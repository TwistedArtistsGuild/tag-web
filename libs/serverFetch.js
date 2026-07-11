/* This file is part of the Twisted Artists Guild project. */

/**
 * Utility for safe Server-Side (Node.js) fetching.
 * Automatically prepends the absolute backend URL so Next.js doesn't crash 
 * with "Invalid URL" when processing relative paths in getServerSideProps.
 * 
 * Usage: const res = await serverFetch(`/artist/${slug}`);
 */
export async function serverFetch(path, options = {}) {
    // 1. Grab the absolute URL from Azure / Docker, fallback to local Visual Studio
    const backendApiUrl = (process.env.DOTNET_API_URL || 'https://localhost:7225/api').replace(/\/$/, "");

    // 2. Safely strip out the leading slash if the developer accidentally typed it
    const safePath = path.startsWith('/') ? path.substring(1) : path;

    // 3. Construct the perfect Absolute URL (e.g. https://api.tags.com/api/artist/slug)
    const fetchUrl = `${backendApiUrl}/${safePath}`;

    // 4. Return the standard Node fetch promise
    return fetch(fetchUrl, options);
}

export default serverFetch;