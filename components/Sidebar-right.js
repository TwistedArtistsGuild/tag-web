/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Image from "next/image"
import Link from "next/link"
import { useLayout } from "./LayoutProvider"
import { useCart } from "@/components/cart/CartContext"
import { PanelRightOpen, PanelRightClose } from 'lucide-react';

export default function RightSidebar() {
  const { isRightSidebarVisible, toggleRightSidebar, isMobile, isHeaderVisible } = useLayout()
  
  // Use global Cart Context
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const topOffset = isHeaderVisible ? "top-20" : "top-0"

  // Ensure safe calculations
  const totalCartValue = isNaN(cartTotal) ? 0 : cartTotal;
  const items = Array.isArray(cartItems) ? cartItems : [];
  const hasItems = items.length > 0;

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
          fixed ${topOffset} bottom-0 right-0 bg-base-200 border-l border-base-content/10 z-30
          transition-transform duration-300 ease-in-out
          ${isRightSidebarVisible ? "translate-x-0" : "translate-x-full"}
          ${isMobile ? "w-full" : "w-80"}
          flex flex-col
        `}
        style={{ height: isHeaderVisible ? 'calc(100vh - 5rem)' : '100vh' }}
      >
        {/* Theme-reactive accent strip */}
        <div className="sidebar-accent" />
        
        {/* Close Button - Left Edge Center of Sidebar when open */}
        {isRightSidebarVisible && (
            <button
                onClick={toggleRightSidebar}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 
                bg-base-200 text-base-content p-1 rounded-md border border-base-content/20 shadow-sm z-40"
                aria-label="Hide right sidebar"
            >
                <PanelRightClose size={18} strokeWidth={2} />
            </button>
        )}

        {/* Sidebar Header */}
        <div className="sidebar-inner-header flex-shrink-0 flex items-center justify-between p-4 border-b border-base-content/10 bg-base-300">
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
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="tabs tabs-boxed m-4 mb-0 flex-shrink-0">
          <button className="tab tab-active">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            Cart ({items.length})
          </button>
        </div>

        {/* Content Area - Scrollable Middle Section */}
        <div className="flex-1 overflow-y-auto p-4 pb-4 items-wrapper">
          <div className="space-y-4">
            {hasItems ? (
              items.map((item, index) => {
                  const listing = item.listing || {};
                  const title = listing.title || listing.titleID || "Unknown Item";
                  // Ensure price parses to a literal zero cleanly
                  const rawPrice = Number(listing.price);
                  const price = isNaN(rawPrice) ? 0 : rawPrice;
                  const imageUrl = listing.defaultImageURL || listing.pictures?.[0]?.url || "/blank_image.png";
                  const uniqueKey = item.listingId || item.id || `fallback-cart-item-${index}`;

                  return (
                    <div key={uniqueKey} className="card card-compact bg-base-100 shadow border border-base-content/10">
                      <div className="card-body">
                        <div className="flex items-center space-x-3">
                          <div className="avatar relative">
                            <div className="w-12 h-12 rounded bg-base-300 overflow-hidden relative border border-base-300">
                              <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate" title={title}>{title}</h4>
                            <p className="text-xs text-base-content/60 font-semibold">${price.toFixed(2)}</p>
                            
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center space-x-1">
                                  <button 
                                    onClick={() => updateQuantity(item.listingId, item.quantity - 1)}
                                    className="btn btn-xs btn-circle btn-outline border-base-content/20 hover:bg-base-300 hover:text-base-content hover:border-base-content/40" 
                                    aria-label={`Decrease quantity`}
                                  >-</button>
                                  <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.listingId, item.quantity + 1)}
                                    className="btn btn-xs btn-circle btn-outline border-base-content/20 hover:bg-base-300 hover:text-base-content hover:border-base-content/40" 
                                    aria-label={`Increase quantity`}
                                  >+</button>
                                </div>
                                
                                <button 
                                    onClick={() => removeFromCart(item.listingId)}
                                    className="text-error opacity-70 hover:opacity-100 p-1"
                                    title="Remove from cart"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              })
            ) : (
              <div className="text-center py-12 text-base-content/60">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="font-medium text-lg mb-1">Your cart is empty</p>
                <p className="text-xs">Add listings to checkout.</p>
              </div>
            )}
          </div>
        </div>

        {/* ALWAYS RENDER FOOTER PUSHED TO BOTTOM BY PREVIOUS FLEX-1 TRAY */}
        {hasItems && (
            <div className="flex-shrink-0 p-4 border-t border-base-content/10 bg-base-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="card bg-base-200 border border-base-content/5">
                    <div className="card-body p-4 gap-3">
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-primary">${totalCartValue.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" onClick={toggleRightSidebar} className="btn btn-primary w-full shadow-md text-white font-bold">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isRightSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 touch-manipulation backdrop-blur-sm" 
          onClick={toggleRightSidebar}
          onTouchEnd={toggleRightSidebar}
          style={{ touchAction: 'manipulation' }}
        />
      )}
    </>
  )
}
