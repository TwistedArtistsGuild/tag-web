/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import QRCode from "qrcode"

const CACHE_TTL_MS = 10 * 60 * 1000
const qrCache = new Map()

function readCache(key) {
  const cached = qrCache.get(key)
  if (!cached) {
    return null
  }

  if (cached.expiresAt <= Date.now()) {
    qrCache.delete(key)
    return null
  }

  return cached.payload
}

function writeCache(key, payload) {
  qrCache.set(key, {
    payload,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })
}

function pruneCache() {
  const now = Date.now()
  for (const [key, value] of qrCache.entries()) {
    if (value.expiresAt <= now) {
      qrCache.delete(key)
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const url = typeof req.query.url === "string" ? req.query.url.trim() : ""
  const size = Number.parseInt(String(req.query.size || "256"), 10)

  if (!url) {
    res.status(400).json({ error: "Missing url query parameter" })
    return
  }

  let parsedUrl
  try {
    parsedUrl = new URL(url)
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Unsupported protocol")
    }
  } catch {
    res.status(400).json({ error: "Invalid url" })
    return
  }

  const resolvedSize = Number.isFinite(size) ? Math.min(Math.max(size, 96), 1200) : 256
  const cacheKey = `${parsedUrl.toString()}::${resolvedSize}`
  const cachedSvg = readCache(cacheKey)

  if (cachedSvg) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8")
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=300")
    res.status(200).send(cachedSvg)
    return
  }

  try {
    const svg = await QRCode.toString(parsedUrl.toString(), {
      type: "svg",
      width: resolvedSize,
      margin: 1,
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
    })

    pruneCache()
    writeCache(cacheKey, svg)

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8")
    res.setHeader("Cache-Control", "public, max-age=300, stale-while-revalidate=300")
    res.status(200).send(svg)
  } catch {
    res.status(500).json({ error: "Failed to generate QR code" })
  }
}