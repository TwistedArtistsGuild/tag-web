/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Image from "next/image"
import Link from "next/link"

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

function initialsOf(text) {
  return String(text || "?")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("") || "?"
}

function RowMedia({ media, explicit, title }) {
  if (explicit) {
    return <span className="tag-row__tile tag-row__tile--explicit" aria-label="Preview hidden: 18+ explicit">18+</span>
  }

  if (media.kind === "date") {
    // UTC so the server and the browser render the same day (no hydration mismatch).
    const date = media.date ? new Date(media.date) : null
    const valid = date && !Number.isNaN(date.getTime())
    return (
      <span className="tag-row__date" aria-hidden="true">
        <b>{valid ? date.getUTCDate() : "?"}</b>
        <small>{valid ? MONTHS[date.getUTCMonth()] : "TBA"}</small>
      </span>
    )
  }

  if (media.src) {
    return (
      <Image
        src={media.src}
        alt=""
        width={52}
        height={52}
        unoptimized
        className={media.kind === "avatar" ? "tag-row__avatar" : "tag-row__thumb"}
      />
    )
  }

  return <span className={media.kind === "avatar" ? "tag-row__avatar tag-row__avatar--initials" : "tag-row__tile"} aria-hidden="true">{initialsOf(title)}</span>
}

/**
 * Compact sidebar row: 52px media (thumb, avatar or date tile), a truncating title, one meta
 * line, an optional price chip and an optional trailing action (e.g. add to cart, remove).
 * @param {{ href: string, title: string, meta?: string, media?: { kind: "thumb"|"avatar"|"date", src?: string, date?: string },
 *   explicit?: boolean, price?: number, action?: React.ReactNode }} props
 */
export default function SidebarRow({ href, title, meta = "", media = { kind: "thumb" }, explicit = false, price, action = null }) {
  const showPrice = Number.isFinite(Number(price)) && Number(price) > 0

  return (
    <li className="tag-row">
      <Link href={href} className="tag-row__link">
        <RowMedia media={media} explicit={explicit} title={title} />
        <span className="tag-row__meta">
          <strong title={title}>{title}</strong>
          {meta ? <span title={meta}>{meta}</span> : null}
        </span>
      </Link>
      {showPrice ? <span className="tag-price">${Number(price).toFixed(2)}</span> : null}
      {action}
    </li>
  )
}
