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
const formName = "BlogForm1";

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @returns {JSX.Element}
 */
export default function CreateBlogForm1(props) {
    const enhancedMetadata = useMemo(() => {
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (!base || Object.keys(base).length === 0) {
            return null;
        }

        return {
            ...base,
            FromURL: "/blogs/create.js",
            redirectURL: "/blogs/",
            APIURL: `${api_url}${base.apiurlpostfix}`
        };
    }, [props.metadataProp]);

    if (!enhancedMetadata) {
        return <div className="p-10 text-center"><span className="loading loading-ghost loading-lg"></span></div>;
    }

    return <div className="p-4"><DynaFormDB request="add" metadataProp={enhancedMetadata} formData={null} /></div>;
}

CreateBlogForm1.getInitialProps = async function () {
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

