/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from "react"
import { defaultButtonClass } from "/utils/formSettings";

export default function TestMail() {
	const [status, setStatus] = useState("")

	const handleSendTestEmail = async () => {
		try {
			const response = await fetch("/api/sendEmail", {
				method: "POST",
			})
			const data = await response.json()
			setStatus(data.message || data.error)
		} catch (error) {
			console.error("Error sending email:", error)
			setStatus("Failed to send email.")
		}
	}

	return (
		<div>
			<h1>Send Test Email</h1>
				<button className={defaultButtonClass} onClick={handleSendTestEmail}>
					Send Test Email
				</button>
			{status && <p>{status}</p>}
		</div>
	)
}