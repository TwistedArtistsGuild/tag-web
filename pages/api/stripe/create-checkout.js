/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { createCheckout } from "@/libs/stripe"

// This function is used to create a Stripe Checkout Session
// It's called by the <ButtonCheckout /> component
// It forces user to be authenticated but you can remove all the auth logic if you want (if (session) {} | if (!user) {}, etc...)
export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions)

	if (session) {
		const { id } = session.user
		const { method, body } = req

		switch (method) {
		case "POST": {
			if (!body.priceId) {
				return res.status(404).send({ error: "Need a Price ID for Stripe" })
			} else if (!body.successUrl || !body.cancelUrl) {
				return res
					.status(404)
					.send({ error: "Need valid success/failure URL to return to" })
			}

			try {
				const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
				const userRes = await fetch(`${api_url}users/${id}`)
				const user = await userRes.json()

				if (!user) {
					return res.status(404).json({ error: "User doesn't exist" })
				}

				const { coupon, successUrl, cancelUrl } = body

				const stripeSessionURL = await createCheckout({
					successUrl,
					cancelUrl,
					clientReferenceID: user.id,
					priceId: body.priceId,
					coupon,
				})

				return res.status(200).json({ url: stripeSessionURL })
			} catch (e) {
				console.error(e)
				return res.status(500).json({ error: e?.message })
			}
		}

		default:
			res.status(404).json({ error: "Unknown request type" })
		}
	} else {
		// Not Signed in
		res.status(401).end()
	}
}
