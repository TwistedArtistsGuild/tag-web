/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { useState } from "react"
import { useLayout } from "./LayoutProvider"

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

export default function RightSidebar(props) {
  // Since MyLayout.js spreads the rightSidebarData, we access props directly
  const cartItems = props.cartItems || [
    {
      id: "default",
      name: "Default Cart Item (no data passed in)",
      price: 0,
      quantity: 1,
      image: stockPhotos[2],
      artist: "Default Artist"
    }
  ];
  const stories = props.stories || [
    {
      id: "default",
      author: "Default Author (no data passed in)",
      avatar: stockPhotos[3],
      content: "This is a default story because no data was passed in.",
      timestamp: "now"
    }
  ];
  const notifications = props.notifications || [
    {
      id: "default",
      message: "Default notification (no data passed in)",
      type: "info"
    }
  ];
  
  const { isRightSidebarVisible, toggleRightSidebar, isMobile, isHeaderVisible } = useLayout()
  const [activeTab, setActiveTab] = useState("cart")
  const [newStory, setNewStory] = useState("")

  const totalCartValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const topOffset = isHeaderVisible ? "top-20" : "top-0"

  return (
    <>
      {/* Open Button - Right Edge of Screen when closed */}
      {!isRightSidebarVisible && (
        <button
          onClick={toggleRightSidebar}
          className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 bg-primary text-primary-content px-2 py-4 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Show right sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Sidebar */}
      <aside
        className={`
          fixed ${topOffset} bottom-0 right-0 w-80 bg-base-200 border-l border-base-content/10 z-30
          transition-transform duration-300 ease-in-out
          ${isRightSidebarVisible ? "translate-x-0" : "translate-x-full"}
          ${isMobile ? "w-full" : "w-80"}
          h-screen overflow-y-auto
        `}
      >
        {/* Close Button - Left Edge Center of Sidebar when open */}
        {isRightSidebarVisible && (
          <button
            onClick={toggleRightSidebar}
            className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-base-200 text-base-content hover:bg-base-300 px-1 py-3 rounded-l-lg border border-base-content/10 shadow-md transition-all duration-300 hover:scale-105 z-10"
            aria-label="Hide right sidebar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-content/10 bg-base-300">
          <h2 className="font-semibold text-lg text-base-content">Personal Space</h2>
        </div>

        {/* Tab Navigation */}
        <div className="tabs tabs-boxed m-4">
          <button className={`tab ${activeTab === "cart" ? "tab-active" : ""}`} onClick={() => setActiveTab("cart")}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            Cart ({cartItems.length})
          </button>
          <button className={`tab ${activeTab === "stories" ? "tab-active" : ""}`} onClick={() => setActiveTab("stories")}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Stories
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "cart" && (
            <div className="space-y-4">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="card card-compact bg-base-100 shadow">
                      <div className="card-body">
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded">
                              <img src={item.image || "/placeholder.svg?height=48&width=48"} alt={item.name} />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-base-content/60">${item.price}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <button className="btn btn-xs btn-circle btn-outline">-</button>
                              <span className="text-xs">{item.quantity}</span>
                              <button className="btn btn-xs btn-circle btn-outline">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="divider"></div>
                  <div className="flex justify-between items-center font-bold">
                    <span>Total:</span>
                    <span>${totalCartValue.toFixed(2)}</span>
                  </div>
                  <button className="btn btn-primary w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Checkout
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <p>Your cart is empty</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "stories" && (
            <div className="space-y-4">
              {/* Add New Story */}
              <div className="card card-compact bg-base-100 shadow">
                <div className="card-body">
                  <h4 className="font-medium">Share Your Story</h4>
                  <textarea
                    className="textarea textarea-bordered textarea-sm"
                    placeholder="What's on your mind?"
                    value={newStory}
                    onChange={(e) => setNewStory(e.target.value)}
                    rows={3}
                  />
                  <button className="btn btn-primary btn-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Post Story
                  </button>
                </div>
              </div>

              {/* Existing Stories */}
              {stories.length > 0 ? (
                stories.map((story, index) => (
                  <div key={index} className="card card-compact bg-base-100 shadow">
                    <div className="card-body">
                      <div className="flex items-start space-x-3">
                        <div className="avatar">
                          <div className="w-8 h-8 rounded-full">
                            <img src={story.avatar || "/placeholder.svg?height=32&width=32"} alt={story.author} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{story.author}</h5>
                          <p className="text-xs text-base-content/60 mb-2">{story.timestamp}</p>
                          <p className="text-sm">{story.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
                  <p>No stories yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isRightSidebarVisible && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={toggleRightSidebar} />
      )}
    </>
  )
}
