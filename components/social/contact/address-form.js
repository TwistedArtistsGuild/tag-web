/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, useState } from "react"
import getApiURL from "@/components/widgets/GetApiURL"

const FALLBACK_LABELS = ["home", "work", "mobile", "office", "studio", "regional office", "support", "booking", "press", "billing", "sales", "other"]

function makeInitialEntries(existingContacts = [], primaryAddress = null) {
  const sorted = [...existingContacts].sort((a, b) => Number(a?.displayOrder || 0) - Number(b?.displayOrder || 0))
  const entries = sorted.map((contact, index) => ({
    id: `address-${index}`,
    label: String(contact?.label || "Address").trim(),
    description: String(contact?.description || "").trim(),
    line1: String(contact?.address?.line1 || "").trim(),
    line2: String(contact?.address?.line2 || "").trim(),
    city: String(contact?.address?.city || "").trim(),
    state: String(contact?.address?.state || "").trim(),
    region: String(contact?.address?.region || "").trim(),
    zipCode: String(contact?.address?.postalCode || "").trim(),
    country: String(contact?.address?.country || "").trim(),
    operationHours: String(contact?.address?.hours || "").trim(),
    isPrivate: Boolean(contact?.isPrivate || contact?.private || false),
    isPrimary: false,
    mode: contact?.address?.line1 ? "display" : "edit",
  }))

  if (primaryAddress?.addressLine1 || primaryAddress?.line1) {
    const primaryLine1 = String(primaryAddress?.addressLine1 || primaryAddress?.line1 || "").trim().toLowerCase()
    const existingPrimary = entries.find((entry) => String(entry.line1 || "").trim().toLowerCase() === primaryLine1)
    if (existingPrimary) {
      existingPrimary.isPrimary = true
    } else {
      entries.unshift({
        id: "address-primary",
        label: "Primary Address",
        description: "",
        line1: String(primaryAddress?.addressLine1 || primaryAddress?.line1 || "").trim(),
        line2: String(primaryAddress?.addressLine2 || primaryAddress?.line2 || "").trim(),
        city: String(primaryAddress?.city || "").trim(),
        state: String(primaryAddress?.state || "").trim(),
        region: String(primaryAddress?.region || "").trim(),
        zipCode: String(primaryAddress?.zipCode || primaryAddress?.postalCode || "").trim(),
        country: String(primaryAddress?.country || "").trim(),
        operationHours: String(primaryAddress?.operationHours || primaryAddress?.hours || "").trim(),
        isPrivate: Boolean(primaryAddress?.isPrivate || false),
        isPrimary: true,
        mode: "display",
      })
    }
  }

  if (entries.length === 0) {
    return [{
      id: "address-0",
      label: "Address",
      description: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      region: "",
      zipCode: "",
      country: "",
      operationHours: "",
      isPrivate: false,
      isPrimary: false,
      mode: "edit",
    }]
  }

  return entries
}

