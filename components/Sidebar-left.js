/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { PanelLeft, Search, ShoppingCart } from "lucide-react"
import { useLayout } from "./LayoutProvider"
import { useCart } from "@/components/cart/CartContext"
import { hasExplicitWarning, extractContentWarnings } from "@/components/social/ContentTags"
import SidePanel from "@/components/sidebar/SidePanel"
import EdgeTab from "@/components/sidebar/EdgeTab"
import SidebarRow from "@/components/sidebar/SidebarRow"
import SidebarFavorites from "@/components/sidebar/SidebarFavorites"
import { filterSidebarItems } from "@/utils/sidebarFilter"

export const BROWSE_PANEL_ID = "tag-browse-panel"
const ROWS_PER_SECTION = 6
const DEFAULT_FILTERS = [
  { label: "All art", value: "-1" },
  { label: "Paintings", value: "3" },
  { label: "Sculpture", value: "30" },
]

function listingRow(listing, onAddToCart) {
  const artist = listing?.artist || listing?.vendor || {}
  const href = listing?.artist?.path && listing?.path ? `/artists/${listing.artist.path}/listings/${listing.path}` : "/art/"
  const price = Number(listing?.price || 0)
  return {
    key: listing?.id || listing?.listingID || listing?.path || listing?.title,
    href,
    title: listing?.title || "Untitled listing",
    meta: artist?.title || artist?.name || "",
    media: { kind: "thumb", src: listing?.profilePic?.url || listing?.defaultImageURL || listing?.image || "" },
    explicit: hasExplicitWarning(extractContentWarnings(listing)),
    price,
    action: price > 0 ? (
      <button
        type="button"
        className="tag-row__action"
        aria-label={`Add ${listing?.title || "listing"} to cart`}
        title="Add to cart"
        onClick={() => onAddToCart(listing)}
      >
        <ShoppingCart aria-hidden="true" />
      </button>
    ) : null,
  }
}

function artistRow(artist) {
  return {
    key: artist?.id || artist?.artistID || artist?.path || artist?.title,
    href: artist?.path ? `/artists/${artist.path}` : "/artists",
    title: artist?.title || "Untitled artist",
    meta: artist?.byline || artist?.locationSummary || "",
    media: { kind: "avatar", src: artist?.profilePic?.url || artist?.profilePic?.URL || artist?.profilePicUrl || "" },
  }
}

function eventRow(event) {
  const location = typeof event?.location === "string" ? event.location : event?.location?.name || event?.venue?.name || ""
  return {
    key: event?.id || event?.eventID || event?.path || event?.title,
    href: event?.href || (event?.path ? `/events/${event.path}` : "/events"),
    title: event?.name || event?.title || "Untitled event",
    meta: location,
    media: { kind: "date", date: event?.date || event?.startDate || event?.startsAt },
  }
}

function RowSection({ id, title, seeAllHref, rows }) {
  if (!rows.length) return null
  return (
    <section className="tag-panel__section" aria-labelledby={id}>
      <h3 id={id} className="tag-panel__section-title">
        {title}
        <Link href={seeAllHref}>See all</Link>
      </h3>
      <ul className="tag-rows">
        {rows.slice(0, ROWS_PER_SECTION).map(({ key, ...row }, index) => (
          <SidebarRow key={key || index} {...row} />
        ))}
      </ul>
    </section>
  )
}

/**
 * Browse panel (left): search, category chips, the visitor's favorites, then compact rows for
 * featured listings, artists and events. Data comes from page props; when a page gives none,
 * listings are fetched the first time the panel opens.
 */
