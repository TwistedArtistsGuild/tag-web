/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import DynaFormDB from "/components/widgets/DynaFormDB"

//broken but don't care!!!!

// Set the active API URL defaulting to prod
var activeAPI_URL = process.env.NEXT_PUBLIC_TAG_API_URL

const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
const formName = "EventForm1";

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.metadata
 * @returns {JSX.Element}
 */
export default function UpdateEventForm1(props) {
    props.metadataProp.FromURL = "/events/" + props.slug + "/update.js";
    props.metadataProp.redirectURL = "/events/" + props.slug;
    props.metadataProp.APIURL = process.env.NEXT_PUBLIC_TAG_API_URL + `${props.metadataProp.apiurlpostfix}/${props.slug}`;
    return <div className="p-4"><DynaFormDB request="update" metadataProp={props.metadataProp} formData={props.eventdata} /></div>;
}

/**
 * Get initial props for component.
 * @async
 * @param {Object} context
 * @returns {Object}
 */
UpdateEventForm1.getInitialProps = async function (context) {
    const { slug } = context.query;
    if (!slug) {
        return { error: { message: "Event slug is missing from context query" } };
    }
    const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
    let data = {};
    let metadata = {};
    try {
        const res1 = await fetch(api_url + `event/${slug}`);
        data = await res1.json();
        const res2 = await fetch(api_url + `forms_metadata/EventForm1`);
        metadata = await res2.json();
    } catch (error) {
        console.error("Error fetching form meta or field data:", error);
    }
    return {
        eventdata: data,
        slug: slug,
        metadataProp: metadata
    };
};