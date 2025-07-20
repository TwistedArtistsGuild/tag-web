/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState } from "react"
import Link from "next/link"
import { useLayout } from "./LayoutProvider"
import ArtistCard from "/components/card_artist"
import ListingCard from "/components/card_listing"
import Image from "next/image"
import { useRouter } from "next/router"

const stockPhotos = [
  "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1322183-artistpaintingmural2.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-brett-sayles-1340502-artistpaintingmural.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-carlo-junemann-156928830-12407580-merchandisehats.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-daiangan-102127-paintpallette.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-joshsorenson-995301-drummer.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-jovanvasiljevic-32146479-merchandisesweater.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-karolina-grabowska-4471894-blackguitar.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-marcela-alessandra-789314-1885213-pianist.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-markus-winkler-1430818-3812433-merchandiseclothingrack.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-nappy-936030-violin.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-210922-guitarist.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-pixabay-262034-brushes.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-thfotodesign-3253724-artistpaintingmural3.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-sebastian-ervi-866902-1763075-bandNcrowd.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-valeriiamiller-3547625-artistpainting.jpg",
  "https://tagstatic.blob.core.windows.net/pexels/pexels-victorfreitas-733767-sultrysax.jpg",
]

export default function LeftSidebar(props) {
  const { leftSidebarData = {} } = props.sidebarProps || {};
  const artists = leftSidebarData.artists || [
    {
      id: "default",
      name: "Default Artist (no data passed in)",
      avatar: stockPhotos[0],
      specialty: "Default Specialty",
      rating: 1,
      location: "Default Location"
    }
  ];
  const listings = leftSidebarData.listings || [
    {
      id: "default",
      name: "Default Listing (no data passed in)",
      image: stockPhotos[1],
      price: 0,
      artist: "Default Artist"
    }
  ];
  const filters = leftSidebarData.filters || [
    { label: "All Art", value: "all" },
    { label: "Paintings", value: "paintings" },
    { label: "Sculpture", value: "sculpture" },
  ];
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[LeftSidebar] props:", { artists, listings, filters, leftSidebarData, sidebarProps: props.sidebarProps })
  }

  const { isLeftSidebarVisible, toggleLeftSidebar, isMobile, isHeaderVisible } = useLayout()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
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
              <div className="flex flex-col items-center justify-center">
                <Image src={stockPhotos[2]} width={48} height={48} alt="No content" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No content available</p>
              </div>
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
