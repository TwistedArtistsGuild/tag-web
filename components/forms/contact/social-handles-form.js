/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DEFAULT_SOCIALS } from "@/components/cards/card_contactList"
import getApiURL from "@/components/widgets/GetApiURL"

export const socialPlatforms = {
  instagram: { label: "Instagram", baseUrl: "https://www.instagram.com/" },
  tiktok: { label: "TikTok", baseUrl: "https://www.tiktok.com/@" },
  x: { label: "X / Twitter", baseUrl: "https://x.com/" },
  facebook: { label: "Facebook", baseUrl: "https://www.facebook.com/" },
  youtube: { label: "YouTube", baseUrl: "https://www.youtube.com/@" },
  threads: { label: "Threads", baseUrl: "https://www.threads.net/@" },
}

export const socialIconMap = {
  instagram: DEFAULT_SOCIALS.find((s) => s.name === "Instagram") || null,
  tiktok: DEFAULT_SOCIALS.find((s) => s.name === "TikTok") || null,
  x: DEFAULT_SOCIALS.find((s) => s.name === "X") || null,
  facebook: DEFAULT_SOCIALS.find((s) => s.name === "Facebook") || null,
  youtube: DEFAULT_SOCIALS.find((s) => s.name === "YouTube") || null,
  threads: DEFAULT_SOCIALS.find((s) => s.name === "Threads") || null,
}

function normalizeUrl(value) {
  const raw = String(value || "").trim()
  if (!raw) return ""
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(withProtocol).toString()
  } catch {
    return ""
  }
}

function extractHandleFromUrl(value, platformKey) {
  const normalized = normalizeUrl(value)
  if (!normalized) return ""
  try {
    const parsed = new URL(normalized)
    let pathname = parsed.pathname.replace(/^\/+/, "")
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return ""
    if (platformKey === "tiktok") return segments[0].replace(/^@/, "")
    if (platformKey === "youtube" && segments[0].toLowerCase() === "@") return segments[1] || ""
    return segments[0].replace(/^@/, "")
  } catch {
    return ""
  }
}

function buildUrlFromHandle(platformKey, handle) {
  const cleanHandle = String(handle || "").trim().replace(/^@/, "")
  if (!cleanHandle) return ""
  const platform = socialPlatforms[platformKey]
  if (!platform?.baseUrl) return ""
  return normalizeUrl(`${platform.baseUrl}${cleanHandle}`)
}

function resolvePlatformKey(contact) {
  const rawCategory = String(contact?.category || "").trim().toLowerCase()
  if (rawCategory && socialPlatforms[rawCategory]) {
    return rawCategory
  }

  const normalizedUrl = normalizeUrl(contact?.value || "")
  if (normalizedUrl) {
    try {
      const host = new URL(normalizedUrl).hostname.toLowerCase()
      if (host.includes("instagram.com")) return "instagram"
      if (host.includes("tiktok.com")) return "tiktok"
      if (host.includes("x.com") || host.includes("twitter.com")) return "x"
      if (host.includes("facebook.com") || host.includes("fb.com")) return "facebook"
      if (host.includes("youtube.com") || host.includes("youtu.be")) return "youtube"
      if (host.includes("threads.net")) return "threads"
    } catch {
      // no-op; fallback to label inference
    }
  }

  const rawLabel = String(contact?.label || "").trim().toLowerCase()
  if (rawLabel.includes("instagram")) return "instagram"
  if (rawLabel.includes("tiktok")) return "tiktok"
  if (rawLabel.includes("x") || rawLabel.includes("twitter")) return "x"
  if (rawLabel.includes("facebook")) return "facebook"
  if (rawLabel.includes("youtube")) return "youtube"
  if (rawLabel.includes("threads")) return "threads"

  return ""
}

function normalizeScope(value, fallback = "secondary") {
  const normalized = String(value || fallback).trim().toLowerCase() || fallback
  if (normalized === "private" || normalized === "primary" || normalized === "secondary") {
    return normalized
  }

  return fallback
}

