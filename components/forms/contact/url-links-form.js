/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react"
import getApiURL from "@/components/widgets/GetApiURL"

const BLOCKED_SOCIAL_DOMAINS = [
  "instagram.com",
  "tiktok.com",
  "x.com",
  "twitter.com",
  "facebook.com",
  "fb.com",
  "youtube.com",
  "youtu.be",
  "threads.net",
  "snapchat.com",
  "linkedin.com",
  "discord.com",
  "telegram.org",
  "whatsapp.com",
  "reddit.com",
]

const BLOCKED_ADULT_DOMAINS = [
  "onlyfans.com",
  "fansly.com",
  "pornhub.com",
  "xvideos.com",
  "xnxx.com",
  "redtube.com",
  "youporn.com",
  "chaturbate.com",
  "cam4.com",
  "stripchat.com",
  "manyvids.com",
]

const REQUIRED_FALLBACK_LABELS = [
  "home",
  "work",
  "mobile",
  "office",
  "studio",
  "regional office",
  "support",
  "booking",
  "press",
  "billing",
  "sales",
  "other",
]
const CONTACT_SCOPE_OPTIONS = [
  { value: "private", label: "Private" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
]

function normalizeScope(value, fallback = "secondary") {
  const normalized = String(value || "").trim().toLowerCase()
  if (normalized === "private" || normalized === "primary" || normalized === "secondary") {
    return normalized
  }

  return fallback
}

function scopeFromContact(contact, fallback = "secondary") {
  const rawIsPrivate = contact?.isPrivate
  if (rawIsPrivate === true || String(rawIsPrivate || "").trim().toLowerCase() === "true") {
    return "private"
  }
  if (rawIsPrivate === false || String(rawIsPrivate || "").trim().toLowerCase() === "false") {
    return "secondary"
  }

  return normalizeScope(contact?.scope, fallback)
}

function sortByScopeAndOrder(entries = []) {
  const rank = { primary: 0, private: 1, secondary: 2 }
  return [...entries].sort((a, b) => {
    const aScope = rank[scopeFromContact(a)] ?? 9
    const bScope = rank[scopeFromContact(b)] ?? 9
    if (aScope !== bScope) return aScope - bScope
    return Number(a?.displayOrder || 0) - Number(b?.displayOrder || 0)
  })
}

const LABEL_DOMAIN_MAP = {
  website: "example.com",
  portfolio: "behance.net",
  shopify: "shopify.com",
  etsy: "etsy.com",
  wix: "wix.com",
  wordpress: "wordpress.com",
  woocommerce: "woocommerce.com",
  bigcartel: "bigcartel.com",
  gumroad: "gumroad.com",
  spotify: "spotify.com",
  soundcloud: "soundcloud.com",
  "apple music": "music.apple.com",
  bandcamp: "bandcamp.com",
  mixcloud: "mixcloud.com",
  github: "github.com",
  gitlab: "gitlab.com",
  codepen: "codepen.io",
  paypal: "paypal.com",
  stripe: "stripe.com",
  square: "squareup.com",
  patreon: "patreon.com",
  "ko-fi": "ko-fi.com",
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

function getHostname(value) {
  const normalized = normalizeUrl(value)
  if (!normalized) return ""
  try {
    const host = new URL(normalized).hostname.toLowerCase()
    return host.startsWith("www.") ? host.slice(4) : host
  } catch {
    return ""
  }
}

function hostMatchesDomain(host, domain) {
  return host === domain || host.endsWith(`.${domain}`)
}

function getBlockedReason(value) {
  const host = getHostname(value)
  if (!host) return ""

  if (BLOCKED_SOCIAL_DOMAINS.some((domain) => hostMatchesDomain(host, domain))) {
    return "That platform belongs in Social Handles. Please add it there instead."
  }

  if (BLOCKED_ADULT_DOMAINS.some((domain) => hostMatchesDomain(host, domain))) {
    return "Adult-content domains are not supported for profile links."
  }

  return ""
}

function getIconDomain(urlValue, label) {
  const host = getHostname(urlValue)
  if (host) {
    return host
  }

  const normalizedLabel = String(label || "").trim().toLowerCase()
  return LABEL_DOMAIN_MAP[normalizedLabel] || "example.com"
}

function getFaviconUrl(urlValue, label) {
  const domain = getIconDomain(urlValue, label)
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
}

function inferLabelFromUrl(urlValue, groupedOptions = []) {
  const host = getHostname(urlValue)
  if (!host) return ""

  const matchedByKnownMap = Object.entries(LABEL_DOMAIN_MAP).find(([, domain]) => hostMatchesDomain(host, domain))
  if (matchedByKnownMap) {
    const [labelKey] = matchedByKnownMap
    return labelKey
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  const allLabelOptions = flattenLabelOptions(groupedOptions)
  const matchedByOption = allLabelOptions.find((labelOption) => {
    const key = labelOption.toLowerCase().replace(/\s+/g, "")
    return key && host.includes(key)
  })

  return matchedByOption || ""
}

function groupNameForCategoryKey(categoryKey = "") {
  const key = String(categoryKey || "").toLowerCase()
  if (key.includes("store") || key.includes("commerce") || key.includes("shop") || key.includes("payment") || key.includes("support")) return "Sales"
  if (key.includes("developer") || key.includes("github") || key.includes("gitlab") || key.includes("codepen")) return "Code"
  if (key.includes("music") || key.includes("audio") || key.includes("spotify") || key.includes("soundcloud") || key.includes("bandcamp") || key.includes("mixcloud")) return "Music"
  if (key.includes("writing") || key.includes("blog") || key.includes("newsletter") || key.includes("medium") || key.includes("substack")) return "Writing"
  if (key.includes("event") || key.includes("ticket") || key.includes("booking")) return "Events"
  if (key.includes("professional") || key.includes("business") || key.includes("linkedin") || key.includes("press")) return "Professional"
  if (key.includes("create") || key.includes("portfolio") || key.includes("artstation") || key.includes("behance") || key.includes("dribbble")) return "Creative"
  return "Websites"
}

function createGroupedLabelOptions(categories = []) {
  const categoryRows = categories
    .map((category) => ({
      label: String(category?.label || category?.category || "").trim(),
      group: "Labels",
    }))
    .filter((row) => row.label)

  const fallbackRows = REQUIRED_FALLBACK_LABELS.map((label) => ({
    label,
    group: groupNameForCategoryKey(label),
  }))

  const uniqueByLabel = new Map()
  ;[...categoryRows, ...fallbackRows].forEach((row) => {
    const normalized = row.label.toLowerCase()
    if (!uniqueByLabel.has(normalized)) {
      uniqueByLabel.set(normalized, row)
    }
  })

  const groupedMap = new Map()
  Array.from(uniqueByLabel.values())
    .sort((a, b) => a.label.localeCompare(b.label))
    .forEach((row) => {
      if (!groupedMap.has(row.group)) {
        groupedMap.set(row.group, [])
      }
      groupedMap.get(row.group).push(row.label)
    })

  return Array.from(groupedMap.entries())
    .map(([group, labels]) => ({ group, labels }))
    .sort((a, b) => a.group.localeCompare(b.group))
}

function flattenLabelOptions(groupedOptions = []) {
  return groupedOptions.flatMap((group) => group.labels)
}

function LabelDropdown({ value, urlValue, groupedOptions, onSelect }) {
  const selectedFaviconUrl = getFaviconUrl(urlValue, value)

  return (
    <div className="dropdown w-full">
      <div tabIndex={0} role="button" className="btn btn-outline w-full justify-between">
        <span className="inline-flex items-center gap-2 min-w-0">
          <img src={selectedFaviconUrl} alt="" className="h-5 w-5 rounded-sm" loading="lazy" />
          <span className="truncate">{value || "Website"}</span>
        </span>
        <span className="text-xs">▾</span>
      </div>
      <ul tabIndex={0} className="dropdown-content menu z-1 mt-1 w-full max-h-64 overflow-auto rounded-box border border-base-300 bg-base-100 p-2 shadow">
        {groupedOptions.map((group) => (
          <Fragment key={group.group}>
            <li className="menu-title px-2 pt-2 pb-1 text-[11px] uppercase tracking-wide text-base-content/60">{group.group}</li>
            {group.labels.map((labelOption) => (
              <li key={`${group.group}-${labelOption}`}>
                <button type="button" onClick={() => onSelect(labelOption)} className="justify-start">
                  <img src={getFaviconUrl("", labelOption)} alt="" className="h-5 w-5 rounded-sm" loading="lazy" />
                  <span>{labelOption}</span>
                </button>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  )
}

function makeInitialEntries(existingContacts = [], defaultScope = "secondary") {
  const sorted = sortByScopeAndOrder(existingContacts)
  if (sorted.length === 0) {
    return [{ id: "url-0", label: "Website", urlValue: "", description: "", scope: normalizeScope(defaultScope), mode: "edit" }]
  }

  return sorted.map((contact, index) => ({
    id: `url-${index}`,
    label: String(contact?.label || "Website").trim(),
    urlValue: String(contact?.value || "").trim(),
    description: String(contact?.description || "").trim(),
    scope: scopeFromContact(contact, defaultScope),
    previewStatus: "idle",
    previewTitle: "",
    previewHint: "",
    mode: contact?.value ? "display" : "edit",
  }))
}

export default function UrlLinksForm({
  context = "artist",
  entityID,
  artistID,
  existingContacts = [],
  onSaved,
  defaultScope = "secondary",
  availableScopes = ["private", "primary", "secondary"],
  singleEntryOnly = false,
  scopeLabelMap = {},
  hideDeleteAction = false,
}) {
  const apiUrl = getApiURL()
  const resolvedContext = String(context || "artist").trim().toLowerCase() || "artist"
  const resolvedEntityId = Number(entityID || artistID || 0)
  const canChooseScope = availableScopes.length > 1
  const initialEntries = useMemo(() => makeInitialEntries(existingContacts, defaultScope), [defaultScope, existingContacts])

  const [entries, setEntries] = useState(initialEntries)
  const [draggingId, setDraggingId] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [groupedLabelOptions, setGroupedLabelOptions] = useState(createGroupedLabelOptions([]))
  const previewTimersRef = useRef({})
  const selectableLabels = useMemo(() => flattenLabelOptions(groupedLabelOptions), [groupedLabelOptions])
  const normalizedSelectableLabels = useMemo(
    () => new Set(selectableLabels.map((label) => String(label || "").trim().toLowerCase()).filter(Boolean)),
    [selectableLabels]
  )

  const resolveLabelForSubmit = (rawLabel) => {
    const trimmed = String(rawLabel || "").trim()
    if (!trimmed) {
      return null
    }

    return normalizedSelectableLabels.has(trimmed.toLowerCase()) ? trimmed : null
  }

  const getScopeLabel = (scope) => {
    const normalized = normalizeScope(scope, defaultScope)
    return scopeLabelMap?.[normalized] || CONTACT_SCOPE_OPTIONS.find((option) => option.value === normalized)?.label || "Secondary"
  }

  useEffect(() => {
    const nextEntries = makeInitialEntries(existingContacts, defaultScope)
    setEntries(singleEntryOnly ? nextEntries.slice(0, 1) : nextEntries)
    setHasUnsavedChanges(false)
  }, [defaultScope, existingContacts, singleEntryOnly])

  useEffect(() => {
    let ignore = false

    const loadLabelOptions = async () => {
      try {
        const response = await fetch(`${apiUrl}contactlabel`)
        if (!response.ok) {
          return
        }

        const categories = await response.json()
        if (!ignore) {
          setGroupedLabelOptions(createGroupedLabelOptions(Array.isArray(categories) ? categories : []))
        }
      } catch {
        if (!ignore) {
          setGroupedLabelOptions(createGroupedLabelOptions([]))
        }
      }
    }

    loadLabelOptions()
    return () => {
      ignore = true
    }
  }, [apiUrl])

  const updateEntry = useCallback((entryId, updateFn) => {
    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? updateFn(entry) : entry)))
  }, [])

  const onGripDragStart = useCallback((event, entryId) => {
    event.stopPropagation()
    setDraggingId(entryId)
  }, [])

  const onDropEntry = useCallback((targetId) => {
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
      return reordered
    })
    setHasUnsavedChanges(true)
    setDraggingId("")
  }, [draggingId])

  const deleteEntry = useCallback((entryId) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    setHasUnsavedChanges(true)
  }, [])

  const addEntry = () => {
    if (singleEntryOnly) {
      return
    }

    setEntries((prev) => ([
      ...prev,
      {
        id: `url-${Date.now()}`,
        label: "Website",
        urlValue: "",
        description: "",
        scope: normalizeScope(defaultScope),
        previewStatus: "idle",
        previewTitle: "",
        previewHint: "",
        mode: "edit",
      },
    ]))
    setHasUnsavedChanges(true)
  }

  const runPreviewLookup = useCallback(async (entryId, explicitUrl = "") => {
    const current = entries.find((entry) => entry.id === entryId)
    const safeUrl = normalizeUrl(explicitUrl || current?.urlValue)

    if (!safeUrl) {
      updateEntry(entryId, (entry) => ({
        ...entry,
        previewStatus: "idle",
        previewTitle: "",
        previewHint: "",
      }))
      return
    }

    updateEntry(entryId, (entry) => ({
      ...entry,
      previewStatus: "loading",
      previewHint: "Checking destination...",
    }))

    try {
      const response = await fetch(`/api/link-title?url=${encodeURIComponent(safeUrl)}`)
      if (!response.ok) {
        throw new Error("Failed preview lookup")
      }

      const data = await response.json()
      const title = String(data?.title || "").trim()

      updateEntry(entryId, (entry) => {
        const inferredLabel = inferLabelFromUrl(safeUrl, groupedLabelOptions)
        const shouldUseInferredLabel = !entry.label || entry.label === "Website"
        const suggestedDescription = title
          ? `Visit ${shouldUseInferredLabel ? inferredLabel || entry.label || "Website" : entry.label}: ${title}`
          : entry.description

        return {
          ...entry,
          previewStatus: "resolved",
          previewTitle: title,
          previewHint: title ? "Destination verified. Service detected." : "Destination verified.",
          label: shouldUseInferredLabel && inferredLabel ? inferredLabel : entry.label,
          description: entry.description.trim() ? entry.description : suggestedDescription,
        }
      })
    } catch {
      updateEntry(entryId, (entry) => ({
        ...entry,
        previewStatus: "error",
        previewTitle: "",
        previewHint: "Unable to resolve this URL right now.",
      }))
    }
  }, [entries, groupedLabelOptions, updateEntry])

  const schedulePreviewLookup = useCallback((entryId, nextUrl) => {
    const timers = previewTimersRef.current
    if (timers[entryId]) {
      clearTimeout(timers[entryId])
    }

    timers[entryId] = setTimeout(() => {
      runPreviewLookup(entryId, nextUrl)
      delete timers[entryId]
    }, 450)
  }, [runPreviewLookup])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setResultMessage("")
    setErrorMessage("")

    if (!resolvedEntityId) {
      setErrorMessage("Contact context is missing.")
      return
    }

    const candidateEntries = singleEntryOnly ? entries.slice(0, 1) : entries
    const payloadEntries = candidateEntries
      .map((entry, index) => {
        const finalUrl = normalizeUrl(entry.urlValue)
        if (!finalUrl) return null

        const blockedReason = getBlockedReason(finalUrl)
        if (blockedReason) {
          throw new Error(`${entry.label || "URL"}: ${blockedReason}`)
        }

        return {
          context: resolvedContext,
          entityID: resolvedEntityId,
          contactType: "url",
          label: entry.label.trim() || "Website",
          category: "website",
          value: finalUrl,
          description: entry.description.trim() || null,
          isPrivate: normalizeScope(entry.scope, defaultScope) === "private",
          displayOrder: singleEntryOnly ? 0 : index,
        }
      })
      .filter(Boolean)

    if (payloadEntries.length === 0) {
      setErrorMessage("Add at least one website URL before saving.")
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
          const err = await response.json().catch(() => ({}))
          throw new Error(err?.message || "Unable to save website contacts")
        }
      }

      setResultMessage(`Saved ${payloadEntries.length} URL contact${payloadEntries.length === 1 ? "" : "s"}.`)
      setHasUnsavedChanges(false)
      onSaved?.(payloadEntries.length)
    } catch (error) {
      setErrorMessage(error.message || "Save failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {hasUnsavedChanges ? (
        <div className="alert alert-warning text-sm">Changes are not applied until you click Save URL Contacts.</div>
      ) : null}

      <div className="max-h-128 overflow-y-auto overflow-x-hidden pr-1 space-y-3">
        <div className="rounded-box border border-primary/40 bg-primary/5 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Lead URL Entry</div>
          <div className="text-xs text-base-content/70">{canChooseScope ? "Set scope to Primary only if this URL should be the direct linked website record." : "This URL will be saved as a private contact."}</div>
        </div>

        {entries.map((entry, index) => (
          <Fragment key={entry.id}>
            {!singleEntryOnly && index === 1 ? (
              <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-base-content/70">Secondary Details</div>
              </div>
            ) : null}
            <div
              className={`rounded-box bg-base-100 p-4 overflow-x-hidden ${index === 0 ? "border border-primary/40" : "border border-base-300"}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDropEntry(entry.id)}
            >
            {entry.mode === "display" ? (
              <div className="flex items-center gap-3">
                <div className="h-8 min-w-8 inline-flex items-center justify-center" aria-label="Website icon">
                  <img src={getFaviconUrl(entry.urlValue, entry.label)} alt="" className="h-7 w-7 rounded-sm" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary">{entry.label || "Website"}</div>
                  <a href={entry.urlValue} target="_blank" rel="noopener noreferrer" className="text-sm link link-primary truncate block">
                    {entry.urlValue}
                  </a>
                  <div className="text-xs text-base-content/60 mt-0.5">Scope: {getScopeLabel(entry.scope)}</div>
                  {entry.description ? <p className="text-xs text-base-content/60 mt-0.5 truncate">{entry.description}</p> : null}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setHasUnsavedChanges(true)
                    updateEntry(entry.id, (old) => ({ ...old, mode: "edit" }))
                  }}
                >
                  Edit
                </button>
                {!hideDeleteAction ? (
                  <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                    Delete
                  </button>
                ) : null}
                <div className="cursor-grab text-xs text-base-content/50 shrink-0 select-none px-1" draggable onDragStart={(event) => onGripDragStart(event, entry.id)}>
                  ⠿ reorder
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="h-8 min-w-8 inline-flex items-center justify-center mt-8" aria-label="Website icon">
                    <img src={getFaviconUrl(entry.urlValue, entry.label)} alt="" className="h-7 w-7 rounded-sm" loading="lazy" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 flex-1">
                    <label className="form-control">
                      <span className="label-text mb-1">URL</span>
                      <input
                        type="url"
                        className="input input-bordered w-full"
                        placeholder="https://..."
                        value={entry.urlValue}
                        onChange={(event) => {
                          setHasUnsavedChanges(true)
                          const nextValue = event.target.value
                          schedulePreviewLookup(entry.id, nextValue)
                          updateEntry(entry.id, (old) => {
                            const inferredLabel = inferLabelFromUrl(nextValue, groupedLabelOptions)

                            if (old.label && old.label !== "Website") {
                              return { ...old, urlValue: nextValue }
                            }

                            return {
                              ...old,
                              urlValue: nextValue,
                              label: inferredLabel || old.label,
                            }
                          })
                        }}
                        onBlur={() => runPreviewLookup(entry.id)}
                        onPaste={(event) => {
                          event.preventDefault()
                          const pasted = event.clipboardData.getData("text")
                          setHasUnsavedChanges(true)
                          schedulePreviewLookup(entry.id, pasted)
                          updateEntry(entry.id, (old) => ({ ...old, urlValue: pasted }))
                        }}
                      />
                      {getBlockedReason(entry.urlValue) ? (
                        <span className="label-text-alt text-error mt-1">{getBlockedReason(entry.urlValue)}</span>
                      ) : null}
                      {entry.previewHint ? (
                        <span className={`label-text-alt mt-1 ${entry.previewStatus === "error" ? "text-error" : "text-base-content/60"}`}>
                          {entry.previewStatus === "loading" ? "Checking destination..." : entry.previewHint}
                        </span>
                      ) : null}
                    </label>

                    {entry.previewTitle ? (
                      <div className="rounded-box border border-base-300 bg-base-200 p-3 text-sm">
                        <div><span className="font-semibold">Resolved title:</span> {entry.previewTitle}</div>
                        <div className="truncate"><span className="font-semibold">Resolved URL:</span> {normalizeUrl(entry.urlValue) || entry.urlValue}</div>
                      </div>
                    ) : null}

                    <label className="form-control">
                      <span className="label-text mb-1">Service / Label</span>
                      <LabelDropdown
                        value={entry.label}
                        urlValue={entry.urlValue}
                        groupedOptions={groupedLabelOptions}
                        onSelect={(nextLabel) => {
                          setHasUnsavedChanges(true)
                          updateEntry(entry.id, (old) => ({ ...old, label: nextLabel }))
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <label className="form-control flex-1">
                    <span className="label-text mb-1">Description</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={entry.description}
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(entry.id, (old) => ({ ...old, description: event.target.value }))
                      }}
                    />
                  </label>
                  <div className="flex items-center justify-between gap-3">
                    {canChooseScope ? (
                      <label className="form-control min-w-40">
                        <span className="label-text mb-1">Scope</span>
                        <select
                          className="select select-bordered"
                          value={normalizeScope(entry.scope, defaultScope)}
                          onChange={(event) => {
                            setHasUnsavedChanges(true)
                            updateEntry(entry.id, (old) => ({ ...old, scope: normalizeScope(event.target.value, defaultScope) }))
                          }}
                        >
                          {availableScopes.map((scope) => (
                            <option key={scope} value={scope}>{getScopeLabel(scope)}</option>
                          ))}
                        </select>
                      </label>
                    ) : <div className="flex-1" />}
                    {!hideDeleteAction ? (
                      <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                        Delete
                      </button>
                    ) : null}
                  </div>
                  {!singleEntryOnly ? (
                    <div className="cursor-grab text-xs text-base-content/50 shrink-0 select-none px-1" draggable onDragStart={(event) => onGripDragStart(event, entry.id)}>
                      ⠿ reorder
                    </div>
                  ) : null}
                </div>
              </>
            )}
            </div>
          </Fragment>
        ))}
      </div>

      <div className="flex gap-2">
        {!singleEntryOnly ? <button type="button" className="btn btn-outline btn-sm" onClick={addEntry}>Add URL</button> : null}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save URL Contacts"}
        </button>
        {resultMessage ? <span className="text-success text-sm">{resultMessage}</span> : null}
        {errorMessage ? <span className="text-error text-sm">{errorMessage}</span> : null}
      </div>
    </form>
  )
}
