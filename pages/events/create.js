/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import DynaFormDB from "@/components/widgets/DynaFormDB";
import TagSEO from "@/components/TagSEO";

const formName = "EventForm1";
//broken but don't care!!!!

export default function CreateEventForm1(props) {
    props.metadataProp = props.metadataProp || {};
    props.metadataProp.FromURL = "/events/create.js";
    props.metadataProp.redirectURL = "/events/";
    props.metadataProp.APIURL = `/api/${props.metadataProp.apiurlpostfix}`;
    return (
        <div className="p-4">
            <TagSEO
                metadataProp={{
                    title: "Create Event",
                    description: "Create a new event listing.",
                    robots: "noindex, nofollow",
                    keywords: "events, create event",
                    og: {
                        title: "Create Event",
                        description: "Create a new event listing.",
                    },
                }}
                canonicalSlug="events/create"
            />
            <DynaFormDB request="add" metadataProp={props.metadataProp} />
        </div>
    );
}

CreateEventForm1.getInitialProps = async function () {
    let metadata = {};
    try {
        const res = await fetch(`/api/forms_metadata/${formName}`);
        metadata = await res.json();
    } catch (error) {
        console.error("Error fetching form meta:", error);
    }
    return {
        metadataProp: metadata
    };
}
