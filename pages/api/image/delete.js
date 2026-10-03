// pages/api/delete-image.js
import { BlobServiceClient } from '@azure/storage-blob';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    try {
        const { imageUrl, pictureId } = req.body;
        if (!imageUrl) return res.status(400).json({ message: 'URL is required' });

        // Extract blob name from the full URL
        // URL: https://[account].blob.core.windows.net/tagpictures/[path/to/blob]
        const urlParts = imageUrl.split('/tagpictures/');
        const blobName = urlParts[1];

        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('tagpictures');
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.deleteIfExists();

        let resolvedPictureId = pictureId;

        if (!resolvedPictureId) {
            const lookup = await fetch(`/api/picture/by-url?url=${encodeURIComponent(imageUrl)}`).catch(() => null);
            if (lookup?.ok) {
                const found = await lookup.json().catch(() => null);
                resolvedPictureId = found?.id ?? found?.pictureId ?? null;
            }
        }

        if (resolvedPictureId) {
            await fetch(`/api/picture/${resolvedPictureId}`, {
                method: 'DELETE',
            }).catch(() => null);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}