/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Stripe from "stripe"

function toSafeCurrency(currency) {
const normalized = String(currency || "USD").trim().toLowerCase()
return normalized || "usd"
}

function toItemQuantity(value) {
const parsed = Math.floor(Number(value) || 1)
return parsed > 0 ? parsed : 1
}

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" })
}

const body = req.body || {}
const cart = Array.isArray(body.cart) ? body.cart : []
const dryRun = Boolean(body.dryRun)

if (!dryRun && !process.env.STRIPE_SECRET_KEY) {
return res.status(500).json({ error: "Stripe is not configured on this environment" })
}

if (cart.length === 0) {
return res.status(400).json({ error: "Cart must contain at least one item" })
}

const buyerUserId = body.buyerUserId != null ? String(body.buyerUserId) : ""
const currency = toSafeCurrency(body.currency)
const productAmountCents = cart.reduce((sum, item) => sum + Math.round(Number(item.price) * 100) * toItemQuantity(item.quantity), 0)
const shippingAmountCents = Math.max(0, Number(body.shippingAmountCents) || 0)
const amountCents = productAmountCents + shippingAmountCents
const unitCount = cart.reduce((sum, item) => sum + toItemQuantity(item.quantity), 0)

if (!Number.isFinite(amountCents) || amountCents <= 0) {
return res.status(400).json({ error: "Cart total must be greater than zero" })
}

if (dryRun) {
return res.status(200).json({
paymentIntentId: `pi_dryrun_${Date.now()}`,
clientSecret: "",
amountCents,
productAmountCents,
shippingAmountCents,
currency,
dryRun: true,
})
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

try {
const intent = await stripe.paymentIntents.create({
amount: amountCents,
currency,
automatic_payment_methods: {
enabled: true,
},
metadata: {
source: "tag-web treasury_stripe_shippo",
buyer_user_id: buyerUserId,
cart_size: String(cart.length),
unit_count: String(unitCount),
product_total_cents: String(productAmountCents),
shipping_total_cents: String(shippingAmountCents),
cart_total_cents: String(amountCents),
listing_ids: cart.map((item) => `${item.listingId}x${toItemQuantity(item.quantity)}`).join(","),
},
})

return res.status(200).json({
paymentIntentId: intent.id,
clientSecret: intent.client_secret,
amountCents,
productAmountCents,
shippingAmountCents,
currency,
})
} catch (error) {
console.error("stripe payment intent creation failed:", error?.message || error)
return res.status(500).json({ error: error?.message || "Unable to create Stripe payment intent" })
}
}
