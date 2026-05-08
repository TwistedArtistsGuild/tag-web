/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import TagSEO from "@/components/TagSEO"
import Link from "next/link"
import { useState } from "react"

export default function PasswordSettings() {
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
	const [loginAlerts, setLoginAlerts] = useState(true)

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
					<div className="card-body space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-base-content">Password Update</h2>
							<span className="badge badge-ghost">Mock for now</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							<input className="input input-bordered" type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
							<input className="input input-bordered" type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
							<input className="input input-bordered" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Enable 2FA</span>
								<input type="checkbox" className="toggle toggle-primary" checked={twoFactorEnabled} onChange={(e) => setTwoFactorEnabled(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Send login alerts</span>
								<input type="checkbox" className="toggle toggle-primary" checked={loginAlerts} onChange={(e) => setLoginAlerts(e.target.checked)} />
							</label>
						</div>

						<div className="alert alert-warning text-sm">
							<span>Security updates are currently in wireframe mode and not yet persisted.</span>
						</div>

						<div className="flex gap-2 flex-wrap">
							<button className="btn btn-primary" onClick={() => alert("Security settings saved (mock).")}>Save Security Settings</button>
							<button className="btn btn-ghost" onClick={() => alert("Signed out of other sessions (mock).")}>Sign Out Other Sessions</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
