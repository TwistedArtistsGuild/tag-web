/* This file is part of the Twisted Artists Guild project

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source - low-profit - human-first */
"use client"

import Link from "next/link"
import Image from "next/image"
import { CARD_SHELL_CLASS } from "@/components/cards/sizes/panel-layout"

export default function ContestCard({ contest = {}, compact = false }) {
  const id = contest?.id || contest?.contestId || contest?.path || contest?.slug || "contest"
  const title = contest?.title || contest?.name || "Untitled Contest"
  const prompt = contest?.prompt || contest?.summary || contest?.description || ""
  const cadence = contest?.cadence || contest?.type || ""
  const cover = contest?.coverPicUrl || "/placeholder.svg"

  const contestHref = `/contests/${contest?.path || contest?.slug || id}`

  // Date parsing and status logic (same as [slug]/index.js)
  const parseDate = (v) => {
    if (!v) return null
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? null : d
  }

  const startDate = parseDate(contest.startDate || contest.starts || contest.created || contest.opened)
  const warmupEndDate = parseDate(contest.warmupEndDate)
  const endDate = parseDate(contest.endDate || contest.ends || contest.closed || contest.deadline)
  const now = new Date()
  const hasEnded = endDate ? endDate < now : false
  const isActive = !hasEnded && (!startDate || startDate <= now)
  const isUpcoming = isActive && warmupEndDate && warmupEndDate > now

  return (
    <article className={`${CARD_SHELL_CLASS} h-auto overflow-hidden`}>
      <div className={`card-body ${compact ? "gap-2 p-3" : "gap-4 p-4"}`}>
        <figure className={`relative ${compact ? "h-36" : "h-48"} w-full rounded-box overflow-hidden mb-3`}>
          <Image
            src={cover}
            alt={String(title)}
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Status badge overlay */}
          <div className="absolute top-2 right-2 z-10">
            {hasEnded ? (
              <span className="badge badge-error badge-sm">Ended</span>
            ) : isActive && !isUpcoming ? (
              <span className="badge badge-success badge-sm">Open</span>
            ) : isUpcoming ? (
              <span className="badge badge-info badge-sm">Upcoming</span>
            ) : null}
          </div>
        </figure>

        {cadence && <p className="text-xs uppercase tracking-wide text-secondary font-semibold mb-1">{cadence}</p>}

        <h3 className="text-xl font-bold text-primary leading-tight mb-2">
          <Link href={contestHref} className="hover:underline">
            <span dangerouslySetInnerHTML={{ __html: title }} />
          </Link>
        </h3>

        <p className="text-base-content/80 text-sm line-clamp-3 mb-4">{prompt}</p>

        <div className="mt-auto flex gap-3">
          <Link href={contestHref} className="btn btn-primary btn-sm">
            View Contest
          </Link>
          {contest?.archiveLink && (
            <Link href={contest.archiveLink} className="btn btn-outline btn-sm">
              View Archive
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}