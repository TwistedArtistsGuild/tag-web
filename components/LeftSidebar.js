"use client"

/* This file is part of the Twisted Artists Guild project.
 Copyright (C) 2025 Twisted Artists Guild
 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).
 This software comes with NO WARRANTY; see the license for details.
 Open source · low-profit · human-first*/

import { useState } from "react"
import Link from "next/link"
import { useLayout } from "./LayoutProvider"
import ArtistCard from "/components/card_artist"
import ListingCard from "/components/card_listing"

export default function LeftSidebar({ artists = [], listings = [], filters = [] }) {
  const { isLeftSidebarVisible, toggleLeftSidebar, isMobile, isHeaderVisible } = useLayout()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

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
          transition-transform duration-300 ease-in-out overflow-hidden
          ${isLeftSidebarVisible ? "translate-x-0" : "-translate-x-full"}
          ${isMobile ? "w-full" : "w-80"}
        `}
      >
        {/* Close Button - Right Edge Center of Sidebar when open */}
        {isLeftSidebarVisible && (
          <button
            onClick={toggleLeftSidebar}
            className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-base-200 text-base-content hover:bg-base-300 px-1 py-3 rounded-r-lg border border-base-content/10 shadow-md transition-all duration-300 hover:scale-105 z-10"
            aria-label="Hide left sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-content/10 bg-base-300">
          <h2 className="font-semibold text-lg text-base-content">Navigation & Filters</h2>
        </div>

        {/* Search Section */}
        <div className="p-4 border-b border-base-content/10 bg-base-100">
          <div className="space-y-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Search</span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search artists, art, events..."
                className="input input-bordered input-sm w-full"
              />
            </div>
            <button className="btn btn-primary btn-sm w-full">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 border-b border-base-content/10">
          <h3 className="font-medium text-base-content mb-3">Quick Navigation</h3>
          <div className="space-y-2">
            <Link href="/artists" className="btn btn-ghost btn-sm w-full justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Artists
            </Link>
            <Link href="/art" className="btn btn-ghost btn-sm w-full justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Artwork
            </Link>
            <Link href="/events" className="btn btn-ghost btn-sm w-full justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Events
            </Link>
            <Link href="/blogs" className="btn btn-ghost btn-sm w-full justify-start">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Blog
            </Link>
          </div>
        </div>

        {/* Filters Section */}
        {filters.length > 0 && (
          <div className="p-4 border-b border-base-content/10">
            <h3 className="font-medium text-base-content mb-3">Filters</h3>
            <div className="space-y-2">
              {filters.map((filter, index) => (
                <label key={index} className="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    name="filter"
                    className="radio radio-primary radio-sm"
                    checked={activeFilter === filter.value}
                    onChange={() => setActiveFilter(filter.value)}
                  />
                  <span className="label-text ml-2">{filter.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {listings && listings.length > 0 ? (
            <>
              <h3 className="font-medium text-base-content mb-3">Featured Listings</h3>
              {listings.map((listing, index) => (
                <ListingCard key={index} listing={listing} />
              ))}
            </>
          ) : artists && artists.length > 0 ? (
            <>
              <h3 className="font-medium text-base-content mb-3">Featured Artists</h3>
              {artists.map((artist, index) => (
                <ArtistCard key={index} artist={artist} />
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-base-content/60">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>No content available</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isLeftSidebarVisible && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={toggleLeftSidebar} />
      )}
    </>
  )
}
