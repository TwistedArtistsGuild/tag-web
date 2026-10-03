/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

function normalizeAddress(address) {
	return {
		name: String(address?.name || "").trim(),
		street1: String(address?.street1 || "").trim(),
		city: String(address?.city || "").trim(),
		state: String(address?.state || "").trim(),
		zip: String(address?.zip || "").trim(),
		country: String(address?.country || "US").trim().toUpperCase(),
		email: String(address?.email || "").trim(),
		phone: String(address?.phone || "").trim(),
	}
}

function normalizeParcel(parcel) {
	return {
		length: String(parcel?.length || "10").trim(),
		width: String(parcel?.width || "10").trim(),
		height: String(parcel?.height || "4").trim(),
		distance_unit: String(parcel?.distanceUnit || parcel?.distance_unit || "in").trim().toLowerCase(),
		weight: String(parcel?.weight || "1").trim(),
		mass_unit: String(parcel?.massUnit || parcel?.mass_unit || "lb").trim().toLowerCase(),
	}
}

function validateAddress(address, label) {
	const required = ["name", "street1", "city", "state", "zip", "country"]
	for (const field of required) {
		if (!address[field]) {
			throw new Error(`${label} is missing ${field}`)
		}
	}
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const dryRun = Boolean(req.body?.dryRun)
	if (dryRun) {
		return res.status(200).json({
			shipmentId: `shippo_dryrun_${Date.now()}`,
			rates: [
				{
					objectId: `rate_dryrun_${Date.now()}`,
					provider: "Shippo Dry Run",
					serviceLevel: "Ground Sample",
					amount: "9.99",
					currency: "USD",
					estimatedDays: 5,
					durationTerms: "Dry run sample rate",
				},
			],
			dryRun: true,
		})
	}

	if (!process.env.SHIPPOTOKEN) {
		return res.status(500).json({ error: "Shippo is not configured on this environment" })
	}

	try {
		const addressFrom = normalizeAddress(req.body?.addressFrom)
		const addressTo = normalizeAddress(req.body?.addressTo)
		const parcel = normalizeParcel(req.body?.parcel)
		validateAddress(addressFrom, "From address")
		validateAddress(addressTo, "To address")

		const response = await fetch("https://api.goshippo.com/shipments/", {
			method: "POST",
			headers: {
				Authorization: `ShippoToken ${process.env.SHIPPOTOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				address_from: addressFrom,
				address_to: addressTo,
				parcels: [parcel],
				async: false,
			}),
		})

		const body = await response.json()
		if (!response.ok) {
			const details = body?.detail || body?.error || body?.message || "Unable to get Shippo rates"
			throw new Error(typeof details === "string" ? details : JSON.stringify(details))
		}

		const rates = Array.isArray(body?.rates) ? body.rates : []
		const normalizedRates = rates
			.map((rate) => ({
				objectId: rate.object_id,
				provider: rate.provider || rate.provider_image_75 || "Unknown",
				serviceLevel: rate.servicelevel?.name || rate.servicelevel?.token || "Unknown",
				amount: rate.amount,
				currency: rate.currency,
				estimatedDays: rate.estimated_days,
				durationTerms: rate.duration_terms,
			}))
			.sort((left, right) => Number(left.amount) - Number(right.amount))

		return res.status(200).json({
			shipmentId: body?.object_id || "",
			rates: normalizedRates,
		})
	} catch (error) {
		console.error("shippo quote failed:", error?.message || error)
		return res.status(500).json({ error: error?.message || "Unable to get Shippo rates" })
	}
}
