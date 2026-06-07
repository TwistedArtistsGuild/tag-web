/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useEffect, useState } from "react"
import { getServerSession } from "next-auth/next"

import getApiURL from "@/components/widgets/GetApiURL"
import TagSEO from "@/components/TagSEO"
import ArtistContextNav from "@/components/portal/ArtistContextNav"
import SocialHandlesForm from "@/components/forms/contact/social-handles-form"
import ArtistCard from "@/components/cards/card_artist"
import { SocialRealtimeProvider } from "@/components/social/SocialRealtimeContext"
import AddressForm from "@/components/forms/contact/address-form"
import EmailForm from "@/components/forms/contact/email-form"
import PhoneForm from "@/components/forms/contact/phone-form"
import UrlLinksForm from "@/components/forms/contact/url-links-form"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isArtist, isStaff } from "@/utils/authHelpers"

const TABS = [
  { key: "social", label: "Social Handles" },
  { key: "urls", label: "URLs" },
	{ key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
]

export default function ArtistManageContactsPage({
	selectedArtist,
	sessionUser,
	socialContacts = [],
	urlContacts = [],
	emailContacts = [],
	phoneContacts = [],
	addressContacts = [],
}) {
	const [activeTab, setActiveTab] = useState("social")
	const [artistCardData, setArtistCardData] = useState(null)

	useEffect(() => {
		if (!selectedArtist?.path) return
		const apiUrl = getApiURL()
		fetch(`${apiUrl}artist/${selectedArtist.path}/profile`)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (!data?.artist) return
				setArtistCardData({
					...data.artist,
					profilePic: data.profilePic || data.artist.profilePic || null,
					coverPic: data.coverPic || data.artist.coverPic || null,
						panelSize: "third",
				})
			})
			.catch(() => {})
	}, [selectedArtist?.path])

	return (
		<SocialRealtimeProvider>
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO
				metadataProp={{
					title: "Manage Artist Contacts",
					description: "Manage social handles, URLs, phone numbers, and addresses.",
					robots: "noindex, nofollow",
				}}
				canonicalSlug={`portal/artist/${selectedArtist?.path || ""}/manage-contacts`}
			/>
			<ArtistContextNav />

			<div className="max-w-4xl mx-auto space-y-4">
				<div className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body gap-2">
						<div className="flex items-center justify-between flex-wrap gap-2">
							<h1 className="text-2xl font-bold text-primary">Manage Contacts</h1>
							<Link href={`/portal/artist/${selectedArtist?.path || ""}`} className="btn btn-sm btn-ghost">Back to Artist Portal</Link>
						</div>
						<p className="text-xs text-base-content/50">
							Signed in as {sessionUser?.name || sessionUser?.email || "Artist user"}.
						</p>
						{artistCardData && <ArtistCard artist={artistCardData} showContentGallery={false} />}
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

						{activeTab === "social" && (
							<SocialHandlesForm artistID={selectedArtist?.artistID} existingContacts={socialContacts} />
						)}
						{activeTab === "urls" && (
							<UrlLinksForm artistID={selectedArtist?.artistID} existingContacts={urlContacts} />
						)}
						{activeTab === "phone" && (
							<PhoneForm
								artistID={selectedArtist?.artistID}
								existingContacts={phoneContacts}
							/>
						)}
						{activeTab === "email" && (
							<EmailForm
								context="artist"
								entityID={selectedArtist?.artistID}
								existingContacts={emailContacts}
							/>
						)}
						{activeTab === "address" && (
							<AddressForm
								artistID={selectedArtist?.artistID}
								existingContacts={addressContacts}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
		</SocialRealtimeProvider>
	)
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions)
	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(`/portal/artist/${context.query.slug}/manage-contacts`)}`,
				permanent: false,
			},
		}
	}

	const apiUrl = getApiURL()
	const slug = String(context.query.slug || "").trim().toLowerCase()
	const userId = Number(session.user.id)
	let linkedArtists = []

	if (Number.isFinite(userId) && userId > 0) {
		try {
			const response = await fetch(`${apiUrl}linker_usertoartist/byUserID/${userId}`)
			if (response.ok) {
				const data = await response.json()
				linkedArtists = Array.isArray(data)
					? data.map((artist) => ({
						artistID: artist?.artistID ?? artist?.ArtistID ?? null,
						title: artist?.title ?? artist?.Title ?? "Untitled Artist",
						path: String(artist?.path ?? artist?.Path ?? "").trim().toLowerCase(),
					}))
					: []
			}
		} catch (error) {
			console.error("Unable to load linked artists for contact manager:", error.message)
		}
	}

	const privilegedUser = isArtist(session) || isStaff(session) || isAdmin(session)
	if (!privilegedUser && linkedArtists.length === 0) {
		return { notFound: true }
	}

	const linkedArtistEntry = linkedArtists.find((a) => a.path === slug) || null
	let selectedArtist = null

	try {
		if (slug) {
			const profileRes = await fetch(`${apiUrl}artist/${slug}/profile`)
			if (profileRes.ok) {
				const profileData = await profileRes.json()
				const artistId = Number(profileData?.artist?.artistID || profileData?.artist?.ArtistID || 0)
				if (artistId > 0) {
					selectedArtist = profileData.artist
					// Ensure artistID is always available as a number
					if (!selectedArtist.artistID) selectedArtist.artistID = artistId
					if (!selectedArtist.path) selectedArtist.path = slug
				}
			}
		}
		if (!selectedArtist && linkedArtistEntry) {
			// Fallback to minimal data if profile fetch fails
			selectedArtist = linkedArtistEntry
		}
	} catch (error) {
		console.error("Error resolving artist for social contact form:", error.message)
		selectedArtist = linkedArtistEntry
	}

	if (!selectedArtist) {
		return { notFound: true }
	}

	if (!privilegedUser) {
		const isLinkedToArtist = linkedArtists.some((a) => a.artistID === selectedArtist?.artistID)
		if (!isLinkedToArtist) {
			return { notFound: true }
		}
	}

	let socialContacts = []
	let urlContacts = []
	let emailContacts = []
	let phoneContacts = []
	let addressContacts = []
	try {
		const contactsRes = await fetch(`${apiUrl}contact/artist/${selectedArtist.artistID}?includePrivate=true`)
		if (contactsRes.ok) {
			const contactsData = await contactsRes.json()
			const rows = Array.isArray(contactsData?.contacts) ? contactsData.contacts : []
			phoneContacts = rows.filter((c) => String(c?.contactType || "").toLowerCase() === "phone")
			emailContacts = rows.filter((c) => String(c?.contactType || "").toLowerCase() === "email")
			addressContacts = rows.filter((c) => String(c?.contactType || "").toLowerCase() === "address")
			urlContacts = rows.filter(
				(c) =>
					String(c?.contactType || "").toLowerCase() === "url" &&
					String(c?.category || "").toLowerCase() === "website"
			)
			socialContacts = rows.filter(
				(c) => String(c?.contactType || "").toLowerCase() === "url" && String(c?.category || "").toLowerCase() !== "website"
			)
		}
	} catch (error) {
		console.error("Error fetching existing social contacts:", error.message)
	}

	return {
		props: {
			selectedArtist,
			sessionUser: session.user,
			socialContacts,
			urlContacts,
			emailContacts,
			phoneContacts,
			addressContacts,
		},
	}
}
