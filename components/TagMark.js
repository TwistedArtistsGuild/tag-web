/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useId } from "react"
import { LOGO_D } from "@/utils/morphMark"

/**
 * The TAG mark as a still (unanimated) SVG, filled with the palette gradient.
 * Gradient stops come from tokens, so it follows the palette and light/dark mode.
 * @param {{ className?: string, title?: string }} props title is the accessible name
 */
export default function TagMark({ className = "", title = "Twisted Artists Guild" }) {
  const gradientId = `tag-mark-${useId().replace(/:/g, "")}`

  return (
    <svg className={`tag-mark ${className}`.trim()} viewBox="0 0 2144 1864" role="img" aria-label={title}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="tag-mark__stop-1" />
          <stop offset=".45" className="tag-mark__stop-2" />
          <stop offset="1" className="tag-mark__stop-3" />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} fillRule="evenodd" d={LOGO_D} />
    </svg>
  )
}
