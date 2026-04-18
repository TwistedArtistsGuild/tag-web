/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

 "use client"

import Link from "next/link"

function ContestsIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-primary">Art Contests</h1>
        <p className="text-xl md:text-2xl text-secondary mb-6">Highlight artist work. Grow engagement. Build visibility.</p>
        <p className="text-lg text-base-content max-w-3xl mx-auto">
          Twisted Artists Guild runs ongoing art contests designed to spotlight artist work, encourage community
          participation, and create durable visibility for members over time.
        </p>
      </section>
      <main className="container mx-auto px-4 py-8 flex-1 w-full">
        {/* Contest Framework */}
        <section className="card bg-base-100 shadow-lg rounded-box p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">How Contests Work</h2>
          <p className="text-lg text-base-content mb-4">
            Contests run on a monthly, quarterly, and annual cadence. Submissions are showcased publicly, and winners
            are determined by community reactions rather than gatekeeping panels.
          </p>
          <ul className="list-disc pl-5 text-lg text-base-content space-y-2">
            <li>Artists submit work to open contest windows.</li>
            <li>Public users can apply multiple reactions to support work they connect with.</li>
            <li>Grassroots enthusiasm drives visibility and outcomes.</li>
            <li>Results remain visible for transparency and long-term recognition.</li>
          </ul>
        </section>

        {/* Community Reaction Model */}
        <section className="card bg-base-100 shadow-lg rounded-box p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary flex items-center gap-2">
            🗳️ Community-Led Outcomes
          </h2>
          <p className="text-lg text-base-content mb-4">
            Each public user may apply multiple reactions. This helps authentic enthusiasm and broad community support
            shape rankings, instead of relying on a single up-vote dynamic.
          </p>
          <p className="text-lg text-base-content">
            The model is intentionally lightweight and transparent: artists submit, the public reacts, and outcomes
            stay visible.
          </p>
          <div className="mt-8 text-center">
            <Link href="/contests/vote_halloween" className="btn btn-primary btn-lg">
              View Active Contest
            </Link>
          </div>
        </section>

        {/* Contest Archive */}
        <section className="card bg-base-100 shadow-lg rounded-box p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary flex items-center gap-2">
            🏆 Durable Visibility Through Archives
          </h2>
          <p className="text-lg text-base-content mb-4">
            Every contest is archived with public-facing, indexable links to participating artist profiles and
            listings. Archives remain accessible long-term to keep work discoverable after the contest window closes.
          </p>
          <p className="text-lg text-base-content mb-4">
            This creates ongoing exposure, backlinking value, and SEO benefits for artists and for the Guild.
          </p>
          <p className="text-lg text-base-content font-semibold mb-8">
            Over time, contests become a growing, searchable history of artist success within the cooperative.
          </p>
          <div className="text-center">
            <Link href="/vote/archive" className="btn btn-primary btn-lg">
              Explore Contest Archive
            </Link>
          </div>
        </section>

      </main>
    </div>
  )
}

export default ContestsIndex
