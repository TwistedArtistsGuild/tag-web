/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { Bug, X } from "lucide-react"
import getApiURL from "@/components/widgets/GetApiURL"

const HEADER_HEIGHT_PX = 88

function stringifyConsoleArg(value) {
	if (typeof value === "string") return value
	if (value instanceof Error) return `${value.name}: ${value.message}`
	try {
		return JSON.stringify(value)
	} catch {
		return String(value)
	}
}

function trimTo(value, maxLen) {
	return String(value || "").slice(0, maxLen)
}

function safeJsonParse(text, fallback) {
	try {
		return JSON.parse(text)
	} catch {
		return fallback
	}
}

export default function BugReportControl({
	isEmbedded = false,
	defaultShortDescription = "",
	defaultExpectedBehavior = "",
	defaultLongDescription = "",
}) {
	const router = useRouter()
	const { data: session, status } = useSession()
	const [isOpen, setIsOpen] = useState(false)
	const [submitting, setSubmitting] = useState(false)
	const [submitMessage, setSubmitMessage] = useState("")
	const [email, setEmail] = useState("")
	const [shortDescription, setShortDescription] = useState(defaultShortDescription)
	const [expectedBehavior, setExpectedBehavior] = useState(defaultExpectedBehavior)
	const [longDescription, setLongDescription] = useState(defaultLongDescription)
	const diagnosticsRef = useRef([])
	const apiBaseUrl = useMemo(() => getApiURL(), [])

	const buildNumber = process.env.NEXT_PUBLIC_BUILD_NUMBER || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local"

	const sessionContext = useMemo(() => {
		const user = session?.user || {}
		return {
			isLoggedIn: status === "authenticated",
			authStatus: status || "unknown",
			userId: trimTo(user.id || user.userID || user.sub || "", 200),
			name: trimTo(user.name || user.displayName || "", 250),
			email: trimTo(user.email || "", 250),
			image: trimTo(user.image || "", 500),
			role: trimTo(user.role || "", 100),
		}
	}, [session, status])

	const resolvedEmail = email || sessionContext.email || ""

	useEffect(() => {
		if (typeof window === "undefined") return

		const appendDiagnostic = (entry) => {
			diagnosticsRef.current = [...diagnosticsRef.current, { ...entry, at: new Date().toISOString() }].slice(-40)
		}

		const originalConsoleError = console.error
		console.error = (...args) => {
			appendDiagnostic({
				type: "console.error",
				message: trimTo(args.map(stringifyConsoleArg).join(" | "), 2000),
			})
			originalConsoleError(...args)
		}

		const onWindowError = (event) => {
			appendDiagnostic({
				type: "window.error",
				message: trimTo(event?.message || "Unknown script error", 2000),
				source: trimTo(event?.filename || "", 500),
				line: event?.lineno || null,
				column: event?.colno || null,
			})
		}

		const onUnhandledRejection = (event) => {
			const reason = event?.reason instanceof Error
				? `${event.reason.name}: ${event.reason.message}`
				: stringifyConsoleArg(event?.reason)
			appendDiagnostic({
				type: "unhandledrejection",
				message: trimTo(reason, 2000),
			})
		}

		window.addEventListener("error", onWindowError)
		window.addEventListener("unhandledrejection", onUnhandledRejection)

		return () => {
			console.error = originalConsoleError
			window.removeEventListener("error", onWindowError)
			window.removeEventListener("unhandledrejection", onUnhandledRejection)
		}
	}, [])

	const openPanel = () => {
		setSubmitMessage("")
		setIsOpen(true)
	}

	const togglePanel = () => {
		if (isOpen) {
			closePanel()
			return
		}
		openPanel()
	}

	const closePanel = () => {
		if (submitting) return
		setIsOpen(false)
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setSubmitting(true)
		setSubmitMessage("")
		const pageContext = typeof window === "undefined"
			? {
				path: router.asPath || "",
				url: "",
				referrer: "",
				userAgent: "",
				language: "",
				platform: "",
				viewport: "",
				timezone: "",
			}
			: {
				path: router.asPath || "",
				url: window.location.href,
				referrer: document.referrer || "",
				userAgent: navigator.userAgent,
				language: navigator.language,
				platform: navigator.platform,
				viewport: `${window.innerWidth}x${window.innerHeight}`,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
			}

		try {
			const response = await fetch(`${apiBaseUrl}bug-report`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: resolvedEmail,
					shortDescription,
					expectedBehavior,
					longDescription,
					sessionContext,
					buildNumber,
					pageContext,
					diagnostics: diagnosticsRef.current,
				}),
			})

			const body = safeJsonParse(await response.text(), {})
			if (!response.ok) {
				throw new Error(body?.error || "Failed to submit bug report")
			}

			setSubmitMessage("Bug report sent. Thank you.")
			setShortDescription("")
			setExpectedBehavior("")
			setLongDescription("")
			setEmail("")
			setTimeout(() => {
				setIsOpen(false)
				setSubmitMessage("")
			}, 900)
		} catch (submitError) {
			setSubmitMessage(submitError?.message || "Failed to submit bug report")
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>
			{!isEmbedded && (
				<button
					type="button"
					className="btn btn-ghost btn-sm btn-circle text-base-content enhanced-text-visibility bg-base-100/18 border border-base-content/10 hover:bg-base-100/24"
					aria-label="Report a bug"
					title="Report a bug"
					onClick={togglePanel}
				>
					<Bug size={18} />
				</button>
			)}

			{(isEmbedded || isOpen) && (
				<div
					className={isEmbedded ? "w-full" : "fixed left-0 right-0 z-30 px-4"}
					style={isEmbedded ? undefined : { top: `${HEADER_HEIGHT_PX}px` }}
					role="region"
					aria-label="Bug report panel"
				>
					<div className={`bg-base-100 rounded-xl border border-base-300 w-full ${isEmbedded ? "max-w-3xl" : "max-w-4xl"} mx-auto shadow-2xl`}>
						<div className="flex items-center justify-between p-4 border-b border-base-300">
							<h2 className="font-semibold text-lg">Report Bug</h2>
							{!isEmbedded && (
								<button type="button" className="btn btn-ghost btn-sm btn-circle" onClick={closePanel} aria-label="Close report panel">
									<X size={16} />
								</button>
							)}
						</div>

						<form className={`p-4 space-y-5 ${isEmbedded ? "" : "max-h-[70vh] overflow-auto"}`} onSubmit={handleSubmit}>
							<div className="text-sm text-base-content/80">
								Please fill each field below on its own line so we can triage quickly.
							</div>

							<div className="space-y-4">
								<div className="space-y-1">
									<label className="font-medium" htmlFor="bug-report-email">Your Email (optional)</label>
									<input
										id="bug-report-email"
										type="email"
										value={resolvedEmail}
										onChange={(e) => setEmail(e.target.value)}
										className="input input-bordered w-full"
										maxLength={250}
									/>
								</div>

								<div className="space-y-1">
									<label className="font-medium" htmlFor="bug-report-short">Short Description</label>
									<input
										id="bug-report-short"
										type="text"
										value={shortDescription}
										onChange={(e) => setShortDescription(e.target.value)}
										className="input input-bordered w-full"
										required
										maxLength={180}
										placeholder="One-line summary of the issue"
									/>
								</div>

								<div className="space-y-1">
									<label className="font-medium" htmlFor="bug-report-expected">What Were You Expecting?</label>
									<textarea
										id="bug-report-expected"
										value={expectedBehavior}
										onChange={(e) => setExpectedBehavior(e.target.value)}
										className="textarea textarea-bordered min-h-24 w-full"
										required
										maxLength={1200}
										placeholder="Describe the expected result"
									/>
								</div>

								<div className="space-y-1">
									<label className="font-medium" htmlFor="bug-report-detail">Detailed Description</label>
									<textarea
										id="bug-report-detail"
										value={longDescription}
										onChange={(e) => setLongDescription(e.target.value)}
										className="textarea textarea-bordered min-h-35 w-full"
										required
										maxLength={4000}
										placeholder="Steps taken, what broke, and any extra context"
									/>
								</div>
							</div>

							<div className="rounded-lg border border-base-300 bg-base-200 p-3 text-xs space-y-1">
								<div className="font-medium">Included Automatically</div>
								<div>Path and URL</div>
								<div>Build identifier</div>
								<div>Session user details (if logged in)</div>
								<div>Browser and viewport details</div>
								<div>Captured Errors: {diagnosticsRef.current.length}</div>
							</div>

							{submitMessage && <div className="alert alert-info"><span>{submitMessage}</span></div>}

							<div className="flex justify-end gap-2">
								{!isEmbedded && <button type="button" className="btn btn-ghost" onClick={closePanel} disabled={submitting}>Cancel</button>}
								<button type="submit" className={`btn btn-primary ${submitting ? "btn-disabled" : ""}`} disabled={submitting}>
									{submitting ? "Sending..." : "Send Report"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	)
}

