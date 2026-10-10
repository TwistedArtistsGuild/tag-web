/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/** The TAG mark as one SVG path (viewBox 0 0 2144 1864), same shape as public/tag-mark.svg. */
export const LOGO_D = "M460 161.25 A460 460 0 0 1 920 621.25 L920 662.25 A373 373 0 0 0 1293 1035.25 L1470.5 1035.25 A197.25 197.25 0 0 0 1667.75 838 A197.25 197.25 0 0 0 1470.5 640.75 L1387 640.75 A321 321 0 1 1 1708 319.75 L1708 406.25 A194.25 194.25 0 0 0 1902.25 600.5 A240.25 240.25 0 0 1 2142.5 840.75 A240.25 240.25 0 0 1 1902.25 1081 A194.25 194.25 0 0 0 1708 1275.25 L1708 1446.25 A417.25 417.25 0 0 1 1290.75 1863.5 A417.25 417.25 0 0 1 873.5 1446.25 A365 365 0 0 0 508.5 1081.25 L460 1081.25 A460 460 0 0 1 0 621.25 A460 460 0 0 1 460 161.25 Z"

/*
 * TAG morph mark engine (ported from docs/design/logo-morph and mockup v5).
 * The mark morphs logo -> icon -> logo for five icons (record, palette, paintbrush, canvas,
 * pencil) in an endless loop, and its gradient colours morph with the shape: each icon is its
 * own mix of the brand colours. Everything here is pure; DOM sampling lives in MorphMark.js.
 */

/** Points sampled around every ring. */
export const N = 180

/** Milliseconds: hold the logo, morph to the icon, hold the icon, morph back. */
export const TIMING = { holdLogo: 1400, morph: 900, holdIcon: 1300 }
const STEP = TIMING.holdLogo + TIMING.morph + TIMING.holdIcon + TIMING.morph

/** SVG circle as a path. */
export function circlePath(cx, cy, r) {
  return `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} Z`
}

/** Icon outlines in a 0-100 box; ring 0 morphs from the logo, the other rings grow from their centres. */
export const ICONS = [
  { name: "record", rings: [circlePath(50, 50, 46), circlePath(50, 50, 34), circlePath(50, 50, 30.5), circlePath(50, 50, 5)] },
  { name: "palette", rings: ["M50 6 C77 6 96 25 96 48 C96 65 85 73 73 71 C64 69 59 75 62 83 C65 92 57 96 48 96 C23 96 4 76 4 51 C4 26 24 6 50 6 Z", circlePath(47, 76, 7.5), circlePath(29, 31, 8), circlePath(54, 21, 7), circlePath(76, 34, 7), circlePath(21, 58, 7)] },
  { name: "paintbrush", rotate: 45, scale: 1.12, rings: ["M50 2 C58 12 63 22 63 33 L63 38 L65 38 L65 55 L58 58 L56.5 91 A6.5 6.5 0 0 1 43.5 91 L42 58 L35 55 L35 38 L37 38 L37 33 C37 22 42 12 50 2 Z", "M38 44 H62 V47 H38 Z"] },
  { name: "canvas", rings: ["M14 8 H45 V3 H55 V8 H86 V64 H71 L83 94 L76 97 L63.5 64 H53.5 V97 H46.5 V64 H36.5 L24 97 L17 94 L29 64 H14 Z", "M20 14 H80 V58 H20 Z", circlePath(36, 27, 5.5), "M24 54 L42 36 L52 46 L62 32 L76 54 Z"] },
  { name: "pencil", rotate: 225, scale: 1.12, rings: ["M50 3 L62 25 L62 87 Q62 96 53 96 L47 96 Q38 96 38 87 L38 25 Z", "M45.1 12 L54.9 12 L56.5 15 L43.5 15 Z", "M40.5 76 H59.5 V78.5 H40.5 Z", "M40.5 81 H59.5 V83.5 H40.5 Z"] },
]

/** Cubic ease-in-out. */
export function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** Average point of a ring. */
export function centroid(points) {
  return points.reduce((c, p) => [c[0] + p[0] / points.length, c[1] + p[1] / points.length], [0, 0])
}

/**
 * Rotate a ring's starting point so it lines up with `ref` (smallest summed squared distance),
 * which stops the morph from twisting. Steps keep it cheap: offsets every 2 points, distance
 * sampled every 4.
 */
