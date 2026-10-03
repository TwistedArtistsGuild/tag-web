/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

import TagSEO from "@/components/TagSEO"
import { useAppContext } from "@/components/Context"
import DynamicComments, { CommentTargetType } from "@/components/social/DynamicComments"

const userSections = [
	{ id: "profile", label: "Profile" },
	{ id: "comments", label: "Comments & Feedback" },
]

function getUserId(user) {
	return user?.userId ?? user?.userID ?? user?.UserID ?? null
}

function getUsername(user) {
	return String(user?.username ?? user?.Username ?? "").trim()
}

function getDisplayName(user) {
	const preferredName = String(user?.preferredName ?? user?.PreferredName ?? "").trim()
	return preferredName || getUsername(user)
}

function getProfilePic(user) {
	return String(user?.profilePic ?? user?.ProfilePic ?? "").trim()
}

export default function UserProfile(props) {
	const { data: session } = useSession()
	const { setPageSections } = useAppContext()
	const displayName = getDisplayName(props.user)
	const username = getUsername(props.user)
	const profilePic = getProfilePic(props.user)
	const userId = getUserId(props.user)

	useEffect(() => {
		setPageSections(userSections)
		return () => setPageSections([])
	}, [setPageSections])

	useEffect(() => {
		if (!props.user) console.warn("User data failed to load.")
	}, [props.user])

	const pageMetaData = {
		title: displayName || "User Profile",
		description: username ? `Public profile for @${username} on Twisted Artists Guild.` : "User profile page",
		keywords: username ? `user, profile, ${username}` : "user, profile",
		robots: "index, follow",
		author: displayName || username,
		viewport: "width=device-width, initial-scale=1.0",
		og: { title: displayName || "User Profile", description: username ? `Public profile for @${username}.` : "User profile page" },
	}

	return (
		
			<div className="min-h-screen bg-base-200">
				<TagSEO metadataProp={pageMetaData} canonicalSlug={`user/${props.slug}`} />

				{/* Hero Section */}
				<div className="bg-base-100 border-b border-base-300">
					<div className="max-w-5xl mx-auto px-4 py-8">
						<div className="flex flex-col md:flex-row gap-6 items-start">
							{profilePic && (
								<div className="w-32 h-32 shrink-0 rounded-lg overflow-hidden ring-2 ring-primary">
									<Image
										src={profilePic}
										alt={displayName || "User"}
										width={128}
										height={128}
										style={{ objectFit: "cover" }}
										priority
									/>
								</div>
							)}
							<div className="flex-1">
								<h1 className="text-3xl font-bold text-base-content">{displayName || "User Profile"}</h1>
								<p className="text-lg text-base-content/70 mt-2">{username ? `@${username}` : "Published TAG user"}</p>
							</div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
					{/* Profile Section */}
					<div id="profile" className="scroll-mt-20 card bg-base-100 shadow border border-base-300">
						<div className="card-body">
							<h2 className="text-2xl font-bold text-base-content mb-4">About</h2>
							<p className="text-base-content/70">
								{displayName || "This user"} has a published TAG profile.
							</p>
							{username ? (
								<p className="text-sm text-base-content/60 mt-2">
									Profile handle: @{username}
								</p>
							) : null}
						</div>
					</div>

					{/* Comments Section */}
					<div id="comments" className="scroll-mt-20">
						<DynamicComments
							targetType={CommentTargetType.USER}
							targetId={userId}
							currentUserId={session?.user?.id}
						/>
					</div>
				</div>

				{/* Footer Navigation */}
				<div className="bg-base-100 border-t border-base-300 mt-12">
					<div className="max-w-5xl mx-auto px-4 py-6">
						<Link href="/user" className="btn btn-ghost btn-sm">
							← Back to Users
						</Link>
					</div>
				</div>
			</div>
		
	)
}

export async function getStaticProps(context) {
	const { slug } = context.params

	try {
		const response = await fetch(`/api/user-details/by-username/${encodeURIComponent(slug)}`)
		if (!response.ok) {
			return { notFound: true }
		}

		const user = await response.json()

		return {
			props: {
				user,
				slug,
			},
			revalidate: 3600,
		}
	} catch (error) {
		console.error("Error fetching user profile:", error.message)
		return { notFound: true }
	}
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: "blocking",
	}
}

