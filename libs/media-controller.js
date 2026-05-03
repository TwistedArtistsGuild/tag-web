/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/**
 * Media Controller Utility
 * Handles image uploads to Azure Blob Storage via the backend API.
 */

export async function uploadImageToAzure(file, context = {}) {
  const { userID, category, entityID, postfix = "" } = context;

  // 1. Prepare the form data for our API
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userID", userID);
  formData.append("category", category);
  formData.append("entityID", entityID);
  formData.append("postfix", postfix);

  try {
    // 2. Post to your Next.js API route (Milestone 1)
    const response = await fetch("/api/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    // 3. Return the permanent Azure URL from the response
    const data = await response.json();
    return data.url; 
  } catch (error) {
    console.error("Azure Upload Error:", error);
    throw error;
  }
}

export async function deleteImageFromAzure(imageUrl) {
    try {
        const response = await fetch('/api/image/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl }),
        });
        return await response.json();
    } catch (error) {
        console.error("Delete request failed", error);
    }
}