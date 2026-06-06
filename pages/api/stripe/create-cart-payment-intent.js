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
	const amountCents = cart.reduce((sum, item) => sum + Math.round(Number(item.price) * 100), 0)

	if (!Number.isFinite(amountCents) || amountCents <= 0) {
		return res.status(400).json({ error: "Cart total must be greater than zero" })
	}

	try {
		const intent = await stripe.paymentIntents.create({
			amount: amountCents,
			currency,
			automatic_payment_methods: {
				enabled: true,
			},
			metadata: {
				source: "tag-web treasury_stripe",
				buyer_user_id: buyerUserId,
				cart_size: String(cart.length),
				cart_total_cents: String(amountCents),
				listing_ids: cart.map((item) => item.listingId).join(","),
			},
		})

		return res.status(200).json({
			paymentIntentId: intent.id,
			clientSecret: intent.client_secret,
			amountCents,
			currency,
		})
	} catch (error) {
		console.error("stripe payment intent creation failed:", error?.message || error)
		return res.status(500).json({ error: error?.message || "Unable to create Stripe payment intent" })
	}
}
