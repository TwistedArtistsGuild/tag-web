/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useCallback, useSyncExternalStore } from "react"
import { DEFAULT_PREFS, MODES, PALETTES, applyThemePrefs, saveThemePref } from "@/utils/themePrefs"

// <html> carries the live prefs (set before first paint by the head script), so it is the store.
function subscribe(onChange) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette", "data-mode"] })
  return () => observer.disconnect()
}

function readSnapshot() {
  const root = document.documentElement
  const palette = root.getAttribute("data-palette")
  const mode = root.getAttribute("data-mode")
  // A string snapshot keeps useSyncExternalStore's equality check cheap and stable.
  return `${PALETTES.includes(palette) ? palette : DEFAULT_PREFS.palette}|${MODES.includes(mode) ? mode : DEFAULT_PREFS.mode}`
}

const serverSnapshot = () => `${DEFAULT_PREFS.palette}|${DEFAULT_PREFS.mode}`

/**
 * Current palette + mode, kept in sync across every picker (header popover, mobile menu).
 * @returns {{ palette: string, mode: string, setPalette: (p: string) => void, setMode: (m: string) => void }}
 */
export default function useThemePrefs() {
  const snapshot = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot)
  const [palette, mode] = snapshot.split("|")

  const setPalette = useCallback((nextPalette) => {
    if (!PALETTES.includes(nextPalette)) return
    const current = readSnapshot().split("|")
    applyThemePrefs(document.documentElement, { palette: nextPalette, mode: current[1] })
    try {
      saveThemePref(window.localStorage, "palette", nextPalette)
    } catch {
      // Storage blocked: the choice lasts for this page view.
    }
  }, [])

  const setMode = useCallback((nextMode) => {
    if (!MODES.includes(nextMode)) return
    const current = readSnapshot().split("|")
    applyThemePrefs(document.documentElement, { palette: current[0], mode: nextMode })
    try {
      saveThemePref(window.localStorage, "mode", nextMode)
    } catch {
      // Storage blocked: the choice lasts for this page view.
    }
  }, [])

  return { palette, mode, setPalette, setMode }
}
