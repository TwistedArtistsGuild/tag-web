/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect } from "react"

/**
 * Fades and lifts `[data-reveal]` elements inside `containerRef` into view once (adds `is-in`).
 * With reduced motion, or without IntersectionObserver, everything is shown at once.
 * The CSS only hides them when JS runs (html.tag-js), so content is never lost without JS.
 * @param {{ current: HTMLElement | null }} containerRef
 */
export default function useRevealOnScroll(containerRef) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    const elements = Array.from(container.querySelectorAll("[data-reveal]"))
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-in"))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in")
          observer.unobserve(entry.target)
        }
      })
    }, { rootMargin: "0px 0px -8% 0px" })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [containerRef])
}
