/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import DynaFormDB from "/components/widgets/DynaFormDB";

const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
const formName = "ListingForm1";

//bnroken but don't care!!!!

export default function UpdateListingForm2(props) {
    props.metadataProp.FromURL = "/portal/listing/update.js";
    props.metadataProp.redirectURL = "/portal/listing/" + props.id;
    props.metadataProp.APIURL = process.env.NEXT_PUBLIC_TAG_API_URL + `${props.metadataProp.apiurlpostfix}/${props.id}`;
    return <div className="p-4"><DynaFormDB request="update" metadataProp={props.metadataProp} fieldsProp={props.metadataProp.forms_fields} formData={props.listingdata} /></div>;
}

UpdateListingForm2.getInitialProps = async function (context) {
    const { id } = context.query;
    if (!id) {
        return { error: { message: "Listing ID is missing from context query" } };
    }
    let data = {};
    let metadata = {};
    try {
        const res1 = await fetch(api_url + `listingByID/${id}`);
        data = await res1.json();
        const res2 = await fetch(api_url + 'forms_metadata/'+ formName);
        metadata = await res2.json();
    } catch (error) {
        console.error("Error fetching form meta or field data:", error);
    }
    return {
        listingdata: data,
        id: id,
        metadataProp: metadata
    };
};