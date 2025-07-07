/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import DynaFormDB from "/components/widgets/DynaFormDB";

const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;
const formName = "UserForm1";

/**
 * Component for registering a user.
 * @param {Object} props
 * @param {Object} props.data
 * @returns {JSX.Element}
 */
export default function RegisterUserForm1(props) {
    return <div><DynaFormDB request="add" formName={formName} metadataProp={props.metadata} formData={props.data} /></div>;
}

/**
 * Get initial props for component.
 * @async
 * @param {Object} context
 * @returns {Object}
 */
RegisterUserForm1.getInitialProps = async function (context) {
    // If we are running in debug mode, log the active API URL
    if (process.env.DEBUG === "true") {
        console.log("RegisterUserForm1 fetch starting\n " + api_url );
    }
    const metadataRes = await fetch(`${api_url}forms_metadata/${formName}`);
    const metadata = await metadataRes.json();
    // Example: fetch registration data if needed, adjust endpoint as appropriate
    let data = null;
    try {
        const dataRes = await fetch(`${api_url}register_data`);
        data = await dataRes.json();
        if (process.env.DEBUG === "true") {
            console.log(`register data fetched. Count: ${Array.isArray(data) ? data.length : (data ? 1 : 0)}`);
        }
    } catch (err) {
        if (process.env.DEBUG === "true") {
            console.error("Error fetching register data", err);
        }
    }
    return {
        metadata: metadata,
        data: data
    };
}
