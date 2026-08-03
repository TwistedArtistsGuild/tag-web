/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from 'react';
import TagSEO from "@/components/TagSEO";
import CostCalculator from '@/components/listings/CostCalculator';
import { IoCalculatorOutline } from 'react-icons/io5';

/**
 * Cost & Margin Calculator Test Page
 * Allows testing the calculator against any listing ID or in standalone preview mode.
 */
export default function CostCalculatorTest() {
    const [listingId, setListingId] = useState('');
    const [activeListingId, setActiveListingId] = useState(null);
    const [latestResult, setLatestResult] = useState(null);

    const pageMetaData = {
        title: "Cost Calculator Test",
        description: "Internal test page for the Cost & Margin Calculator component",
        keywords: "cost calculator, pricing, test",
        robots: "noindex, nofollow",
        og: {
            title: "Cost Calculator Test",
            description: "Internal test page for the Cost & Margin Calculator component",
        },
    };

    const handleLoad = (e) => {
        e.preventDefault();
        const parsed = parseInt(listingId);
        if (!isNaN(parsed) && parsed > 0) {
            setActiveListingId(parsed);
            setLatestResult(null);
        }
    };

    return (
        <>
            <TagSEO metadataProp={pageMetaData} canonicalSlug="test/costCalculator" />

            <div className="min-h-screen bg-base-200 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
                            <IoCalculatorOutline /> Cost Calculator — Test Page
                        </h1>
                        <p className="text-base-content/60 mt-1">
                            Enter a Listing ID to load/save a real cost breakdown, or just use the calculator in preview mode.
                        </p>
                    </div>

                    {/* Listing ID Selector */}
                    <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
                        <div className="card-body py-4">
                            <form onSubmit={handleLoad} className="flex flex-col sm:flex-row gap-3 items-end">
                                <div className="form-control flex-1">
                                    <label className="label"><span className="label-text font-medium">Listing ID</span></label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input input-bordered font-mono"
                                        placeholder="e.g. 42"
                                        value={listingId}
                                        onChange={(e) => setListingId(e.target.value)}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    Load Calculator
                                </button>
                            </form>
                            {activeListingId && (
                                <p className="text-sm text-success mt-2">
                                    ✓ Calculator loaded for Listing #{activeListingId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Live Result Badge */}
                    {latestResult && (
                        <div className="stats shadow border border-base-300 bg-base-100 w-full mb-6">
                            <div className="stat">
                                <div className="stat-title">Total Cost</div>
                                <div className="stat-value text-base-content font-mono text-xl">${latestResult.totalCost.toFixed(2)}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">ASMRP</div>
                                <div className="stat-value text-warning font-mono text-xl">${latestResult.asmrp.toFixed(2)}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Suggested Price</div>
                                <div className="stat-value text-primary font-mono text-xl">${latestResult.suggestedFinalPrice.toFixed(2)}</div>
                            </div>
                            <div className="stat">
                                <div className="stat-title">Pickup Price</div>
                                <div className="stat-value text-secondary font-mono text-xl">${latestResult.inPersonPickupPrice.toFixed(2)}</div>
                            </div>
                        </div>
                    )}

                    {/* Calculator */}
                    {activeListingId ? (
                        <CostCalculator
                            key={activeListingId}
                            listingId={activeListingId}
                            onPriceCalculated={setLatestResult}
                        />
                    ) : (
                        <div className="card bg-base-100 border border-base-300 shadow-sm">
                            <div className="card-body items-center text-center py-12">
                                <IoCalculatorOutline className="text-5xl text-base-content/20 mb-3" />
                                <p className="text-base-content/50 text-lg">Enter a Listing ID above to start testing</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}