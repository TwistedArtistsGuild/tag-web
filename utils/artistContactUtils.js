/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { DEFAULT_SOCIALS, DEFAULT_STORES } from "@/components/cards/card_contactList"

export const SOCIAL_HOST_MAP = {
  instagram: ["instagram.com"],
  facebook: ["facebook.com", "fb.com"],
  threads: ["threads.net"],
  x: ["x.com", "twitter.com"],
  youtube: ["youtube.com", "youtu.be"],
  linkedin: ["linkedin.com"],
  tiktok: ["tiktok.com"],
}

export const STORE_HOST_KEYWORDS = [
  "etsy.com",
  "redbubble.com",
  "shopify.com",
  "bigcartel.com",
  "gumroad.com",
  "patreon.com",
  "ko-fi.com",
  "printify.com",
  "printful.com",
]

export function normalizeHttpUrl(value) {
  const raw = String(value || "").trim()
  if (!raw) return ""
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(withProtocol).toString()
  } catch {
    return ""
  }
}

export function getHost(urlValue) {
  const normalized = normalizeHttpUrl(urlValue)
  if (!normalized) return ""
  try {
    return new URL(normalized).hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return ""
  }
}

export function hostMatches(host, domain) {
  return host === domain || host.endsWith(`.${domain}`)
}

export function dedupeLinks(entries = []) {
  const seen = new Set()
  return entries
    .map((entry) => {
      const url = normalizeHttpUrl(entry?.url)
      if (!url) return null
      const key = url.toLowerCase()
      if (seen.has(key)) return null
      seen.add(key)
      return { ...entry, url }
    })
    .filter(Boolean)
}

export function resolveSocialKey(entry) {
  const category = String(entry?.category || "").trim().toLowerCase()
  if (category && SOCIAL_HOST_MAP[category]) {
    return category
  }

  const label = String(entry?.label || "").trim().toLowerCase()
  const host = getHost(entry?.url)

  return (
    Object.keys(SOCIAL_HOST_MAP).find((key) => {
      if (label.includes(key)) return true
      return SOCIAL_HOST_MAP[key].some((domain) => hostMatches(host, domain))
    }) || ""
  )
}

export function isStoreEntry(entry) {
  const category = String(entry?.category || "").trim().toLowerCase()
  if (category.includes("store") || category.includes("shop") || category.includes("commerce")) {
    return true
  }

  const label = String(entry?.label || "").trim().toLowerCase()
  const host = getHost(entry?.url)
  return (
    label.includes("store") ||
    label.includes("shop") ||
    STORE_HOST_KEYWORDS.some((domain) => hostMatches(host, domain))
  )
}

export function pickContactCardData(contactRows = [], primaryPhone = null, primaryAddress = null) {
  const deduped = dedupeLinks(
    contactRows
      .filter((entry) => String(entry?.contactType || "").toLowerCase() === "url")
      .map((entry) => ({
        label: String(entry?.label || entry?.handle || "Website").trim(),
        url: entry?.value || "",
        purpose: String(entry?.description || "").trim(),
        category: String(entry?.category || "").trim(),
        handle: String(entry?.handle || "").trim(),
      }))
  )

  const socials = deduped
    .filter((entry) => Boolean(resolveSocialKey(entry)))
    .map((entry) => {
      const socialKey = resolveSocialKey(entry)
      const socialName = socialKey === "x" ? "X" : socialKey.charAt(0).toUpperCase() + socialKey.slice(1)
      const baseSocial = DEFAULT_SOCIALS.find((s) => s.name.toLowerCase() === socialName.toLowerCase())
      return {
        name: baseSocial?.name || socialName,
        url: entry.url,
        handle: String(entry.handle || entry.label || entry.url).trim(),
        purpose: entry.purpose,
        color: baseSocial?.color || "#4b5563",
        icon: baseSocial?.icon || null,
      }
    })

  const stores = deduped
    .filter((entry) => !resolveSocialKey(entry) && isStoreEntry(entry))
    .map((entry) => ({
      name: String(entry.label || "Store").trim(),
      url: entry.url,
      handle: String(entry.handle || entry.label || "Store").trim(),
      purpose: entry.purpose,
      color:
        DEFAULT_STORES.find(
          (store) => store.name.toLowerCase() === String(entry.label || "").trim().toLowerCase()
        )?.color || "#4b5563",
      icon:
        DEFAULT_STORES.find(
          (store) => store.name.toLowerCase() === String(entry.label || "").trim().toLowerCase()
        )?.icon || null,
    }))

  const contactUrls = deduped.filter((entry) => !resolveSocialKey(entry) && !isStoreEntry(entry))

  const phoneValue = String(
    primaryPhone?.phoneNumber ||
      contactRows.find((entry) => String(entry?.contactType || "").toLowerCase() === "phone")?.value ||
      ""
  ).trim()

  const addressSource =
    primaryAddress ||
    contactRows.find((entry) => String(entry?.contactType || "").toLowerCase() === "address")?.address ||
    null

  const locationParts = addressSource
    ? [addressSource.country, addressSource.region || addressSource.state, addressSource.city]
        .map((part) => String(part || "").trim())
        .filter(Boolean)
    : []

  const primaryAddressParts = addressSource
    ? [
        addressSource.addressLine1 || addressSource.line1,
        addressSource.addressLine2 || addressSource.line2,
        addressSource.city,
        addressSource.region || addressSource.state,
        addressSource.zipCode || addressSource.postalCode,
        addressSource.country,
      ]
        .map((part) => String(part || "").trim())
        .filter(Boolean)
    : []

  return {
    socials,
    stores,
    contactInfo: {
      phone: phoneValue,
      location: locationParts.join(" / "),
      primaryAddressText: primaryAddressParts.join(", "),
      customUrls: contactUrls.map((entry) => ({
        label: entry.label,
        url: entry.url,
        purpose: entry.purpose,
      })),
    },
  }
}
