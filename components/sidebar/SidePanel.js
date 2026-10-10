/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect, useRef } from "react"

/**
 * Shared frame for the Browse (left) and Cart (right) panels: head with title and close button,
 * a scrolling body and an optional sticky footer.
 * Accessibility: `inert` while closed; focus moves to the close button on open and back to the
 * opener on close (the element focused before opening, or the visible control for this panel).
 * @param {{ id: string, side: "left"|"right", title: string, titleExtra?: React.ReactNode,
 *   open: boolean, onClose: () => void, footer?: React.ReactNode, className?: string, children: React.ReactNode }} props
 */
export default function SidePanel({ id, side, title, titleExtra = null, open, onClose, footer = null, className = "", children }) {
  const closeRef = useRef(null)
  const returnFocusRef = useRef(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      returnFocusRef.current = document.activeElement
      closeRef.current?.focus({ preventScroll: true })
    }

    if (!open && wasOpenRef.current) {
      const previous = returnFocusRef.current
      returnFocusRef.current = null
      const panel = document.getElementById(id)
      // Visible and focusable (offsetParent can't be used: the edge tabs are position: fixed)
      const isUsable = (el) => el && el !== document.body && document.contains(el) && !panel?.contains(el)
        && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden" && !el.closest("[inert]")
      const opener = isUsable(previous)
        ? previous
        : Array.from(document.querySelectorAll(`[aria-controls="${id}"]`)).find(isUsable)
      // Only move focus if it was inside the panel (don't steal it from wherever the user went).
      if (opener && (!document.activeElement || document.activeElement === document.body || panel?.contains(document.activeElement))) {
        opener.focus({ preventScroll: true })
      }
    }

    wasOpenRef.current = open
  }, [id, open])

  return (
    <aside
      id={id}
      className={`tag-panel tag-panel--${side}${open ? " is-open" : ""} ${className}`.trim()}
      aria-label={title}
      inert={!open}
    >
      <div className="tag-panel__head">
        <h2 className="tag-panel__title">
          {title}
          {titleExtra}
        </h2>
        <button ref={closeRef} type="button" className="tag-panel__close" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="tag-panel__body">{children}</div>
      {footer ? <div className="tag-panel__foot">{footer}</div> : null}
    </aside>
  )
}
