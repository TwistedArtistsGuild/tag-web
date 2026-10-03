/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

export default function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const publishableKey = process.env.STRIPE_PUBLIC_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY

	if (!publishableKey) {
		return res.status(500).json({ error: "Stripe publishable key is not configured" })
	}

	return res.status(200).json({ publishableKey })
}
