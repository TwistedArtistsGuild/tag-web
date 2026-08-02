/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TagSEO from '@/components/TagSEO';
import CostCalculator from '@/components/listings/CostCalculator';
import { IoArrowBackOutline, IoCalculatorOutline } from 'react-icons/io5';

export default function ListingCostsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [latestResult, setLatestResult] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/api/auth/signin?callbackUrl=' + encodeURIComponent(router.asPath));
        }
    }, [status, router]);

    useEffect(() => {
        const fetchListing = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/Listing/${id}`);
                if (res.ok) {
                    setListing(await res.json());
                }
            } catch (err) {
                console.error("Failed to load listing", err);
            }
            setLoading(false);
        };
        fetchListing();
    }, [id]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl font-bold">Listing not found</p>
                    <Link href="/dashboard/listings" className="btn btn-primary">Back to Listings</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 py-8 lg:py-12">
            <TagSEO metadataProp={{ title: `Cost Calculator — ${listing.title_Plaintext || listing.title || 'Listing'}` }} canonicalSlug={`dashboard/listings/${id}/costs`} />

            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <Link href={`/dashboard/listings/${id}`} className="btn btn-ghost btn-sm gap-1 mb-2">
                            <IoArrowBackOutline /> Back to Listing
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-extrabold text-primary flex items-center gap-2">
                            <IoCalculatorOutline /> Cost & Margin Calculator
                        </h1>
                        <p className="text-base-content/60 mt-1">
                            {listing.title_Plaintext || listing.title}
                        </p>
                    </div>

                    {/* Live price badge */}
                    {latestResult && (
                        <div className="stats shadow border border-base-300 bg-base-100">
                            <div className="stat py-3 px-5">
                                <div className="stat-title text-xs">Suggested Price</div>
                                <div className="stat-value text-primary text-2xl font-mono">
                                    ${latestResult.suggestedFinalPrice.toFixed(2)}
                                </div>
                                <div className="stat-desc">ASMRP: ${latestResult.asmrp.toFixed(2)}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Calculator */}
                <CostCalculator
                    listingId={parseInt(id)}
                    onPriceCalculated={setLatestResult}
                />
            </div>
        </div>
    );
}