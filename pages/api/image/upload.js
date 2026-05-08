import { BlobServiceClient } from "@azure/storage-blob";
import formidable from "formidable";
import fs from "fs";

const SAFE_SEGMENT_RE = /^[A-Za-z0-9_-]{1,64}$/;
const ALLOWED_PREFIX_RE = /^[A-Za-z0-9/_\-.]*$/;
const CONTAINER_ROOTS = {
    tagpictures: "platformpics/",
    platformpics: "",
};

function normalizePrefix(value) {
    if (!value) return "";
    return String(value).replace(/^\/+/, "");
}

function sanitizeFilenamePart(value, fallback) {
    const sanitized = String(value || "")
        .replace(/[^A-Za-z0-9._-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^[-.]+|[-.]+$/g, "")
        .slice(0, 120);
    return sanitized || fallback;
}

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
        const requestedContainer = fields.container?.[0] || "tagpictures";
        const container = CONTAINER_ROOTS[requestedContainer] !== undefined ? requestedContainer : null;
        if (!container) {
            return res.status(400).json({ error: "Unsupported container" });
        }

        const containerRoot = CONTAINER_ROOTS[container];
        const requestedStartPrefix = normalizePrefix(fields.startPrefix?.[0] || "");
        const startPrefix = requestedStartPrefix || containerRoot;
        const requestedTargetPrefix = normalizePrefix(fields.targetPrefix?.[0] || "");
        const targetPrefixRaw = requestedTargetPrefix || startPrefix;
        const targetPrefix = targetPrefixRaw && !targetPrefixRaw.endsWith("/") ? `${targetPrefixRaw}/` : targetPrefixRaw;

        if (!ALLOWED_PREFIX_RE.test(startPrefix) || !ALLOWED_PREFIX_RE.test(targetPrefix)) {
            return res.status(400).json({ error: "Invalid upload prefix" });
        }

        if (startPrefix.includes("..") || targetPrefix.includes("..")) {
            return res.status(400).json({ error: "Invalid upload prefix path" });
        }

        if (containerRoot && !startPrefix.startsWith(containerRoot)) {
            return res.status(400).json({ error: `startPrefix must stay within ${containerRoot}` });
        }

        if (startPrefix && !targetPrefix.startsWith(startPrefix)) {
            return res.status(400).json({ error: `targetPrefix must stay within startPrefix ${startPrefix}` });
        }

        if (!SAFE_SEGMENT_RE.test(userID)) {
            return res.status(400).json({ error: "Invalid userID" });
        }

        // Construct the filename with the postfix
        const originalName = file.originalFilename || "upload.bin";
        const nameParts = originalName.split('.');
        const extension = sanitizeFilenamePart(nameParts.pop(), "bin");
        const baseName = sanitizeFilenamePart(nameParts.join('.'), "upload");
        const safeEntityID = sanitizeFilenamePart(entityID, "default");
        const safePostfix = sanitizeFilenamePart(postfix, "");

        // 1. Connection string from your .env file
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const containerName = container;

        if (!AZURE_STORAGE_CONNECTION_STRING) {
            throw new Error("Azure Storage Connection String is missing");
        }

        // 2. Initialize Azure Client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // 3. Upload to the current explorer directory (targetPrefix), constrained by startPrefix/root.
        const finalFileName = `${baseName}${safePostfix ? `-${safePostfix}` : ""}.${extension}`;
        const blobName = `${targetPrefix}${Date.now()}-${finalFileName}`;
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