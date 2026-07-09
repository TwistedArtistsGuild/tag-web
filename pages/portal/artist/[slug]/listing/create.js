/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import DynaFormDB from "@/components/widgets/DynaFormDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isArtist, isStaff } from "@/utils/authHelpers";
import React, { useMemo } from "react";
import TagSEO from "@/components/TagSEO";
import ArtistContextNav from "@/components/portal/ArtistContextNav";

const formName = "ListingForm1";

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @returns {JSX.Element}
 */
export default function CreateListingForm1(props) {
    const enhancedMetadata = useMemo(() => {
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (!base || Object.keys(base).length === 0) {
            return null;
        }

        return {
            ...base,
            FromURL: "/portal/artist/listing/create.js",
            redirectURL: "/portal/artist/listing/",
            APIURL: `/api/${base.apiurlpostfix}`
        };
    }, [props.metadataProp]);

    if (!enhancedMetadata) {
        return <div className="p-10 text-center"><span className="loading loading-ghost loading-lg"></span></div>;
    }

    return (
        <div className="p-4">
            <TagSEO
                metadataProp={{
                    title: "Create Listing",
                    description: "Create a new artist listing.",
                    robots: "noindex, nofollow",
                    keywords: "artist portal, create listing",
                    og: {
                        title: "Create Listing",
                        description: "Create a new artist listing.",
                    },
                }}
                canonicalSlug="portal/artist/[slug]/listing/create"
            />
            <ArtistContextNav />
            <DynaFormDB request="add" metadataProp={enhancedMetadata} fieldsProp={enhancedMetadata.forms_fields} formData={null} />
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session?.user) {
        return {
            redirect: {
                destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/artist/listing/create")}`,
                permanent: false,
            },
        };
    }

    const userId = session.user.id || null;
    let hasLinkedArtist = false;

    if (userId && !isArtist(session) && !isStaff(session) && !isAdmin(session)) {
        try {
            const linkedResponse = await fetch(`/api/linker_usertoartist/byUserID/${userId}`);
            if (linkedResponse.ok) {
                const linkedArtists = await linkedResponse.json();
                hasLinkedArtist = Array.isArray(linkedArtists) && linkedArtists.length > 0;
            }
        } catch (error) {
            console.error("Unable to verify linked artists for listing create:", error.message);
        }
    }

    if (!isArtist(session) && !isStaff(session) && !isAdmin(session) && !hasLinkedArtist) {
        return {
            notFound: true,
        };
    }

    let metadata = {};
    try {
        let res = await fetch(`/api/formsmetadata/${formName}`);

        // Backward compatibility with older endpoint naming.
        if (!res.ok) {
            res = await fetch(`/api/forms_metadata/${formName}`);
        }

        if (res.ok) {
            metadata = await res.json();
        }
    } catch (error) {
        console.error("Error fetching form meta:", error);
    }
    return {
        props: {
            metadataProp: metadata,
        }
    };
}

