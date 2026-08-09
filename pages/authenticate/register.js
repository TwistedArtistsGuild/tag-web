/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import DynaFormDB from "@/components/widgets/DynaFormDB";
import TagSEO from "@/components/TagSEO";
import { useEffect, useState } from "react";
import serverFetch from "@/libs/serverFetch"

const formName = "UserForm1";

/**
 * Component for registering a user.
 * @param {Object} props
 * @param {Object} props.data
 * @returns {JSX.Element}
 */
export default function RegisterUserForm1(props) {
    const [metadata, setMetadata] = useState(props.metadata || null);
    const [data, setData] = useState(props.data || null);
    const [loading, setLoading] = useState(!props.metadata);

    // Fetch form metadata and data on client-side
    useEffect(() => {
        if (metadata) return; // Already loaded from props

        const fetchFormData = async () => {
            try {
                const metadataRes = await serverFetch(`/forms_metadata/${formName}`);
                const metadataData = await metadataRes.json();
                setMetadata(metadataData);

                try {
                    const dataRes = await serverFetch(`/register_data`);
                    const registrationData = await dataRes.json();
                    setData(registrationData);
                } catch (err) {
                    console.error("Error fetching register data", err);
                }
            } catch (err) {
                console.error("Error fetching form metadata", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFormData();
    }, [metadata]);
    return (
        <div>
            <TagSEO
                metadataProp={{
                    title: "Register Account",
                    description: "Create a new user account.",
                    robots: "noindex, nofollow",
                    keywords: "registration, account",
                    og: {
                        title: "Register Account",
                        description: "Create a new user account.",
                    },
                }}
                canonicalSlug="authenticate/register"
            />
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="loading loading-lg loading-spinner"></div>
                </div>
            ) : (
                <DynaFormDB request="add" formName={formName} metadataProp={metadata} formData={data} />
            )}
        </div>
    );
}

