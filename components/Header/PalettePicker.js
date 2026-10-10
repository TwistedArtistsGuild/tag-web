/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect, useId, useRef } from "react"
import useThemePrefs from "@/hooks/useThemePrefs"

const PALETTE_OPTIONS = [
  { value: "orig", label: "Original" },
  { value: "7a", label: "Magenta" },
]

const MODE_OPTIONS = [
  { value: "dark", label: "Dark", icon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /> },
  {
    value: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
]

const TICK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5 9-10" />
  </svg>
)

/**
 * A radiogroup with a roving tabindex: Tab enters on the checked option, arrow keys move and select.
 */
function RadioGroup({ labelId, label, options, value, onChange, className, renderOption }) {
  const groupRef = useRef(null)

  function handleKeyDown(event) {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (!(event.key in keys)) return
    event.preventDefault()
    const index = options.findIndex((option) => option.value === value)
    const next = options[(index + keys[event.key] + options.length) % options.length]
    onChange(next.value)
    groupRef.current?.querySelector(`[data-value="${next.value}"]`)?.focus()
  }

  return (
    <div
      ref={groupRef}
      className={className}
      role="radiogroup"
      aria-labelledby={labelId}
      aria-label={labelId ? undefined : label}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const checked = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            data-value={option.value}
            onClick={() => onChange(option.value)}
          >
            {renderOption(option, checked)}
          </button>
        )
      })}
    </div>
  )
}

function PickerBody({ idPrefix, showTitles }) {
  const { palette, mode, setPalette, setMode } = useThemePrefs()
  const paletteLabelId = `${idPrefix}-palette`
  const modeLabelId = `${idPrefix}-mode`

  return (
    <>
      <p className="tag-pal__title" id={paletteLabelId}>Palette</p>
      <RadioGroup
        labelId={paletteLabelId}
        className="tag-pal__swatches"
        options={PALETTE_OPTIONS}
        value={palette}
        onChange={setPalette}
        renderOption={(option) => (
          <>
            <span className="tag-pal__square" style={{ background: `var(--tag-swatch-${option.value})` }}>
              <span className="tag-pal__tick">{TICK}</span>
            </span>
            {option.label}
          </>
        )}
      />
      {showTitles ? <div className="tag-pal__sep" /> : null}
      <p className={`tag-pal__title${showTitles ? "" : " sr-only"}`} id={modeLabelId}>Mode</p>
      <RadioGroup
        labelId={modeLabelId}
        className="tag-pal__seg"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        renderOption={(option) => (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {option.icon}
            </svg>
            {option.label}
          </>
        )}
      />
      {showTitles ? <p className="tag-pal__note">Saved on this device.</p> : null}
    </>
  )
}

/**
 * Header palette picker: a brush button with the current swatch, opening a small popover
 * (Palette: Original / Magenta, Mode: Dark / Light). `variant="inline"` renders the same
 * controls without the button, for the mobile menu.
 * @param {{ variant?: "popover"|"inline", isOpen?: boolean, onToggle?: () => void }} props
 */
export default function PalettePicker({ variant = "popover", isOpen = false, onToggle = () => {} }) {
  const idPrefix = useId().replace(/:/g, "")
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const popoverRef = useRef(null)

  // Opening moves focus to the checked swatch; Escape or a click outside closes and returns focus.
  useEffect(() => {
    if (variant !== "popover" || !isOpen) return undefined

    popoverRef.current?.querySelector('[role="radio"][aria-checked="true"]')?.focus({ preventScroll: true })

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault()
        onToggle()
        buttonRef.current?.focus()
      }
    }

    function handlePointerDown(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        onToggle()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    document.addEventListener("mousedown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
      document.removeEventListener("mousedown", handlePointerDown)
    }
  }, [isOpen, onToggle, variant])

  if (variant === "inline") {
    return (
      <div className="tag-pal tag-pal--inline">
        <PickerBody idPrefix={idPrefix} showTitles={false} />
      </div>
    )
  }

  const popoverId = `${idPrefix}-popover`

  return (
    <div className="tag-pal" ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className="tag-icon-btn tag-pal__btn"
        aria-label="Colour palette and mode"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={popoverId}
        onClick={onToggle}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M18.4 2.6a2 2 0 0 1 2.9 2.9l-8.6 8.6-2.9-2.9z" />
          <path d="M9.8 11.2c-2-.1-3.7 1.4-3.9 3.4-.1 1.2-.8 2.4-2.4 3.1 1.4 1.4 3.4 2 5.3 1.6 2.4-.5 3.9-2.7 3.5-5.1z" />
        </svg>
        <span className="tag-pal__dot" aria-hidden="true" />
      </button>
      <div
        ref={popoverRef}
        id={popoverId}
        className="tag-pal__pop"
        role="dialog"
        aria-label="Colour palette and mode"
        hidden={!isOpen}
      >
        <PickerBody idPrefix={idPrefix} showTitles />
      </div>
    </div>
  )
}
