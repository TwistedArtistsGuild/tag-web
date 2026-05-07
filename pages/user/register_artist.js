/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import DynaFormDB from "@/components/widgets/DynaFormDB";
import getApiURL from "@/components/widgets/GetApiURL";
import TagSEO from "@/components/TagSEO";
import React, { useMemo } from "react";

const api_url = getApiURL();
const formName = "ArtistForm1";

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @returns {JSX.Element}
 */
export default function CreateArtistForm1(props) {
    const pageMetaData = {
        title: "Register Artist",
        description: "Submit your artist registration form.",
        keywords: "artist, registration, user",
        robots: "noindex, nofollow",
        og: { title: "Register Artist", description: "Submit your artist registration form." },
    };

    const enhancedMetadata = useMemo(() => {
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (!base || Object.keys(base).length === 0) {
            return null;
        }

        return {
            ...base,
            FromURL: "/portal/artist/create.js",
            redirectURL: "/portal/artist/",
            APIURL: `${api_url}${base.apiurlpostfix}`
        };
    }, [props.metadataProp]);

    if (!enhancedMetadata) {
        return (
            <div className="min-h-screen bg-base-200 p-4 md:p-8">
                <TagSEO metadataProp={pageMetaData} canonicalSlug="user/register_artist" />
                <div className="max-w-5xl mx-auto">
                    <div className="card bg-base-100 shadow border border-base-300">
                        <div className="card-body items-center py-12">
                            <span className="loading loading-ghost loading-lg"></span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <TagSEO metadataProp={pageMetaData} canonicalSlug="user/register_artist" />
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="card bg-base-100 shadow-lg border border-base-300">
                    <div className="card-body">
                        <h1 className="text-2xl font-bold text-base-content">Artist Registration</h1>
                        <p className="text-sm text-base-content/70">
                            Complete the form below to submit your artist application.
                        </p>
                    </div>
                </div>

                <div className="card bg-base-100 shadow border border-base-300">
                    <div className="card-body">
                        <DynaFormDB request="add" metadataProp={enhancedMetadata} formData={null} />
                    </div>
                </div>
            </div>
        </div>
    );
}

CreateArtistForm1.getInitialProps = async function () {
    let metadata = {};
    try {
        let res = await fetch(`${api_url}formsmetadata/${formName}`);

        // Backward compatibility with older endpoint naming.
        if (!res.ok) {
            res = await fetch(`${api_url}forms_metadata/${formName}`);
        }

        if (res.ok) {
            metadata = await res.json();
        }
    } catch (error) {
        console.error("Error fetching form meta:", error);
    }
    return {
        metadataProp: metadata
    };
};

