/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { BLOOMSCROLL_HREF } from "@/components/Header/nav-links"

/**
 * A Bloomscroll action with the scroll cue: a small mouse whose wheel runs the original hero
 * scroll-cue animation endlessly (pure CSS, static with reduced motion). Bloomscroll actions only,
 * so it always opens the Bloomscroll feed (the same link as the header's Bloomscroll logo).
 * @param {{ variant?: "primary"|"outline", children: React.ReactNode }} props
 */
export default function BloomscrollButton({ variant = "primary", children }) {
  return (
    <Link href={BLOOMSCROLL_HREF} className={`btn btn-${variant} tag-bs-btn`}>
      <span className="tag-bs-mouse" aria-hidden="true">
        <i />
      </span>
      {children}
    </Link>
  )
}
