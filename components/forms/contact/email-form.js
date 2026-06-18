/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, useState } from "react"
import getApiURL from "@/components/widgets/GetApiURL"

const FALLBACK_LABELS = ["home", "work", "mobile", "office", "studio", "regional office", "support", "booking", "press", "billing", "sales", "other"]
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

function sortByScopeAndOrder(entries = []) {
  const rank = { primary: 0, private: 1, secondary: 2 }
  return [...entries].sort((a, b) => {
    const aScope = rank[normalizeScope(a?.scope)] ?? 9
    const bScope = rank[normalizeScope(b?.scope)] ?? 9
    if (aScope !== bScope) return aScope - bScope
    return Number(a?.displayOrder || 0) - Number(b?.displayOrder || 0)
  })
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase()
}

function dedupeEmailEntries(entries = []) {
  const seen = new Set()
  return entries.filter((entry) => {
    const key = normalizeEmail(entry.email)
    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function makeInitialEntries(existingContacts = [], defaultScope = "secondary") {
  const sorted = sortByScopeAndOrder(existingContacts)
  const entries = dedupeEmailEntries(
    sorted.map((contact, index) => ({
      id: `email-${index}`,
      email: String(contact?.value || "").trim(),
      label: String(contact?.label || "booking").trim() || "booking",
      description: String(contact?.description || "").trim(),
      scope: normalizeScope(contact?.scope, defaultScope),
      mode: contact?.value ? "display" : "edit",
    }))
  )

  if (entries.length === 0) {
    return [{ id: "email-0", email: "", label: "booking", description: "", scope: normalizeScope(defaultScope), mode: "edit" }]
  }

  return entries
}

export default function EmailForm({
  context = "artist",
  entityID,
  existingContacts = [],
  onSaved,
  defaultScope = "secondary",
  availableScopes = ["private", "primary", "secondary"],
  singleEntryOnly = false,
  scopeLabelMap = {},
  hideDeleteAction = false,
}) {
  const apiUrl = getApiURL()
  const [labelOptions, setLabelOptions] = useState([])
  const initialEntries = useMemo(() => makeInitialEntries(existingContacts, defaultScope), [defaultScope, existingContacts])

  const [entries, setEntries] = useState(initialEntries)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

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
    const loadLabels = async () => {
      try {
        const response = await fetch(`${apiUrl}contactlabel`)
        if (!response.ok) return
        const data = await response.json()
        if (!ignore) {
          setLabelOptions(Array.isArray(data) ? data : [])
        }
      } catch {
        // no-op
      }
    }
    loadLabels()
    return () => {
      ignore = true
    }
  }, [apiUrl])

  const updateEntry = (entryId, updateFn) => {
    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? updateFn(entry) : entry)))
  }

  const addEntry = () => {
    if (singleEntryOnly) {
      return
    }

    setEntries((prev) => ([
      ...prev,
      { id: `email-${Date.now()}`, email: "", label: "booking", description: "", scope: normalizeScope(defaultScope), mode: "edit" },
    ]))
    setHasUnsavedChanges(true)
  }

  const deleteEntry = (entryId) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
    setHasUnsavedChanges(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setResultMessage("")
    setErrorMessage("")

    if (!entityID) {
      setErrorMessage("Contact context is missing.")
      return
    }

    const candidateEntries = singleEntryOnly ? entries.slice(0, 1) : entries
    const payloadEntries = candidateEntries
      .map((entry, index) => {
        const email = String(entry.email || "").trim()
        if (!email) return null

        return {
          context,
          entityID,
          contactType: "email",
          label: entry.label.trim() || "booking",
          category: "email",
          value: email,
          description: entry.description.trim() || null,
          scope: normalizeScope(entry.scope, defaultScope),
          displayOrder: index,
        }
      })
      .filter(Boolean)

    if (payloadEntries.length === 0) {
      setErrorMessage("Add at least one email address before saving.")
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
          throw new Error(err?.message || "Unable to save email contacts")
        }
      }

      setResultMessage(`Saved ${payloadEntries.length} email contact${payloadEntries.length === 1 ? "" : "s"}.`)
      setHasUnsavedChanges(false)
      onSaved?.(payloadEntries.length)
    } catch (error) {
      setErrorMessage(error.message || "Save failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectableLabels = labelOptions.length > 0
    ? labelOptions.map((option) => option.label)
    : FALLBACK_LABELS

  const canChooseScope = availableScopes.length > 1
  const headingContext = context === "user" ? "User" : "Artist"
  const primaryEntry = entries[0] || null
  const secondaryEntries = singleEntryOnly ? [] : entries.slice(1)

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {hasUnsavedChanges ? (
        <div className="alert alert-warning text-sm">Changes are not applied until you click Save Email Contacts.</div>
      ) : null}

      <div className="space-y-3">
        <div className="rounded-box border border-primary/40 bg-primary/5 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Lead Email Entry</div>
          <div className="text-xs text-base-content/70">{canChooseScope ? `Set scope to Primary only if this email should be the direct linked contact for this ${headingContext.toLowerCase()}.` : `This email will be saved as a private contact for this ${headingContext.toLowerCase()}.`}</div>
        </div>

        {primaryEntry ? (
          <div key={primaryEntry.id} className="rounded-box border border-primary/40 bg-base-100 p-4">
            {primaryEntry.mode === "display" ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary">{primaryEntry.label || "Email"}</div>
                  <div className="text-sm break-all">{primaryEntry.email}</div>
                  <div className="text-xs text-base-content/60 mt-0.5">Scope: {getScopeLabel(primaryEntry.scope)}</div>
                  {primaryEntry.description ? <p className="text-xs text-base-content/60 mt-0.5 truncate">{primaryEntry.description}</p> : null}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setHasUnsavedChanges(true)
                    updateEntry(primaryEntry.id, (old) => ({ ...old, mode: "edit" }))
                  }}
                >
                  Edit
                </button>
                {!hideDeleteAction ? (
                  <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(primaryEntry.id)}>
                    Delete
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Email</span>
                  <input
                    type="email"
                    className="input input-bordered"
                    value={primaryEntry.email}
                    autoComplete="email"
                    placeholder="name@example.com"
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(primaryEntry.id, (old) => ({ ...old, email: event.target.value }))
                    }}
                  />
                </label>

                <label className="form-control">
                  <span className="label-text mb-1">Email Label</span>
                  <select
                    className="select select-bordered"
                    value={primaryEntry.label}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(primaryEntry.id, (old) => ({ ...old, label: event.target.value }))
                    }}
                  >
                    {selectableLabels.map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </label>

                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Description</span>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={primaryEntry.description}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(primaryEntry.id, (old) => ({ ...old, description: event.target.value }))
                    }}
                  />
                </label>

                <div className="md:col-span-1 flex items-end justify-between gap-3">
                  <label className="form-control flex-1">
                    <span className="label-text mb-1">Scope</span>
                    <select
                      className="select select-bordered"
                      value={normalizeScope(primaryEntry.scope, defaultScope)}
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(primaryEntry.id, (old) => ({ ...old, scope: normalizeScope(event.target.value, defaultScope) }))
                      }}
                    >
                        {availableScopes.map((scope) => (
                          <option key={scope} value={scope}>{getScopeLabel(scope)}</option>
                        ))}
                    </select>
                  </label>
                  {!hideDeleteAction ? (
                    <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(primaryEntry.id)}>
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {secondaryEntries.length > 0 ? (
          <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-base-content/70">Secondary Details</div>
          </div>
        ) : null}

        {secondaryEntries.map((entry) => (
          <div key={entry.id} className="rounded-box border border-base-300 bg-base-100 p-4">
            {entry.mode === "display" ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary">{entry.label || "Email"}</div>
                  <div className="text-sm break-all">{entry.email}</div>
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
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Email</span>
                  <input
                    type="email"
                    className="input input-bordered"
                    value={entry.email}
                    autoComplete="email"
                    placeholder="name@example.com"
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(entry.id, (old) => ({ ...old, email: event.target.value }))
                    }}
                  />
                </label>

                <label className="form-control">
                  <span className="label-text mb-1">Email Label</span>
                  <select
                    className="select select-bordered"
                    value={entry.label}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(entry.id, (old) => ({ ...old, label: event.target.value }))
                    }}
                  >
                    {selectableLabels.map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </label>

                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Description</span>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={entry.description}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(entry.id, (old) => ({ ...old, description: event.target.value }))
                    }}
                  />
                </label>

                <div className="md:col-span-1 flex items-end justify-between gap-3">
                  {canChooseScope ? (
                    <label className="form-control flex-1">
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
              </div>
            )}
          </div>
        ))}
      </div>

      {!singleEntryOnly ? <button type="button" className="btn btn-outline btn-sm" onClick={addEntry}>Add Email</button> : null}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Email Contacts"}
        </button>
        {!entityID ? <span className="text-warning text-xs">{headingContext} ID missing</span> : null}
        {resultMessage ? <span className="text-success text-sm">{resultMessage}</span> : null}
        {errorMessage ? <span className="text-error text-sm">{errorMessage}</span> : null}
      </div>
    </form>
  )
}