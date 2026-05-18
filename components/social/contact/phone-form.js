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

function makeInitialEntries(existingContacts = [], primaryPhone = null) {
  const sorted = [...existingContacts].sort((a, b) => Number(a?.displayOrder || 0) - Number(b?.displayOrder || 0))
  const entries = dedupePhoneEntries(sorted.map((contact, index) => ({
    ...splitPhoneNumber(contact?.value || ""),
    id: `phone-${index}`,
    label: String(contact?.phoneLabel || contact?.label || "Mobile").trim(),
    description: String(contact?.description || "").trim(),
    isPrivate: Boolean(contact?.isPrivate || contact?.private || false),
    isPrimary: false,
    mode: contact?.value ? "display" : "edit",
  })))

  if (primaryPhone?.phoneNumber) {
    const normalizedPrimary = normalizePhone(primaryPhone.phoneNumber)
    const match = entries.find((entry) => normalizePhone(composePhoneNumber(entry.phonePrefix, entry.phoneNumber)) === normalizedPrimary)
    if (match) {
      match.isPrimary = true
    } else {
      entries.unshift({
        ...splitPhoneNumber(primaryPhone.phoneNumber || ""),
        id: "phone-primary",
        label: String(primaryPhone?.phoneContactLabel?.label || primaryPhone?.phoneLabel || "Mobile").trim(),
        description: String(primaryPhone?.description || "").trim(),
        isPrivate: Boolean(primaryPhone?.isPrivate || false),
        isPrimary: true,
        mode: "display",
      })
    }
  }

  if (entries.length === 0) {
    return [{ id: "phone-0", phonePrefix: DEFAULT_PHONE_PREFIX, phoneNumber: "", label: "Mobile", description: "", isPrivate: false, isPrimary: false, mode: "edit" }]
  }

  return entries
}

export default function PhoneForm({ artistID, existingContacts = [], primaryPhone = null, onSaved }) {
  const apiUrl = getApiURL()
  const [labelOptions, setLabelOptions] = useState([])
  const initialEntries = useMemo(() => makeInitialEntries(existingContacts, primaryPhone), [existingContacts, primaryPhone])

  const [entries, setEntries] = useState(initialEntries)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setEntries(makeInitialEntries(existingContacts, primaryPhone))
    setHasUnsavedChanges(false)
  }, [existingContacts, primaryPhone])

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
    setEntries((prev) => ([
      ...prev,
      { id: `phone-${Date.now()}`, phonePrefix: DEFAULT_PHONE_PREFIX, phoneNumber: "", label: "Mobile", description: "", isPrivate: false, isPrimary: false, mode: "edit" },
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

    if (!artistID) {
      setErrorMessage("Artist context is missing.")
      return
    }

    const payloadEntries = entries
      .map((entry, index) => {
        const phoneValue = composePhoneNumber(entry.phonePrefix, entry.phoneNumber)
        if (!phoneValue) return null
        return {
          context: "artist",
          entityID: artistID,
          contactType: "phone",
          label: entry.label.trim() || "Mobile",
          category: "phone",
          value: phoneValue,
          phoneNumber: phoneValue,
          phoneDescription: entry.description.trim() || null,
          description: entry.description.trim() || null,
          isPrivate: Boolean(entry.isPrivate),
          displayOrder: index,
          setAsPrimary: index === 0,
        }
      })
      .filter(Boolean)

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
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Primary Phone (linked to entity)</div>
          <div className="text-xs text-base-content/70">This number is treated as the primary phone contact.</div>
        </div>

        {entries.slice(0, 1).map((entry) => (
          <div key={entry.id} className="rounded-box border border-primary/40 bg-base-100 p-4">
            {entry.mode === "display" ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary">{entry.label || "Phone"} (Primary)</div>
                  <div className="text-sm">
                    {entry.phonePrefix || DEFAULT_PHONE_PREFIX} {formatPhoneLocalForPrefix(entry.phonePrefix, entry.phoneNumber)}
                  </div>
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
                <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                  Delete
                </button>
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
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs"
                      checked={Boolean(entry.isPrivate)}
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(entry.id, (old) => ({ ...old, isPrivate: event.target.checked }))
                      }}
                    />
                    <span>Private</span>
                  </label>
                  <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {entries.length > 1 ? (
          <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-base-content/70">Secondary Details</div>
          </div>
        ) : null}

        {entries.slice(1).map((entry) => (
          <div key={entry.id} className="rounded-box border border-base-300 bg-base-100 p-4">
            {entry.mode === "display" ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-primary">{entry.label || "Phone"}</div>
                  <div className="text-sm">
                    {entry.phonePrefix || DEFAULT_PHONE_PREFIX} {formatPhoneLocalForPrefix(entry.phonePrefix, entry.phoneNumber)}
                  </div>
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
                <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                  Delete
                </button>
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
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs"
                      checked={Boolean(entry.isPrivate)}
                      onChange={(event) => {
                        setHasUnsavedChanges(true)
                        updateEntry(entry.id, (old) => ({ ...old, isPrivate: event.target.checked }))
                      }}
                    />
                    <span>Private</span>
                  </label>
                  <button type="button" className="btn btn-sm btn-ghost text-error" onClick={() => deleteEntry(entry.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-outline btn-sm" onClick={addEntry}>Add Phone</button>

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
