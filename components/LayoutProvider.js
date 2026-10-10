/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"
"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { nextSidebarState } from "@/utils/sidebarState"

const LayoutContext = createContext()

/** Below 1280px the panels overlay the page (with a scrim), one at a time. From 1280px they push it. */
const OVERLAY_QUERY = "(max-width: 1279px)"

export function LayoutProvider({ children }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [sidebars, setSidebars] = useState({ left: false, right: false })
  const [isOverlay, setIsOverlay] = useState(false)
  const isOverlayRef = useRef(false)

  useEffect(() => {
    const query = window.matchMedia(OVERLAY_QUERY)
    const update = () => {
      isOverlayRef.current = query.matches
      setIsOverlay(query.matches)
      // Moving into the overlay layout with both panels open: keep only the cart.
      if (query.matches) {
        setSidebars((current) => (current.left && current.right ? { left: false, right: true } : current))
      }
    }
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  // `force`: true opens, false closes, anything else (e.g. a click event) toggles.
  const toggleLeftSidebar = useCallback((force) => {
    setSidebars((current) => nextSidebarState(current, "left", typeof force === "boolean" ? force : undefined, isOverlayRef.current))
  }, [])

  const toggleRightSidebar = useCallback((force) => {
    setSidebars((current) => nextSidebarState(current, "right", typeof force === "boolean" ? force : undefined, isOverlayRef.current))
  }, [])

  const closeSidebars = useCallback(() => setSidebars({ left: false, right: false }), [])

  // Escape closes an open panel, unless a popover or menu already handled it (they preventDefault).
  const anyOpen = sidebars.left || sidebars.right
  useEffect(() => {
    if (!anyOpen) return undefined
    function handleKeyDown(event) {
      if (event.key === "Escape" && !event.defaultPrevented) closeSidebars()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [anyOpen, closeSidebars])

  const value = useMemo(() => ({
    isHeaderVisible,
    setIsHeaderVisible,
    isLeftSidebarVisible: sidebars.left,
    setIsLeftSidebarVisible: (open) => toggleLeftSidebar(Boolean(open)),
    isRightSidebarVisible: sidebars.right,
    setIsRightSidebarVisible: (open) => toggleRightSidebar(Boolean(open)),
    isOverlay,
    toggleHeader: () => setIsHeaderVisible((prev) => !prev),
    toggleLeftSidebar,
    toggleRightSidebar,
    closeSidebars,
  }), [isHeaderVisible, sidebars, isOverlay, toggleLeftSidebar, toggleRightSidebar, closeSidebars])

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}