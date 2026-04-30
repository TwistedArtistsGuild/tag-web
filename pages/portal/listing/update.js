/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import DynaFormDB from "@/components/widgets/DynaFormDB";
import getApiURL from "@/components/widgets/GetApiURL";
import React, { useMemo } from "react";

const api_url = getApiURL();
const formName = "ListingForm1";

export default function UpdateListingForm2(props) {
    const enhancedMetadata = useMemo(() => {
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (!base || Object.keys(base).length === 0 || !props.id) {
            return null;
        }

        return {
            ...base,
            FromURL: "/portal/listing/update.js",
            redirectURL: `/portal/listing/${props.id}`,
            APIURL: `${api_url}listing/byID/${props.id}`
        };
    }, [props.metadataProp, props.id]);

    if (!enhancedMetadata || !props.listingdata) {
        return <div className="p-10 text-center"><span className="loading loading-ghost loading-lg"></span></div>;
    }

    return <div className="p-4"><DynaFormDB request="update" metadataProp={enhancedMetadata} fieldsProp={enhancedMetadata.forms_fields} formData={props.listingdata} /></div>;
}

UpdateListingForm2.getInitialProps = async function (context) {
    const { id } = context.query;
    if (!id) {
        return { error: { message: "Listing ID is missing from context query" } };
    }
    let data = {};
    let metadata = {};
    try {
        const res1 = await fetch(`${api_url}listing/byID/${id}`);
        if (res1.ok) {
            data = await res1.json();
        } else {
            console.error(`Failed to fetch listing ${id}: ${res1.status} ${res1.statusText}`);
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
        listingdata: data,
        id: id,
        metadataProp: metadata
    };
};
