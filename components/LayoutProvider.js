"use client"

/* This file is part of the Twisted Artists Guild project.
 Copyright (C) 2025 Twisted Artists Guild
 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).
 This software comes with NO WARRANTY; see the license for details.
 Open source · low-profit · human-first*/

import { createContext, useState, useContext, useEffect } from "react"

const LayoutContext = createContext()

export function LayoutProvider({ children }) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isLeftSidebarVisible, setIsLeftSidebarVisible] = useState(true)
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsLeftSidebarVisible(false)
        setIsRightSidebarVisible(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const value = {
    isHeaderVisible,
    setIsHeaderVisible,
    isLeftSidebarVisible,
    setIsLeftSidebarVisible,
    isRightSidebarVisible,
    setIsRightSidebarVisible,
    isMobile,
    toggleHeader: () => setIsHeaderVisible((prev) => !prev),
    toggleLeftSidebar: () => setIsLeftSidebarVisible((prev) => !prev),
    toggleRightSidebar: () => setIsRightSidebarVisible((prev) => !prev),
  }

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
