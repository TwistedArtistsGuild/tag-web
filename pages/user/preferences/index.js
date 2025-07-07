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

export default function Preferences() {
	// Custom hook to make private pages easier to deal with (see /hooks folder)
	const [session, status] = usePrivate({})
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
		return <p>Loading...</p>
	}

	return (
		<>
			<TagSEO title="User Preferences" />
			<main className="min-h-screen p-8 pb-24 bg-base-200">
				<section className="max-w-xl mx-auto space-y-8">
					<h1 className="text-3xl md:text-4xl font-extrabold text-primary">
						User Preferences
					</h1>
					<p className="text-lg leading-relaxed text-base-content/80">
						{status === "authenticated"
							? `Welcome ${session?.user?.name}`
							: "You are not logged in"}
					</p>
						<div className="form-control">
						<label className="label">
							<span className="label-text">Theme:</span>
						</label>
						<select
							value={theme}
							onChange={(e) => setTheme(e.target.value)}
							className="select select-bordered w-full"
						>
							<option value="light">Light</option>
							<option value="dark">Dark</option>
						</select>
					</div>
						<div className="form-control">
						<label className="label cursor-pointer">
							<span className="label-text">Enable Notifications:</span>
							<input
								type="checkbox"
								checked={notifications}
								onChange={(e) => setNotifications(e.target.checked)}
								className="toggle toggle-primary"
							/>
						</label>
					</div>
						<div className="form-control">
						<label className="label">
							<span className="label-text">Language:</span>
						</label>
						<select
							value={language}
							onChange={(e) => setLanguage(e.target.value)}
							className="select select-bordered w-full"
						>
							<option value="en">English</option>
							<option value="es">Spanish</option>
							<option value="fr">French</option>
							<option value="de">German</option>
						</select>
					</div>
					<div className="flex space-x-4">
						<button
							className={`btn btn-primary ${isLoading ? "loading" : ""}`}
							onClick={handlePreferencesUpdate}
							disabled={isLoading}
						>
							{isLoading ? "Updating..." : "Update Preferences"}
						</button>
						<button
							className="btn btn-ghost"
							onClick={() => signOut({ callbackUrl: "/" })}
						>
							Logout
						</button>
					</div>
				</section>
			</main>
		</>
	)
}