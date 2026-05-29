/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { useState } from "react"
import { signOut } from "next-auth/react"
import apiClient from "@/libs/api"
import { usePrivate } from "@/hooks/usePrivate"
import TagSEO from "@/components/TagSEO"
import Link from "next/link"

export default function Preferences() {
	// Custom hook to make private pages easier to deal with (see /hooks folder)
	const [session, status] = usePrivate("/user/preferences")
	const [isLoading, setIsLoading] = useState(false)
	const [theme, setTheme] = useState(session?.user?.preferences?.theme || "light")
	const [notifications, setNotifications] = useState(session?.user?.preferences?.notifications || true)
	const [language, setLanguage] = useState(session?.user?.preferences?.language || "en")
	const [allowMessageRequests, setAllowMessageRequests] = useState(true)
	const [readReceipts, setReadReceipts] = useState(false)
	const [showPronouns, setShowPronouns] = useState(true)
	const [discoverability, setDiscoverability] = useState("everyone")
	const [feedPersonalization, setFeedPersonalization] = useState("balanced")

	const handlePreferencesUpdate = async () => {
		setIsLoading(true)
		try {
			// Existing endpoint currently supports these fields; newer social controls are mocked until API expands.
			await apiClient.put("/user/preferences", {
				theme,
				notifications,
				language,
			})
			alert("Preferences updated successfully")
		} catch (error) {
			console.error("Error updating preferences:", error.message)
			alert("Error updating preferences")
		} finally {
			setIsLoading(false)
		}
	}

	// Show a loader when the session is loading. Not needed but recommended if you show user data like email/name
	if (status === "loading") {
		return (
			<div className="min-h-screen bg-base-200 p-4 md:p-8">
				<div className="max-w-5xl mx-auto">
					<div className="card bg-base-100 shadow border border-base-300">
						<div className="card-body items-center py-12">
							<span className="loading loading-ghost loading-lg"></span>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={{ title: "User Preferences", description: "Manage account and app preferences.", robots: "noindex, nofollow", keywords: "user preferences, account settings", og: { title: "User Preferences", description: "Manage account and app preferences." } }} canonicalSlug="user/preferences" />
			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-2xl font-bold text-base-content">User Preferences</h1>
							<Link href="/user" className="btn btn-sm btn-ghost">Back to Dashboard</Link>
						</div>
						<p className="text-sm text-base-content/70">
							{status === "authenticated" ? `Welcome ${session?.user?.name}` : "You are not logged in"}
						</p>
						<div>
							<Link href="/user/preferences/content" className="btn btn-sm btn-outline btn-accent">
								Open Content Preferences
							</Link>
						</div>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-base-content">App Preferences</h2>
							<span className="badge badge-success badge-outline">Live</span>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Theme</span>
							</label>
							<select value={theme} onChange={(e) => setTheme(e.target.value)} className="select select-bordered w-full">
								<option value="light">Light</option>
								<option value="dark">Dark</option>
							</select>
						</div>

						<div className="form-control">
							<label className="label cursor-pointer justify-start gap-3">
								<input
									type="checkbox"
									checked={notifications}
									onChange={(e) => setNotifications(e.target.checked)}
									className="toggle toggle-primary"
								/>
								<span className="label-text">Enable Notifications</span>
							</label>
						</div>

						<div className="form-control">
							<label className="label">
								<span className="label-text">Language</span>
							</label>
							<select value={language} onChange={(e) => setLanguage(e.target.value)} className="select select-bordered w-full">
								<option value="en">English</option>
								<option value="es">Spanish</option>
								<option value="fr">French</option>
								<option value="de">German</option>
							</select>
						</div>

						<div className="flex gap-3 flex-wrap">
							<button className={`btn btn-primary ${isLoading ? "loading" : ""}`} onClick={handlePreferencesUpdate} disabled={isLoading}>
								{isLoading ? "Updating..." : "Update Preferences"}
							</button>
							<span className="text-xs text-base-content/60 self-center">Theme, language, and notification opt-in save to API.</span>
						</div>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-base-content">Messaging & Identity</h2>
							<span className="badge badge-ghost">Mock for now</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Allow message requests</span>
								<input type="checkbox" className="toggle toggle-primary" checked={allowMessageRequests} onChange={(e) => setAllowMessageRequests(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Enable read receipts</span>
								<input type="checkbox" className="toggle toggle-primary" checked={readReceipts} onChange={(e) => setReadReceipts(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Show pronouns on profile</span>
								<input type="checkbox" className="toggle toggle-primary" checked={showPronouns} onChange={(e) => setShowPronouns(e.target.checked)} />
							</label>
							<div className="form-control rounded-box border border-base-300 px-3 py-2">
								<label className="label p-0 pb-1"><span className="label-text">Discoverability</span></label>
								<select className="select select-bordered select-sm" value={discoverability} onChange={(e) => setDiscoverability(e.target.value)}>
									<option value="everyone">Everyone</option>
									<option value="followers">Followers only</option>
									<option value="nobody">Nobody</option>
								</select>
							</div>
						</div>

						<div className="form-control">
							<label className="label"><span className="label-text">Feed personalization</span></label>
							<select className="select select-bordered" value={feedPersonalization} onChange={(e) => setFeedPersonalization(e.target.value)}>
								<option value="low">Low</option>
								<option value="balanced">Balanced</option>
								<option value="high">High</option>
							</select>
						</div>

						<div className="alert alert-info text-sm">
							<span>These controls are UI-ready and awaiting backend persistence.</span>
						</div>

						<div className="flex gap-3 flex-wrap">
							<button className="btn btn-outline" onClick={() => alert("Saved locally in wireframe mode.")}>Save Social Preferences (Mock)</button>
							<button className="btn btn-ghost" onClick={() => signOut({ callbackUrl: "/" })}>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}