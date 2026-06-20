/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, useState } from "react"
import getApiURL from "@/components/widgets/GetApiURL"

const PHONE_PREFIX_OPTIONS = [
  { code: "+1", label: "US/CA (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+52", label: "Mexico (+52)" },
  { code: "+55", label: "Brazil (+55)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+91", label: "India (+91)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+82", label: "South Korea (+82)" },
  { code: "+86", label: "China (+86)" },
]

const DEFAULT_PHONE_PREFIX = "+1"
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

function normalizePhone(value) {
  return String(value || "").replace(/[^\d+]/g, "").trim()
}

function normalizePhoneLocal(value) {
  return String(value || "").replace(/[^\d]/g, "").trim()
}

function splitPhoneNumber(value) {
  const raw = normalizePhone(value)
  if (!raw) {
    return { phonePrefix: DEFAULT_PHONE_PREFIX, phoneNumber: "" }
  }

  const matchedPrefix = PHONE_PREFIX_OPTIONS
    .map((option) => option.code)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => raw.startsWith(prefix))

  if (matchedPrefix) {
    return {
      phonePrefix: matchedPrefix,
      phoneNumber: normalizePhoneLocal(raw.slice(matchedPrefix.length)),
    }
  }

  if (raw.startsWith("+")) {
    const numericOnly = raw.slice(1).replace(/\D/g, "")
    if (numericOnly.length > 1) {
      return {
        phonePrefix: `+${numericOnly.slice(0, 1)}`,
        phoneNumber: normalizePhoneLocal(numericOnly.slice(1)),
      }
    }
  }

  return {
    phonePrefix: DEFAULT_PHONE_PREFIX,
    phoneNumber: normalizePhoneLocal(raw),
  }
}

function composePhoneNumber(phonePrefix, phoneNumber) {
  const prefix = String(phonePrefix || DEFAULT_PHONE_PREFIX).trim() || DEFAULT_PHONE_PREFIX
  const local = normalizePhoneLocal(phoneNumber)
  if (!local) return ""
  return `${prefix}${local}`
}

function isNorthAmericanPrefix(phonePrefix) {
  const digits = String(phonePrefix || "").replace(/\D/g, "")
  return digits === "1"
}

