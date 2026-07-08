/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, useRef, useState } from "react"

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

function makeInitialEntries(existingContacts = [], defaultScope = "secondary", defaultLabel = "Address") {
  const sorted = sortByScopeAndOrder(existingContacts)
  const entries = sorted.map((contact, index) => {
    const rawCountry = String(contact?.address?.country || "").trim()
    const rawRegion = String(contact?.address?.region || contact?.address?.state || "").trim()

    return {
      id: `address-${index}`,
      label: String(contact?.label || defaultLabel).trim(),
      description: String(contact?.description || "").trim(),
      line1: String(contact?.address?.line1 || "").trim(),
      line2: String(contact?.address?.line2 || "").trim(),
      city: String(contact?.address?.city || "").trim(),
      state: rawRegion,
      region: rawRegion,
      zipCode: String(contact?.address?.postalCode || "").trim(),
      country: rawCountry,
      operationHours: String(contact?.address?.hours || "").trim(),
      scope: scopeFromContact(contact, defaultScope),
      mode: contact?.address?.line1 ? "display" : "edit",
    }
  })

  if (entries.length === 0) {
    return [{
      id: "address-0",
      label: String(defaultLabel || "Address"),
      description: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      region: "",
      zipCode: "",
      country: "",
      operationHours: "",
      scope: normalizeScope(defaultScope),
      mode: "edit",
    }]
  }

  return entries
}

