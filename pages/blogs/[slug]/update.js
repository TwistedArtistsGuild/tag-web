/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import DynaFormDB from "/components/widgets/DynaFormDB"

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.metadata
 * @returns {JSX.Element}
 */
export default function UpdateBlogForm1(props) {
    // Error handling
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
                </div>
            </div>
        );
    }

    // Loading state
    if (!props.metadataProp || !props.blogdata) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    // Set up the metadata properties  
    props.metadataProp.FromURL = "/blogs/" + props.slug + "/update.js";
    props.metadataProp.redirectURL = "/blogs/" + props.slug;
    
    // Debug: Log the form data and metadata
    if (process.env.NODE_ENV === 'development') {
        console.log("🔧 UpdateBlogForm1 - blogID:", props.blogdata.blogID);
        console.log("🔧 UpdateBlogForm1 - Full metadata:", props.metadataProp);
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <DynaFormDB 
                key={`blog-update-${props.blogdata.blogID}`}
                request="update" 
                metadataProp={props.metadataProp} 
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
UpdateBlogForm1.getInitialProps = async function (context) {
    const { slug } = context.query;
    if (!slug) {
        return { error: { message: "Blog's slug is missing from context query" } };
    }
    const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
    let data = {};
    let metadata = {};
    try {
        const res1 = await fetch(api_url + `blog/path/${slug}`);
        data = await res1.json();
        const res2 = await fetch(api_url + `forms_metadata/BlogForm1`);
        metadata = await res2.json();
    } catch (error) {
        console.error("Error fetching form meta or field data:", error);
    }
    return {
        blogdata: data,
        slug: slug,
        metadataProp: metadata
    };
};