export default function LeftSidebar(props) {
  const artists = props.artists || []
  const events = props.events || []
  const filters = props.filters || DEFAULT_FILTERS
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL

  const { isLeftSidebarVisible, toggleLeftSidebar, toggleRightSidebar } = useLayout()
  const { addToCart } = useCart()
  const router = useRouter()
  const [listings, setListings] = useState(props.listings || [])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("-1")
  const searchInputRef = useRef(null)
  const hasFetchedRef = useRef(false)

  const shouldFetchListings = (!props.contentType || props.contentType === "auto")
    && !props.listings?.length && !artists.length && !events.length

  // Fetch listings on first open only (they used to be downloaded on every page load).
  useEffect(() => {
    if (!isLeftSidebarVisible || !shouldFetchListings || hasFetchedRef.current) return
    hasFetchedRef.current = true
    let cancelled = false
    ;(async () => {
      try {
        //TODO: Change to add new API in backend to fetch top n listings instead of fetching all
        const res = await fetch(`${api_url}listing/`)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()
        if (!cancelled && Array.isArray(data)) setListings(data)
      } catch (error) {
        console.error("Error loading sidebar listings:", error)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [api_url, isLeftSidebarVisible, shouldFetchListings])

  // The header's search button opens this panel and focuses the field.
  useEffect(() => {
    const handleSidebarSearchFocus = () => {
      toggleLeftSidebar(true)
      window.setTimeout(() => searchInputRef.current?.focus(), 350) // after the slide-in
    }
    window.addEventListener("sidebarSearchFocus", handleSidebarSearchFocus)
    return () => window.removeEventListener("sidebarSearchFocus", handleSidebarSearchFocus)
  }, [toggleLeftSidebar])

  function runSearch() {
    router.push(`/search?term=${encodeURIComponent(searchTerm)}`)
  }

  function handleAddToCart(listing) {
    addToCart({ ...listing, id: listing.listingID || listing.id, price: Number(listing.price || 0) }, 1)
    toggleRightSidebar(true)
  }

  // Categories only exist on listings; artists and events are filtered by the search text alone.
  const listingRows = filterSidebarItems(listings, { type: "listings", term: searchTerm, category: activeFilter })
    .map((listing) => listingRow(listing, handleAddToCart))
  const artistRows = filterSidebarItems(artists, { type: "artists", term: searchTerm, category: "-1" }).map(artistRow)
  const eventRows = filterSidebarItems(events, { type: "events", term: searchTerm, category: "-1" }).map(eventRow)
  const nothingFound = searchTerm && !listingRows.length && !artistRows.length && !eventRows.length

  return (
    <>
      <EdgeTab
        side="left"
        label="Browse"
        ariaLabel="Open browse panel"
        icon={<PanelLeft aria-hidden="true" />}
        controls={BROWSE_PANEL_ID}
        expanded={isLeftSidebarVisible}
        onClick={() => toggleLeftSidebar(true)}
      />
      <SidePanel id={BROWSE_PANEL_ID} side="left" title="Browse" open={isLeftSidebarVisible} onClose={() => toggleLeftSidebar(false)}>
        <form
          className="tag-panel__search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            runSearch()
          }}
        >
          <Search className="tag-panel__search-icon" aria-hidden="true" />
          <label className="sr-only" htmlFor="tag-browse-search">Search the guild</label>
          <input
            id="tag-browse-search"
            ref={searchInputRef}
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search art, artists, events…"
            autoComplete="off"
          />
          <button type="submit" className="tag-panel__search-go" aria-label="Search">
            <Search aria-hidden="true" />
          </button>
        </form>

        {filters.length > 0 && (
          <div className="tag-panel__chips" role="group" aria-label="Filter by category">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className="tag-chip"
                aria-pressed={String(activeFilter) === String(filter.value)}
                onClick={() => setActiveFilter(String(filter.value))}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        <SidebarFavorites />

        <RowSection id="tag-browse-listings" title="Featured listings" seeAllHref="/art/" rows={listingRows} />
        <RowSection id="tag-browse-artists" title="Featured artists" seeAllHref="/artists" rows={artistRows} />
        <RowSection id="tag-browse-events" title="Upcoming events" seeAllHref="/events" rows={eventRows} />

        {nothingFound ? (
          <p className="tag-panel__empty-note" role="status">
            Nothing here matches “{searchTerm}”. Press Enter to search the whole guild.
          </p>
        ) : null}
      </SidePanel>
    </>
  )
}
