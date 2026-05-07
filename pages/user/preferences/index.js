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

	const handlePreferencesUpdate = async () => {
		setIsLoading(true)
		try {
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
			<TagSEO title="User Preferences" />
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
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body space-y-4">
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