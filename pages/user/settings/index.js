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

export default function Settings() {
	// Custom hook to make private pages easier to deal with (see /hooks folder)
	const [session, status] = usePrivate({})
	const [isLoading, setIsLoading] = useState(false)

	// Show a loader when the session is loading. Not needed but recommended if you show user data like email/name
	if (status === "loading") {
		return <p>Loading...</p>
	}

	const pageMetaData = {
		title: "User Settings",
		description: "Manage your account settings",
		keywords: "settings, user, account, privacy",
		robots: "index, follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "User Settings",
			description: "Manage your account settings",
		},
	}

	return (
		<>
			<TagSEO metadataProp={pageMetaData} canonicalSlug="settings" />
			<main className="min-h-screen p-8 pb-24 bg-base-200">
				<section className="max-w-xl mx-auto space-y-8">
					<h1 className="text-3xl md:text-4xl font-extrabold text-primary">Your Settings</h1>

					<div className="space-y-4">
						<h2 className="text-2xl font-bold text-secondary">Account Information</h2>
						<div className="flex flex-col space-y-2">
							<div className="flex justify-between">
								<span className="font-medium">Name:</span>
								<span>{session?.user?.name || "N/A"}</span>
							</div>
							<div className="flex justify-between">
								<span className="font-medium">Username:</span>
								<span>{session?.user?.username || "N/A"}</span>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<h2 className="text-2xl font-bold text-secondary">Settings</h2>
						<ul className="list-disc list-inside space-y-2">
							<li>
								<Link href="/user/settings/address" className="link link-primary">
									Update Address
								</Link>
							</li>
							<li>
								<Link href="/user/settings/credit-card" className="link link-primary">
									Update Credit Card Info
								</Link>
							</li>
							<li>
								<Link href="/user/settings/password" className="link link-primary">
									Change Password
								</Link>
							</li>
							<li>
								<Link href="/user/settings/notifications" className="link link-primary">
									Notification Preferences
								</Link>
							</li>
						</ul>
					</div>

					<button
						className="btn btn-ghost"
						onClick={() => signOut({ callbackUrl: "/" })}
					>
						Logout
					</button>
				</section>
			</main>
		</>
	)
}