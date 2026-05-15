    /* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import TagSEO from "@/components/TagSEO"
import DocumentationSection from "@/components/DocumentationSection"
import ContestCard from "@/components/cards/card_contest"
import getApiURL from "@/components/widgets/GetApiURL";

function ContestsIndex() {
  const pageMetaData = {
    title: "Contests",
    description: "Explore active contests, voting, and contest archives across Platform.",
    keywords: "art contests, artist voting, contest archive",
    og: {
      title: "Contests",
      description: "Explore active contests and community voting on Platform.",
    },
  }

  const [activeContests, setActiveContests] = useState([])
  const [archiveContests, setArchiveContests] = useState([])
  const [loadingActive, setLoadingActive] = useState(true)
  const [loadingArchive, setLoadingArchive] = useState(true)
    const [error, setError] = useState(null)
  const api_url = getApiURL();

  useEffect(() => {
    // Fetch active contests
    const fetchActive = async () => {
      setLoadingActive(true)
      try {
        const res = await fetch(`${api_url}contest/active`)
        if (!res.ok) throw new Error(`Active fetch failed: ${res.status}`)
        const data = await res.json()
        // Expect data to be an array; otherwise be defensive
        setActiveContests(Array.isArray(data) ? data : data?.contests || [])
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoadingActive(false)
      }
    }

    // Fetch archived contests
    const fetchArchive = async () => {
      setLoadingArchive(true)
      try {
          const res = await fetch(`${api_url}contest/archive`)
        if (!res.ok) throw new Error(`Archive fetch failed: ${res.status}`)
        const data = await res.json()
        setArchiveContests(Array.isArray(data) ? data : data?.contests || [])
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoadingArchive(false)
      }
    }

    fetchActive()
    fetchArchive()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="contests" />
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
        <DocumentationSection id="contest-framework" title="How Contests Work" bgColor="bg-base-100" sectionClassName="mb-12 py-0">
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
        </DocumentationSection>

        {/* Active contests list */}
        <section id="active-contests" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-primary">Active Contests</h2>
              <p className="text-base-content/80">Current contests open for submission and community voting.</p>
            </div>
            {/*<div>*/}
            {/*  <Link href="/contests/vote" className="btn btn-outline btn-sm">*/}
            {/*    Full Voting Hub*/}
            {/*  </Link>*/}
            {/*</div>*/}
          </div>

          {loadingActive ? (
            <div className="text-center py-8">Loading active contests…</div>
          ) : activeContests.length === 0 ? (
            <div className="text-center py-8 text-base-content/70">No active contests at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeContests.map((contest) => (
                <ContestCard key={contest.id || contest.path || contest.slug} contest={contest} />
              ))}
            </div>
          )}
        </section>

        {/* Archive contests list */}
        <section id="archive-contests" className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-primary">Contest Archive</h2>
              <p className="text-base-content/80">Past contests and their archived results for long-term discovery.</p>
            </div>
            {/*<div>*/}
            {/*  <Link href="/contests/archive" className="btn btn-outline btn-sm">*/}
            {/*    Browse Full Archive*/}
            {/*  </Link>*/}
            {/*</div>*/}
          </div>

          {loadingArchive ? (
            <div className="text-center py-8">Loading archived contests…</div>
          ) : archiveContests.length === 0 ? (
            <div className="text-center py-8 text-base-content/70">No archived contests available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {archiveContests.map((contest) => (
                <ContestCard key={contest.id || contest.path || contest.slug} contest={contest} />
              ))}
            </div>
          )}
        </section>

        {error && (
          <div className="rounded-box border border-error bg-error/5 p-4 text-error">
            There was an error loading contests. Check console for details.
          </div>
        )}
      </main>
    </div>
  )
}

export default ContestsIndex
