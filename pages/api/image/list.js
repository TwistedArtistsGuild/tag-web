/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { BlobServiceClient } from "@azure/storage-blob"

const LOCKED_CONTAINER = "tagpictures"
const ALLOWED_PREFIX_RE = /^[A-Za-z0-9/_\-.]*$/
const CONTAINER_ROOTS = {
  tagpictures: "platformpics/",
  platformpics: "",
}

function normalizePrefix(value) {
  if (!value) return ""
  return String(value).replace(/^\/+/, "")
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const requestedContainer = req.query.container || LOCKED_CONTAINER
  const container = CONTAINER_ROOTS[requestedContainer] !== undefined ? requestedContainer : null
  if (!container) {
    return res.status(400).json({ error: "Unsupported container" })
  }

  const containerRoot = CONTAINER_ROOTS[container]
  const requestedStartPrefix = normalizePrefix(req.query.startPrefix || "")
  const startPrefix = requestedStartPrefix || containerRoot
  const requestedPrefix = normalizePrefix(req.query.prefix || "")
  const prefix = requestedPrefix || startPrefix

  if (!ALLOWED_PREFIX_RE.test(startPrefix) || !ALLOWED_PREFIX_RE.test(prefix)) {
    return res.status(400).json({ error: "Invalid prefix" })
  }

  if (startPrefix.includes("..") || prefix.includes("..")) {
    return res.status(400).json({ error: "Invalid prefix path" })
  }

  if (containerRoot && !startPrefix.startsWith(containerRoot)) {
    return res.status(400).json({
      error: `startPrefix must stay within ${containerRoot}`,
    })
  }

  if (startPrefix && !prefix.startsWith(startPrefix)) {
    return res.status(400).json({
      error: `prefix must stay within startPrefix ${startPrefix}`,
    })
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connectionString) {
    return res.status(500).json({ error: "Azure Storage Connection String is missing" })
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(container)

    const directories = []
    const files = []

    for await (const item of containerClient.listBlobsByHierarchy("/", { prefix })) {
      if (item.kind === "prefix") {
        directories.push(item.name)
      } else {
        files.push({
          name: item.name,
          url: containerClient.getBlockBlobClient(item.name).url,
          contentType: item.properties?.contentType || null,
          contentLength: item.properties?.contentLength || 0,
          lastModified: item.properties?.lastModified || null,
        })
      }
    }

    return res.status(200).json({
      container,
      rootPrefix: containerRoot,
      startPrefix,
      prefix,
      directories,
      files,
    })
  } catch (error) {
    console.error("Error listing image blobs:", error.message)
    return res.status(500).json({ error: "Error listing image blobs" })
  }
}