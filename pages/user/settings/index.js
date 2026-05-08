/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { signOut } from "next-auth/react"
import { usePrivate } from "@/hooks/usePrivate"
import TagSEO from "@/components/TagSEO"
import Link from "next/link"

export default function Settings() {
	// Custom hook to make private pages easier to deal with (see /hooks folder)
	const [session, status] = usePrivate("/user/settings")

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

	const pageMetaData = {
		title: "User Settings",
		description: "Manage your account settings",
		keywords: "settings, user, account, privacy",
		robots: "noindex, nofollow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "User Settings",
			description: "Manage your account settings",
		},
	}

	const settingLinks = [
		{ href: "/user/settings/notifications", label: "Notification Preferences", icon: "🔔", description: "Control likes, comments, mentions, follows, and DM alerts.", status: "Mock" },
		{ href: "/user/settings/password", label: "Security Center", icon: "🔐", description: "Password changes, session management, and account protection.", status: "Mock" },
		{ href: "/user/settings/address", label: "Address & Region", icon: "📍", description: "Manage shipping region, locale, and legal contact details.", status: "Mock" },
		{ href: "/user/settings/credit-card", label: "Billing & Payment", icon: "💳", description: "Payment method preferences and billing controls.", status: "Mock" },
	]

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="user/settings" />
			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-2xl font-bold text-base-content">Your Settings</h1>
							<Link href="/user" className="btn btn-sm btn-ghost">Back to Dashboard</Link>
						</div>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body space-y-4">
						<h2 className="text-lg font-semibold text-base-content">Account Information</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
							<div className="rounded-box border border-base-300 p-3">
								<div className="text-base-content/60">Name</div>
								<div className="font-medium">{session?.user?.name || "N/A"}</div>
							</div>
							<div className="rounded-box border border-base-300 p-3">
								<div className="text-base-content/60">Username</div>
								<div className="font-medium">{session?.user?.username || "N/A"}</div>
							</div>
						</div>

						<div className="alert alert-info text-sm">
							<span>
								This area is structured for social-platform operations: audience controls, security, notifications, identity, and billing.
							</span>
						</div>

						<h2 className="text-lg font-semibold text-base-content">Settings</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{settingLinks.map((item) => (
								<Link key={item.href} href={item.href} className="card bg-base-200 border border-base-300 hover:border-primary transition-colors">
									<div className="card-body p-4">
										<div className="flex items-center justify-between gap-2">
											<div className="font-medium text-base-content">{item.icon} {item.label}</div>
											<span className="badge badge-ghost badge-sm">{item.status}</span>
										</div>
										<p className="text-sm text-base-content/70">{item.description}</p>
									</div>
								</Link>
							))}
						</div>

						<div>
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