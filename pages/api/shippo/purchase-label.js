/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { stripHtmlText } from "@/components/security/sanitize"

function collectShippoMessages(body) {
	const messages = []

	if (typeof body?.detail === "string") messages.push(body.detail)
	if (typeof body?.error === "string") messages.push(body.error)
	if (typeof body?.message === "string") messages.push(body.message)

	if (Array.isArray(body?.detail)) {
		body.detail.forEach((item) => {
			if (typeof item === "string") messages.push(item)
			if (typeof item?.message === "string") messages.push(item.message)
		})
	}

	if (Array.isArray(body?.messages)) {
		body.messages.forEach((item) => {
			if (typeof item === "string") messages.push(item)
			if (typeof item?.text === "string") messages.push(item.text)
			if (typeof item?.message === "string") messages.push(item.message)
		})
	}

	if (Array.isArray(body?.__all__)) {
		body.__all__.forEach((item) => {
			if (typeof item === "string") messages.push(item)
		})
	}

	return [...new Set(messages.map((m) => String(m).trim()).filter(Boolean))]
}

function toDetailMessage(body, fallback) {
	const parsedMessages = collectShippoMessages(body)
	if (parsedMessages.length > 0) {
		return parsedMessages.join("; ")
	}

	if (body && typeof body === "object") {
		try {
			return JSON.stringify(body)
		} catch {
			return fallback
		}
	}

	return fallback
}

function pickLabelUrl(body) {
	return body?.label_url || body?.label_file || body?.qr_code_url || ""
}

function truncateToMax(value, maxLen) {
	const normalized = String(value || "")
	if (normalized.length <= maxLen) return normalized
	return normalized.slice(0, maxLen)
}

function buildShippoMetadata(paymentIntentId, shipmentId, artistSummary) {
	const safePi = stripHtmlText(paymentIntentId).replace(/[^a-zA-Z0-9_\-]/g, "")
	const safeShipment = stripHtmlText(shipmentId).replace(/[^a-zA-Z0-9_\-]/g, "")
	const safeArtists = stripHtmlText(artistSummary)
		.replace(/[^a-zA-Z0-9_\-\s,]/g, "")
		.replace(/\s+/g, " ")
		.trim()
	const compact = `tag_checkout|pi:${safePi || "na"}|sh:${safeShipment || "na"}|artists:${safeArtists || "na"}`
	return truncateToMax(compact, 100)
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchTransactionById(transactionId, authToken) {
	const response = await fetch(`https://api.goshippo.com/transactions/${transactionId}`, {
		method: "GET",
		headers: {
			Authorization: `ShippoToken ${authToken}`,
			"Content-Type": "application/json",
		},
	})

	const body = await response.json()
	if (!response.ok) {
		throw new Error(toDetailMessage(body, `Unable to fetch Shippo transaction ${transactionId}`))
	}

	return body
}

async function awaitFinalTransaction(transaction, authToken) {
	const firstStatus = String(transaction?.status || "").toUpperCase()
	if (!transaction?.object_id) return transaction
	if (!["QUEUED", "WAITING", "PURCHASING", "PROCESSING"].includes(firstStatus)) {
		return transaction
	}

	let current = transaction
	for (let attempt = 0; attempt < 6; attempt += 1) {
		await wait(700)
		current = await fetchTransactionById(transaction.object_id, authToken)
		const status = String(current?.status || "").toUpperCase()
		if (!["QUEUED", "WAITING", "PURCHASING", "PROCESSING"].includes(status)) {
			return current
		}
	}

	return current
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const dryRun = Boolean(req.body?.dryRun)
	if (dryRun) {
		return res.status(200).json({
			transactionId: `tx_dryrun_${Date.now()}`,
			status: "SUCCESS",
			trackingNumber: `DRYRUN${Date.now()}`,
			trackingUrlProvider: "",
			labelUrl: "https://mintcdn.com/shippo-f4b7b609/o3pSHzWv8pMmorWX/images/Guides_general/sample_label.png?w=840&fit=max&auto=format&n=o3pSHzWv8pMmorWX&q=85&s=d66a840259a331c866db70129b1cb7e5",
			test: true,
			messages: [{ text: "Dry run mode: sample label response generated locally." }],
			dryRun: true,
		})
	}

	if (!process.env.SHIPPOTOKEN) {
		return res.status(500).json({ error: "Shippo is not configured on this environment" })
	}

	try {
		const rateObjectId = String(req.body?.rateObjectId || "").trim()
		const paymentIntentId = String(req.body?.paymentIntentId || "").trim()
		const shipmentId = String(req.body?.shipmentId || "").trim()
		const artistSummary = String(req.body?.artistSummary || "").trim()

		if (!rateObjectId) {
			return res.status(400).json({ error: "rateObjectId is required" })
		}

		const transactionResponse = await fetch("https://api.goshippo.com/transactions/", {
			method: "POST",
			headers: {
				Authorization: `ShippoToken ${process.env.SHIPPOTOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				rate: rateObjectId,
				label_file_type: "PDF_4x6",
				async: false,
				metadata: buildShippoMetadata(paymentIntentId, shipmentId, artistSummary),
			}),
		})

		const transactionBody = await transactionResponse.json()
		if (!transactionResponse.ok) {
			throw new Error(toDetailMessage(transactionBody, "Unable to purchase Shippo label"))
		}

		const finalTransaction = await awaitFinalTransaction(transactionBody, process.env.SHIPPOTOKEN)
		const status = String(finalTransaction?.status || "").toUpperCase()
		if (status && status !== "SUCCESS") {
			const statusMsg = toDetailMessage(finalTransaction, `Shippo transaction status is ${status}`)
			throw new Error(statusMsg)
		}

		const labelUrl = pickLabelUrl(finalTransaction)
		if (!labelUrl) {
			throw new Error(toDetailMessage(finalTransaction, "Shippo transaction completed but no label URL was returned"))
		}

		return res.status(200).json({
			transactionId: finalTransaction?.object_id || "",
			status: finalTransaction?.status || "",
			trackingNumber: finalTransaction?.tracking_number || "",
			trackingUrlProvider: finalTransaction?.tracking_url_provider || "",
			labelUrl,
			test: Boolean(finalTransaction?.test),
			messages: Array.isArray(finalTransaction?.messages) ? finalTransaction.messages : [],
		})
	} catch (error) {
		console.error("shippo label purchase failed:", error?.message || error)
		return res.status(500).json({ error: error?.message || "Unable to purchase Shippo label" })
	}
}
