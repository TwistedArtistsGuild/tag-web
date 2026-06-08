/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useEffect, useState } from "react"
import { getServerSession } from "next-auth/next"

import TagSEO from "@/components/TagSEO"
import StaffContextNav from "@/components/portal/StaffContextNav"
import getApiURL from "@/components/widgets/GetApiURL"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isStaff } from "@/utils/authHelpers"

export default function BugViewerIndexPage() {
	const [items, setItems] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const apiBaseUrl = getApiURL()

	useEffect(() => {
		const load = async () => {
			setLoading(true)
			setError("")
			try {
				const response = await fetch(`${apiBaseUrl}bug-report`)
				const body = await response.json().catch(() => ({}))
				if (!response.ok) {
					throw new Error(body?.error || "Failed to load bug reports")
				}
				setItems(Array.isArray(body.items) ? body.items : [])
			} catch (loadError) {
				setError(loadError?.message || "Failed to load bug reports")
			} finally {
				setLoading(false)
			}
		}

		load()
	}, [apiBaseUrl])

	return (
		<div className="min-h-screen bg-base-200 text-base-content p-4 md:p-6">
			<TagSEO
				metadataProp={{
					title: "Bug Viewer",
					description: "Staff and admin bug report viewer",
					keywords: "bug reports, staff",
					robots: "noindex, nofollow",
					og: { title: "Bug Viewer", description: "Staff and admin bug report viewer" },
				}}
				canonicalSlug="portal/staff/bugviewer"
			/>

			<StaffContextNav />

			<div className="max-w-7xl mx-auto space-y-4">
				<div className="rounded-xl border border-base-300 bg-base-100 p-4">
					<h1 className="text-2xl font-bold">Bug Viewer</h1>
					<p className="text-sm text-base-content/70 mt-1">Review submitted bug reports and open individual details to add staff notes.</p>
				</div>

				{loading && <div className="alert"><span>Loading bug reports...</span></div>}
				{error && <div className="alert alert-error"><span>{error}</span></div>}

				{!loading && !error && (
					<div className="rounded-xl border border-base-300 bg-base-100 overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th>ID</th>
									<th>Created</th>
									<th>Status</th>
									<th>Summary</th>
									<th>Path</th>
									<th>Reporter</th>
									<th>Notes</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{items.map((item) => (
									<tr key={item.id}>
										<td className="font-mono text-xs">{String(item.id || "").slice(0, 8)}</td>
										<td>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
										<td><span className="badge badge-outline">{item.status || "new"}</span></td>
										<td>{item.shortDescription || "(no summary)"}</td>
										<td className="max-w-55 truncate">{item.path || "-"}</td>
										<td>{item.reporterEmail || "-"}</td>
										<td>{item.staffNotesCount || 0}</td>
										<td>
											<Link href={`/portal/staff/bugviewer/${item.id}`} className="btn btn-sm btn-primary">
												Open
											</Link>
										</td>
									</tr>
								))}
								{items.length === 0 && (
									<tr>
										<td colSpan={8} className="text-center text-base-content/70 py-8">No bug reports submitted yet.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(context.resolvedUrl)}`,
				permanent: false,
			},
		}
	}

	if (!isStaff(session) && !isAdmin(session)) {
		return { notFound: true }
	}

	return { props: {} }
}