function makeInitialEntries(existingContacts = []) {
  const sortedContacts = [...existingContacts].sort((a, b) => {
    const aOrder = Number(a?.displayOrder)
    const bOrder = Number(b?.displayOrder)
    const safeA = Number.isFinite(aOrder) ? aOrder : Number.MAX_SAFE_INTEGER
    const safeB = Number.isFinite(bOrder) ? bOrder : Number.MAX_SAFE_INTEGER
    return safeA - safeB
  })

  const contactsByPlatform = sortedContacts.reduce((acc, contact) => {
    const platformKey = resolvePlatformKey(contact)
    if (!platformKey || !socialPlatforms[platformKey] || acc[platformKey]) {
      return acc
    }

    acc[platformKey] = contact
    return acc
  }, {})

  const defaultPlatformOrder = Object.keys(socialPlatforms)
  const orderedPlatformKeys = Object.entries(contactsByPlatform)
    .sort(([, a], [, b]) => {
      const aOrder = Number(a?.displayOrder)
      const bOrder = Number(b?.displayOrder)
      const safeA = Number.isFinite(aOrder) ? aOrder : Number.MAX_SAFE_INTEGER
      const safeB = Number.isFinite(bOrder) ? bOrder : Number.MAX_SAFE_INTEGER
      return safeA - safeB
    })
    .map(([platformKey]) => platformKey)

  defaultPlatformOrder.forEach((platformKey) => {
    if (!orderedPlatformKeys.includes(platformKey)) {
      orderedPlatformKeys.push(platformKey)
    }
  })

  return orderedPlatformKeys.map((platformKey, index) => {
    const saved = contactsByPlatform[platformKey]
    return {
      id: `${platformKey}-${index}`,
      platform: platformKey,
      handle: String(saved?.handle || "").trim(),
      urlValue: String(saved?.value || "").trim(),
      label: String(saved?.label || socialPlatforms[platformKey]?.label || "").trim(),
      description: String(saved?.description || "").trim(),
      scope: String(saved?.scope || "secondary").trim().toLowerCase() || "secondary",
      previewStatus: "idle",
      previewTitle: "",
      previewHint: "",
      mode: saved?.value || saved?.handle ? "display" : "edit",
    }
  })
}

function SocialEntryDisplay({ entry, icon, onEdit, onDragStart, onDelete }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 shrink-0">
        {icon?.icon ? (
          <span
            className="h-5 w-5 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current"
            style={{ color: icon.color || "currentColor" }}
          >
            {icon.icon}
          </span>
        ) : (
          <span className="text-sm">🔗</span>
        )}
        <div className="font-semibold text-primary w-20">
          {socialPlatforms[entry.platform]?.label || entry.platform}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {entry.handle ? (
          <span className="text-sm font-mono">@{entry.handle}</span>
        ) : null}
        {entry.urlValue ? (
          <a
            href={entry.urlValue}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm link link-primary truncate block"
          >
            {entry.urlValue}
          </a>
        ) : null}
        {entry.description ? (
          <p className="text-xs text-base-content/60 mt-0.5 truncate">{entry.description}</p>
        ) : null}
        <div className="mt-2 text-xs text-base-content/60">Scope: {String(entry.scope || "secondary")}</div>
      </div>

      <button type="button" className="btn btn-sm btn-ghost shrink-0" onClick={onEdit}>
        Edit
      </button>

      <button type="button" className="btn btn-sm btn-ghost text-error shrink-0" onClick={onDelete}>
        Delete
      </button>

      <div
        className="cursor-grab text-xs text-base-content/50 shrink-0 select-none px-1"
        draggable
        onDragStart={onDragStart}
      >
        ⠿ reorder
      </div>
    </div>
  )
}

/**
 * SocialHandlesForm
 *
 * Props:
 *   artistID        — number, required for submit
 *   existingContacts — array of saved contact rows from the API (optional)
 *   availableScopes — allowed scope values for this surface
 *   onSaved         — callback(savedCount) after successful save
 */
