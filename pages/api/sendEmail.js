/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { EmailClient } from "@azure/communication-email"
import config from "@/config"

/**
 * Sends an email using the provided parameters.
 *
 * @async
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The HTML content of the email.
 * @param {string} replyTo - The email address to set as the "Reply-To" address.
 * @returns {Promise} A Promise that resolves when the email is sent.
 */
export const sendEmail = async (to, subject, text, html, replyTo) => {
	const emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING)

	const emailMessage = {
		senderAddress: process.env.AZURE_COMMUNICATION_SERVICES_SENDER_ADDRESS,
		content: {
			subject,
			plainText: text,
			html,
		},
		recipients: {
			to: [
				{
					address: to,
					displayName: "Recipient",
				},
			],
		},
		...(replyTo && { replyTo: [{ address: replyTo }] }),
	}

	try {
		const poller = await emailClient.beginSend(emailMessage)
		const result = await poller.pollUntilDone()

		if (result.status === "Succeeded") {
			console.log("Email sent successfully")
		} else {
			console.error(`Failed to send email: ${result.error}`)
		}
	} catch (error) {
		console.error("Error sending email:", error)
	}
}

export default async function handler(req, res) {
	if (req.method === "POST") {
		const { to, subject, text, html, replyTo } = req.body
		try {
			await sendEmail(to, subject, text, html, replyTo)
			res.status(200).json({ message: "Email sent successfully!" })
		} catch (error) {
			console.error("Error sending email:", error)
			res.status(500).json({ error: "Failed to send email." })
		}
	} else {
		res.status(405).json({ error: "Method not allowed." })
	}
}
