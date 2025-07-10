/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"

export default function Custom404() {
	const [email, setEmail] = useState("")
	const [message, setMessage] = useState("")
	const router = useRouter()

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await fetch('/api/sendEmail', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					to: 'admin@twistedartistsguild.com',
					subject: 'Support Request',
					text: `${message}\n\nURL: ${router.asPath}`,
					html: `<p>${message}</p><p>URL: ${router.asPath}</p>`,
					replyTo: email,
				}),
			})
			if (res.ok) {
				alert('Email sent successfully!')
			} else {
				alert('Failed to send email.')
			}
		} catch (error) {
			console.error('Error sending email:', error)
			alert('Failed to send email.')
		}
	}

	return (
		<section className="relative bg-base-100 text-base-content w-full p-10 flex flex-col items-center gap-6">
			<p className="text-xl md:text-2xl font-medium">
				This page doesn&apos;t exist or has been moved.
			</p>

			<Link href="/" className="btn btn-primary flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="w-5 h-5"
				>
					<path
						fillRule="evenodd"
						d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
						clipRule="evenodd"
					/>
				</svg>
				Home
			</Link>

			<form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
				<label className="flex flex-col items-start">
					Your Email:
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="input input-bordered w-full max-w-xs"
					/>
				</label>
				<label className="flex flex-col items-start">
					Message:
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						required
						className="textarea textarea-bordered w-full max-w-xs"
					/>
				</label>
				<button type="submit" className="btn btn-primary">
					Send
				</button>
			</form>
		</section>
	)
}
