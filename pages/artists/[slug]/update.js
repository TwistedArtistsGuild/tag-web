/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import DynaFormDB from "/components/widgets/DynaFormDB"
import { useRouter } from "next/router"

const formName = "ArtistForm1"

/**
 * Component for updating artist details.
 * @param {Object} props - Component properties
 * @param {Object} props.metadataProp - Form metadata
 * @param {Object} props.artistdata - Artist data
 * @param {string} props.slug - Artist slug
 * @returns {JSX.Element} - Rendered component
 */
export default function UpdateArtistForm1(props) {
	const router = useRouter();
	
	// Show error message if there was an error loading data
	if (props.error) {
		return (
			<div className="card bg-base-100 shadow-lg max-w-4xl mx-auto">
				<div className="card-body">
					<div className="alert alert-error">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<span>{props.error.message}</span>
					</div>
					<div className="card-actions justify-end">
						<button 
							className="btn btn-primary"
							onClick={() => router.back()}
						>
							Go Back
						</button>
					</div>
				</div>
			</div>
		);
	}
	
	// Make sure metadata and artist data are properly loaded before rendering the form
	if (!props.metadataProp || !props.artistdata) {
		return (
			<div className="flex justify-center items-center min-h-[400px]">
				<div className="loading loading-spinner loading-lg"></div>
			</div>
		);
	}

	// Set up the metadata with proper URL fields
	const metadataWithUrls = {
		...props.metadataProp,
		FromURL: "/artists/"+ props.slug +"/update.js",
		redirectURL: "/artists/" + props.slug,
		APIURL: process.env.NEXT_PUBLIC_TAG_API_URL + "artist/" + props.slug
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-base-content">Update Artist</h1>
				<p className="text-base-content/70 mt-2">Modify artist information and settings</p>
			</div>
			<DynaFormDB 
				request="update" 
				metadataProp={metadataWithUrls} 
				formData={props.artistdata}
				overrideReadOnly={false}
			/>
		</div>
	)
}

/**
 * Get initial props for component.
 * @async
 * @param {Object} context - Next.js context
 * @returns {Object} - Props for component
 */
UpdateArtistForm1.getInitialProps = async function (context) {
	const { slug } = context.query
	if (!slug) { 
		return { 
			error: { message: "Artist's slug is missing from context query" }
		}
	}

	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL

	// Debug logging
	console.log("⬇️ UpdateArtistForm1 fetch starting");
	console.log("API URL:", api_url);
	console.log("Artist Slug:", slug);

	let artistData = {}
	let formMetadata = {}
	let error = null

	try {
		// Fetch artist data
		console.log(`Fetching artist data for ${slug}...`);
		const res_artist = await fetch(api_url + `artist/${slug}`)
		if (!res_artist.ok) {
			throw new Error(`Failed to fetch artist data: ${res_artist.status} ${res_artist.statusText}`)
		}
		
		// Get the response as text first to inspect it
		const artistText = await res_artist.text();
		console.log(`Received artist data (${artistText.length} bytes): ${artistText.substring(0, 100)}...`);
		
		try {
			artistData = JSON.parse(artistText);
		} catch (parseError) {
			console.error("JSON parse error:", parseError);
			console.error("Problematic JSON:", artistText);
			throw new Error(`Failed to parse artist data: ${parseError.message}`);
		}
		
		if (!artistData || (Array.isArray(artistData) && artistData.length === 0)) {
			throw new Error(`No data found for artist with slug: ${slug}`)
		}

		// Fetch form metadata
		console.log(`Fetching form metadata for ${formName}...`);
		const res_metadata = await fetch(api_url + `forms_metadata/${formName}`)
		if (!res_metadata.ok) {
			throw new Error(`Failed to fetch form metadata: ${res_metadata.status} ${res_metadata.statusText}`)
		}
		
		// Get the response as text first to inspect it
		const metadataText = await res_metadata.text();
		console.log(`Received metadata response: ${metadataText.substring(0, 100)}...`);
		
		try {
			formMetadata = JSON.parse(metadataText);
		} catch (parseError) {
			console.error("JSON parse error:", parseError);
			console.error("Problematic JSON:", metadataText);
			throw new Error(`Failed to parse form metadata: ${parseError.message}`);
		}
		
		if (!formMetadata || (Array.isArray(formMetadata) && formMetadata.length === 0)) {
			throw new Error(`No metadata found for form: ${formName}`)
		}

		// Ensure we have consistent property names for API URL construction
		if (formMetadata.apiurLpostfix && !formMetadata.APIURLpostfix) {
			formMetadata.APIURLpostfix = formMetadata.apiurLpostfix;
		}
		
		// Standardize the metadata if it's an array
		if (Array.isArray(formMetadata)) {
			formMetadata = formMetadata[0];
		}
		
		// Force disable any read-only fields in the form metadata
		if (formMetadata.forms_Fields && Array.isArray(formMetadata.forms_Fields)) {
			formMetadata.forms_Fields = formMetadata.forms_Fields.map(field => {
				// Special handling for SEO tags field
				if (field.name === 'seotags' && !artistData.seotags) {
					// If artistData has no seotags, set empty string to avoid showing default value
					artistData.seotags = '';
				}
				
				return {
					...field,
					isReadOnly: false // Explicitly set all fields to not be read-only
				};
			});
		}
	} catch (err) {
		console.error("Error fetching data:", err);
		error = { message: err.message || "Failed to load necessary data" };
	}

	// Debug logging for successful fetch
	if (artistData && !error) {
		console.log("✅ Artist data fetched successfully:", {
			name: artistData.name,
			dataType: typeof artistData
		});
	}

	return {
		artistdata: artistData,
		slug: slug,
		metadataProp: formMetadata,
		error
	}
}
