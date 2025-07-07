/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import { useState } from "react"
import { signOut } from "next-auth/react"
import apiClient from "@/libs/api"
import { usePrivate } from "@/hooks/usePrivate"
import TagSEO from "@/components/TagSEO"
import UploadPictureForm1 from "/components/widgets/uploadPic"

export default function Dashboard() {
	// Custom hook to make private pages easier to deal with (see /hooks folder)
	const [session, status] = usePrivate({})
	const [isLoading, setIsLoading] = useState(false)
	const [profileParagraph, setProfileParagraph] = useState(session?.user?.profileParagraph || "")
	const [artEndeavors, setArtEndeavors] = useState(session?.user?.artEndeavors || "")
	const [profilePicture, setProfilePicture] = useState(session?.user?.image || "")

	const handleProfileUpdate = async () => {
		setIsLoading(true)
		try {
			await apiClient.put("/user/profile", {
				profileParagraph,
				artEndeavors,
				profilePicture,
			})
			alert("Profile updated successfully")
		} catch (error) {
			console.error("Error updating profile:", error.message)
			alert("Error updating profile")
		} finally {
			setIsLoading(false)
		}
	}

	// Show a loader when the session is loading. Not needed but recommended if you show user data like email/name
	if (status === "loading") {
		return <p>Loading...</p>
	}

	return (
		<>
			<main className="min-h-screen p-8 pb-24 bg-base-200">
				<section className="max-w-xl mx-auto space-y-8">
					<h1 className="text-3xl md:text-4xl font-extrabold text-primary">Your Profile</h1>
					<p className="text-lg leading-relaxed text-base-content">
						{status === "authenticated"
							? `Welcome ${session?.user?.name}`
							: "You are not logged in"}
					</p>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Email:</span>
						</label>
						<p className="text-base-content">{session?.user?.email || "N/A"}</p>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">User ID:</span>
						</label>
						<p className="text-base-content">{session?.user?.id || "N/A"}</p>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Role:</span>
						</label>
						<p className="text-base-content">{session?.user?.role || "N/A"}</p>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Profile Paragraph:</span>
						</label>
						<textarea
							value={profileParagraph}
							onChange={(e) => setProfileParagraph(e.target.value)}
							placeholder="Write something about yourself"
							className="textarea textarea-bordered w-full"
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Art Endeavors:</span>
						</label>
						<textarea
							value={artEndeavors}
							onChange={(e) => setArtEndeavors(e.target.value)}
							placeholder="Describe your art endeavors"
							className="textarea textarea-bordered w-full"
						/>
					</div>
					<div className="form-control">
						<label className="label">
							<span className="label-text">Profile Picture:</span>
						</label>
						<UploadPictureForm1
							context="user-profile"
							topFolder="profile-pictures"
							onUploadComplete={(url) => setProfilePicture(url)}
						/>
						{profilePicture && (
							<img src={profilePicture} alt="Profile Picture" className="mt-4 rounded-lg" />
						)}
					</div>
					<div className="flex space-x-4">
						<button
							className={`btn btn-primary ${isLoading ? "loading" : ""}`}
							onClick={handleProfileUpdate}
							disabled={isLoading}
						>
							{isLoading ? "Updating..." : "Update Profile"}
						</button>
						<button
							className="btn btn-ghost"
							onClick={() => signOut({ callbackUrl: "/" })}
						>
							Logout
						</button>
					</div>
				</section>
			</main>
		</>
	)
}