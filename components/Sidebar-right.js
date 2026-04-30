/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Image from "next/image"
import { useLayout } from "./LayoutProvider"
import { getRandomStockPhotoByCategory } from "@/utils/stockPhotos"
import { PanelRightOpen, PanelRightClose } from 'lucide-react';

export default function RightSidebar(props) {
  // Since MyLayout.js spreads the rightSidebarData, we access props directly
  const cartItems = props.cartItems || [
    {
      id: "default",
      name: "Default Cart Item (no data passed in)",
      price: 0,
      quantity: 1,
      image: getRandomStockPhotoByCategory('merchandise'),
      artist: "Default Artist"
    }
  ];
  
  const { isRightSidebarVisible, toggleRightSidebar, isMobile, isHeaderVisible } = useLayout()

  const totalCartValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const topOffset = isHeaderVisible ? "top-20" : "top-0"

  return (
    <>
      {/* Open Button - Right Edge of Screen when closed */}
      {!isRightSidebarVisible && (
        <button
            onClick={toggleRightSidebar}
            className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50 
            bg-primary text-primary-content 
            pr-2 pl-1.5 py-3 rounded-l-md shadow-lg"
            aria-label="Show right sidebar"
        >
            <PanelRightOpen size={20} strokeWidth={2} />
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
        {/* Theme-reactive accent strip */}
        <div className="sidebar-accent" />
        {/* Close Button - Left Edge Center of Sidebar when open */}
        {isRightSidebarVisible && (
            <button
                onClick={toggleRightSidebar}
                className="absolute top-1/2 right-full transform translate-x-1/2 -translate-y-1/2 
                bg-base-200 text-base-content p-1 rounded-md border border-base-content/20 shadow-sm z-40"
                aria-label="Hide right sidebar"
            >
                <PanelRightClose size={18} strokeWidth={2} />
            </button>
        )}

        {/* Sidebar Header */}
        <div className="sidebar-inner-header flex items-center justify-between p-4 border-b border-base-content/10 bg-base-300">
          <div>
            <h2 className="font-semibold text-lg text-base-content">Checkout</h2>
            <p className="text-xs text-base-content/60">Review items and complete your order.</p>
          </div>
          {/* Mobile close button in header */}
          {isMobile && (
            <button
              onClick={toggleRightSidebar}
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

        <div className="tabs tabs-boxed m-4 mb-0">
          <button className="tab tab-active">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            Cart ({cartItems.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)]">
          <div className="space-y-4 overflow-y-auto max-h-full">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item, index) => (
                  <div key={item.id || index} className="card card-compact bg-base-100 shadow">
                    <div className="card-body">
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded bg-base-300 overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg?height=48&width=48"}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-base-content/60">${item.price}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <button className="btn btn-xs btn-circle btn-outline" aria-label={`Decrease quantity for ${item.name}`}>-</button>
                            <span className="text-xs">{item.quantity}</span>
                            <button className="btn btn-xs btn-circle btn-outline" aria-label={`Increase quantity for ${item.name}`}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="card bg-base-100 shadow border border-base-content/10">
                  <div className="card-body gap-3">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span>${totalCartValue.toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary w-full">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
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
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isRightSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 touch-manipulation" 
          onClick={toggleRightSidebar}
          onTouchEnd={toggleRightSidebar}
          style={{ touchAction: 'manipulation' }}
        />
      )}
    </>
  )
}
