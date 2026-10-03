/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import ContactCard, { DEFAULT_SOCIALS, DEFAULT_STORES } from "@/components/cards/card_contactList"
import ArtistCardSmall from "@/components/cards/card_artist_small"
import serverFetch from "@/libs/serverFetch"
import TagSEO from "@/components/TagSEO"

const SOCIAL_HOST_MAP = {
  instagram: ["instagram.com"],
  facebook: ["facebook.com", "fb.com"],
  threads: ["threads.net"],
  x: ["x.com", "twitter.com"],
  youtube: ["youtube.com", "youtu.be"],
  linkedin: ["linkedin.com"],
  tiktok: ["tiktok.com"],
}

const STORE_HOST_KEYWORDS = [
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

const STORE_LABEL_KEYWORDS = ["shop", "store", "etsy", "redbubble", "shopify", "gumroad", "patreon", "ko-fi"]

function normalizeHttpUrl(value) {
  const raw = String(value || "").trim()
  if (!raw) return ""
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    return new URL(withProtocol).toString()
  } catch {
    return ""
  }
}

function getHost(urlValue) {
  const normalized = normalizeHttpUrl(urlValue)
  if (!normalized) return ""
  try {
    return new URL(normalized).hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return ""
  }
}

function hostMatches(host, domain) {
  return host === domain || host.endsWith(`.${domain}`)
}

function resolveSocialKey(entry) {
  const category = String(entry?.category || "").trim().toLowerCase()
  if (category && SOCIAL_HOST_MAP[category]) {
    return category
  }

  const label = String(entry?.label || "").trim().toLowerCase()
  const host = getHost(entry?.url)

  return Object.keys(SOCIAL_HOST_MAP).find((key) => {
    if (label.includes(key)) return true
    return SOCIAL_HOST_MAP[key].some((domain) => hostMatches(host, domain))
  }) || ""
}

function isStoreEntry(entry) {
  const category = String(entry?.category || "").trim().toLowerCase()
  if (category.includes("store") || category.includes("shop") || category.includes("commerce")) {
    return true
  }

  const label = String(entry?.label || "").trim().toLowerCase()
  if (STORE_LABEL_KEYWORDS.some((keyword) => label.includes(keyword))) {
    return true
  }

  const host = getHost(entry?.url)
  return STORE_HOST_KEYWORDS.some((domain) => hostMatches(host, domain))
}

function dedupeUrlEntries(entries = []) {
  const seen = new Set()
  const deduped = []

  for (const entry of entries) {
    const normalizedUrl = normalizeHttpUrl(entry?.url)
    if (!normalizedUrl) continue

    const key = normalizedUrl.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)

    deduped.push({
      ...entry,
      url: normalizedUrl,
    })
  }

  return deduped
}

function createFallbackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M256 64a192 192 0 1 0 0 384 192 192 0 1 0 0-384zm0 336c-14 0-30.1-25.8-40.8-72H296.8c-10.7 46.2-26.8 72-40.8 72zm-47.7-120c-1.5-15.6-1.5-32.4 0-48h95.4c1.5 15.6 1.5 32.4 0 48H208.3zm-95.8 0c3.9-28.6 15.6-54.6 33.2-75.7 8.6 10.9 20.7 19.8 35.5 26.1-1.9 16.1-2 33.3-.1 49.6H112.5zm289 0h-68.6c1.9-16.3 1.8-33.5-.1-49.6 14.8-6.3 26.9-15.2 35.5-26.1 17.6 21.1 29.3 47.1 33.2 75.7zm-47.8-117.2c-4.8 8-11.9 14.8-20.8 19.9-4.2-18.7-10.4-35.3-18.1-49.1 15.3 7.2 28.8 17.8 38.9 29.2zm-156.5-29.2c-7.7 13.8-13.9 30.4-18.1 49.1-8.9-5.1-16-11.9-20.8-19.9 10.1-11.4 23.6-22 38.9-29.2z" />
    </svg>
  )
}

function mapSocials(entries = []) {
  const socialByName = new Map(DEFAULT_SOCIALS.map((social) => [social.name.toLowerCase(), social]))

  return entries
    .map((entry) => {
      const socialKey = resolveSocialKey(entry)
      if (!socialKey) return null
      const base = socialByName.get(socialKey) || socialByName.get(socialKey === "x" ? "x" : socialKey)

      return {
        name: base?.name || String(entry?.label || socialKey || "Follow").trim(),
        url: entry.url,
        handle: String(entry?.handle || entry?.label || entry.url).trim(),
        purpose: String(entry?.purpose || "").trim(),
        color: base?.color || "#4b5563",
        icon: base?.icon || createFallbackIcon(),
      }
    })
    .filter(Boolean)
}

function mapStores(entries = []) {
  const storeByName = new Map(DEFAULT_STORES.map((store) => [store.name.toLowerCase(), store]))

  return entries.map((entry) => {
    const label = String(entry?.label || "Store").trim()
    const byLabel = storeByName.get(label.toLowerCase())
    const byDomain = DEFAULT_STORES.find((store) => getHost(entry.url).includes(store.name.toLowerCase()))
    const base = byLabel || byDomain

    return {
      name: base?.name || label,
      url: entry.url,
      handle: String(entry?.handle || label).trim(),
      purpose: String(entry?.purpose || "").trim(),
      color: base?.color || "#4b5563",
      icon: base?.icon || createFallbackIcon(),
    }
  })
}