export default function AddressForm({ artistID, existingContacts = [], primaryAddress = null, onSaved }) {
  const apiUrl = getApiURL()
  const initialEntries = useMemo(() => makeInitialEntries(existingContacts, primaryAddress), [existingContacts, primaryAddress])
  const [labelOptions, setLabelOptions] = useState([])

  const [entries, setEntries] = useState(initialEntries)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setEntries(makeInitialEntries(existingContacts, primaryAddress))
    setHasUnsavedChanges(false)
  }, [existingContacts, primaryAddress])

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
      {
        id: `address-${Date.now()}`,
        label: "Address",
        description: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        region: "",
        zipCode: "",
        country: "",
        operationHours: "",
        isPrivate: false,
        isPrimary: false,
        mode: "edit",
      },
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
        const addressLine1 = String(entry.line1 || "").trim()
        if (!addressLine1) return null

        return {
          context: "artist",
          entityID: artistID,
          contactType: "address",
          label: entry.label.trim() || "Address",
          category: "address",
          description: entry.description.trim() || null,
          addressLine1,
          addressLine2: entry.line2.trim() || null,
          city: entry.city.trim() || null,
          state: entry.state.trim() || null,
          region: entry.region.trim() || null,
          zipCode: entry.zipCode.trim() || null,
          country: entry.country.trim() || null,
          operationHours: entry.operationHours.trim() || null,
          isPrivate: Boolean(entry.isPrivate),
          displayOrder: index,
          setAsPrimary: index === 0,
        }
      })
      .filter(Boolean)

    if (payloadEntries.length === 0) {
      setErrorMessage("Add at least one address before saving.")
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
          throw new Error(err?.message || "Unable to save address contacts")
        }
      }

      setResultMessage(`Saved ${payloadEntries.length} address contact${payloadEntries.length === 1 ? "" : "s"}.`)
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {hasUnsavedChanges ? (
        <div className="alert alert-warning text-sm">Changes are not applied until you click Save Address Contacts.</div>
      ) : null}

      <div className="space-y-3">
        <div className="rounded-box border border-primary/40 bg-primary/5 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Primary Address (linked to entity)</div>
          <div className="text-xs text-base-content/70">This address is treated as the primary contact location.</div>
        </div>

        {entries.slice(0, 1).map((entry) => (
          <div key={entry.id} className="rounded-box border border-primary/40 bg-base-100 p-4">
            {entry.mode === "display" ? (
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-primary">{entry.label || "Address"} (Primary)</div>
                  <div className="text-sm">{entry.line1}</div>
                  {entry.line2 ? <div className="text-sm">{entry.line2}</div> : null}
                  <div className="text-sm">{[entry.city, entry.region || entry.state, entry.zipCode, entry.country].filter(Boolean).join(", ")}</div>
                  <label className="mt-2 inline-flex items-center gap-2 text-xs cursor-pointer">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Label</span>
                  <select className="select select-bordered" value={entry.label} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, label: event.target.value })) }}>
                    {selectableLabels.map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Address Line 1</span>
                  <input type="text" className="input input-bordered" value={entry.line1} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, line1: event.target.value })) }} />
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Address Line 2</span>
                  <input type="text" className="input input-bordered" value={entry.line2} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, line2: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">City</span>
                  <input type="text" className="input input-bordered" value={entry.city} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, city: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">State/Region</span>
                  <input type="text" className="input input-bordered" value={entry.region || entry.state} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, region: event.target.value, state: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Postal Code</span>
                  <input type="text" className="input input-bordered" value={entry.zipCode} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, zipCode: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Country</span>
                  <input type="text" className="input input-bordered" value={entry.country} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, country: event.target.value })) }} />
                </label>

                <div className="md:col-span-2 flex items-center justify-between gap-3">
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
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-primary">{entry.label || "Address"}</div>
                  <div className="text-sm">{entry.line1}</div>
                  {entry.line2 ? <div className="text-sm">{entry.line2}</div> : null}
                  <div className="text-sm">{[entry.city, entry.region || entry.state, entry.zipCode, entry.country].filter(Boolean).join(", ")}</div>
                  <label className="mt-2 inline-flex items-center gap-2 text-xs cursor-pointer">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Label</span>
                  <select className="select select-bordered" value={entry.label} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, label: event.target.value })) }}>
                    {selectableLabels.map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Address Line 1</span>
                  <input type="text" className="input input-bordered" value={entry.line1} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, line1: event.target.value })) }} />
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Address Line 2</span>
                  <input type="text" className="input input-bordered" value={entry.line2} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, line2: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">City</span>
                  <input type="text" className="input input-bordered" value={entry.city} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, city: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">State/Region</span>
                  <input type="text" className="input input-bordered" value={entry.region || entry.state} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, region: event.target.value, state: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Postal Code</span>
                  <input type="text" className="input input-bordered" value={entry.zipCode} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, zipCode: event.target.value })) }} />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Country</span>
                  <input type="text" className="input input-bordered" value={entry.country} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, country: event.target.value })) }} />
                </label>

                <div className="md:col-span-2 flex items-center justify-between gap-3">
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

      <button type="button" className="btn btn-outline btn-sm" onClick={addEntry}>Add Address</button>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Address Contacts"}
        </button>
        {resultMessage ? <span className="text-success text-sm">{resultMessage}</span> : null}
        {errorMessage ? <span className="text-error text-sm">{errorMessage}</span> : null}
      </div>
    </form>
  )
}