export function alignTo(ref, points, offsetStep = 2, sampleStep = 4) {
  const n = points.length
  let best = 0
  let bestDistance = Infinity
  for (let offset = 0; offset < n; offset += offsetStep) {
    let distance = 0
    for (let i = 0; i < n; i += sampleStep) {
      const q = points[(i + offset) % n]
      distance += (q[0] - ref[i][0]) ** 2 + (q[1] - ref[i][1]) ** 2
    }
    if (distance < bestDistance) {
      bestDistance = distance
      best = offset
    }
  }
  return points.map((_, i) => points[(i + best) % n])
}

/** Maps icon space (0-100, centred on 50,50) onto the logo's stage, with optional rotate/scale. */
export function toStage(deg = 0, scale = 1) {
  const a = (deg * Math.PI) / 180
  const c = Math.cos(a)
  const s = Math.sin(a)
  const k = 18 * scale
  return (x, y) => {
    const dx = x - 50
    const dy = y - 50
    return [1072 + (dx * c - dy * s) * k, 932 + (dx * s + dy * c) * k]
  }
}

/**
 * Where the loop is at `elapsedMs`.
 * @returns {{ icon: number, phase: "logo"|"toIcon"|"icon"|"toLogo", t: number }}
 */
export function phaseAt(elapsedMs) {
  const icon = Math.floor(elapsedMs / STEP) % ICONS.length
  let t = elapsedMs % STEP
  if (t < TIMING.holdLogo) return { icon, phase: "logo", t: t / TIMING.holdLogo }
  t -= TIMING.holdLogo
  if (t < TIMING.morph) return { icon, phase: "toIcon", t: t / TIMING.morph }
  t -= TIMING.morph
  if (t < TIMING.holdIcon) return { icon, phase: "icon", t: t / TIMING.holdIcon }
  t -= TIMING.holdIcon
  return { icon, phase: "toLogo", t: t / TIMING.morph }
}

/**
 * One frame's path: ring 0 morphs with the eased progress; the extra rings (holes and details)
 * grow in after it, so cut-outs open once the outline has mostly formed.
 * @param {Array<Array<[number, number]>>} from rings at t=0
 * @param {Array<Array<[number, number]>>} to rings at t=1
 * @param {number} t 0..1
 */
export function buildMorphPath(from, to, t) {
  const eOutline = ease(t)
  const eHoles = ease(Math.min(1, Math.max(0, (t - 0.45) / 0.55)))
  let d = ""
  for (let r = 0; r < from.length; r++) {
    const a = from[r]
    const b = to[r]
    const e = r ? eHoles : eOutline
    for (let i = 0; i < a.length; i++) {
      d += `${i ? "L" : "M"}${(a[i][0] + (b[i][0] - a[i][0]) * e).toFixed(1)} ${(a[i][1] + (b[i][1] - a[i][1]) * e).toFixed(1)}`
    }
    d += "Z"
  }
  return d
}

/* ---- colour morph (owner, 2026-10-10: colours morph with the icon; every variation a new mix) ----
 * Roles: W ghost white, I electric indigo, S soft indigo, A palette accent. */
export const LOGO_MIX = ["W", "S", "A"]
/** One three-stop mix per icon, in ICONS order. */
export const ICON_MIX = [
  ["I", "A", "W"], // record
  ["A", "W", "I"], // palette
  ["A", "I", "W"], // paintbrush
  ["I", "W", "A"], // canvas
  ["W", "A", "I"], // pencil
]
/** CSS custom properties that hold each role's colour. */
export const ROLE_TOKENS = { W: "--tag-ghost", I: "--tag-indigo", S: "--tag-indigo-soft", A: "--tag-acc" }

/** "#6233ff" -> [98, 51, 255] */
export function hexToRgb(hex) {
  const h = String(hex).trim().replace("#", "")
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/** Linear blend of two rgb triples, as a CSS colour. */
export function mixRgb(a, b, e) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * e)},${Math.round(a[1] + (b[1] - a[1]) * e)},${Math.round(a[2] + (b[2] - a[2]) * e)})`
}

/**
 * The three gradient stop colours at eased progress `e` from the logo mix to icon `iconIndex`'s mix.
 * @param {Record<"W"|"I"|"S"|"A", number[]>} rgbByRole
 */
export function stopColours(rgbByRole, iconIndex, e) {
  const target = ICON_MIX[iconIndex]
  return LOGO_MIX.map((role, s) => mixRgb(rgbByRole[role], rgbByRole[target[s]], e))
}