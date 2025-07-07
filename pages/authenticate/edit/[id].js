/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



/* Copyright (C) Twisted Artists Guild - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 * Use https://dev.azure.com/bobbshields/tag-web-dev for dev team communcation tools
 */

import DynaFormDB from "/components/widgets/DynaFormDB";

const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
const formName = "UserForm1";

/**
 * Component for updating user details.
 * @param {Object} props
 * @param {Object} props.data
 * @param {Object} props.metadata
 * @returns {JSX.Element}
 */
export default function UpdateUserForm1(props) {
    props.metadataProp.FromURL = "/authenticate/edit/" + props.id + ".js";
    props.metadataProp.redirectURL = "/authenticate/edit/" + props.id;
    props.metadataProp.APIURL = process.env.NEXT_PUBLIC_TAG_API_URL + `${props.metadataProp.apiurlpostfix}/${props.id}`;
    return <div className="p-4"><DynaFormDB request="update" metadataProp={props.metadataProp} formData={props.userdata} /></div>;
}

/**
 * Get initial props for component.
 * @async
 * @param {Object} context
 * @returns {Object}
 */
UpdateUserForm1.getInitialProps = async function (context) {
    const {id} = context.query;
    if (!id) {
        return { error: {message: "ID is missing from context query"} };
    }
    const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
    let data = {};
    let metadata = {};
    try {
        const res1 = await fetch(api_url + `user/${id}`);
        data = await res1.json();
        const res2 = await fetch(api_url + `forms_metadata/UserForm1`);
        metadata = await res2.json();
    } catch (error) {
        console.error("Error fetching form meta or field data:", error);
    }
    return {
        userdata: data,
        id: id,
        metadataProp: metadata
    };
}