const ContactsPage = ({ links, slug, artistSummary, email, location, phone, primaryAddressText }) => {
  const safeLinks = Array.isArray(links) ? links : []
  const dedupedLinks = dedupeUrlEntries(safeLinks)

  const socialEntries = dedupedLinks.filter((entry) => Boolean(resolveSocialKey(entry)))
  const storeEntries = dedupedLinks.filter((entry) => !resolveSocialKey(entry) && isStoreEntry(entry))
  const contactUrlEntries = dedupedLinks.filter((entry) => !resolveSocialKey(entry) && !isStoreEntry(entry))

  const socials = mapSocials(socialEntries)
  const stores = mapStores(storeEntries)

  const defaultContactInfo = {
    email: email || "",
    location: location || "",
    phone: phone || "",
    primaryAddressText: primaryAddressText || "",
    customUrls: [],
  }

  const normalizedCustomUrls = contactUrlEntries.map((entry) => ({
    label: String(entry?.label || "Website").trim(),
    url: entry.url,
    purpose: String(entry?.purpose || "").trim(),
  }))

  const contactInfo = {
    ...defaultContactInfo,
    customUrls: normalizedCustomUrls,
  }

  return (
    <div className="card bg-base-100 text-base-content border border-base-300 shadow-lg p-4 rounded-box">
			<TagSEO metadataProp={{ title: "Artist Contacts", description: "Contact details and links for this artist.", keywords: "artists, contacts, art community", og: { title: "Artist Contacts", description: "Contact details and links for this artist." } }} canonicalSlug="artists/[slug]/contacts" />
      <div className="mb-4">
        <ArtistCardSmall
          artist={{
            title: artistSummary?.title || "Satarah",
            byline: artistSummary?.byline || "Satarah Productions",
            locationSummary: location || "",
            phoneDisplay: phone || "",
            path: slug,
            profilePic: {
              url: artistSummary?.profilePic?.url || "/blank_image.png",
              alttext: artistSummary?.profilePic?.alttext || `${artistSummary?.title || "Artist"} profile picture`,
            },
          }}
        />
      </div>
      <ContactCard
        compact={false}
        showIdentity={false}
        socials={socials}
        stores={stores}
        contactInfo={contactInfo}
      />
    </div>
  )
}

ContactsPage.getInitialProps = async (context) => {
  const { slug } = context.query

  const defaultArtistSummary = {
    title: "Satarah",
    byline: "Satarah Productions",
    profilePic: {
      url: "/blank_image.png",
      alttext: "Satarah profile picture",
    },
  }

  try {
    const profileResponse = await serverFetch(`/artist/${slug}/profile`)
    const profileData = profileResponse.ok ? await profileResponse.json() : {}
    const artistID = Number(profileData?.artist?.artistID || profileData?.artist?.ArtistID || 0)

    let links = []
    let email = ""
    let location = ""
    let phone = ""
    let primaryAddressText = ""

    if (artistID > 0) {
      const dbContactsResponse = await serverFetch(`/contact/artist/${artistID}`)

      if (dbContactsResponse.ok) {
        const dbContactsData = await dbContactsResponse.json()
        const dbContactRows = Array.isArray(dbContactsData?.contacts) ? dbContactsData.contacts : []

        links = dbContactRows
          .filter((entry) => String(entry?.contactType || "").toLowerCase() === "url")
          .map((entry) => {
            const rawUrl = String(entry?.value || "").trim()
            if (!rawUrl) {
              return null
            }

            return {
              label: String(entry?.label || entry?.handle || "Website").trim(),
              url: /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`,
              purpose: String(entry?.description || "").trim(),
              category: String(entry?.category || "").trim(),
              handle: String(entry?.handle || "").trim(),
            }
          })
          .filter(Boolean)

        const emailEntry = dbContactRows.find((entry) => String(entry?.contactType || "").toLowerCase() === "email")
        email = String(emailEntry?.value || "").trim()

        const firstPhone = dbContactRows.find((entry) => String(entry?.contactType || "").toLowerCase() === "phone")
        phone = String(firstPhone?.value || "").trim()

        const firstAddress = dbContactRows.find((entry) => String(entry?.contactType || "").toLowerCase() === "address")
        const addressSource = firstAddress?.address || null

        if (addressSource) {
          const addressParts = [
            addressSource.addressLine1 || addressSource.line1,
            addressSource.addressLine2 || addressSource.line2,
            addressSource.city,
            addressSource.region || addressSource.state,
            addressSource.zipCode || addressSource.postalCode,
            addressSource.country,
          ]
            .map((part) => String(part || "").trim())
            .filter(Boolean)

          primaryAddressText = addressParts.join(", ")

          const locationParts = [
            addressSource.country,
            addressSource.region || addressSource.state,
            addressSource.city,
          ]
            .map((part) => String(part || "").trim())
            .filter(Boolean)

          location = locationParts.join(" / ")
        }
      }
    }

    // Backward-compatible fallback while transitioning all artists to new contact records.
    if (links.length === 0) {
      const legacyContactsResponse = await serverFetch(`/artists/${slug}/contacts`)
      const legacyContactsData = legacyContactsResponse.ok ? await legacyContactsResponse.json() : { links: [] }
      links = Array.isArray(legacyContactsData?.links) ? legacyContactsData.links : []
    }

    const artistSummary = {
      title: profileData?.artist?.title || defaultArtistSummary.title,
      byline: profileData?.artist?.byline || defaultArtistSummary.byline,
      profilePic: profileData?.profilePic || defaultArtistSummary.profilePic,
    }

    return { links, slug, artistSummary, email, location, phone, primaryAddressText }
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return { links: [], slug, artistSummary: defaultArtistSummary, email: "", location: "", phone: "", primaryAddressText: "" }
  }
}

export default ContactsPage