function formatGroupedPhoneLocal(localDigits) {
  const local = normalizePhoneLocal(localDigits)
  if (!local) return ""

  if (local.length <= 3) return local
  if (local.length <= 6) return `${local.slice(0, 3)} ${local.slice(3)}`
  if (local.length <= 10) return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`

  const tenDigitBase = `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 10)}`
  const extra = local.slice(10).replace(/(\d{4})(?=\d)/g, "$1 ")
  return `${tenDigitBase} ${extra}`.trim()
}

function formatPhoneLocalForPrefix(phonePrefix, phoneNumber) {
  const local = normalizePhoneLocal(phoneNumber)
  if (!local) return ""

  if (isNorthAmericanPrefix(phonePrefix)) {
    const area = local.slice(0, 3)
    const mid = local.slice(3, 6)
    const last = local.slice(6, 10)
    const extra = local.slice(10)

    if (local.length <= 3) return `(${area}`
    if (local.length <= 6) return `(${area}) ${mid}`

    const usFormatted = `(${area}) ${mid}-${last}`
    return extra ? `${usFormatted} ${extra}` : usFormatted
  }

  return formatGroupedPhoneLocal(local)
}

function placeholderForPrefix(phonePrefix) {
  if (phonePrefix === "+1") {
    return "(555) 123-4567"
  }

  return "555 123 4567"
}

function dedupePhoneEntries(entries = []) {
  const seen = new Set()
  return entries.filter((entry) => {
    const key = normalizePhone(composePhoneNumber(entry.phonePrefix, entry.phoneNumber))
    if (!key) return true
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function makeInitialEntries(existingContacts = [], defaultScope = "secondary") {
  const sorted = sortByScopeAndOrder(existingContacts)
  const entries = dedupePhoneEntries(sorted.map((contact, index) => ({
    ...splitPhoneNumber(contact?.value || ""),
    id: `phone-${index}`,
    label: String(contact?.phoneLabel || contact?.label || "Mobile").trim(),
    description: String(contact?.description || "").trim(),
    scope: normalizeScope(contact?.scope, defaultScope),
    mode: contact?.value ? "display" : "edit",
  })))

  if (entries.length === 0) {
    return [{ id: "phone-0", phonePrefix: DEFAULT_PHONE_PREFIX, phoneNumber: "", label: "Mobile", description: "", scope: normalizeScope(defaultScope), mode: "edit" }]
  }

  return entries
}

export default function PhoneForm({
  context = "artist",
  entityID,
  artistID,
  existingContacts = [],
  onSaved,
  defaultScope = "secondary",
  availableScopes = ["private", "primary", "secondary"],
  requirePrimaryPhone = false,
  singleEntryOnly = false,
  scopeLabelMap = {},
  hideDeleteAction = false,
}) {
  const apiUrl = getApiURL()
  const resolvedContext = String(context || "artist").trim().toLowerCase() || "artist"
  const resolvedEntityId = Number(entityID || artistID || 0)
  const canChooseScope = availableScopes.length > 1
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
      { id: `phone-${Date.now()}`, phonePrefix: DEFAULT_PHONE_PREFIX, phoneNumber: "", label: "Mobile", description: "", scope: normalizeScope(defaultScope), mode: "edit" },
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

    if (!resolvedEntityId) {
      setErrorMessage("Contact context is missing.")
      return
    }

    const primaryEntry = entries[0]
    const primaryPhoneValue = composePhoneNumber(primaryEntry?.phonePrefix, primaryEntry?.phoneNumber)
    if (requirePrimaryPhone && !primaryPhoneValue) {
      setErrorMessage("Primary phone number is required.")
      return
    }

    const candidateEntries = singleEntryOnly ? entries.slice(0, 1) : entries
    const entriesToSubmit = candidateEntries
      .map((entry) => {
        const phoneValue = composePhoneNumber(entry.phonePrefix, entry.phoneNumber)
        if (!phoneValue) return null
        return {
          ...entry,
          phoneValue,
        }
      })
      .filter(Boolean)

    const payloadEntries = entriesToSubmit
      .map((entry, index) => {
        const phoneValue = entry.phoneValue
        return {
          context: resolvedContext,
          entityID: resolvedEntityId,
          contactType: "phone",
          label: entry.label.trim() || "Mobile",
          category: "phone",
          value: phoneValue,
          phoneNumber: phoneValue,
          phoneDescription: entry.description.trim() || null,
          description: entry.description.trim() || null,
          scope: normalizeScope(entry.scope, defaultScope),
          setAsPrimary: singleEntryOnly,
          displayOrder: singleEntryOnly ? 1 : index,
        }
      })

    if (payloadEntries.length === 0) {
      setErrorMessage("Add at least one phone number before saving.")
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
          throw new Error(err?.message || "Unable to save phone contacts")
        }
      }

      setResultMessage(`Saved ${payloadEntries.length} phone contact${payloadEntries.length === 1 ? "" : "s"}.`)
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
        <div className="alert alert-warning text-sm">Changes are not applied until you click Save Phone Contacts.</div>
      ) : null}

      <div className="space-y-3">
        <div className="rounded-box border border-primary/40 bg-primary/5 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Lead Phone Entry</div>
          <div className="text-xs text-base-content/70">{canChooseScope ? "Set scope to Primary only if this phone should be the direct linked contact number." : "This phone number will be saved as a private contact."}</div>
        </div>

        {entries.slice(0, 1).map((entry) => (
          <div key={entry.id} className="rounded-box border border-primary/40 bg-base-100 p-4">
            {entry.mode === "display" ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary">{entry.label || "Phone"}</div>
                  <div className="text-sm">
                    {entry.phonePrefix || DEFAULT_PHONE_PREFIX} {formatPhoneLocalForPrefix(entry.phonePrefix, entry.phoneNumber)}
                  </div>
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
                <div className="form-control md:col-span-2">
                  <span className="label-text mb-1">Phone Number{requirePrimaryPhone ? " *" : ""}</span>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      className="select select-bordered col-span-1"
                      value={entry.phonePrefix || DEFAULT_PHONE_PREFIX}
                      name="tel-country-code"
                      autoComplete="tel-country-code"
                      aria-label="Country calling code"
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(entry.id, (old) => ({ ...old, phonePrefix: event.target.value }))
                      }}
                    >
                      {PHONE_PREFIX_OPTIONS.map((option) => (
                        <option key={option.code} value={option.code}>{option.label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className="input input-bordered col-span-2"
                      value={formatPhoneLocalForPrefix(entry.phonePrefix, entry.phoneNumber)}
                      name="tel"
                      required={requirePrimaryPhone}
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={placeholderForPrefix(entry.phonePrefix)}
                      aria-label="Phone number"
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(entry.id, (old) => ({ ...old, phoneNumber: normalizePhoneLocal(event.target.value) }))
                      }}
                    />
                  </div>
                </div>

                <label className="form-control">
                  <span className="label-text mb-1">Phone Label</span>
                  <select
                    className="select select-bordered"
                    value={entry.label}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(entry.id, (old) => ({ ...old, label: event.target.value }))
                    }}
                  >
                    {labelOptions.length > 0 ? labelOptions.map((option, idx) => (
                      <option key={`${option.label}-${idx}`} value={option.label}>{option.label}</option>
                    )) : (
                      <>
                        <option value="Mobile">Mobile</option>
                        <option value="Main">Main</option>
                        <option value="Work">Work</option>
                      </>
                    )}
                  </select>
                </label>

                <label className="form-control">
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

                <div className="md:col-span-3 flex items-center justify-between gap-3">
                  {canChooseScope ? (
                    <label className="form-control flex-1 max-w-xs">
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
                  ) : <div className="flex-1 max-w-xs" />}
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

        {!singleEntryOnly && entries.length > 1 ? (
          <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-base-content/70">Secondary Details</div>
          </div>
        ) : null}

        {!singleEntryOnly ? entries.slice(1).map((entry) => (
          <div key={entry.id} className="rounded-box border border-base-300 bg-base-100 p-4">
            {entry.mode === "display" ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary">{entry.label || "Phone"}</div>
                  <div className="text-sm">
                    {entry.phonePrefix || DEFAULT_PHONE_PREFIX} {formatPhoneLocalForPrefix(entry.phonePrefix, entry.phoneNumber)}
                  </div>
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
                <div className="form-control md:col-span-2">
                  <span className="label-text mb-1">Phone Number</span>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      className="select select-bordered col-span-1"
                      value={entry.phonePrefix || DEFAULT_PHONE_PREFIX}
                      name="tel-country-code"
                      autoComplete="tel-country-code"
                      aria-label="Country calling code"
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(entry.id, (old) => ({ ...old, phonePrefix: event.target.value }))
                      }}
                    >
                      {PHONE_PREFIX_OPTIONS.map((option) => (
                        <option key={option.code} value={option.code}>{option.label}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className="input input-bordered col-span-2"
                      value={formatPhoneLocalForPrefix(entry.phonePrefix, entry.phoneNumber)}
                      name="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder={placeholderForPrefix(entry.phonePrefix)}
                      aria-label="Phone number"
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(entry.id, (old) => ({ ...old, phoneNumber: normalizePhoneLocal(event.target.value) }))
                      }}
                    />
                  </div>
                </div>

                <label className="form-control">
                  <span className="label-text mb-1">Phone Label</span>
                  <select
                    className="select select-bordered"
                    value={entry.label}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      updateEntry(entry.id, (old) => ({ ...old, label: event.target.value }))
                    }}
                  >
                    {labelOptions.length > 0 ? labelOptions.map((option, idx) => (
                      <option key={`${option.label}-${idx}`} value={option.label}>{option.label}</option>
                    )) : (
                      <>
                        <option value="Mobile">Mobile</option>
                        <option value="Main">Main</option>
                        <option value="Work">Work</option>
                      </>
                    )}
                  </select>
                </label>

                <label className="form-control">
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

                <div className="md:col-span-3 flex items-center justify-between gap-3">
                  <label className="form-control flex-1 max-w-xs">
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
                  {!hideDeleteAction ? (
                    <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )) : null}
      </div>

      {!singleEntryOnly ? <button type="button" className="btn btn-outline btn-sm" onClick={addEntry}>Add Phone</button> : null}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Phone Contacts"}
        </button>
        {resultMessage ? <span className="text-success text-sm">{resultMessage}</span> : null}
        {errorMessage ? <span className="text-error text-sm">{errorMessage}</span> : null}
      </div>
    </form>
  )
}
