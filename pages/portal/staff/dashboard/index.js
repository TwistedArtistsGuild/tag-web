/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { getServerSession } from "next-auth/next"

import TagSEO from "@/components/TagSEO"
import StaffContextNav from "@/components/portal/StaffContextNav"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isStaff } from "@/utils/authHelpers"

export default function StaffDashboardIndex() {
	const pageMetaData = {
		title: "Staff Dashboard",
		description: "Staff dashboard landing page.",
		keywords: "staff, dashboard, portal",
		robots: "no-index, no-follow",
		og: {
			title: "Staff Dashboard",
			description: "Staff dashboard landing page.",
		},
	}

	return (
		<div className="p-4 bg-base-200 min-h-screen">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/staff/dashboard" />				<StaffContextNav />			<div className="max-w-4xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<h1 className="text-3xl font-bold text-primary">Staff Dashboard</h1>
						<p className="text-base-content/70">
							Simple landing page for staff dashboard tools and future operational widgets.
						</p>
					</div>
				</div>

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<h2 className="text-lg font-semibold text-base-content">Current Entry Points</h2>
						<div className="flex gap-2 flex-wrap">
							<Link href="/portal/staff/logviewer" className="btn btn-sm btn-primary">Open Logviewer</Link>
							<Link href="/portal/staff/ghl-index" className="btn btn-sm btn-outline">CRM Index</Link>
							<Link href="/portal/staff" className="btn btn-sm btn-outline">Staff Portal Home</Link>
						</div>
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
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/staff/dashboard")}`,
				permanent: false,
			},
		}
	}

	if (!isStaff(session) && !isAdmin(session)) {
		return {
			notFound: true,
		}
	}

	return { props: {} }
}