export default function SocialHandlesForm({ context = "artist", entityID, artistID, existingContacts = [], defaultScope = "secondary", availableScopes = ["secondary"], onSaved }) {
  const apiUrl = getApiURL()
  const resolvedContext = String(context || "artist").trim().toLowerCase() || "artist"
  const resolvedEntityId = Number(entityID || artistID || 0)
  const canChooseScope = availableScopes.length > 1

  const initialEntries = useMemo(() => makeInitialEntries(existingContacts), [existingContacts])
  const [entries, setEntries] = useState(initialEntries)
  const [draggingId, setDraggingId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const previewTimersRef = useRef({})

  useEffect(() => {
    setEntries(makeInitialEntries(existingContacts))
    setHasUnsavedChanges(false)
  }, [existingContacts])

  const updateEntry = useCallback((entryId, updateFn) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id !== entryId ? entry : updateFn(entry)))
    )
  }, [])

  const runPreviewLookup = useCallback(
    async (entryId, explicitUrl = "") => {
      const current = entries.find((e) => e.id === entryId)
      const safeUrl = normalizeUrl(explicitUrl || current?.urlValue)

      if (!safeUrl) {
        updateEntry(entryId, (e) => ({ ...e, previewStatus: "idle", previewTitle: "", previewHint: "" }))
        return
      }

      updateEntry(entryId, (e) => ({
        ...e,
        previewStatus: "loading",
        previewHint: "Checking destination page...",
      }))

      try {
        const response = await fetch(`/api/link-title?url=${encodeURIComponent(safeUrl)}`)
        if (!response.ok) throw new Error("Failed preview lookup")
        const data = await response.json()
        const title = String(data?.title || "").trim()

        updateEntry(entryId, (e) => {
          const inferredHandle = extractHandleFromUrl(safeUrl, e.platform)
          return {
            ...e,
            previewStatus: "resolved",
            previewTitle: title,
            previewHint: title
              ? "Preview found. You can use this for label/description."
              : "Page reachable but no title was detected.",
            handle: e.handle.trim() ? e.handle : inferredHandle,
            label: e.label.trim() ? e.label : title || e.label,
            description: e.description.trim()
              ? e.description
              : title
              ? `Follow on ${socialPlatforms[e.platform]?.label || "profile"}: ${title}`
              : e.description,
          }
        })
      } catch {
        updateEntry(entryId, (e) => ({
          ...e,
          previewStatus: "error",
          previewTitle: "",
          previewHint: "Could not verify preview right now. Check URL and try again.",
        }))
      }
    },
    [entries, updateEntry]
  )

  const schedulePreviewLookup = useCallback(
    (entryId, nextUrl) => {
      const timers = previewTimersRef.current
      if (timers[entryId]) clearTimeout(timers[entryId])
      timers[entryId] = setTimeout(() => {
        runPreviewLookup(entryId, nextUrl)
        delete timers[entryId]
      }, 450)
    },
    [runPreviewLookup]
  )

  const handleUrlChange = useCallback(
    (entryId, nextUrl) => {
      setHasUnsavedChanges(true)
      updateEntry(entryId, (old) => ({ ...old, urlValue: nextUrl }))
      if (normalizeUrl(nextUrl)) schedulePreviewLookup(entryId, nextUrl)
    },
    [schedulePreviewLookup, updateEntry]
  )

  const deleteEntry = useCallback((entryId) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    setHasUnsavedChanges(true)
  }, [])

  // Drag-and-drop: only triggered from the grip handle, so inputs remain fully interactive
  const onGripDragStart = useCallback((event, entryId) => {
    event.stopPropagation()
    setDraggingId(entryId)
  }, [])

  const onDropEntry = useCallback(
    (targetId) => {
      if (!draggingId || draggingId === targetId) {
        setDraggingId("")
        return
      }
      setEntries((prev) => {
        const from = prev.findIndex((e) => e.id === draggingId)
        const to = prev.findIndex((e) => e.id === targetId)
        if (from < 0 || to < 0) return prev
        const reordered = [...prev]
        const [moved] = reordered.splice(from, 1)
        reordered.splice(to, 0, moved)
        setHasUnsavedChanges(true)
        return reordered
      })
      setDraggingId("")
    },
    [draggingId]
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setResultMessage("")
    setErrorMessage("")

    if (!resolvedEntityId) {
      setErrorMessage("Contact context is missing.")
      return
    }

    const payloadEntries = entries
      .map((entry, index) => {
        const finalUrl = normalizeUrl(entry.urlValue || buildUrlFromHandle(entry.platform, entry.handle))
        if (!finalUrl) return null
        return {
          context: resolvedContext,
          entityID: resolvedEntityId,
          contactType: "url",
          label: entry.label.trim() || socialPlatforms[entry.platform]?.label || "Website",
          category: entry.platform,
          value: finalUrl,
          handle: entry.handle.trim().replace(/^@/, "") || null,
          description: entry.description.trim() || null,
          scope: normalizeScope(entry.scope, defaultScope),
          setAsPrimary: false,
          displayOrder: index,
        }
      })
      .filter(Boolean)

    if (payloadEntries.length === 0) {
      setErrorMessage("Add at least one social URL or handle before saving.")
      return
    }

    setIsSubmitting(true)
    try {
      for (const payload of payloadEntries) {
        const response = await fetch(`${apiUrl}contact/manage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const contentType = response.headers.get("content-type") || ""
          let serverMessage = ""

          if (contentType.includes("application/json")) {
            const err = await response.json().catch(() => ({}))
            serverMessage = String(err?.message || err?.title || "").trim()
          } else {
            serverMessage = String(await response.text().catch(() => "")).trim()
          }

          throw new Error(serverMessage || "Unable to save one or more social contacts")
        }
      }

      const savedCount = payloadEntries.length
      setResultMessage(`Saved ${savedCount} social contact${savedCount === 1 ? "" : "s"}.`)
      setHasUnsavedChanges(false)
      setEntries((prev) =>
        prev.map((e) => ({
          ...e,
          handle: "",
          urlValue: "",
          description: "",
          scope: defaultScope,
          previewStatus: "idle",
          previewTitle: "",
          previewHint: "",
        }))
      )
      onSaved?.(savedCount)
    } catch (error) {
      setErrorMessage(error.message || "Save failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {hasUnsavedChanges ? (
        <div className="alert alert-warning text-sm">
          Changes are not applied until you click Save Social Contacts.
        </div>
      ) : null}

      <div className="text-sm text-base-content/70">
        Drag cards to reorder. Top card appears first on public profiles.
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const normalizedEntryUrl = normalizeUrl(
            entry.urlValue || buildUrlFromHandle(entry.platform, entry.handle)
          )
          const icon = socialIconMap[entry.platform]

          return (
            <div
              key={entry.id}
              className="rounded-box border border-base-300 bg-base-100 p-4"
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDropEntry(entry.id)}
            >
              {/* Display mode: compact read-only row */}
              {entry.mode === "display" ? (
                <SocialEntryDisplay
                  entry={entry}
                  icon={icon}
                  onEdit={() => updateEntry(entry.id, (e) => ({ ...e, mode: "edit" }))}
                  onDragStart={(event) => onGripDragStart(event, entry.id)}
                  onDelete={() => deleteEntry(entry.id)}
                />
              ) : (
              <>
              {/* Row 1: icon + platform name | handle input | drag grip */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 shrink-0">
                  {icon?.icon ? (
                    <span
                      className="h-5 w-5 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current"
                      style={{ color: icon.color || "currentColor" }}
                    >
                      {icon.icon}
                    </span>
                  ) : (
                    <span className="text-sm">🔗</span>
                  )}
                  <div className="font-semibold text-primary w-20">
                    {socialPlatforms[entry.platform]?.label || entry.platform}
                  </div>
                </div>

                <input
                  type="text"
                  className="input input-bordered input-sm flex-1"
                  placeholder="username or @username"
                  value={entry.handle}
                  onChange={(event) => {
                    setHasUnsavedChanges(true)
                    const nextHandle = event.target.value
                    updateEntry(entry.id, (old) => ({ ...old, handle: nextHandle }))
                  }}
                />

                {/* Drag grip — only this element is draggable */}
                <div
                  className="cursor-grab text-xs text-base-content/50 shrink-0 select-none px-1"
                  draggable
                  onDragStart={(event) => onGripDragStart(event, entry.id)}
                >
                  ⠿ reorder
                </div>
              </div>

              {/* Row 2: URL | Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="form-control">
                  <span className="label-text mb-1">URL</span>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    placeholder="https://..."
                    value={entry.urlValue}
                    onChange={(event) => handleUrlChange(entry.id, event.target.value)}
                    onPaste={(event) => {
                      event.preventDefault()
                      const pasted = event.clipboardData.getData("text")
                      handleUrlChange(entry.id, pasted)
                    }}
                    onBlur={() => runPreviewLookup(entry.id)}
                  />
                </label>

                <label className="form-control">
                  <span className="label-text mb-1">Description</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Quick line that shows in popups"
                    value={entry.description}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(entry.id, (old) => ({ ...old, description: event.target.value }))
                    }}
                  />
                </label>
              </div>

                <div className="flex items-center justify-between gap-3 mt-1">
                  {canChooseScope ? (
                    <label className="form-control min-w-40">
                      <span className="label-text mb-1">Scope</span>
                      <select
                        className="select select-bordered"
                        value={String(entry.scope || defaultScope).trim().toLowerCase() || defaultScope}
                        onChange={(event) => {
                          setHasUnsavedChanges(true)
                          updateEntry(entry.id, (old) => ({ ...old, scope: String(event.target.value || defaultScope).trim().toLowerCase() || defaultScope }))
                        }}
                      >
                        {availableScopes.map((scope) => (
                          <option key={scope} value={scope}>{scope}</option>
                        ))}
                      </select>
                    </label>
                  ) : <div className="flex-1" />}
                  <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                    Delete
                  </button>
                </div>

              {/* Preview hint */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-base-content/70">
                  {entry.previewStatus === "loading"
                    ? "Checking destination..."
                    : entry.previewStatus === "resolved"
                    ? "URL resolved. Handle populated."
                    : entry.previewHint}
                </span>
              </div>

              {/* Preview box */}
              {entry.previewTitle ? (
                <div className="rounded-box border border-base-300 bg-base-200 p-3 text-sm mt-2">
                  <div>
                    <span className="font-semibold">Preview title:</span> {entry.previewTitle}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold">Resolved URL:</span>{" "}
                    {normalizedEntryUrl || entry.urlValue}
                  </div>
                </div>
              ) : null}
              </>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Social Contacts"}
        </button>
        {resultMessage ? <span className="text-success text-sm">{resultMessage}</span> : null}
        {errorMessage ? <span className="text-error text-sm">{errorMessage}</span> : null}
      </div>
    </form>
  )
}
