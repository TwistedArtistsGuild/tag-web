/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import TagSEO from "@/components/TagSEO"
import UserContextNav from "@/components/portal/UserContextNav"
import Link from "next/link"
import { useState } from "react"

export default function NotificationSettings() {
	const [emailLikes, setEmailLikes] = useState(true)
	const [emailComments, setEmailComments] = useState(true)
	const [emailMentions, setEmailMentions] = useState(true)
	const [pushDMs, setPushDMs] = useState(true)
	const [pushFollows, setPushFollows] = useState(true)
	const [pushModeration, setPushModeration] = useState(false)
	const [digestFrequency, setDigestFrequency] = useState("daily")

	const pageMetaData = {
		title: "Notification Preferences",
		description: "Manage your notification preferences",
		keywords: "settings, notifications, user, account",
		robots: "noindex, nofollow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Notification Preferences",
			description: "Manage your notification preferences",
		},
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/user/settings/notifications" />				<UserContextNav />			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-2xl font-bold text-base-content">Notification Preferences</h1>
							<Link href="/portal/user/settings" className="btn btn-sm btn-ghost">Back to Settings</Link>
						</div>
						<p className="text-sm text-base-content/70">Notification controls and delivery options.</p>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-base-content">Notification Matrix</h2>
							<span className="badge badge-ghost">Mock for now</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Email: Likes</span>
								<input type="checkbox" className="toggle toggle-primary" checked={emailLikes} onChange={(e) => setEmailLikes(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Email: Comments</span>
								<input type="checkbox" className="toggle toggle-primary" checked={emailComments} onChange={(e) => setEmailComments(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Email: Mentions</span>
								<input type="checkbox" className="toggle toggle-primary" checked={emailMentions} onChange={(e) => setEmailMentions(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Push: DMs</span>
								<input type="checkbox" className="toggle toggle-primary" checked={pushDMs} onChange={(e) => setPushDMs(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Push: New followers</span>
								<input type="checkbox" className="toggle toggle-primary" checked={pushFollows} onChange={(e) => setPushFollows(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Push: Moderation updates</span>
								<input type="checkbox" className="toggle toggle-primary" checked={pushModeration} onChange={(e) => setPushModeration(e.target.checked)} />
							</label>
						</div>

						<div className="form-control">
							<label className="label"><span className="label-text">Digest frequency</span></label>
							<select className="select select-bordered" value={digestFrequency} onChange={(e) => setDigestFrequency(e.target.value)}>
								<option value="realtime">Realtime</option>
								<option value="daily">Daily</option>
								<option value="weekly">Weekly</option>
								<option value="off">Off</option>
							</select>
						</div>

						<div className="flex gap-2 flex-wrap">
							<button className="btn btn-primary" onClick={() => alert("Notification settings saved (mock).")}>Save Notification Settings</button>
							<Link href="/portal/user/preferences" className="btn btn-ghost">Open Preferences Hub</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
