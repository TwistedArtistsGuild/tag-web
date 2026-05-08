/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { BlobServiceClient } from "@azure/storage-blob"

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
	if (!connectionString) {
		return res.status(500).json({ error: "Azure Storage Connection String is missing" })
	}

	try {
		const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
		const usage = {}

		// Scan both containers
		for (const containerName of ["tagpictures", "platformpics"]) {
			const containerClient = blobServiceClient.getContainerClient(containerName)
			usage[containerName] = {}

			for await (const blob of containerClient.listBlobsFlat()) {
				const blobName = blob.name
				const size = blob.properties?.contentLength || 0

				// Get first-level folder (or root if no slash)
				const parts = blobName.split("/")
				const folder = parts.length > 1 ? parts[0] : "__root__"

				if (!usage[containerName][folder]) {
					usage[containerName][folder] = {
						bytes: 0,
						count: 0,
						subfolders: {},
					}
				}

				usage[containerName][folder].bytes += size
				usage[containerName][folder].count += 1

				// Also track second-level subfolder if it exists
				if (parts.length > 2) {
					const subfolder = parts[1]
					if (!usage[containerName][folder].subfolders[subfolder]) {
						usage[containerName][folder].subfolders[subfolder] = {
							bytes: 0,
							count: 0,
						}
					}
					usage[containerName][folder].subfolders[subfolder].bytes += size
					usage[containerName][folder].subfolders[subfolder].count += 1
				}
			}
		}

		return res.status(200).json({
			timestamp: new Date().toISOString(),
			usage,
		})
	} catch (error) {
		console.error("Error calculating blob usage:", error.message)
		return res.status(500).json({ error: "Error calculating blob usage" })
	}
}
