/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronDown, Palette } from "lucide-react" // Using Lucide React icons

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
        <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl z-100 overflow-hidden theme-dropdown-container border border-base-300">
          <div className="px-3 py-2 border-b border-base-300 bg-base-200">
            <span className="text-sm font-semibold text-primary">Select Theme</span>
          </div>
          <div className="overflow-y-auto max-h-80 p-1 bg-base-100">
            {themes.map((t) => (
              <button
                key={t}
                data-theme={t}
                onClick={() => {
                  onThemeChange(t)
                  handleToggle()
                }}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  marginBottom: "2px",
                  cursor: "pointer",
                  border: currentTheme === t
                    ? "2px solid var(--p, #000)"
                    : "2px solid transparent",
                  backgroundColor: "var(--color-base-100, var(--b1, #fff))",
                  color: "var(--color-base-content, var(--bc, #000))",
                  transition: "border-color 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* Color swatches — these reference CSS vars scoped to data-theme on this button */}
                  <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-primary, var(--p, #f00))", display: "inline-block" }} />
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-secondary, var(--s, #0f0))", display: "inline-block" }} />
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "var(--color-accent, var(--a, #00f))", display: "inline-block" }} />
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{formatThemeName(t)}</span>
                </div>
                {currentTheme === t && (
                  <Check size={12} style={{ color: "var(--color-primary, var(--p, #000))", flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
