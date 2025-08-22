/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import DynaFormDB from "/components/widgets/DynaFormDB";

const formName = "BlogForm1";

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @returns {JSX.Element}
 */
export default function CreateBlogForm1(props) {
    // Ensure we have metadata before proceeding
    if (!props.metadataProp) {
        return (
            <div className="card bg-base-100 shadow-lg max-w-4xl mx-auto">
                <div className="card-body">
                    <div className="alert alert-error">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>Failed to load form configuration. Please try again.</span>
                    </div>
                </div>
            </div>
        );
    }

    // Set up the metadata properties
    props.metadataProp.FromURL = "/blogs/create.js";
    props.metadataProp.redirectURL = "/blogs/";
    
    // Construct the API URL properly - handle both apiurlpostfix and apiurLpostfix (database typo)
    const apiPostfix = props.metadataProp.apiurlpostfix || props.metadataProp.apiurLpostfix || props.metadataProp.APIURLpostfix;
    if (apiPostfix) {
        // The NEXT_PUBLIC_TAG_API_URL should be http://localhost:5000/api/
        // and apiPostfix should be 'blog' 
        // Result should be http://localhost:5000/api/blog
        const baseUrl = process.env.NEXT_PUBLIC_TAG_API_URL;
        props.metadataProp.APIURL = `${baseUrl}${apiPostfix}`;
    } else {
        // Fallback for blog endpoint - this shouldn't happen if metadata is correct
        props.metadataProp.APIURL = `${process.env.NEXT_PUBLIC_TAG_API_URL}blog`;
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <DynaFormDB 
                request="add" 
                metadataProp={props.metadataProp} 
                formData={null} 
            />
        </div>
    );
}

CreateBlogForm1.getInitialProps = async function () {
    const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
    let metadata = {};
    try {
        const res = await fetch(api_url + 'forms_metadata/'+ formName);
        metadata = await res.json();
    } catch (error) {
        console.error("Error fetching form meta:", error);
    }
    return {
        metadataProp: metadata
    };
};
