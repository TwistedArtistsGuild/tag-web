/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import React, { useMemo } from "react";
import DynaFormDB from "@/components/widgets/DynaFormDB"
import getApiURL from "@/components/widgets/GetApiURL"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isStaff } from "@/utils/authHelpers";
import TagSEO from "@/components/TagSEO"

const api_url = getApiURL();
const formName = "BlogForm1";

function isAuthorRole(session) {
    return !!session?.user?.roles?.includes("author");
}

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.metadata
 * @returns {JSX.Element}
 */
export default function UpdateBlogForm1(props) {
    const enhancedMetadata = useMemo(() => {
        // 1. Handle the case where metadataProp might be an array or object
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (process.env.NODE_ENV === 'development') {
            console.log('UpdateBlogForm1 props:', { base, blogdata: props.blogdata, slug: props.slug });
        }

        // If metadata is missing, return null so DynaFormDB shows the error state
        if (!base || Object.keys(base).length === 0) return null;

        // Merge dynamic URL properties
        const blogId = String(props.blogdata?.blogID || "").trim();
        const imageStartPrefix = "platformpics/blog/";
        const imageTargetPrefix = blogId ? `${imageStartPrefix}${blogId}/` : imageStartPrefix;

        return {
            ...base,
            FromURL: `/portal/staff/tagblog/${props.slug}/update.js`,
            redirectURL: `/blogs/${props.slug}`,
            // Reuse the normalized base URL from getApiURL() to keep env fallback/overrides consistent
            APIURL: `${api_url}blog/${props.blogdata?.blogID}`,
            imageCategory: 'blogs',
            entityId: props.blogdata?.blogID,
            imageContainer: "tagpictures",
            imageStartPrefix,
            imageTargetPrefix
        };
    }, [props.slug, props.blogdata, props.metadataProp]);

    // Only render DynaFormDB if we actually have data, otherwise show a loader
    if (!props.blogdata || !enhancedMetadata) {
        return <div className="p-10 text-center"><span className="loading loading-ghost loading-lg"></span></div>;
    }

    return (
      <div className="p-4">
            <TagSEO metadataProp={{ title: "Github Projects Web Pages Blogs Slug Update", description: "Explore Github Projects Web Pages Blogs Slug Update on Platform.", keywords: "artists, art community, marketplace", og: { title: "Github Projects Web Pages Blogs Slug Update", description: "Explore Github Projects Web Pages Blogs Slug Update on Platform." } }} canonicalSlug="/portal/staff/tagblog/[slug]/update" />
            <DynaFormDB
                request="update"
                metadataProp={enhancedMetadata}
                formData={props.blogdata}
            />
        </div>
    );
}

/**
 * Get initial props for component.
 * @async
 * @param {Object} context
 * @returns {Object}
 */
export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions);

    if (!session?.user) {
        return {
            redirect: {
                destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
                permanent: false,
            },
        };
    }

    if (!isStaff(session) && !isAdmin(session) && !isAuthorRole(session)) {
        return {
            notFound: true,
        };
    }

    const { slug } = context.query;
    if (!slug) {
        return { notFound: true };
    }
    let data = {};
    let metadata = null;
    try {
        const res1 = await fetch(api_url + `blog/path/${slug}`);
        data = await res1.json();

        const metadataResponse = await fetch(`${api_url}formsmetadata/${formName}`);
        if (metadataResponse.ok) {
            metadata = await metadataResponse.json();
        }
    } catch (error) {
        console.error("Error fetching form meta or field data:", error);
        if (typeof window !== 'undefined') {
            console.log('getInitialProps result:', { data, metadata, slug });
        }

    }

    return {
        props: {
            blogdata: data,
            slug: slug,
            metadataProp: metadata || {}
        }
    };
}
