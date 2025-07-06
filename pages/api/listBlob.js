/* Copyright (C) Twisted Artists Guild - All Rights Reserved
 Unauthorized copying of this file, via any medium is strictly prohibited
 Proprietary and confidential
 
 Use https://dev.azure.com/bobbshields/tag-web-dev for dev team communcation tools*/
import { BlobServiceClient } from "@azure/storage-blob"

export const config = {
	api: {
		bodyParser: false,
	},
}

async function getBlobServiceClient() {
	const connectionStrings = process.env.AZURE_STORAGE_CONNECTION_STRING.split(";")
	for (const connectionString of connectionStrings) {
		try {
			const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
			return blobServiceClient
		} catch (error) {
			console.error("Error connecting with connection string:", error)
		}
	}
	throw new Error("Failed to connect to Azure Blob Storage with provided connection strings")
}

export default async function handler(req, res) {
	if (req.method === "GET") {
		const { context = "twistedpassions" } = req.query  //uses the query but defaults to 'twistedpassions' if not provided

		let blobServiceClient
		try {
			blobServiceClient = await getBlobServiceClient()
		} catch (error) {
			console.error("Error connecting to blob storage:", error)
			res.status(500).json({ error: "Error connecting to blob storage" })
			return
		}

		const containerClient = blobServiceClient.getContainerClient(context)

		try {
			const blobs = []
			for await (const blob of containerClient.listBlobsFlat()) {
				blobs.push({
					name: blob.name,
					url: containerClient.getBlockBlobClient(blob.name).url
					//,          properties: blob.properties,
				})
			}
			res.status(200).json({ container: context, blobs })
		} catch (error) {
			console.error("Error listing blobs:", error)
			res.status(500).json({ error: "Error listing blobs" })
		}
	} else {
		res.status(405).json({ error: "Method not allowed" })
	}
}