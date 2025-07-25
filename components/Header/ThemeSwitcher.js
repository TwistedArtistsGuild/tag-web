/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Palette } from "lucide-react" // Using Lucide React icons

export default function ThemeSwitcher({ themes, currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleToggle = () => setIsOpen((prev) => !prev)

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Format the theme name for display (capitalize and replace hyphens)
  const formatThemeName = (theme) => {
    return theme
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="btn btn-ghost btn-sm flex items-center gap-1"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Palette size={18} /> {/* Icon for theme */}
        <span className="hidden md:inline">Theme</span>
        <ChevronDown
          className={`transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""}`}
          size={16}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-md shadow-xl z-[100] animate-opacity overflow-auto max-h-96 theme-dropdown-container">
          <div className="p-2">
            <div className="text-sm font-semibold mb-2 px-2 text-primary">Select Theme</div>
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  onThemeChange(theme)
                  handleToggle()
                }}
                className={`w-full text-left px-4 py-2 hover:bg-base-300 rounded-md transition-colors ${
                  currentTheme === theme ? "bg-primary/20 font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Theme color preview dot - uses data-theme to actually show the theme's color */}
                  <div
                    data-theme={theme}
                    className="w-4 h-4 rounded-full border border-base-content/20 flex items-center justify-center theme-color-preview"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: "hsl(var(--p))",
                        boxShadow: theme === "tag-theme" ? "0 0 5px hsl(var(--p)), 0 0 10px hsl(var(--p))" : "none",
                      }}
                    ></div>
                  </div>

                  <span className="theme-name">{formatThemeName(theme)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
