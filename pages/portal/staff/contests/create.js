/* This file is part of the Twisted Artists Guild project.
 Copyright (C) 2026 Twisted Artists Guild
 Licensed under the GNU General Public License v3.0 */

import DynaFormDB from "@/components/widgets/DynaFormDB";
import getApiURL from "@/components/widgets/GetApiURL";
import React, { useMemo } from "react";

const api_url = getApiURL();

const formName = "CreateContestForm";

/**
 * Component for creating a new art contest.
 * @param {Object} props
 * @param {Object} props.metadataProp
 * @returns {JSX.Element}
 */
export default function CreateContestForm(props) {
    const enhancedMetadata = useMemo(() => {
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (!base || Object.keys(base).length === 0) {
            return null;
        }

        return {
            ...base,
            FromURL: "/contests/create.js",
            redirectURL: "/contests",
            // APIURL is built from base.apiurlpostfix seeded as 'api/contest/create'
            APIURL: `${api_url}contest/create`
        };
    }, [props.metadataProp]);

    if (!enhancedMetadata) {
        return (
            <div className="p-10 text-center">
                <span className="loading loading-ghost loading-lg"></span>
                <p className="mt-4 text-gray-500">Loading Contest Configuration...</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* request="add" tells DynaFormDB to treat this as a new POST 
                formData={null} ensures the form starts empty
            */}
            <DynaFormDB
                request="add"
                metadataProp={enhancedMetadata}
                formData={null}
            />
        </div>
    );
}

CreateContestForm.getInitialProps = async function () {
    let metadata = {};
    try {
        // Fetching the 'CreateContestForm' metadata we seeded earlier
        let res = await fetch(`${api_url}formsmetadata/${formName}`);

        if (!res.ok) {
            res = await fetch(`${api_url}forms_metadata/${formName}`);
        }

        if (res.ok) {
            metadata = await res.json();
        }
    } catch (error) {
        console.error("Error fetching contest form meta:", error);
    }
    return {
        metadataProp: metadata
    };
};