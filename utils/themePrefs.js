/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/**
 * Palette + mode preferences (header palette picker).
 * Applied as data attributes on <html>; saved per device in localStorage.
 * No imports, so the same rules run in the browser, in tests and (as a string) in the <head> script.
 */

/** Approved brand palette first: it is the default. */
export const PALETTES = ["orig", "7a"]
export const MODES = ["dark", "light"]
export const DEFAULT_PREFS = { palette: "orig", mode: "dark" }
export const STORAGE_KEYS = { palette: "tag-palette", mode: "tag-mode", legacy: "theme" }
export const DAISY_THEME_BY_MODE = { dark: "tag-dark", light: "tag-light" }

const ALLOWED = { palette: PALETTES, mode: MODES }

/**
 * One-time move from the old theme menu (`localStorage.theme`) to the new keys.
 * Only the mode carries over (`light` stays light, every other old theme is dark);
 * an existing `tag-mode` always wins. The old key is removed either way.
 * @param {Storage} storage
 */
export function migrateLegacyTheme(storage) {
  try {
    const legacy = storage.getItem(STORAGE_KEYS.legacy)
    if (legacy === null) return
    if (storage.getItem(STORAGE_KEYS.mode) === null) {
      storage.setItem(STORAGE_KEYS.mode, legacy === "light" ? "light" : "dark")
    }
    storage.removeItem(STORAGE_KEYS.legacy)
  } catch {
    // Storage blocked: nothing to migrate.
  }
}

/**
 * @param {Storage} storage
 * @returns {{ palette: string, mode: string }} saved prefs, or the defaults for anything missing or unknown
 */
export function readThemePrefs(storage) {
  migrateLegacyTheme(storage)
  const prefs = { ...DEFAULT_PREFS }
  try {
    for (const kind of ["palette", "mode"]) {
      const value = storage.getItem(STORAGE_KEYS[kind])
      if (ALLOWED[kind].includes(value)) prefs[kind] = value
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
  return prefs
}

/**
 * @param {Storage} storage
 * @param {"palette"|"mode"} kind
 * @param {string} value
 * @returns {boolean} true when saved
 */
export function saveThemePref(storage, kind, value) {
  if (!ALLOWED[kind] || !ALLOWED[kind].includes(value)) return false
  try {
    storage.setItem(STORAGE_KEYS[kind], value)
    return true
  } catch {
    return false
  }
}

/**
 * @param {HTMLElement} rootEl usually document.documentElement
 * @param {{ palette: string, mode: string }} prefs
 */
export function applyThemePrefs(rootEl, { palette, mode }) {
  rootEl.setAttribute("data-palette", palette)
  rootEl.setAttribute("data-mode", mode)
  rootEl.setAttribute("data-theme", DAISY_THEME_BY_MODE[mode])
}

/**
 * Inline <head> script: restores the saved palette and mode before first paint (no flash),
 * and marks <html> with `tag-js` so reveal-on-scroll styles only hide content when JS runs.
 * Written as a literal (not fn.toString()) so minification can never break it.
 * @returns {string}
 */
export function themeHeadScript() {
  const config = JSON.stringify({ keys: STORAGE_KEYS, allowed: ALLOWED, defaults: DEFAULT_PREFS, daisy: DAISY_THEME_BY_MODE })
  return `(function(){try{var c=${config},s=localStorage,r=document.documentElement;`
    + `try{var l=s.getItem(c.keys.legacy);if(l!==null){if(s.getItem(c.keys.mode)===null)s.setItem(c.keys.mode,l==="light"?"light":"dark");s.removeItem(c.keys.legacy);}}catch(e){}`
    + `var p=c.defaults.palette,m=c.defaults.mode;`
    + `try{var sp=s.getItem(c.keys.palette),sm=s.getItem(c.keys.mode);if(c.allowed.palette.indexOf(sp)>-1)p=sp;if(c.allowed.mode.indexOf(sm)>-1)m=sm;}catch(e){}`
    + `r.setAttribute("data-palette",p);r.setAttribute("data-mode",m);r.setAttribute("data-theme",c.daisy[m]);r.classList.add("tag-js");`
    + `}catch(e){}})();`
}
