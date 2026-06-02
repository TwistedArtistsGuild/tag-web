/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"

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

export default function UsersPage({ users = [] }) {
	const pageMetaData = {
		title: "User Directory",
		description: "Browse user profiles on Twisted Artists Guild.",
		keywords: "users, directory, profiles",
		robots: "index, follow",
		og: { title: "User Directory", description: "Browse user profiles." },
	}

	const [searchTerm, setSearchTerm] = useState("")
	const normalizedSearchTerm = searchTerm.trim().toLowerCase()

	const filteredUsers = users.filter((user) => {
		if (!normalizedSearchTerm) {
			return true
		}

		const displayName = getDisplayName(user).toLowerCase()
		const username = getUsername(user).toLowerCase()
		return displayName.includes(normalizedSearchTerm) || username.includes(normalizedSearchTerm)
	})

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="user" />

			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<h1 className="text-3xl font-bold text-base-content">User Directory</h1>
						<p className="text-base-content/70 mt-2">Browse profiles and connect with creators on TAG.</p>
					</div>
				</div>

				{/* Search */}
				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<input
							type="text"
							placeholder="Search users by name or description..."
							className="input input-bordered w-full"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{/* Users Grid */}
				{filteredUsers.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredUsers.map((user) => (
							(() => {
								const userId = getUserId(user)
								const username = getUsername(user)
								const displayName = getDisplayName(user)
								const profilePic = getProfilePic(user)

								return (
							<Link
								key={userId || username}
								href={username ? `/user/${encodeURIComponent(username)}` : "/user"}
								className="card bg-base-100 shadow border border-base-300 hover:shadow-lg hover:border-primary transition-all"
							>
								<div className="card-body">
									{profilePic && (
										<div className="relative w-full h-40 -mx-6 -mt-6 mb-4 rounded-t overflow-hidden">
											<Image
												src={profilePic}
												alt={displayName || "User"}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											/>
										</div>
									)}
									<h2 className="card-title text-lg text-base-content">{displayName || "Unnamed user"}</h2>
									<p className="text-sm text-base-content/70">{username ? `@${username}` : "Published profile"}</p>
									<div className="card-actions justify-end mt-4">
										<button className="btn btn-sm btn-primary">View Profile</button>
									</div>
								</div>
							</Link>
								)
							})()
						))}
					</div>
				) : (
					<div className="card bg-base-100 shadow border border-base-300">
						<div className="card-body text-center">
							<p className="text-base-content/60">
								{searchTerm ? "No users found matching your search." : "No users available."}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export async function getStaticProps() {
	const apiUrl = getApiURL()

	try {
		const response = await fetch(`${apiUrl}user-details`)
		if (!response.ok) {
			return { props: { users: [] }, revalidate: 3600 }
		}

		const users = await response.json()
		return {
			props: { users: Array.isArray(users) ? users : [] },
			revalidate: 3600,
		}
	} catch (error) {
		console.error("Error fetching users:", error.message)
		return { props: { users: [] }, revalidate: 3600 }
	}
}

