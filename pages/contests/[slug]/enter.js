/* This file is part of the Twisted Artists Guild project.

   Copyright (C) 2026 Twisted Artists Guild
   Licensed under the GNU General Public License v3.0 */

import TagSEO from "@/components/TagSEO";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import ContestParticipationForm from "@/components/contests/contest-participation-form";
import Image from "next/image";
import Link from "next/link";
import longDateOptions from "@/utils/longdateoptions";
import serverFetch from "@/libs/serverFetch"

export default function ContestEnterPage({ contest = {}, listings = [], artists = [], slug }) {
    const canonicalSlug = `contests/${slug}/enter`;

    const parseDate = (v) => {
        if (!v) return null;
        const d = new Date(v);
        return Number.isNaN(d.getTime()) ? null : d;
    };

    const startDate = parseDate(contest.startDate || contest.starts || contest.created || contest.opened);
    const warmupEndDate = parseDate(contest.warmupEndDate);
    const endDate = parseDate(contest.endDate || contest.ends || contest.closed || contest.deadline);
    const now = new Date();
    const hasEnded = endDate ? endDate < now : false;
    const isActive = !hasEnded && (!startDate || startDate <= now);
    const isUpcoming = isActive && warmupEndDate > now;

    // Get the first artist's path for the "Add Listing" button
    const firstArtistPath = artists.length > 0 ? (artists[0].path || artists[0].Path) : null;

    const pageMetaData = {
        title: `Enter ${contest.title || "Contest"}`,
        description: contest.description || contest.byline || "Enter this contest with your listings.",
        keywords: `contest, enter, participate, ${contest.title || ""}`,
        og: {
            title: `Enter ${contest.title || "Contest"}`,
            description: contest.description || contest.byline || "",
            image: contest.coverPicUrl || "/placeholder.svg",
        },
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <TagSEO metadataProp={pageMetaData} canonicalSlug={canonicalSlug} />

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-3"
                                dangerouslySetInnerHTML={{ __html: contest.title || "Enter Contest" }} />
                            
                            {contest.byline && (
                                <p className="text-lg text-secondary mb-4">{contest.byline}</p>
                            )}

                            {contest.description && (
                                <div className="rounded-box border border-base-300 bg-base-100/70 p-4 prose max-w-none mb-4">
                                    <div dangerouslySetInnerHTML={{ __html: contest.description || contest.summary || "" }} />
                                </div>
                            )}

                            {contest.guidelines && (
                                <div className="rounded-box border border-base-300 bg-base-100/70 p-4 mb-4">
                                    <h3 className="text-lg font-semibold text-primary mb-2">Guidelines</h3>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contest.guidelines }} />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                {contest.prompt && (
                                    <div className="rounded-box border border-base-300 bg-base-100/60 p-4">
                                        <h4 className="text-sm font-semibold text-secondary uppercase tracking-wide">Prompt</h4>
                                        <p className="mt-2 text-base-content">{contest.prompt}</p>
                                    </div>
                                )}

                                <div className="rounded-box border border-base-300 bg-base-100/60 p-4 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-sm font-semibold text-secondary uppercase tracking-wide">Period</h4>
                                        <p className="mt-2 text-base-content text-sm">
                                            {startDate ? new Date(startDate).toLocaleDateString("en-US", longDateOptions) : "Start: TBD"}
                                            <br />
                                            {endDate ? new Date(endDate).toLocaleDateString("en-US", longDateOptions) : "End: TBD"}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        {hasEnded ? (
                                            <span className="badge badge-error badge-lg">Contest Ended</span>
                                        ) : isActive && !isUpcoming ? (
                                            <span className="badge badge-success badge-lg">Open - Accepting Entries</span>
                                        ) : (
                                            <span className="badge badge-info badge-lg">Upcoming</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-primary">Select Your Listings to Enter</h2>
                                {firstArtistPath && (
                                    <Link
                                        href={`/portal/artist/${firstArtistPath}/listing/create`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Listing
                                    </Link>
                                )}
                            </div>
                            <ContestParticipationForm initialListings={listings} contest={contest} slug={slug} />
                        </div>
                    </div>

                    <aside className="lg:col-span-1">
                        <div className="rounded-box overflow-hidden border border-base-300 bg-base-100 shadow-md sticky top-4">
                            <div className="relative h-60 w-full bg-base-200">
                                <Image
                                    src={contest.coverPicUrl || "/placeholder.svg"}
                                    alt={contest.title || "Contest cover"}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            <div className="p-4">
                                <h4 className="text-sm text-secondary font-semibold uppercase tracking-wide mb-3">Contest Summary</h4>
                                <ul className="space-y-3 text-sm text-base-content/85">
                                    {contest.prompt && (
                                        <li>
                                            <span className="font-semibold text-base-content">Prompt:</span>
                                            <p className="mt-1">{contest.prompt}</p>
                                        </li>
                                    )}
                                    {startDate && (
                                        <li>
                                            <span className="font-semibold text-base-content">Starts:</span>
                                            <p className="mt-1">{new Date(startDate).toLocaleDateString("en-US", longDateOptions)}</p>
                                        </li>
                                    )}
                                    {endDate && (
                                        <li>
                                            <span className="font-semibold text-base-content">Ends:</span>
                                            <p className="mt-1">{new Date(endDate).toLocaleDateString("en-US", longDateOptions)}</p>
                                        </li>
                                    )}
                                    {contest.period && (
                                        <li>
                                            <span className="font-semibold text-base-content">Period:</span>
                                            <p className="mt-1">{contest.period}</p>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.query;
    
    const session = await getServerSession(context.req, context.res, authOptions);

    // If no session, redirect to login
    if (!session) {
        return {
            redirect: {
                destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(`/contests/${slug}/enter`)}`,
                permanent: false,
            },
        };
    }

    let contest = {};
    let listings = [];
    let artists = [];

    try {
        // 1. Fetch Contest
        const contestRes = await serverFetch(`/contest/slug/${slug}`);

        if (contestRes.ok) {
            const text = await contestRes.text();
            if (text) {
                const data = JSON.parse(text);
                contest = Array.isArray(data) ? data[0] : data;
            }
        }

        // 2. Fetch Artists and Listings using the server-side session user ID
        const userId = session.user.id;
        const artistsRes = await serverFetch(`/linker_usertoartist/byUserID/${userId}`);

        if (artistsRes.ok) {
            const text = await artistsRes.text();
            
            if (text) {
                artists = JSON.parse(text);
                console.log("Fetched artists:", artists);
                const listingPromises = artists.map(async (a) => {
                    const id = a.artistID;
                    
                    const lRes = await serverFetch(`/listing/artist/${id}`);
                    
                    if (lRes.ok) {
                        const lText = await lRes.text();
                       
                        return lText ? JSON.parse(lText) : [];
                    }
                    return [];
                });
                const results = await Promise.all(listingPromises);
                listings = results.flat();
            }
        }
    } catch (e) {
        console.error("Fetch error details:", e);
    }

    return {
        props: {
            contest: JSON.parse(JSON.stringify(contest)),
            listings: JSON.parse(JSON.stringify(listings)),
            artists: JSON.parse(JSON.stringify(artists)),
            slug,
        }
    };
}