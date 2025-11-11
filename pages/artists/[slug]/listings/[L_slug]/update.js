/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import DynaFormDB from "/components/widgets/DynaFormDB";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Set the active API URL defaulting to prod
const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
const formName = "ListingForm1";

/**
 * Component for updating listing details.
 * @param {Object} props - Component properties
 * @param {Object} props.metadata - Form metadata
 * @param {Object} props.listingData - Listing data
 * @param {string} props.id - Listing ID
 * @param {Object} props.error - Error object if any
 * @returns {JSX.Element} - Rendered component
 */
export default function UpdateListingForm1(props) {
    const router = useRouter();
    const { slug, L_slug } = router.query;
    
    // Show error message if there was an error loading data
    if (props.error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-xl font-bold text-red-700">Oh crud!</h2>
                <p className="text-red-600">{props.error.message}</p>
                <button 
                    className="mt-4 btn btn-primary"
                    onClick={() => router.back()}
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Make sure metadata and listing data are properly loaded before rendering the form
    if (!props.metadata || !props.listingData) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // Setup the correct API URL for byID endpoint and proper redirect URL
    const base = api_url?.endsWith('/') ? api_url : `${api_url}/`;
    const metadataWithUrls = {
        ...props.metadata,
        // Use the byID route as specified in ListingController.cs
        APIURL: `${base}listing/byID/${props.id}`,  //APIURL: process.env.NEXT_PUBLIC_TAG_API_URL + "artist/" + props.slug
        redirectURL: `/artists/${slug}/listings/${L_slug}`
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Update Listing</h1>
            <DynaFormDB 
                request="update" 
                metadataProp={metadataWithUrls} 
                formData={props.listingData} 
            />
        </div>
    );
}

/**
 * Get initial props for component.
 * @async
 * @param {Object} context - Next.js context
 * @returns {Object} - Props for component
 */
UpdateListingForm1.getInitialProps = async function (context) {
    const { slug, L_slug } = context.query;
    
    // If we don't have a listing slug, return an error
    if (!L_slug) { 
        return { 
            error: { message: "Listing's slug is missing from URL" }
        };
    }
    
    // Debug logging
    console.log("⬇️ UpdateListingForm1 fetch starting");
    console.log("API URL:", api_url);
    console.log("Listing Slug:", L_slug);
    
    // Initialize return data
    let metadata = null;
    let listingData = null;
    let error = null;
    let listingId = null;
    
    try {
        // Fetch form metadata
        console.log(`Fetching form metadata for ${formName}...`);
        const metadataRes = await fetch(`${api_url}forms_metadata/${formName}`);
        
        if (!metadataRes.ok) {
            throw new Error(`Failed to fetch form metadata: ${metadataRes.status} ${metadataRes.statusText}`);
        }
        
        const metadataText = await metadataRes.text();
        console.log(`Received metadata response: ${metadataText.substring(0, 100)}...`);
        
        metadata = JSON.parse(metadataText);
        
        if (!metadata || (Array.isArray(metadata) && metadata.length === 0)) {
            throw new Error(`No metadata found for form: ${formName}`);
        }
        
        // Standardize the metadata if it's an array
        if (Array.isArray(metadata)) {
            metadata = metadata[0];
        }
        
    // First get the listing's ID using the slug and the artist slug via the API route
    console.log(`Fetching listing by artist/path: ${slug} / ${L_slug}...`);
    const slugRes = await fetch(`${api_url}listing/artist/${encodeURIComponent(slug)}/listing/${encodeURIComponent(L_slug)}`);
        
        if (!slugRes.ok) {
            throw new Error(`Failed to find listing with slug: ${L_slug}`);
        }
        
        const slugData = await slugRes.json();
        
        // The artist/listing endpoint returns the full listing object already.
        listingId = slugData.listingID;
        if (!listingId) {
            throw new Error(`Could not determine listing ID from slug data: ${JSON.stringify(slugData)}`);
        }

        // Use the returned slugData as the full listing data
        listingData = slugData;
    } catch (err) {
        console.error("Error fetching data:", err);
        error = { message: err.message || "Failed to load necessary data" };
    }
    
    // Debug logging for successful fetch
    if (listingData) {
        console.log("✅ Listing data fetched successfully:", {
            id: listingId,
            title: listingData.title,
            dataType: typeof listingData
        });
    }
    
    return {
        metadata,
        listingData,
        id: listingId,
        error
    };
};
