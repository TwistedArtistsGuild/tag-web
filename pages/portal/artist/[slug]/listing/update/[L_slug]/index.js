/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import DynaFormDB from "@/components/widgets/DynaFormDB";
import getApiURL from "@/components/widgets/GetApiURL";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isArtist, isStaff } from "@/utils/authHelpers";
import React, { useMemo } from "react";

const api_url = getApiURL();
const formName = "ListingForm1";

export default function UpdateListingForm2(props) {
    const enhancedMetadata = useMemo(() => {
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (!base || Object.keys(base).length === 0 || !props.listingId) {
            return null;
        }

        return {
            ...base,
            FromURL: "/portal/artist/listing/update/[slug]",
            redirectURL: `/portal/artist/listing/${props.listingId}`,
            APIURL: `${api_url}listing/byID/${props.listingId}`
        };
    }, [props.metadataProp, props.listingId]);

    if (!enhancedMetadata || !props.listingdata) {
        return <div className="p-10 text-center"><span className="loading loading-ghost loading-lg"></span></div>;
    }

    return <div className="p-4"><DynaFormDB request="update" metadataProp={enhancedMetadata} fieldsProp={enhancedMetadata.forms_fields} formData={props.listingdata} /></div>;
}

export async function getServerSideProps(context) {
    const listingId = context.params?.slug || context.query?.slug || context.query?.id;

    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session?.user) {
        return {
            redirect: {
                destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(`/portal/artist/listing/update/${listingId || ""}`)}`,
                permanent: false,
            },
        };
    }

    const userId = session.user.id || null;
    let hasLinkedArtist = false;

    if (userId && !isArtist(session) && !isStaff(session) && !isAdmin(session)) {
        try {
            const linkedResponse = await fetch(`${api_url}linker_usertoartist/byUserID/${userId}`);
            if (linkedResponse.ok) {
                const linkedArtists = await linkedResponse.json();
                hasLinkedArtist = Array.isArray(linkedArtists) && linkedArtists.length > 0;
            }
        } catch (error) {
            console.error("Unable to verify linked artists for listing update:", error.message);
        }
    }

    if (!isArtist(session) && !isStaff(session) && !isAdmin(session) && !hasLinkedArtist) {
        return {
            notFound: true,
        };
    }

    if (!listingId) {
        return {
            notFound: true,
        };
    }
    let data = {};
    let metadata = {};
    try {
        const res1 = await fetch(`${api_url}listing/byID/${listingId}`);
        if (res1.ok) {
            data = await res1.json();
        } else {
            console.error(`Failed to fetch listing ${listingId}: ${res1.status} ${res1.statusText}`);
        }

        let res2 = await fetch(`${api_url}formsmetadata/${formName}`);

        // Backward compatibility with older endpoint naming.
        if (!res2.ok) {
            res2 = await fetch(`${api_url}forms_metadata/${formName}`);
        }

        if (res2.ok) {
            metadata = await res2.json();
        }
    } catch (error) {
        console.error("Error fetching form meta or field data:", error);
    }
    return {
        props: {
            listingdata: data,
            listingId: listingId,
            metadataProp: metadata
        }
    };
}
