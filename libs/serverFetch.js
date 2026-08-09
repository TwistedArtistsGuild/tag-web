/* This file is part of the Twisted Artists Guild project. */

/**
 * Utility for safe Server-Side (Node.js) fetching.
 * Automatically prepends the absolute backend URL so Next.js doesn't crash 
 * with "Invalid URL" when processing relative paths in getServerSideProps.
 * 
 * When running on client-side, routes through Next.js proxy instead of direct backend.
 * 
 * Usage: const res = await serverFetch(`/artist/${slug}`);
 */
export async function serverFetch(path, options = {}) {
    const isClient = typeof window !== 'undefined';
    const isCapacitor = isClient && window.Capacitor;
    
    // Determine API URL based on environment:
    // - In Capacitor: use Azure API (NEXT_PUBLIC_TAG_API_URL)
    // - On client (web): use Next.js proxy at /api
    // - On server: use absolute backend URL (localhost or Azure)
    let backendApiUrl;
    if (isCapacitor) {
        backendApiUrl = (process.env.NEXT_PUBLIC_TAG_API_URL || 'https://api.twistedartistsguild.com/api').replace(/\/$/, "");
    } else if (isClient) {
        backendApiUrl = '/api';  // Browser proxies through Next.js
    } else {
        backendApiUrl = (process.env.DOTNET_API_URL || 'https://localhost:7225/api').replace(/\/$/, "");
    }

    // Safely strip out the leading slash if the developer accidentally typed it
    const safePath = path.startsWith('/') ? path.substring(1) : path;

    // Construct the fetch URL
    const fetchUrl = `${backendApiUrl}/${safePath}`;

    // Return the standard Node fetch promise
    return fetch(fetchUrl, options);
}

export default serverFetch;