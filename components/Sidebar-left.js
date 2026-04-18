/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/ 
"use client"

import { useState, useEffect } from "react"
import { useLayout } from "./LayoutProvider"
import ArtistCardSmall from "@/components/cards/card_artist_small"
import ListingCardSmall from "@/components/cards/card_listing_small"
import { useRouter } from "next/router"

export default function LeftSidebar(props) {
  // Since MyLayout.js spreads the leftSidebarData, we access props directly
  const artists = props.artists || [];
  const [listings, setDisplayListings] = useState(props.listings || []);
  const [displayType, setDisplayType] = useState("auto");
  const events = props.events || [];
  const filters = props.filters || [
    { label: "All Art", value: "-1" },
    { label: "Paintings", value: "3" },
    { label: "Sculpture", value: "30" },
  ];
  const api_url = process.env.NEXT_PUBLIC_TAG_API_URL;

 useEffect(() => {
  // Auto-detect content type if not specified
     const resolveContent = async () => {
    // 2. Logic: If we already have data from props, use it.
    if (props.contentType && props.contentType !== "auto") {
        setDisplayType(props.contentType);
        return;
    }
      if (artists.length > 0) {
          setDisplayType("artists");
      } else if (events.length > 0) {
          setDisplayType("events");
      } else if (props.listings && props.listings.length > 0) {
          setDisplayType("listings");
      } else {
          try {
              // Fetch the listings data
              let status = 200
              const res = await fetch(`${api_url}listing/`);
              //TODO: Change to add new API in backend to fetch top n listings instead of fetching all
              //listings and filter top 5 to show
              status = res.status
              if (!res.ok) {
                  throw new Error(`HTTP error! status: ${status}`)
              }
              const data = await res.json();
              setDisplayListings(data);
              setDisplayType("listings");
          } catch (error) {
              console.error('Error in getInitialProps:', error);
              setDisplayType("none");
          }
      }
     }
     resolveContent();
 }, [props.listings, props.artists, props.events]); // Re-run if props change

  // Render content based on type
  const renderContent = () => {
    // 1. Create a helper function to filter based on the active state
    const filterItem = (item) => {
        if (activeFilter === "-1" || activeFilter === -1) return true;
       
        const itemType = item.artCategoryID;

        return String(itemType) === String(activeFilter);
    }; 
    switch (displayType) {
      case "listings":
        return (
          <>
            <h3 className="font-medium text-base-content mb-3">Featured Listings</h3>
            {listings.filter(filterItem).map((listing, index) => (
              <ListingCardSmall key={listing.id || index} listing={listing} />
            ))}
          </>
        );
      case "artists":
        return (
          <>
            <h3 className="font-medium text-base-content mb-3">Featured Artists</h3>
            {artists.map((artist, index) => (
              <ArtistCardSmall key={artist.id || index} artist={artist} />
            ))}
          </>
        );
      case "events":
        return (
          <>
            <h3 className="font-medium text-base-content mb-3">Upcoming Events</h3>
            {events.map((event, index) => (
              <div key={event.id || index} className="card card-compact bg-base-100 shadow">
                <div className="card-body">
                  <h4 className="font-medium text-sm">{event.name}</h4>
                  <p className="text-xs text-base-content/60">{event.date}</p>
                  <p className="text-xs">{event.location}</p>
                </div>
              </div>
            ))}
          </>
        );
      default:
        return (          
            <>
                <h3 className="font-medium text-base-content mb-3">Featured Listings</h3>
                {listings.filter(filterItem).map((listing, index) => (
                    <ListingCardSmall key={listing.id || index} listing={listing} />
                ))}
            </>
        );
    }
  };
  
  const { isLeftSidebarVisible, toggleLeftSidebar, isMobile, isHeaderVisible } = useLayout()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("-1")
  const router = useRouter()

  const topOffset = isHeaderVisible ? "top-20" : "top-0"

  return (
    <>
      {/* Open Button - Left Edge of Screen when closed */}
      {!isLeftSidebarVisible && (
        <button
          onClick={toggleLeftSidebar}
          className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-primary text-primary-content px-2 py-4 rounded-r-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Show left sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Left Sidebar */}
      <aside
        className={`
          fixed ${topOffset} bottom-0 left-0 w-80 bg-base-200 border-r border-base-content/10 z-30
          transition-transform duration-300 ease-in-out
          ${isLeftSidebarVisible ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "w-full" : "w-80"}
          h-screen overflow-y-auto
        `}
      >
        {/* Theme-reactive accent strip */}
        <div className="sidebar-accent" />

        {/* Close Button - Right Edge Center of Sidebar when open */}
        {isLeftSidebarVisible && (
          <button
            onClick={toggleLeftSidebar}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-base-200 text-base-content hover:bg-base-300 px-2 py-4 rounded-r-lg border border-base-content/10 shadow-md transition-all duration-300 hover:scale-105 z-40 touch-manipulation"
            aria-label="Hide left sidebar"
            style={{ touchAction: 'manipulation' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Sidebar Header */}
        <div className="sidebar-inner-header flex items-center justify-between p-4 border-b border-base-content/10 bg-base-300">
          <h2 className="font-semibold text-lg text-base-content">Navigation & Filters</h2>
          {/* Mobile close button in header */}
          {isMobile && (
            <button
              onClick={toggleLeftSidebar}
              className="btn btn-sm btn-circle btn-ghost touch-manipulation"
              aria-label="Close sidebar"
              style={{ touchAction: 'manipulation' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Section */}
        <div className="p-2 border-b border-base-content/10 bg-base-100">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="input input-bordered input-xs flex-1"
              onKeyDown={e => { if (e.key === 'Enter') { router.push(`/search?term=${encodeURIComponent(searchTerm)}`) } }}
            />
            <button
              className="btn btn-primary btn-xs"
              onClick={() => router.push(`/search?term=${encodeURIComponent(searchTerm)}`)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {filters.length > 0 && (
          <div className="p-4 border-b border-base-content/10">
            <h3 className="font-medium text-base-content mb-3">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filters.map((filter, index) => (
                <label key={index} className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    name="filter"
                    className="radio radio-primary radio-xs"
                    checked={activeFilter === filter.value}
                    onChange={() => setActiveFilter(filter.value)}
                  />
                  
                  <span className="label-text text-xs ml-2">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 max-h-[calc(100vh-300px)]">
          {renderContent()}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isLeftSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 touch-manipulation" 
          onClick={toggleLeftSidebar}
          onTouchEnd={toggleLeftSidebar}
          style={{ touchAction: 'manipulation' }}
        />
      )}
    </>
  )
}
