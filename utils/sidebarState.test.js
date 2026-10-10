/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { test } from "node:test"
import assert from "node:assert/strict"
import { nextSidebarState } from "./sidebarState.js"

const closed = { left: false, right: false }

test("no force toggles the side", () => {
  assert.deepEqual(nextSidebarState(closed, "left", undefined, false), { left: true, right: false })
  assert.deepEqual(nextSidebarState({ left: true, right: false }, "left", undefined, false), closed)
})

test("force true always opens (add-to-cart never closes an open cart)", () => {
  assert.deepEqual(nextSidebarState({ left: false, right: true }, "right", true, false), { left: false, right: true })
  assert.deepEqual(nextSidebarState(closed, "right", true, false), { left: false, right: true })
})

test("force false always closes", () => {
  assert.deepEqual(nextSidebarState({ left: true, right: false }, "left", false, false), closed)
  assert.deepEqual(nextSidebarState(closed, "left", false, false), closed)
})

test("overlay layouts (below 1280px) show one panel at a time", () => {
  assert.deepEqual(nextSidebarState({ left: true, right: false }, "right", undefined, true), { left: false, right: true })
  assert.deepEqual(nextSidebarState({ left: false, right: true }, "left", true, true), { left: true, right: false })
})

test("push layouts (1280px and up) can show both panels", () => {
  assert.deepEqual(nextSidebarState({ left: true, right: false }, "right", undefined, false), { left: true, right: true })
})

test("closing in an overlay layout leaves the other panel alone", () => {
  assert.deepEqual(nextSidebarState({ left: true, right: false }, "right", false, true), { left: true, right: false })
})
