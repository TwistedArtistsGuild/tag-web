/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { test } from "node:test"
import assert from "node:assert/strict"
import { isActivePath } from "./nav-links.js"

test("a link is active on its own page, with or without a trailing slash", () => {
  assert.equal(isActivePath("/artists", "/artists"), true)
  assert.equal(isActivePath("/art", "/art/"), true)
  assert.equal(isActivePath("/contests/", "/contests/"), true)
})

test("a link is active on its sub-pages", () => {
  assert.equal(isActivePath("/artists/TwistedPassions", "/artists"), true)
  assert.equal(isActivePath("/art/paintings/oil", "/art/"), true)
})

test("query strings and hashes are ignored", () => {
  assert.equal(isActivePath("/events?month=10#top", "/events"), true)
})

test("a shared prefix is not a match", () => {
  assert.equal(isActivePath("/artists", "/art/"), false)
  assert.equal(isActivePath("/newsletter", "/news"), false)
})

test("home is only active on home", () => {
  assert.equal(isActivePath("/", "/"), true)
  assert.equal(isActivePath("/blogs", "/"), false)
})