export default function AddressForm({
  context = "artist",
  entityID,
  artistID,
  existingContacts = [],
  onSaved,
  defaultScope = "secondary",
  availableScopes = ["private", "primary", "secondary"],
  primaryCityStateRequired = false,
  warnOnPublicHomeLabel = false,
  defaultLabel = "office",
  requireCityStateCountry = false,
  requireFullAddressFields = false,
  singleEntryOnly = false,
  scopeLabelMap = {},
  hideDeleteAction = false,
}) {
  const resolvedContext = String(context || "artist").trim().toLowerCase() || "artist"
  const resolvedEntityId = Number(entityID || artistID || 0)
  const normalizedDefaultLabel = String(defaultLabel || "Address").trim() || "Address"
  const canChooseScope = availableScopes.length > 1
  const initialEntries = useMemo(
    () => makeInitialEntries(existingContacts, defaultScope, normalizedDefaultLabel),
    [defaultScope, existingContacts, normalizedDefaultLabel]
  )
  const [labelOptions, setLabelOptions] = useState([])

  const [entries, setEntries] = useState(initialEntries)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultMessage, setResultMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [homePublicOverride, setHomePublicOverride] = useState(false)
  const [entryValidationErrors, setEntryValidationErrors] = useState({})
  const [flashValidation, setFlashValidation] = useState(false)
  const formRef = useRef(null)

  const getScopeLabel = (scope) => {
    const normalized = normalizeScope(scope, defaultScope)
    return scopeLabelMap?.[normalized] || CONTACT_SCOPE_OPTIONS.find((option) => option.value === normalized)?.label || "Secondary"
  }

  useEffect(() => {
    const nextEntries = makeInitialEntries(existingContacts, defaultScope, normalizedDefaultLabel)
    setEntries(singleEntryOnly ? nextEntries.slice(0, 1) : nextEntries)
    setHasUnsavedChanges(false)
    setHomePublicOverride(false)
  }, [defaultScope, existingContacts, normalizedDefaultLabel, singleEntryOnly])

  useEffect(() => {
    let ignore = false
    const loadLabels = async () => {
      try {
        const response = await fetch(`/api/contactlabel`)
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
  })

  const updateEntry = (entryId, updateFn) => {
    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? updateFn(entry) : entry)))
  }

  const clearFieldError = (entryId, field) => {
    setEntryValidationErrors((prev) => {
      const current = prev?.[entryId]
      if (!current || !current[field]) {
        return prev
      }

      const next = { ...prev }
      const nextEntry = { ...current, [field]: false }
      const hasAnyError = Object.values(nextEntry).some(Boolean)
      if (!hasAnyError) {
        delete next[entryId]
      } else {
        next[entryId] = nextEntry
      }
      return next
    })
  }

  const triggerValidationFlash = (message, nextErrors = {}) => {
    setErrorMessage(message)
    setEntryValidationErrors(nextErrors)
    setFlashValidation(true)
    setTimeout(() => {
      const firstErroredInput = formRef.current?.querySelector(".input-error")
      if (firstErroredInput) {
        firstErroredInput.scrollIntoView({ behavior: "smooth", block: "center" })
        firstErroredInput.focus()
      }
    }, 0)
    setTimeout(() => setFlashValidation(false), 900)
  }

  const hasPublicHomeLabel = useMemo(
    () => entries.some((entry) => {
      const normalizedLabel = String(entry?.label || "").trim().toLowerCase()
      return normalizeScope(entry?.scope, defaultScope) !== "private" && normalizedLabel === "home"
    }),
    [defaultScope, entries]
  )

  useEffect(() => {
    if (!hasPublicHomeLabel && homePublicOverride) {
      setHomePublicOverride(false)
    }
  }, [hasPublicHomeLabel, homePublicOverride])

  const addEntry = () => {
    if (singleEntryOnly) {
      return
    }

    setEntries((prev) => ([
      ...prev,
      {
        id: `address-${Date.now()}`,
        label: normalizedDefaultLabel,
        description: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        region: "",
        zipCode: "",
        country: "",
        operationHours: "",
        scope: normalizeScope(defaultScope),
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
    setEntryValidationErrors({})

    if (!resolvedEntityId) {
      setErrorMessage("Contact context is missing.")
      return
    }

    const primaryEntry = entries[0]
    if (primaryCityStateRequired && primaryEntry) {
      const primaryCity = String(primaryEntry.city || "").trim()
      const primaryRegion = String(primaryEntry.region || primaryEntry.state || "").trim()

      if (!primaryCity || !primaryRegion) {
        triggerValidationFlash("Primary public address requires both city and state/region.", {
          [primaryEntry.id]: {
            city: !primaryCity,
            region: !primaryRegion,
            country: false,
          },
        })
        return
      }
    }

    if (warnOnPublicHomeLabel && hasPublicHomeLabel && !homePublicOverride) {
      triggerValidationFlash("Home is set as a public address label. Confirm override to publish it.")
      return
    }

    const candidateEntries = singleEntryOnly ? entries.slice(0, 1) : entries
    const entriesToSubmit = candidateEntries.filter((entry, index) => {
      if (index === 0) {
        return true
      }

      const hasAnyValue = [
        entry.line1,
        entry.line2,
        entry.city,
        entry.region,
        entry.state,
        entry.zipCode,
        entry.country,
      ].some((value) => String(value || "").trim().length > 0)

      return hasAnyValue
    })

    if (requireCityStateCountry || requireFullAddressFields) {
      const requiredFieldErrors = {}
      const invalidEntry = entriesToSubmit.find((entry) => {
        const line1 = String(entry.line1 || "").trim()
        const city = String(entry.city || "").trim()
        const countryValue = String(entry.country || "").trim()
        const regionValue = String(entry.region || entry.state || "").trim()
        const postalCode = String(entry.zipCode || "").trim()
        const hasError = requireFullAddressFields
          ? (!line1 || !city || !regionValue || !postalCode || !countryValue)
          : (!city || !regionValue || !countryValue)
        if (hasError) {
          requiredFieldErrors[entry.id] = {
            line1: requireFullAddressFields ? !line1 : false,
            city: !city,
            region: !regionValue,
            zipCode: requireFullAddressFields ? !postalCode : false,
            country: !countryValue,
          }
        }
        return hasError
      })

      if (invalidEntry) {
        triggerValidationFlash(
          requireFullAddressFields
            ? "Missing required fields: Address Line 1, city, state/region, postal code, and country are required."
            : "Missing required fields: city, state/region, and country are required.",
          requiredFieldErrors
        )
        return
      }
    }

    const payloadEntries = entriesToSubmit
      .map((entry, index) => {
        const isPrimary = index === 0
        const isPrimaryCityStateRequired = primaryCityStateRequired && isPrimary

        const city = String(entry.city || "").trim()
        const countryValue = String(entry.country || "").trim()
        const regionValue = String(entry.region || entry.state || "").trim()
        const rawLine1 = String(entry.line1 || "").trim()
        const addressLine1 = (isPrimaryCityStateRequired || requireCityStateCountry) && !requireFullAddressFields
          ? (rawLine1 || [city, regionValue, countryValue].filter(Boolean).join(", "))
          : rawLine1

        if (!addressLine1) return null

        return {
          context: resolvedContext,
          entityID: resolvedEntityId,
          contactType: "address",
          label: resolveLabelForSubmit(entry.label),
          category: "address",
          description: entry.description.trim() || null,
          addressLine1,
          addressLine2: entry.line2.trim() || null,
          city: city || null,
          state: regionValue || null,
          region: regionValue || null,
          zipCode: entry.zipCode.trim() || null,
          country: countryValue || null,
          operationHours: entry.operationHours.trim() || null,
          isPrivate: normalizeScope(entry.scope, defaultScope) === "private",
          displayOrder: singleEntryOnly ? 0 : index,
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
        const response = await fetch(`/api/contact/manage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const errJson = await response.json().catch(() => null)
          const errText = typeof errJson === "string"
            ? errJson
            : (errJson?.message || errJson?.error || "")
          const statusText = response.status ? ` (${response.status})` : ""
          throw new Error(errText || `Unable to save address contacts${statusText}`)
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

  return (
    <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
      {hasUnsavedChanges ? (
        <div className="alert alert-warning text-sm">Changes are not applied until you click Save Address Contacts.</div>
      ) : null}

      {errorMessage ? (
        <div className={`alert alert-error text-sm ${flashValidation ? "animate-pulse" : ""}`}>
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {warnOnPublicHomeLabel && hasPublicHomeLabel ? (
        <div className="alert alert-warning text-sm">
          <div className="space-y-2">
            <div>Home is marked as a public location label. This may expose personal location details.</div>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={homePublicOverride}
                onChange={(event) => {
                  setHasUnsavedChanges(true)
                  setHomePublicOverride(event.target.checked)
                }}
              />
              <span>I understand and want to publish Home anyway.</span>
            </label>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <div className="rounded-box border border-primary/40 bg-primary/5 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary">Lead Address Entry</div>
          <div className="text-xs text-base-content/70">{canChooseScope ? "Set scope to Primary only if this address should be the direct linked contact location." : "This address will be saved as a private contact."}</div>
        </div>

        {entries.slice(0, 1).map((entry) => (
          <div key={entry.id} className="rounded-box border border-primary/40 bg-base-100 p-4">
            {entry.mode === "display" ? (
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-primary">{entry.label || "Address"}</div>
                  {entry.line1 ? <div className="text-sm">{entry.line1}</div> : null}
                  {entry.line2 ? <div className="text-sm">{entry.line2}</div> : null}
                  <div className="text-sm">{[entry.city, entry.region || entry.state, entry.zipCode, entry.country].filter(Boolean).join(", ")}</div>
                  {primaryCityStateRequired ? (
                    <div className="text-xs text-base-content/60 mt-1">City and state/region are required for the primary public address.</div>
                  ) : null}
                  <div className="text-xs text-base-content/60 mt-1">Scope: {getScopeLabel(entry.scope)}</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Label</span>
                  <select className="select select-bordered" value={entry.label} onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, label: event.target.value })) }}>
                    {selectableLabels.map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </label>
                {primaryCityStateRequired ? (
                  <div className="md:col-span-2 rounded-box border border-base-300 bg-base-200/60 p-2 text-xs text-base-content/70">
                    Public primary address requires at least city and state/region.
                  </div>
                ) : null}
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Address Line 1{requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.line1 ? "input-error" : ""}`}
                    name={`address-line1-${entry.id}`}
                    autoComplete={`section-${entry.id} address-line1`}
                    value={entry.line1}
                    onChange={(event) => { setHasUnsavedChanges(true); clearFieldError(entry.id, "line1"); updateEntry(entry.id, (old) => ({ ...old, line1: event.target.value })) }}
                  />
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Address Line 2</span>
                  <input
                    type="text"
                    className="input input-bordered"
                    name={`address-line2-${entry.id}`}
                    autoComplete={`section-${entry.id} address-line2`}
                    value={entry.line2}
                    onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, line2: event.target.value })) }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">City{requireCityStateCountry || requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.city ? "input-error" : ""}`}
                    name={`city-${entry.id}`}
                    autoComplete={`section-${entry.id} address-level2`}
                    value={entry.city}
                    onChange={(event) => { setHasUnsavedChanges(true); clearFieldError(entry.id, "city"); updateEntry(entry.id, (old) => ({ ...old, city: event.target.value })) }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">State/Region{requireCityStateCountry || requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.region ? "input-error" : ""}`}
                    name={`region-${entry.id}`}
                    autoComplete={`section-${entry.id} address-level1`}
                    value={entry.region || entry.state}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      clearFieldError(entry.id, "region")
                      updateEntry(entry.id, (old) => ({ ...old, region: event.target.value, state: event.target.value }))
                    }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Postal Code{requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.zipCode ? "input-error" : ""}`}
                    name={`postal-code-${entry.id}`}
                    autoComplete={`section-${entry.id} postal-code`}
                    value={entry.zipCode}
                    onChange={(event) => { setHasUnsavedChanges(true); clearFieldError(entry.id, "zipCode"); updateEntry(entry.id, (old) => ({ ...old, zipCode: event.target.value })) }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Country{requireCityStateCountry || requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.country ? "input-error" : ""}`}
                    name={`country-${entry.id}`}
                    autoComplete={`section-${entry.id} country`}
                    value={entry.country}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      clearFieldError(entry.id, "country")
                      updateEntry(entry.id, (old) => ({ ...old, country: event.target.value }))
                    }}
                  />
                </label>

                <div className="md:col-span-2 flex items-center justify-between gap-3">
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
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-primary">{entry.label || "Address"}</div>
                  <div className="text-sm">{entry.line1}</div>
                  {entry.line2 ? <div className="text-sm">{entry.line2}</div> : null}
                  <div className="text-sm">{[entry.city, entry.region || entry.state, entry.zipCode, entry.country].filter(Boolean).join(", ")}</div>
                  <div className="text-xs text-base-content/60 mt-1">Scope: {getScopeLabel(entry.scope)}</div>
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
                  <span className="label-text mb-1">Address Line 1{requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.line1 ? "input-error" : ""}`}
                    name={`address-line1-${entry.id}`}
                    autoComplete={`section-${entry.id} address-line1`}
                    value={entry.line1}
                    onChange={(event) => { setHasUnsavedChanges(true); clearFieldError(entry.id, "line1"); updateEntry(entry.id, (old) => ({ ...old, line1: event.target.value })) }}
                  />
                </label>
                <label className="form-control md:col-span-2">
                  <span className="label-text mb-1">Address Line 2</span>
                  <input
                    type="text"
                    className="input input-bordered"
                    name={`address-line2-${entry.id}`}
                    autoComplete={`section-${entry.id} address-line2`}
                    value={entry.line2}
                    onChange={(event) => { setHasUnsavedChanges(true); updateEntry(entry.id, (old) => ({ ...old, line2: event.target.value })) }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">City{requireCityStateCountry || requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.city ? "input-error" : ""}`}
                    name={`city-${entry.id}`}
                    autoComplete={`section-${entry.id} address-level2`}
                    value={entry.city}
                    onChange={(event) => { setHasUnsavedChanges(true); clearFieldError(entry.id, "city"); updateEntry(entry.id, (old) => ({ ...old, city: event.target.value })) }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">State/Region{requireCityStateCountry || requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.region ? "input-error" : ""}`}
                    name={`region-${entry.id}`}
                    autoComplete={`section-${entry.id} address-level1`}
                    value={entry.region || entry.state}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      clearFieldError(entry.id, "region")
                      updateEntry(entry.id, (old) => ({ ...old, region: event.target.value, state: event.target.value }))
                    }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Postal Code{requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.zipCode ? "input-error" : ""}`}
                    name={`postal-code-${entry.id}`}
                    autoComplete={`section-${entry.id} postal-code`}
                    value={entry.zipCode}
                    onChange={(event) => { setHasUnsavedChanges(true); clearFieldError(entry.id, "zipCode"); updateEntry(entry.id, (old) => ({ ...old, zipCode: event.target.value })) }}
                  />
                </label>
                <label className="form-control">
                  <span className="label-text mb-1">Country{requireCityStateCountry || requireFullAddressFields ? " *" : ""}</span>
                  <input
                    type="text"
                    className={`input input-bordered ${entryValidationErrors?.[entry.id]?.country ? "input-error" : ""}`}
                    name={`country-${entry.id}`}
                    autoComplete={`section-${entry.id} country`}
                    value={entry.country}
                    onChange={(event) => {
                      setHasUnsavedChanges(true)
                      clearFieldError(entry.id, "country")
                      updateEntry(entry.id, (old) => ({ ...old, country: event.target.value }))
                    }}
                  />
                </label>

                <div className="md:col-span-2 flex items-center justify-between gap-3">
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

      {!singleEntryOnly ? <button type="button" className="btn btn-outline btn-sm" onClick={addEntry}>Add Address</button> : null}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Address Contacts"}
        </button>
        {resultMessage ? <span className="text-success text-sm">{resultMessage}</span> : null}
      </div>
    </form>
  )
}
