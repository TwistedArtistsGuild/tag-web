/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useMemo, useState } from "react"
import { getServerSession } from "next-auth/next"

import DynaFormDB from "@/components/widgets/DynaFormDB"
import getApiURL from "@/components/widgets/GetApiURL"
import TagSEO from "@/components/TagSEO"
import EmailForm from "@/components/social/contact/email-form"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

const formName = "ManageContactForm1"
const TABS = [
	{ key: "email", label: "Email" },
	{ key: "all", label: "All Contact Fields" },
]

export default function UserManageContactsPage({ metadataProp, sessionUser, emailContacts = [] }) {
	const apiUrl = getApiURL()
	const entityID = Number(sessionUser?.id) || 0
	const [activeTab, setActiveTab] = useState("email")

	const enhancedMetadata = useMemo(() => {
		const base = Array.isArray(metadataProp) ? metadataProp[0] : metadataProp
		if (!base || Object.keys(base).length === 0) {
			return null
		}

		const postfix = base.apiurlpostfix || base.APIURLpostfix || "contact/manage"
		const separator = apiUrl.endsWith("/") || postfix.startsWith("/") ? "" : "/"

		return {
			...base,
			APIURL: `${apiUrl}${separator}${postfix}`,
			redirectURL: "/portal/user/manage-contacts",
		}
	}, [apiUrl, metadataProp])

	const formData = useMemo(() => ({
		context: "user",
		entityID,
		isPrivate: true,
		displayOrder: 0,
		phoneContactLabelID: 2,
	}), [entityID])

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO
				metadataProp={{
					title: "User Manage Contacts",
					description: "Create and link contact records for the signed-in user.",
					robots: "noindex, nofollow",
				}}
				canonicalSlug="portal/user/manage-contacts"
			/>

			<div className="max-w-4xl mx-auto space-y-4">
				<div className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body gap-2">
						<h1 className="text-2xl font-bold text-primary">Manage User Contacts</h1>
						<p className="text-sm text-base-content/70">Create contact records linked to your current user account.</p>
						<div className="rounded-box bg-base-200 border border-base-300 p-3 text-sm">
							<div><span className="font-semibold">Signed in as:</span> {sessionUser?.name || sessionUser?.email || "User"}</div>
							<div><span className="font-semibold">User ID:</span> {entityID || "Missing"}</div>
						</div>
						<div>
							<Link href="/portal/user" className="btn btn-sm btn-ghost">Back to User Portal</Link>
						</div>
					</div>
				</div>

				<div className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body">
						<div role="tablist" className="tabs tabs-bordered mb-4">
							{TABS.map((tab) => (
								<button
									key={tab.key}
									role="tab"
									type="button"
									className={`tab${activeTab === tab.key ? " tab-active" : ""}`}
									onClick={() => setActiveTab(tab.key)}
								>
									{tab.label}
								</button>
							))}
						</div>

						{activeTab === "email" && (
							<EmailForm context="user" entityID={entityID} existingContacts={emailContacts} />
						)}

						{activeTab === "all" && (enhancedMetadata ? (
							<DynaFormDB request="add" metadataProp={enhancedMetadata} formData={formData} />
						) : (
							<div className="text-sm text-error">Form metadata &quot;{formName}&quot; was not found. Run the SQL seed script, then refresh.</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions)
	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/user/manage-contacts")}`,
				permanent: false,
			},
		}
	}

	const apiUrl = getApiURL()
	const userId = Number(session.user.id)
	let metadataProp = {}
	let emailContacts = []

	try {
		let res = await fetch(`${apiUrl}formsmetadata/${formName}`)
		if (!res.ok) {
			res = await fetch(`${apiUrl}forms_metadata/${formName}`)
		}
		if (res.ok) {
			metadataProp = await res.json()
		}
	} catch (error) {
		console.error("Error fetching manage contact form metadata:", error.message)
	}

	if (Number.isFinite(userId) && userId > 0) {
		try {
			const contactsRes = await fetch(`${apiUrl}contact/user/${userId}`)
			if (contactsRes.ok) {
				const contactsData = await contactsRes.json()
				const rows = Array.isArray(contactsData?.contacts) ? contactsData.contacts : []
				emailContacts = rows.filter((c) => String(c?.contactType || "").toLowerCase() === "email")
			}
		} catch (error) {
			console.error("Error fetching existing user email contacts:", error.message)
		}
	}

	return {
		props: {
			metadataProp,
			sessionUser: session.user,
			emailContacts,
		},
	}
}
