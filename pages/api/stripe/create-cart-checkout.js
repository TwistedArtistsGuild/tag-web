/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Stripe from "stripe"

function buildAbsoluteUrl(req, path) {
const protocol = (req.headers["x-forwarded-proto"] || "http").toString()
const host = (req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000").toString()
return `${protocol}://${host}${path}`
}

function toSafeCurrency(currency) {
const normalized = String(currency || "USD").trim().toLowerCase()
return normalized || "usd"
}

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

if (!process.env.STRIPE_SECRET_KEY) {
return res.status(500).json({ error: "Stripe is not configured on this environment" })
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const body = req.body || {}
const cart = Array.isArray(body.cart) ? body.cart : []

if (cart.length === 0) {
return res.status(400).json({ error: "Cart must contain at least one item" })
}

const buyerUserId = body.buyerUserId != null ? String(body.buyerUserId) : ""
const currency = toSafeCurrency(body.currency)
const successUrl = typeof body.successUrl === "string" && body.successUrl.trim()
? body.successUrl.trim()
: buildAbsoluteUrl(req, "/test/treasury_stripe?stripe_checkout=success&stripe_session_id={CHECKOUT_SESSION_ID}")
const cancelUrl = typeof body.cancelUrl === "string" && body.cancelUrl.trim()
? body.cancelUrl.trim()
: buildAbsoluteUrl(req, "/test/treasury_stripe?stripe_checkout=canceled")

try {
const lineItems = cart.map((item, index) => {
const priceCents = Math.round(Number(item.price) * 100)

if (!Number.isFinite(priceCents) || priceCents <= 0) {
throw new Error(`Cart item ${index + 1} is missing a valid price`)
}

return {
quantity: 1,
price_data: {
currency,
unit_amount: priceCents,
product_data: {
name: item.listingTitle || item.listingId || `Listing ${index + 1}`,
description: item.artistTitle ? `by ${item.artistTitle}` : undefined,
metadata: {
listing_id: item.listingId != null ? String(item.listingId) : "",
artist_id: item.artistId != null ? String(item.artistId) : "",
artist_path: item.artistPath != null ? String(item.artistPath) : "",
},
},
},
}
})

const totalCents = lineItems.reduce((sum, lineItem) => sum + lineItem.price_data.unit_amount, 0)
const session = await stripe.checkout.sessions.create({
mode: "payment",
line_items: lineItems,
success_url: successUrl,
cancel_url: cancelUrl,
client_reference_id: buyerUserId || undefined,
payment_intent_data: {
metadata: {
source: "tag-web treasury_stripe",
buyer_user_id: buyerUserId,
cart_size: String(cart.length),
cart_total_cents: String(totalCents),
},
},
metadata: {
source: "tag-web treasury_stripe",
buyer_user_id: buyerUserId,
cart_size: String(cart.length),
cart_total_cents: String(totalCents),
},
})

return res.status(200).json({
id: session.id,
url: session.url,
})
} catch (error) {
console.error("stripe checkout session creation failed:", error?.message || error)
return res.status(500).json({ error: error?.message || "Unable to create Stripe checkout session" })
}
}
