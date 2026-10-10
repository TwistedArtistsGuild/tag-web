/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

/**
 * Glassy tab on the screen edge that opens a panel (shown from 1060px; below that the header
 * icon buttons take over). Hidden while its panel is open.
 * @param {{ side: "left"|"right", label: string, ariaLabel: string, icon: React.ReactNode,
 *   count?: number, controls: string, expanded: boolean, onClick: () => void }} props
 */
export default function EdgeTab({ side, label, ariaLabel, icon, count = 0, controls, expanded, onClick }) {
  return (
    <button
      type="button"
      className={`tag-edge-tab tag-edge-tab--${side}${expanded ? " is-hidden" : ""}`}
      aria-label={ariaLabel}
      aria-controls={controls}
      aria-expanded={expanded}
      tabIndex={expanded ? -1 : 0}
      onClick={onClick}
    >
      {icon}
      {count > 0 ? <span className="tag-count" aria-hidden="true">{count}</span> : null}
      <span className="tag-edge-tab__label" aria-hidden="true">{label}</span>
    </button>
  )
}
