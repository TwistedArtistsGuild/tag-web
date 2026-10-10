/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Trash2 } from "lucide-react"
import { useLayout } from "./LayoutProvider"
import { useCart } from "@/components/cart/CartContext"
import SidePanel from "@/components/sidebar/SidePanel"
import EdgeTab from "@/components/sidebar/EdgeTab"

export const CART_PANEL_ID = "tag-cart-panel"

const formatMoney = (value) => `$${(Number.isFinite(value) ? value : 0).toFixed(2)}`

/**
 * Cart panel (right): item cards with a quantity stepper, sticky totals and checkout,
 * or an empty state. Cart actions are the existing CartContext ones.
 */
export default function RightSidebar() {
  const { isRightSidebarVisible, toggleRightSidebar } = useLayout()
  const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart } = useCart()

  const items = Array.isArray(cartItems) ? cartItems : []
  const total = Number.isFinite(cartTotal) ? cartTotal : 0
  const count = Number.isFinite(cartCount) ? cartCount : 0
  const hasItems = items.length > 0

  const footer = hasItems ? (
    <>
      <div className="tag-cart__sum">
        <span>Subtotal</span>
        <span>{formatMoney(total)}</span>
      </div>
      <div className="tag-cart__sum tag-cart__sum--total">
        <span>Total</span>
        <b>{formatMoney(total)}</b>
      </div>
      <Link href="/checkout" className="btn btn-primary tag-cart__checkout" onClick={() => toggleRightSidebar(false)}>
        Proceed to checkout
      </Link>
      <small className="tag-cart__note">Shipping and taxes calculated at checkout.</small>
    </>
  ) : null

  return (
    <>
      <EdgeTab
        side="right"
        label="Cart"
        ariaLabel={count > 0 ? `Open cart, ${count} items` : "Open cart"}
        icon={<ShoppingCart aria-hidden="true" />}
        count={count}
        controls={CART_PANEL_ID}
        expanded={isRightSidebarVisible}
        onClick={() => toggleRightSidebar(true)}
      />
      <SidePanel
        id={CART_PANEL_ID}
        side="right"
        title="Your cart"
        titleExtra={hasItems ? <span className="tag-panel__pill">{count} {count === 1 ? "item" : "items"}</span> : null}
        open={isRightSidebarVisible}
        onClose={() => toggleRightSidebar(false)}
        footer={footer}
      >
        {hasItems ? (
          <ul className="tag-cart__list">
            {items.map((item, index) => {
              const listing = item.listing || {}
              const title = listing.title || listing.titleID || "Unknown item"
              const artist = listing.artist?.title || listing.vendor?.title || ""
              const price = Number(listing.price)
              const unitPrice = Number.isFinite(price) ? price : 0
              const quantity = Number(item.quantity) || 1
              const imageUrl = listing.defaultImageURL || listing.pictures?.[0]?.url || "/blank_image.png"
              const key = item.listingId || item.id || `cart-item-${index}`

              return (
                <li key={key} className="tag-cart__item">
                  <Image src={imageUrl} alt="" width={64} height={64} unoptimized className="tag-cart__image" />
                  <div className="tag-cart__meta">
                    <strong title={title}>{title}</strong>
                    {artist ? <span title={artist}>{artist}</span> : null}
                    <div className="tag-cart__stepper" role="group" aria-label={`Quantity of ${title}`}>
                      <button type="button" aria-label={`Decrease quantity of ${title}`} onClick={() => updateQuantity(item.listingId, quantity - 1)}>−</button>
                      <output aria-live="polite">{quantity}</output>
                      <button type="button" aria-label={`Increase quantity of ${title}`} onClick={() => updateQuantity(item.listingId, quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="tag-cart__right">
                    <b>{formatMoney(unitPrice * quantity)}</b>
                    <button type="button" className="tag-row__action" aria-label={`Remove ${title}`} title="Remove from cart" onClick={() => removeFromCart(item.listingId)}>
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="tag-cart__empty">
            <span className="tag-cart__empty-icon" aria-hidden="true">
              <ShoppingCart />
            </span>
            <h3>Your cart is empty</h3>
            <p>Find something you love from Guild artists.</p>
            <Link href="/art/" className="btn btn-primary btn-sm" onClick={() => toggleRightSidebar(false)}>
              Browse art
            </Link>
          </div>
        )}
      </SidePanel>
    </>
  )
}
