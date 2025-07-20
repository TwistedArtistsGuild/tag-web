/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

 "use client"

import Link from "next/link"
import { useState } from "react"

function VoteIndex() {
  const [isPanelMinimized, setIsPanelMinimized] = useState(false)
  const togglePanel = () => {
    setIsPanelMinimized(!isPanelMinimized)
  }
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-primary">
          🎨 TAG Contest Central
        </h1>
        <p className="text-xl md:text-2xl text-secondary mb-6">Vote. Celebrate. Shape the future of art.</p>
        <p className="text-lg text-base-content max-w-3xl mx-auto">
          Welcome to the Twisted Artists Guild Contest Hub—your gateway to artist showcases, themed challenges, and
          member-driven voting. Whether you're an artist sharing your vision or a community member showing support,
          this is where collaboration meets celebration.
        </p>
      </section>
      <main className="container mx-auto px-4 py-8 flex-1 w-full">
        {/* Minimizeable Panel */}
        <div className="mb-6 card bg-base-100 shadow-lg rounded-box p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Quick Links</h2>
            <button className="btn btn-sm btn-secondary" onClick={togglePanel}>
              {isPanelMinimized ? "Expand" : "Minimize"}
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
        {/* What You Can Do Here Section */}
        <section className="card bg-base-100 shadow-lg rounded-box p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">What You Can Do Here</h2>
          <ul className="list-disc pl-5 text-lg text-base-content space-y-2">
            <li>Browse and vote on current contest entries</li>
            <li>Leave encouraging comments to uplift your fellow artists</li>
            <li>Explore past prompts and winning pieces across every medium</li>
            <li>Get inspired by the depth, diversity, and passion of our cooperative community</li>
          </ul>
        </section>
        {/* Active Prompts Section */}
        <section className="card bg-base-100 shadow-lg rounded-box p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary flex items-center gap-2">
            🗳️ Active Prompts
          </h2>
          <ul className="list-disc pl-5 text-lg text-base-content space-y-4">
            <li>
              <span className="font-semibold">Weekly Theme: "Autumn Colors"</span>
              <p className="text-base text-gray-700 ml-4">
                From crisp palettes to cozy moods—see how artists are interpreting fall’s textures and tones.
              </p>
            </li>
            <li>
              <span className="font-semibold">Monthly Challenge: "Winter Wonderland"</span>
              <p className="text-base text-gray-700 ml-4">
                A celebration of light, quiet, and mystery in winter scenes—from surreal snowscapes to whimsical icy
                creations.
              </p>
            </li>
            <li>
              <span className="font-semibold">Upcoming Quarterly Contest: "Valentine’s Day Special"</span>
              <p className="text-base text-gray-700 ml-4">
                Love in all its forms—romantic, platonic, artistic, chaotic. Submissions open soon!
              </p>
            </li>
          </ul>
          <div className="mt-8 text-center">
            <Link href="/vote/vote_halloween" className="btn btn-primary btn-lg">
              Vote on Halloween Contest
            </Link>
          </div>
        </section>
        {/* Previous Prompts and Winners Section */}
        <section className="card bg-base-100 shadow-lg rounded-box p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary flex items-center gap-2">
            🏆 Previous Prompts & Winners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="card bg-base-200 shadow-md p-4 rounded-box">
              <h3 className="text-xl font-semibold text-primary mb-2">Prompt: Hands of Love</h3>
              <ul className="list-disc pl-5 text-base-content space-y-1">
                <li>Winner: Artist A - Category: Painting</li>
                <li>Winner: Artist B - Category: Sculpture</li>
                <li>Winner: Artist C - Category: Digital Art</li>
              </ul>
            </div>
            <div className="card bg-base-200 shadow-md p-4 rounded-box">
              <h3 className="text-xl font-semibold text-primary mb-2">Prompt: Winter Wonderland</h3>
              <ul className="list-disc pl-5 text-base-content space-y-1">
                <li>Winner: Artist D - Category: Photography</li>
                <li>Winner: Artist E - Category: Painting</li>
                <li>Winner: Artist F - Category: Costume Design</li>
              </ul>
            </div>
            <div className="card bg-base-200 shadow-md p-4 rounded-box">
              <h3 className="text-xl font-semibold text-primary mb-2">Prompt: Nature’s Fury</h3>
              <ul className="list-disc pl-5 text-base-content space-y-1">
                <li>Winner: Artist G - Category: Digital Art</li>
                <li>Winner: Artist H - Category: Sculpture</li>
                <li>Winner: Artist I - Category: Painting</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default VoteIndex
