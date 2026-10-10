/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { test } from "node:test"
import assert from "node:assert/strict"
import { filterSidebarItems } from "./sidebarFilter.js"

const listings = [
  { id: 1, title: "Blue Heron", medium: "Oil", artCategoryID: 3, description: "A heron at dawn" },
  { id: 2, title: "Granite Owl", medium: "Stone", artCategoryID: 30, culture: "Celtic" },
  { id: 3, title: "Tie Dye Shirt", artCategoryID: "3", path: "tiedye3", artCategory: "Apparel" },
]

const titles = (items) => items.map((item) => item.title)

test("category -1 keeps every item", () => {
  assert.equal(filterSidebarItems(listings, { type: "listings", term: "", category: "-1" }).length, 3)
  assert.equal(filterSidebarItems(listings, { type: "listings", term: "", category: -1 }).length, 3)
})

test("a category keeps items whose artCategoryID matches as number or string", () => {
  assert.deepEqual(titles(filterSidebarItems(listings, { type: "listings", term: "", category: "3" })), ["Blue Heron", "Tie Dye Shirt"])
})

test("listing search covers title, description, culture, medium, path and artCategory, ignoring case", () => {
  assert.deepEqual(titles(filterSidebarItems(listings, { type: "listings", term: "HERON", category: "-1" })), ["Blue Heron"])
  assert.deepEqual(titles(filterSidebarItems(listings, { type: "listings", term: "celtic", category: "-1" })), ["Granite Owl"])
  assert.deepEqual(titles(filterSidebarItems(listings, { type: "listings", term: "stone", category: "-1" })), ["Granite Owl"])
  assert.deepEqual(titles(filterSidebarItems(listings, { type: "listings", term: "tiedye", category: "-1" })), ["Tie Dye Shirt"])
  assert.deepEqual(titles(filterSidebarItems(listings, { type: "listings", term: "apparel", category: "-1" })), ["Tie Dye Shirt"])
})

test("artist search covers biography, byline, title, path, seotags and statement", () => {
  const artists = [
    { title: "Campfire Cirque", byline: "Fire performers", seotags: "fire,circus" },
    { title: "Twisted Passions", statement: "Tie dye forever", path: "TwistedPassions" },
  ]
  assert.deepEqual(titles(filterSidebarItems(artists, { type: "artists", term: "circus", category: "-1" })), ["Campfire Cirque"])
  assert.deepEqual(titles(filterSidebarItems(artists, { type: "artists", term: "forever", category: "-1" })), ["Twisted Passions"])
})

test("event search covers description, title, note and path", () => {
  const events = [
    { title: "Fire Night", note: "Bring a chair" },
    { title: "Open Studio", description: "Paint with us", path: "open-studio" },
  ]
  assert.deepEqual(titles(filterSidebarItems(events, { type: "events", term: "chair", category: "-1" })), ["Fire Night"])
  assert.deepEqual(titles(filterSidebarItems(events, { type: "events", term: "paint", category: "-1" })), ["Open Studio"])
})

test("missing or null fields never throw", () => {
  const messy = [{ title: null }, {}, { title: undefined, description: 42 }]
  assert.doesNotThrow(() => filterSidebarItems(messy, { type: "listings", term: "x", category: "-1" }))
  assert.deepEqual(filterSidebarItems(messy, { type: "listings", term: "42", category: "-1" }).length, 1)
})

test("an empty term returns the category matches only", () => {
  assert.equal(filterSidebarItems(listings, { type: "listings", term: "", category: "30" }).length, 1)
})

test("a missing list returns an empty list", () => {
  assert.deepEqual(filterSidebarItems(undefined, { type: "listings", term: "", category: "-1" }), [])
})
