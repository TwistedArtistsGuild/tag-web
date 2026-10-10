/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { test } from "node:test"
import assert from "node:assert/strict"
import {
  ICONS,
  ICON_MIX,
  LOGO_MIX,
  TIMING,
  alignTo,
  buildMorphPath,
  centroid,
  ease,
  hexToRgb,
  mixRgb,
  phaseAt,
  stopColours,
} from "./morphMark.js"

const STEP = TIMING.holdLogo + TIMING.morph + TIMING.holdIcon + TIMING.morph

test("ease starts at 0, ends at 1 and passes through the middle", () => {
  assert.equal(ease(0), 0)
  assert.equal(ease(1), 1)
  assert.equal(ease(0.5), 0.5)
})

test("centroid of a square is its centre", () => {
  assert.deepEqual(centroid([[0, 0], [2, 0], [2, 2], [0, 2]]), [1, 1])
})

test("alignTo undoes a rotation of the ring's starting point", () => {
  const ring = Array.from({ length: 8 }, (_, i) => [Math.cos((i / 8) * Math.PI * 2), Math.sin((i / 8) * Math.PI * 2)])
  const rotated = ring.map((_, i) => ring[(i + 2) % 8])
  assert.deepEqual(alignTo(ring, rotated, 1, 1), ring)
})

test("phaseAt walks logo -> toIcon -> icon -> toLogo and wraps across the five icons", () => {
  assert.equal(phaseAt(0).phase, "logo")
  const mid = phaseAt(TIMING.holdLogo + TIMING.morph / 2)
  assert.equal(mid.phase, "toIcon")
  assert.ok(Math.abs(mid.t - 0.5) < 1e-9)
  assert.equal(phaseAt(TIMING.holdLogo + TIMING.morph + 10).phase, "icon")
  assert.equal(phaseAt(STEP - 1).phase, "toLogo")
  assert.equal(phaseAt(STEP).icon, 1)
  assert.equal(phaseAt(STEP * ICONS.length).icon, 0)
})

test("hexToRgb and mixRgb", () => {
  assert.deepEqual(hexToRgb("#6233ff"), [98, 51, 255])
  assert.deepEqual(hexToRgb(" #ceff1d "), [206, 255, 29])
  assert.equal(mixRgb([0, 0, 0], [255, 255, 255], 0.5), "rgb(128,128,128)")
})

test("stopColours blend the logo mix into the icon's own mix", () => {
  const roles = { W: [245, 245, 252], I: [98, 51, 255], S: [143, 114, 255], A: [206, 255, 29] }
  assert.deepEqual(stopColours(roles, 0, 0), LOGO_MIX.map((role) => mixRgb(roles[role], roles[role], 0)))
  assert.deepEqual(stopColours(roles, 0, 1), ICON_MIX[0].map((role) => mixRgb(roles[role], roles[role], 0)))
})

test("every icon has its own colour mix, different from the logo's", () => {
  const keys = ICON_MIX.map((mix) => mix.join(""))
  assert.equal(new Set(keys).size, ICON_MIX.length)
  assert.ok(!keys.includes(LOGO_MIX.join("")))
  assert.equal(ICON_MIX.length, ICONS.length)
})

test("buildMorphPath draws the start shape at t=0 and the end shape at t=1", () => {
  const from = [[[0, 0], [10, 0], [10, 10]]]
  const to = [[[0, 0], [20, 0], [20, 20]]]
  assert.equal(buildMorphPath(from, to, 0), "M0.0 0.0L10.0 0.0L10.0 10.0Z")
  assert.equal(buildMorphPath(from, to, 1), "M0.0 0.0L20.0 0.0L20.0 20.0Z")
})
