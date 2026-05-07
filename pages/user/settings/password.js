/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import TagSEO from "@/components/TagSEO"
import Link from "next/link"

export default function PasswordSettings() {
	const pageMetaData = {
		title: "Change Password",
		description: "Change your account password",
		keywords: "settings, password, user, account",
		robots: "noindex, nofollow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Change Password",
			description: "Change your account password",
		},
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="user/settings/password" />
			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-2xl font-bold text-base-content">Change Password</h1>
							<Link href="/user/settings" className="btn btn-sm btn-ghost">Back to Settings</Link>
						</div>
						<p className="text-sm text-base-content/70">Password and account security controls.</p>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<p className="text-base-content/80">This page is under construction.</p>
					</div>
				</div>
			</div>
		</div>
	)
}
