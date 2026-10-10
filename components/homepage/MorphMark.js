/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect, useId, useRef } from "react"
import {
  ICONS,
  LOGO_D,
  N,
  ROLE_TOKENS,
  alignTo,
  buildMorphPath,
  centroid,
  ease,
  hexToRgb,
  phaseAt,
  stopColours,
  toStage,
} from "@/utils/morphMark"

/**
 * The TAG morph mark at the bottom of the landing hero: the logo morphs into a record, palette,
 * paintbrush, canvas and pencil in an endless loop, and its gradient colours morph with it.
 * Performance: shapes are sampled once; the loop runs only while the mark is on screen and the
 * tab is visible; the path is written only while it is changing. Reduced motion: still logo.
 * @param {{ href: string }} props where the mark scrolls to
 */
export default function MorphMark({ href }) {
  const gradientId = `tag-morph-${useId().replace(/:/g, "")}`
  const linkRef = useRef(null)
  const pathRef = useRef(null)
  const samplerRef = useRef(null)
  const stopRefs = [useRef(null), useRef(null), useRef(null)]

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined
    const path = pathRef.current
    const sampler = samplerRef.current
    const stops = stopRefs.map((ref) => ref.current)
    if (!path || !sampler || stops.some((stop) => !stop)) return undefined

    // Sample every ring once (N points), counter-clockwise, so all shapes share one point order.
    const sample = (d, transform) => {
      sampler.setAttribute("d", d)
      const length = sampler.getTotalLength()
      let points = []
      for (let i = 0; i < N; i++) {
        const p = sampler.getPointAtLength((length * i) / N)
        points.push(transform ? transform(p.x, p.y) : [p.x, p.y])
      }
      let area = 0
      for (let j = 0; j < N; j++) {
        const a = points[j]
        const b = points[(j + 1) % N]
        area += a[0] * b[1] - b[0] * a[1]
      }
      if (area < 0) points = points.reverse()
      return points
    }

    const logo = sample(LOGO_D)
    const morphs = ICONS.map((icon) => {
      const transform = toStage(icon.rotate, icon.scale)
      const to = icon.rings.map((d) => sample(d, transform))
      to[0] = alignTo(logo, to[0])
      const from = to.map((ring, i) => (i === 0 ? logo : Array(N).fill(centroid(ring))))
      return { from, to }
    })

    // Brand colours for the colour morph, re-read when the palette or mode changes.
    let rgb = {}
    const readColours = () => {
      const styles = getComputedStyle(document.documentElement)
      rgb = Object.fromEntries(Object.entries(ROLE_TOKENS).map(([role, token]) => [role, hexToRgb(styles.getPropertyValue(token))]))
    }
    readColours()
    const paletteObserver = new MutationObserver(readColours)
    paletteObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette", "data-mode"] })

    let elapsed = 0
    let last = null
    let raf = 0
    let visible = false
    let logoShown = true

    const showLogo = () => {
      if (logoShown) return
      path.setAttribute("d", LOGO_D)
      path.removeAttribute("transform")
      stops.forEach((stop) => { stop.style.stopColor = "" }) // back to the CSS (palette-aware) logo gradient
      logoShown = true
    }

    const drawFrame = (iconIndex, t) => {
      logoShown = false
      path.setAttribute("d", buildMorphPath(morphs[iconIndex].from, morphs[iconIndex].to, t))
      path.setAttribute("transform", `rotate(${(Math.sin(Math.PI * t) * -6).toFixed(2)} 1072 932)`)
      stopColours(rgb, iconIndex, ease(t)).forEach((colour, s) => { stops[s].style.stopColor = colour })
    }

    let heldIcon = -1
    const tick = (now) => {
      if (last !== null) elapsed += Math.min(now - last, 64) // never jump after a stall
      last = now
      const { icon, phase, t } = phaseAt(elapsed)
      if (phase === "logo") {
        showLogo()
        heldIcon = -1
      } else if (phase === "toIcon") {
        drawFrame(icon, t)
        heldIcon = -1
      } else if (phase === "icon") {
        if (heldIcon !== icon) drawFrame(icon, 1) // write the held icon once
        heldIcon = icon
      } else {
        drawFrame(icon, 1 - t)
        heldIcon = -1
      }
      raf = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = null
        raf = window.requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      if (raf) {
        window.cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      if (visible) start()
      else stop()
    })
    visibilityObserver.observe(linkRef.current)
    const handleVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      stop()
      visibilityObserver.disconnect()
      paletteObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
    }
    // stopRefs are stable refs created once per render pass; the effect only needs to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <a ref={linkRef} href={href} className="tag-morph-mark" aria-label="Scroll to the next section">
      <svg viewBox="0 0 2144 1864" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop ref={stopRefs[0]} offset="0" className="tag-morph-mark__stop-1" />
            <stop ref={stopRefs[1]} offset=".45" className="tag-morph-mark__stop-2" />
            <stop ref={stopRefs[2]} offset="1" className="tag-morph-mark__stop-3" />
          </linearGradient>
        </defs>
        <path ref={pathRef} fill={`url(#${gradientId})`} fillRule="evenodd" d={LOGO_D} />
        <path ref={samplerRef} className="tag-morph-mark__sampler" />
      </svg>
    </a>
  )
}
