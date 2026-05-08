/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import TagSEO from "@/components/TagSEO"
import Link from "next/link"
import { useState } from "react"

export default function CreditCardSettings() {
	const [defaultMethod, setDefaultMethod] = useState("card")
	const [autoRenew, setAutoRenew] = useState(true)
	const [emailReceipts, setEmailReceipts] = useState(true)
	const [tipLimit, setTipLimit] = useState("50")

	const pageMetaData = {
		title: "Update Credit Card Info",
		description: "Update your credit card information",
		keywords: "settings, credit card, user, account",
		robots: "noindex, nofollow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Update Credit Card Info",
			description: "Update your credit card information",
		},
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="user/settings/credit-card" />
			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-2xl font-bold text-base-content">Update Credit Card Info</h1>
							<Link href="/user/settings" className="btn btn-sm btn-ghost">Back to Settings</Link>
						</div>
						<p className="text-sm text-base-content/70">Payment method management screen.</p>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-base-content">Billing & Payment Controls</h2>
							<span className="badge badge-ghost">Mock for now</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<div className="form-control">
								<label className="label"><span className="label-text">Default payment method</span></label>
								<select className="select select-bordered" value={defaultMethod} onChange={(e) => setDefaultMethod(e.target.value)}>
									<option value="card">Credit Card</option>
									<option value="paypal">PayPal</option>
									<option value="wallet">Platform Wallet</option>
								</select>
							</div>
							<div className="form-control">
								<label className="label"><span className="label-text">Max tip per purchase ($)</span></label>
								<input className="input input-bordered" value={tipLimit} onChange={(e) => setTipLimit(e.target.value)} />
							</div>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Auto-renew subscriptions</span>
								<input type="checkbox" className="toggle toggle-primary" checked={autoRenew} onChange={(e) => setAutoRenew(e.target.checked)} />
							</label>
							<label className="label cursor-pointer justify-between rounded-box border border-base-300 px-3 py-2">
								<span className="label-text">Email billing receipts</span>
								<input type="checkbox" className="toggle toggle-primary" checked={emailReceipts} onChange={(e) => setEmailReceipts(e.target.checked)} />
							</label>
						</div>

						<div className="alert alert-info text-sm">
							<span>Billing controls are staged for implementation pending payment endpoint updates.</span>
						</div>

						<div className="flex gap-2 flex-wrap">
							<button className="btn btn-primary" onClick={() => alert("Billing settings saved (mock).")}>Save Billing Settings</button>
							<button className="btn btn-ghost" onClick={() => alert("Open payment method manager (mock).")}>Manage Payment Methods</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
