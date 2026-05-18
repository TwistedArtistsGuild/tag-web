/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { getServerSession } from "next-auth/next"

import TagSEO from "@/components/TagSEO"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default function PortalUserIndex() {
	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO
				metadataProp={{
					title: "User Portal",
					description: "User tools and contact management workspace.",
					robots: "noindex, nofollow",
				}}
				canonicalSlug="portal/user"
			/>

			<div className="max-w-4xl mx-auto space-y-4">
				<div className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body gap-2">
						<h1 className="text-2xl font-bold text-primary">User Portal</h1>
						<p className="text-sm text-base-content/70">User-level workspace for managing profile-related records.</p>
					</div>
				</div>

				<div className="card bg-base-100 border border-base-300 shadow">
					<div className="card-body p-4 gap-2">
						<Link href="/portal/user/manage-contacts" className="btn btn-primary btn-sm w-fit">Manage Contacts</Link>
						<p className="text-xs text-base-content/65">This uses the shared DynaForm metadata and links contacts to your current user account.</p>
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
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/user")}`,
				permanent: false,
			},
		}
	}

	return { props: {} }
}
