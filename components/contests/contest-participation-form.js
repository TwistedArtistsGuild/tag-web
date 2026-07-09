/* This file is part of the Twisted Artists Guild project.

   Copyright (C) 2026 Twisted Artists Guild
   Licensed under the GNU General Public License v3.0 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ContentTags, { hasExplicitWarning, extractContentWarnings } from "@/components/social/ContentTags";

export default function ContestParticipationForm({ initialListings = [], contest = {}, slug }) {
    const [selected, setSelected] = useState(new Set());
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const toggleSelection = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleSubmit = async () => {
        setError(null);
        if (selected.size === 0) {
            setError("Please select at least one listing to enter.");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                ContestId: contest.Id || contest.id,
                ListingIds: Array.from(selected)
            };

            const res = await fetch(`/api/contest/participate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Failed to join contest: ${res.statusText}`);
            }

            router.push(`/contests/${slug}`);
        } catch (e) {
            console.error(e);
            setError(e.message);
            setSubmitting(false);
        }
    };

    if (!Array.isArray(initialListings) || initialListings.length === 0) {
        return (
            <div className="alert alert-warning">
                <span>No listings found. Please create art listings before entering a contest.</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="alert alert-error shadow-lg">
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialListings.map((listing) => {
                    const id = listing.listingID;
                    const isSelected = selected.has(id);
                    const contentWarnings = extractContentWarnings(listing);
                    const hideImage = hasExplicitWarning(contentWarnings);

                    return (
                        <div
                            key={id}
                            className={`card bg-base-100 text-base-content shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out border-2 cursor-pointer rounded-box ${
                                isSelected ? "border-primary" : "border-base-300"
                            }`}
                            onClick={() => toggleSelection(id)}
                        >
                            <figure className="relative h-48 w-full overflow-hidden">
                                {contentWarnings.length > 0 && (
                                    <div className="absolute left-0 right-0 top-0 z-10">
                                        <ContentTags
                                            warnings={contentWarnings.slice(0, 2)}
                                            size="sm"
                                            showTitle={false}
                                            className="rounded-none border-0 bg-base-100/92 px-2 py-1"
                                        />
                                    </div>
                                )}

                                {hideImage ? (
                                    <div className="flex h-full w-full items-center justify-center bg-base-200 text-center">
                                        <div className="space-y-1 px-3">
                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-error">18+ Explicit</p>
                                            <p className="text-[10px] text-base-content/70">Preview hidden</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        src={listing?.profilePic?.url || "/blank_image.png"}
                                        alt={listing?.profilePic?.altText || `${listing?.title || "Unknown"}'s picture`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 320px"
                                        style={{ objectFit: "cover" }}
                                        className="rounded-t-box transition-transform duration-300"
                                    />
                                )}
                            </figure>

                            <div className="card-body p-3">
                                <h3 className="card-title text-lg text-primary">
                                    {listing?.title || "Untitled"}
                                </h3>
                                <p className="text-sm text-base-content/90 line-clamp-2">
                                    {listing?.description || "No description available"}
                                </p>
                                <p className="text-xs text-base-content/80 mt-2">
                                    Listing created:{" "}
                                    {listing?.created ? new Date(listing.created).toLocaleDateString("en-US") : "No date available"}
                                </p>
                                <p className="text-xs text-base-content/80">
                                    Category: {listing?.artCategory?.category || "No category found"}
                                </p>
                                <p className="text-xs text-base-content/80">
                                    Price: ${listing?.price?.toFixed(2) || "N/A"}
                                </p>

                                <div className="card-actions justify-end mt-2">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => {}}
                                        className="checkbox checkbox-primary pointer-events-none"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSubmit}
                    className={`btn btn-primary btn-lg ${submitting ? "loading" : ""}`}
                    disabled={submitting || selected.size === 0}
                >
                    {submitting ? "Entering..." : `Submit ${selected.size} Selection(s)`}
                </button>
            </div>
        </div>
    );
}