import { BlobServiceClient } from "@azure/storage-blob";
import formidable from "formidable";
import fs from "fs";

// Disable the default body parser to handle file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const form = formidable({});

    try {
        const [fields, files] = await form.parse(req);
        const file = files.file[0];

        // Extract the new fields
        const userID = fields.userID?.[0] || "unknown";
        const category = fields.category?.[0] || "general";
        const entityID = fields.entityID?.[0] || "default";
        const postfix = fields.postfix?.[0] || "";

        // Construct the filename with the postfix
        const originalName = file.originalFilename;
        const nameParts = originalName.split('.');
        const extension = nameParts.pop();
        const baseName = nameParts.join('.');

        // 1. Connection string from your .env file
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const containerName = "tagpictures";

        if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw new Error("Azure Storage Connection String is missing");
        }

        // 2. Initialize Azure Client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // 3. Create the specific path: tagpictures/platformpics/usercontent/{userID}/{category}/{entityID}/{filename}{postfix}
        const finalFileName = `${baseName}${postfix}.${extension}`;
        const blobName = `platformpics/usercontent/${userID}/${category}/${entityID}/${Date.now()}-${finalFileName}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        // 4. Upload the binary data
        const fileStream = fs.createReadStream(file.filepath);
        await blockBlobClient.uploadStream(fileStream);

        // 5. Return the permanent URL
        // Make sure your container "Access Level" is set to "Blob" or "Container" in Azure Portal
        const url = blockBlobClient.url;

        return res.status(200).json({ url });
    } catch (error) {
        console.error("Server-side Upload Error:", error);
        return res.status(500).json({ error: error.message });
    }
}