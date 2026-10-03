/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import TagSEO from "@/components/TagSEO"

/**
 * Component for updating listing details.
 * @param {Object} props - Component properties
 * @param {Object} props.metadata - Form metadata
 * @param {Object} props.listingData - Listing data
 * @param {string} props.id - Listing ID
 * @param {Object} props.error - Error object if any
 * @returns {JSX.Element} - Rendered component
 */
export default function UpdateListingForm1(props) {
    const router = useRouter();
    const { slug, L_slug } = router.query;

    return (
      <div className="min-h-[60vh] p-6 md:p-10 bg-base-200">
      <TagSEO metadataProp={{ title: "Listing Update Moved to Portal", description: "Listing editing now happens in the Artist Portal.", keywords: "listing, portal, update", og: { title: "Listing Update Moved to Portal", description: "Listing editing now happens in the Artist Portal." } }} canonicalSlug="/artists/[slug]/listings/[L_slug]/update" />
            <div className="max-w-3xl mx-auto card bg-base-100 shadow border border-base-300">
                <div className="card-body gap-4">
                    <h1 className="text-2xl font-bold">This Listing Update Page Has Moved</h1>
                    <p className="text-base-content/80">
                        If you own this listing, sign in to the Artist Portal to edit listing details and manage media.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {(slug && L_slug) ? (
                            <Link href={`/portal/artist/${slug}/listing/update/${L_slug}`} className="btn btn-primary">Open Listing Editor</Link>
                        ) : null}
                        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Go Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
