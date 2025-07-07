/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useState } from 'react';
import Link from 'next/link';

const VoteIndex = () => {
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);

  const togglePanel = () => {
    setIsPanelMinimized(!isPanelMinimized);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        {/* Minimizeable Panel */}
        <div className="mb-6 border rounded-lg shadow bg-base-100 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Quick Links</h2>
            <button
              className="btn btn-sm btn-secondary"
              onClick={togglePanel}
            >
              {isPanelMinimized ? 'Expand' : 'Minimize'}
            </button>
          </div>
          {!isPanelMinimized && (
            <div className="mt-4">
              <Link href="/shareholders" className="btn btn-primary">
                Shareholder Voting
              </Link>
            </div>
          )}
        </div>

        {/* Main Content */}
        <h1 className="text-4xl font-bold mb-4 text-primary">Art Competitions</h1>
        <p className="text-lg mb-6 text-base-content">
          Welcome to the Twisted Artists Guild voting page! Here, you can vote on your favorite art pieces and leave comments to support the artists. Your engagement helps shape the community and celebrate creativity.
        </p>
        <div>
            <h3 className="text-lg font-bold">Active Prompts:</h3>
            <ul className="list-disc pl-5">
                <li>Weekly Contest: "Autumn Colors"</li>
                <li>Monthly Contest: "Winter Wonderland"</li>
                <li>Upcoming Quarterly Contest: "Valentine's Day Special"</li>
            </ul>
        </div>
        <div className="">
          <Link href="/vote/vote_halloween" className="btn btn-primary">
            Vote on Halloween Contest
          </Link>
        </div>
        <div className="mt-8">
                    <h2 className="text-3xl font-bold">Previous Prompts and Winners</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="border rounded p-4 shadow">
                            <h3 className="text-2xl font-semibold">Prompt: Hands of Love</h3>
                            <ul className="list-disc pl-5">
                                <li>Winner: Artist A - Category: Painting</li>
                                <li>Winner: Artist B - Category: Sculpture</li>
                                <li>Winner: Artist C - Category: Digital Art</li>
                            </ul>
                        </div>
                        <div className="border rounded p-4 shadow">
                            <h3 className="text-2xl font-semibold">Prompt: Winter Wonderland</h3>
                            <ul className="list-disc pl-5">
                                <li>Winner: Artist D - Category: Photography</li>
                                <li>Winner: Artist E - Category: Painting</li>
                                <li>Winner: Artist F - Category: Costume Design</li>
                            </ul>
                        </div>
                        <div className="border rounded p-4 shadow">
                            <h3 className="text-2xl font-semibold">Prompt: Nature's Fury</h3>
                            <ul className="list-disc pl-5">
                                <li>Winner: Artist G - Category: Digital Art</li>
                                <li>Winner: Artist H - Category: Sculpture</li>
                                <li>Winner: Artist I - Category: Painting</li>
                            </ul>
                        </div>
                    </div>
                </div>
      </div>
    </div>
  );
};

export default VoteIndex;