/* This file is part of the Twisted Artists Guild project.
 Copyright (C) 2026 Twisted Artists Guild
 Licensed under the GNU General Public License v3.0 */

import DynaFormDB from "@/components/widgets/DynaFormDB";
import getApiURL from "@/components/widgets/GetApiURL";
import React, { useMemo, useState } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isStaff } from "@/utils/authHelpers";
import TagSEO from "@/components/TagSEO";
import StaffContextNav from "@/components/portal/StaffContextNav";

const api_url = getApiURL();

const formName = "CreateContestForm";

/**
 * Component for creating a new art contest.
 * @param {Object} props
 * @param {Object} props.metadataProp
 * @returns {JSX.Element}
 */
export default function CreateContestForm(props) {
    const enhancedMetadata = useMemo(() => {
        const base = Array.isArray(props.metadataProp)
            ? props.metadataProp[0]
            : props.metadataProp;

        if (!base || Object.keys(base).length === 0) {
            return null;
        }

        return {
            ...base,
            FromURL: "/contests/create.js",
            redirectURL: "/contests",
            APIURL: `${api_url}contest/create`
        };
    }, [props.metadataProp]);

    /**
      * Contest Specific Business Rule Interceptor Engine
      * @param {Object} currentFormValues - The updated form state payload dictionary
      * @param {Array} schemaFields - The structural dynamic table config fields array
      * @returns {Object} - Fully augmented state dictionary
      */
    const handleContestDateCalculations = (currentFormValues, schemaFields) => {
        // Create a shallow copy to safely mutate properties
        let updatedValues = { ...currentFormValues };

        // Safely extract names from the backend schema metadata array mappings
        const targetFields = schemaFields.map(f => f.name || f.Name).filter(Boolean);
        const findExactKey = (alternatives) => {
            return targetFields.find(f => alternatives.map(a => a.toLowerCase()).includes(f.toLowerCase())) || alternatives[0];
        };

        const startDateKey = findExactKey(["startDate", "StartDate", "start_date"]);
        const periodKey = findExactKey(["period", "Period"]);
        const warmupKey = findExactKey(["warmupDate", "WarmupDate", "warmup_date", "warmupStartDate", "WarmupStartDate"]);
        const warmupEndKey = findExactKey(["warmupEndDate", "WarmupEndDate", "warmup_end_date"]);
        const endKey = findExactKey(["endDate", "EndDate", "end_date"]);

        // Extract values using exact dynamic casing matching
        let startDate = updatedValues[startDateKey] || updatedValues[startDateKey.toLowerCase()];
        const period = updatedValues[periodKey] || updatedValues[periodKey.toLowerCase()];

        // Execute timeline projections if conditions are satisfied
        if (startDate && period) {
            // Standardize the selected Start Date to 8:00 PM (20:00) 
            if (startDate.includes("T")) {
                // Strip existing offset or Z if present to prevent double appending
                const pureDate = startDate.split("T")[0];
                startDate = `${pureDate}T20:00`;

                // CRITICAL FIX: Append 'Z' to tell PostgreSQL Npgsql provider this is UTC
                updatedValues[startDateKey] = `${startDate}Z`;
                updatedValues[startDateKey.toLowerCase()] = `${startDate}Z`;
            }

            const baseAnchor = new Date(startDate.endsWith('Z') ? startDate : `${startDate}Z`);
            let calculatedWarmupStart = new Date(baseAnchor);
            let calculatedEnd = new Date(baseAnchor);
            let timelineAltered = false;

            switch (String(period).trim().toLowerCase()) {
                case "weekly":
                    calculatedWarmupStart.setDate(baseAnchor.getDate() - 2);
                    calculatedEnd.setDate(baseAnchor.getDate() + 5);
                    timelineAltered = true;
                    break;
                case "monthly":
                    calculatedWarmupStart.setDate(baseAnchor.getDate() - 10);
                    calculatedEnd.setDate(baseAnchor.getDate() + 20);
                    timelineAltered = true;
                    break;
                case "quarterly":
                    calculatedWarmupStart.setDate(baseAnchor.getDate() - 30);
                    calculatedEnd.setDate(baseAnchor.getDate() + 60);
                    timelineAltered = true;
                    break;
                case "yearly":
                    calculatedWarmupStart.setDate(baseAnchor.getDate() - 90);
                    calculatedEnd.setDate(baseAnchor.getDate() + 275);
                    timelineAltered = true;
                    break;
            }

            if (timelineAltered) {
                // Helper that extracts the pure date segment and locks it with a UTC specifier
                const formatTo8PMWithUtc = (d) => {
                    const year = d.getUTCFullYear();
                    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(d.getUTCDate()).padStart(2, '0');
                    // Appending 'Z' fixes the Kind=Unspecified exception on Npgsql backend maps
                    return `${year}-${month}-${day}T20:00Z`;
                };

                const warmupStartStr = formatTo8PMWithUtc(calculatedWarmupStart);
                const activeEndStr = formatTo8PMWithUtc(calculatedEnd);
                const startUtcStr = startDate.endsWith('Z') ? startDate : `${startDate}Z`;

                // Assign valid PostgreSQL timestamp strings to schema-defined key variants
                updatedValues[warmupKey] = warmupStartStr;
                updatedValues[warmupEndKey] = startUtcStr;
                updatedValues[endKey] = activeEndStr;

                // Sync lowercase variants to handle raw layout renders
                updatedValues[warmupKey.toLowerCase()] = warmupStartStr;
                updatedValues[warmupEndKey.toLowerCase()] = startUtcStr;
                updatedValues[endKey.toLowerCase()] = activeEndStr;
            }
        }

        return updatedValues;
    };

    if (!enhancedMetadata) {
        return (
            <div className="p-10 text-center">
                <span className="loading loading-ghost loading-lg"></span>
                <p className="mt-4 text-gray-500">Loading Contest Configuration...</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <TagSEO metadataProp={{ title: "Create Contest", description: "Create a new art contest.", keywords: "contests, create, staff", robots: "noindex, nofollow", og: { title: "Create Contest", description: "Create a new art contest." } }} canonicalSlug="portal/staff/contests/create" />
            <StaffContextNav />
            <DynaFormDB
                request="add"
                metadataProp={enhancedMetadata}
                formData={null}
                onStateValueChange={handleContestDateCalculations}
            />
        </div>
    );
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/staff/contests/create")}`,
				permanent: false,
			},
		};
	}

	if (!isStaff(session) && !isAdmin(session)) {
		return {
			notFound: true,
		};
	}

    let metadata = {};
    try {
        let res = await fetch(`${api_url}formsmetadata/${formName}`);

        if (!res.ok) {
            res = await fetch(`${api_url}forms_metadata/${formName}`);
        }

        if (res.ok) {
            metadata = await res.json();
        }
    } catch (error) {
        console.error("Error fetching contest form meta:", error);
    }

    return { props: { metadataProp: metadata } };
}