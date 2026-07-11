/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import DynaFormDB from "@/components/widgets/DynaFormDB";
import React, { useMemo } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isStaff } from "@/utils/authHelpers";
import TagSEO from "@/components/TagSEO";
import serverFetch from "@/libs/serverFetch"

const formName = "BlogForm1";

function isAuthorRole(session) {
    return !!session?.user?.roles?.includes("author");
}

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

        const imageStartPrefix = "platformpics/blog/";
        const apiPostfix = base.apiurlpostfix || base.APIURLpostfix || base.apiurLpostfix || "blog";
        const normalizedPostfix = String(apiPostfix).replace(/^\/+/, "");
        const resolvedApiUrl = base.APIURL || `/api/${normalizedPostfix}`;

        return {
            ...base,
            FromURL: "/portal/staff/tagblog/create.js",
            redirectURL: "/blogs/",
            APIURL: resolvedApiUrl,
            imageCategory: "blogs",
            entityId: "new",
            imageContainer: "tagpictures",
            imageStartPrefix,
            imageTargetPrefix: imageStartPrefix
        };
    }, [props.metadataProp]);

    if (!enhancedMetadata) {
        return <div className="p-10 text-center"><span className="loading loading-ghost loading-lg"></span></div>;
    }

    return (
        <div className="p-4">
            <TagSEO
                metadataProp={{
                    title: "Create Blog Post",
                    description: "Internal staff and author blog creation form.",
                    robots: "noindex, nofollow",
                    keywords: "staff, blog, create",
                    og: {
                        title: "Create Blog Post",
                        description: "Internal staff and author blog creation form.",
                    },
                }}
                canonicalSlug="portal/staff/tagblog/create"
            />
            <DynaFormDB request="add" metadataProp={enhancedMetadata} formData={null} />
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session?.user) {
        return {
            redirect: {
                destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/staff/tagblog/create")}`,
                permanent: false,
            },
        };
    }

    if (!isStaff(session) && !isAdmin(session) && !isAuthorRole(session)) {
        return {
            notFound: true,
        };
    }

    let metadata = {};
    try {
        let res = await serverFetch(`/formsmetadata/${formName}`);

        // Backward compatibility with older endpoint naming.
        if (!res.ok) {
            res = await serverFetch(`/forms_metadata/${formName}`);
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
        },
    };
}

