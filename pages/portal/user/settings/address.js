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

export default function AddressSettings() {
	const [displayLocation, setDisplayLocation] = useState("")
	const [shippingRegion, setShippingRegion] = useState("US")
	const [city, setCity] = useState("")
	const [stateProvince, setStateProvince] = useState("")
	const [country, setCountry] = useState("USA")

	const pageMetaData = {
		title: "Update Address",
		description: "Update your address information",
		keywords: "settings, address, user, account",
		robots: "noindex, nofollow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Update Address",
			description: "Update your address information",
		},
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/user/settings/address" />				<UserContextNav />			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-2xl font-bold text-base-content">Update Address</h1>
							<Link href="/portal/user/settings" className="btn btn-sm btn-ghost">Back to Settings</Link>
						</div>
						<p className="text-sm text-base-content/70">Address management screen.</p>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body space-y-4">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-base-content">Address & Region</h2>
							<span className="badge badge-ghost">Mock for now</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input className="input input-bordered" placeholder="Public display location (ex: Austin, TX)" value={displayLocation} onChange={(e) => setDisplayLocation(e.target.value)} />
							<select className="select select-bordered" value={shippingRegion} onChange={(e) => setShippingRegion(e.target.value)}>
								<option value="US">US Only</option>
								<option value="NA">North America</option>
								<option value="INTL">International</option>
							</select>
							<input className="input input-bordered" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
							<input className="input input-bordered" placeholder="State / Province" value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} />
							<input className="input input-bordered" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
						</div>

						<div className="alert alert-info text-sm">
							<span>Use this to control storefront location metadata and shipping availability.</span>
						</div>

						<div className="flex gap-2 flex-wrap">
							<button className="btn btn-primary" onClick={() => alert("Address settings saved (mock).")}>Save Address Settings</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
