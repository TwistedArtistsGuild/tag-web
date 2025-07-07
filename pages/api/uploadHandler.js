/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { BlobServiceClient } from "@azure/storage-blob"
import formidable from "formidable"
import fs from "fs"

// Disable Next.js's default body parsing to use formidable
export const config = {
	api: {
		bodyParser: false,
	},
}

// Helper function to get BlobServiceClient
async function getBlobServiceClient() {
	const connectionStrings = process.env.AZURE_STORAGE_CONNECTION_STRING.split(";")
	for (const connectionString of connectionStrings) {
		try {
			const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
			return blobServiceClient
		} catch (error) {
			console.error("Error connecting with connection string:", error.message)
		}
	}
	throw new Error("Failed to connect to Azure Blob Storage with provided connection strings")
}

export default async function handler(req, res) {
	if (req.method === "POST") {
		const form = formidable({ multiples: true, keepExtensions: true })

		// Parse the incoming request using formidable
		form.parse(req, async (err, fields, files) => {
			if (err) {
				console.error("Error parsing files:", err.message)
				res.status(500).json({ error: "Error parsing form data" })
				return
			}

			console.log("Received fields:", fields)
			console.log("Received files:", files)

			let blobServiceClient
			try {
				blobServiceClient = await getBlobServiceClient()
			} catch (error) {
				console.error("Error connecting to blob storage:", error.message)
				res.status(500).json({ error: "Error connecting to blob storage" })
				return
			}

			// Get 'context' and 'topFolder' from fields
			const containerName = fields.context || "twistedpassions"
			const topFolder = fields.topFolder || "listing"

			const containerClient = blobServiceClient.getContainerClient(containerName)

			// Ensure the container exists
			try {
				await containerClient.createIfNotExists()
			} catch (error) {
				console.error("Error accessing container:", error.message)
				res.status(500).json({ error: "Error accessing storage container" })
				return
			}

			try {
				const new_urls = []

				// Normalize files to an array
				const uploadedFiles = Array.isArray(files.file)
					? files.file
					: [files.file]

				for (const file of uploadedFiles) {
					// Construct blob name with topFolder
					const blobName = `${topFolder}/${Date.now()}-${file.originalFilename}`
					const blockBlobClient = containerClient.getBlockBlobClient(blobName)

					console.log("Uploading file:", blobName)

					try {
						// Read the file as a stream
						const stream = fs.createReadStream(file.filepath)

						// Upload the stream to Azure Blob Storage
						await blockBlobClient.uploadStream(stream, undefined, undefined, {
							blobHTTPHeaders: { blobContentType: file.mimetype },
						})

						console.log("Upload successful:", blobName)

						// Add the blob URL to the array
						new_urls.push(blockBlobClient.url)
					} catch (uploadError) {
						console.error("Error uploading file:", blobName, uploadError.message)
						// You might want to handle this error further
					}
				}

				res.status(200).json({ new_urls })
			} catch (error) {
				console.error("Error processing files:", error.message)
				res.status(500).json({ error: "Error processing files" })
			}
		})
	} else {
		res.status(405).json({ error: "Method not allowed" })
	}
}
