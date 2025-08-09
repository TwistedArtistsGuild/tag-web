/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import CardFactory from "@/components/cards/CardFactory"
//Imports
import {useRouter} from "next/router"
//import Picture from '../../components/picture/[context]/[slug].js' 
import Image from "next/image" // Next v10+ (Not working and not called at this time)
// import ImageGallery from 'react-image-gallery'; //tested on home page with static images, looks pretty good
import Link from "next/link"
import { useState, useEffect } from "react" //Sidebar state

//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // Dev environment only, allows for self-signed

/**
 * @desc Displays an individual Listing's details by the shortname, passed by POST
 * @param {object} props 
 */
const Listing = props => {
	return (
		<div className="card shadow-lg p-4">
			<Image
				src={props.listing?.profilePic?.url || "/blank_image.png"}
				alt={props.listing?.profilePic?.alttext || `${props.listing?.title || 'Unknown'}'s picture`}
				width={100}
				height={100}
				className="rounded-lg"
			/>
			<div className="card-body">
				<h2 className="card-title">{props.listing.title}</h2>
				<p>{props.listing.description}</p>
				<Link
					href="/listings/[slug]/update"
					as={`/listings/${props.id}/update`}
					className="btn btn-secondary mt-4">
					Update this listing page
				</Link>
			</div>
		</div>
	)
}

/**
 * Pulls from the provided API URL to recieve the listing data
 * @async
 * @param {object} context - 
 */
Listing.getInitialProps = async function (context) {
	const { id } = context.query
	let data = []

	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
        
	//Staging API can be added here if needed

	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log(`Fetching listing: ${api_url}${id}, path: ${context.pathname}`)
	} 

	var res

	try {
		res = await fetch(`${api_url}listing/ByID/${id}`)
		data = await res.json()
        

	} catch (error) {
		console.error(error)
	}

	// const res4 = await fetch(process.env.flask_api_url +`picture/${data.p1pic}`); 
	// const p1PicData = await res4.json();

	// const res5 = await fetch(process.env.flask_api_url +`picture/${data.p2pic}`); 
	// const p2PicData = await res5.json();

	// const res6 = await fetch(process.env.flask_api_url +`picture/${data.p3pic}`); 
	// const p3PicData = await res6.json();

	//console.log(isDev ? 'After fetch.' : '');

	// const res2 = await fetch(process.env.dev_api_url +`picture/${pictureID}`); //slug.slug is confusing, but it makes sense if you think about it
	// const proPicData = await res2.json();

	return {
		listing: data,
		id: id,
           
	}
}

const ArtistListings = ({ initialListings = [] }) => {
    const [listings, setListings] = useState(initialListings);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        const fetchListings = async () => {
            if (!slug) return; // Wait until slug is available

            try {
                const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
                const response = await fetch(`${api_url}artist/${slug}/listings`);
                
                if (!response.ok) {
                    console.error(`Error fetching artist listings: ${response.status}`);
                    setLoading(false);
                    return;
                }
                
                const data = await response.json();
                setListings(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching listings:', error);
                setLoading(false);
            }
        };

        fetchListings();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">No listings found for this artist</h2>
                <p>Check back later or explore other artists.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Artist Listings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                    <CardFactory
                        key={listing.listingID}
                        type="listing"
                        variant="medium"
                        data={{
                            ...listing,
                            // Ensure we have proper data structure
                            PictureID: listing.listingID,
                            Title: listing.title,
                            Description: listing.description,
                            URL: listing.profilePic?.url,
                            // Add placeholder artist data if needed
                            artist: listing.artist || {
                                ArtistID: slug,
                                Title: "Artist",
                                Path: slug
                            }
                        }}
                        showInteractions={true}
                        orientation="vertical"
                        className="w-full"
                    />
                ))}
            </div>
        </div>
    );
};

ArtistListings.getInitialProps = async function (context) {
    const { slug } = context.query;
    const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;

    // Only fetch on server-side to avoid duplicate requests
    if (!context.req) return { initialListings: [] };

    try {
        const res = await fetch(`${api_url}artist/${slug}/listings`);
        if (!res.ok) return { initialListings: [] };
        
        const data = await res.json();
        return { initialListings: data };
    } catch (error) {
        console.error('Error in getInitialProps:', error);
        return { initialListings: [] };
    }
};

export default ArtistListings;

