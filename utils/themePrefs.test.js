/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { test } from "node:test"
import assert from "node:assert/strict"
import {
  DEFAULT_PREFS,
  readThemePrefs,
  saveThemePref,
  themeHeadScript,
} from "./themePrefs.js"

function memoryStorage(initial = {}) {
  const data = { ...initial }
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value) },
    removeItem: (key) => { delete data[key] },
  }
}

function throwingStorage() {
  const boom = () => { throw new Error("storage blocked") }
  return { getItem: boom, setItem: boom, removeItem: boom }
}

test("empty storage gives the brand defaults (Original + dark)", () => {
  assert.deepEqual(readThemePrefs(memoryStorage()), { palette: "orig", mode: "dark" })
  assert.deepEqual(DEFAULT_PREFS, { palette: "orig", mode: "dark" })
})

test("stored Magenta + light is returned", () => {
  const storage = memoryStorage({ "tag-palette": "7a", "tag-mode": "light" })
  assert.deepEqual(readThemePrefs(storage), { palette: "7a", mode: "light" })
})

test("unknown palette values fall back to the default", () => {
  assert.equal(readThemePrefs(memoryStorage({ "tag-palette": "pink" })).palette, "orig")
  assert.equal(readThemePrefs(memoryStorage({ "tag-palette": "7b" })).palette, "orig")
})

test("legacy theme 'light' migrates to light mode and is removed", () => {
  const storage = memoryStorage({ theme: "light" })
  assert.deepEqual(readThemePrefs(storage), { palette: "orig", mode: "light" })
  assert.equal(storage.data.theme, undefined)
  assert.equal(storage.data["tag-mode"], "light")
})

test("legacy theme 'neon' migrates to dark mode and is removed", () => {
  const storage = memoryStorage({ theme: "neon" })
  assert.equal(readThemePrefs(storage).mode, "dark")
  assert.equal(storage.data.theme, undefined)
})

test("a saved tag-mode wins over the legacy theme, which is still removed", () => {
  const storage = memoryStorage({ theme: "neon", "tag-mode": "light" })
  assert.equal(readThemePrefs(storage).mode, "light")
  assert.equal(storage.data.theme, undefined)
})

test("blocked storage gives the defaults without throwing", () => {
  assert.deepEqual(readThemePrefs(throwingStorage()), { palette: "orig", mode: "dark" })
  assert.equal(saveThemePref(throwingStorage(), "palette", "7a"), false)
})

test("saveThemePref rejects unknown values and writes nothing", () => {
  const storage = memoryStorage()
  assert.equal(saveThemePref(storage, "palette", "pink"), false)
  assert.deepEqual(storage.data, {})
  assert.equal(saveThemePref(storage, "palette", "7a"), true)
  assert.equal(storage.data["tag-palette"], "7a")
})

// Runs our own constant head-script string against a fake <html>; no outside input reaches it.
function runHeadScript(storage) {
  const attrs = {}
  const classes = new Set()
  const fakeDocument = {
    documentElement: {
      setAttribute: (name, value) => { attrs[name] = value },
      classList: { add: (c) => classes.add(c) },
    },
  }
  new Function("document", "localStorage", themeHeadScript())(fakeDocument, storage)
  return { attrs, classes }
}

test("the head script applies saved prefs to <html> before first paint", () => {
  const { attrs, classes } = runHeadScript(memoryStorage({ "tag-palette": "7a", "tag-mode": "light" }))
  assert.equal(attrs["data-palette"], "7a")
  assert.equal(attrs["data-mode"], "light")
  assert.equal(attrs["data-theme"], "tag-light")
  assert.ok(classes.has("tag-js"))
})

test("the head script migrates the legacy theme key like readThemePrefs", () => {
  const storage = memoryStorage({ theme: "light" })
  const { attrs } = runHeadScript(storage)
  assert.equal(attrs["data-palette"], "orig")
  assert.equal(attrs["data-mode"], "light")
  assert.equal(storage.data.theme, undefined)
})

test("the head script falls back to the defaults when storage is blocked", () => {
  const { attrs, classes } = runHeadScript(throwingStorage())
  assert.equal(attrs["data-palette"], "orig")
  assert.equal(attrs["data-mode"], "dark")
  assert.equal(attrs["data-theme"], "tag-dark")
  assert.ok(classes.has("tag-js"))
})
