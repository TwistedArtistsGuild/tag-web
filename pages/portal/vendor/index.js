/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import Link from "next/link";
import TagSEO from "@/components/TagSEO";
import VendorContextNav from "@/components/portal/VendorContextNav";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getApiURL from "@/components/widgets/GetApiURL";

export default function Portal_Vendor({ vendors }) {
	const pageMetaData = {
		title: "Vendor Portal",
		description: "Vendor workspace and routing hub.",
		keywords: "Vendor, Dashboard, Reports, Slug",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Vendor Portal",
			description: "Vendor workspace and routing hub.",
		},
	};

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/vendor" />				<VendorContextNav />			<div className="mx-auto max-w-6xl space-y-6">
				<section className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body gap-3">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<div>
								<p className="text-xs uppercase tracking-widest text-base-content/50">Portal Domain</p>
								<h1 className="text-3xl font-bold text-primary mt-1">Vendor Workspace</h1>
							</div>

						</div>
						<p className="text-base-content/75 max-w-3xl">
							Access vendor-specific slug routes, profile management, and related operational pages using a consistent portal UX surface.
						</p>
					</div>
				</section>
				<section className="card bg-base-100 shadow border border-base-300">
					<div className="card-body gap-3">
						<h2 className="text-xl font-semibold text-base-content">Linked Vendors</h2>
						<p className="text-sm text-base-content/70">Vendor entities attributed to your user account.</p>
						{Array.isArray(vendors) && vendors.length > 0 ? (
							<div className="overflow-x-auto rounded-xl border border-base-300">
								<table className="table table-zebra table-sm">
									<thead>
										<tr>
											<th>Vendor</th>
											<th>Slug</th>
											<th>Status</th>
											<th className="text-right">Portal</th>
										</tr>
									</thead>
									<tbody>
										{vendors.map((vendor) => {
											const slug = vendor.path || vendor.slug || ""
											return (
												<tr key={`${vendor.vendorID || vendor.id || slug || vendor.title}`}> 
													<td className="font-medium">{vendor.title || vendor.name || "Untitled Vendor"}</td>
													<td><code>{slug || "(no slug)"}</code></td>
													<td>
														{vendor.isPublished ? <span className="badge badge-success badge-sm">Published</span> : <span className="badge badge-warning badge-sm">Draft</span>}
													</td>
													<td className="text-right">
														{slug ? <Link href={`/portal/vendor/${slug}`} className="btn btn-xs btn-primary">Open</Link> : <span className="badge badge-ghost badge-sm">n/a</span>}
													</td>
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						) : (
							<div className="alert alert-info text-sm">No linked vendors found for this account.</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/vendor")}`,
				permanent: false,
			},
		};
	}

	const userId = Number(session.user.id || 0)
	let vendors = []

	if (userId > 0) {
		try {
			const apiUrl = getApiURL()

			const linkerResponse = await fetch(`${apiUrl}linker_vendortouser`)
			const linkerRows = linkerResponse.ok ? await linkerResponse.json() : []
			const linkRows = Array.isArray(linkerRows) ? linkerRows : []

			const linkedVendorIds = Array.from(
				new Set(
					linkRows
						.filter((row) => Number(row?.userID || row?.UserID || row?.userId || row?.UserId || 0) === userId)
						.map((row) => Number(row?.vendorID || row?.VendorID || row?.vendorId || row?.VendorId || 0))
						.filter((value) => Number.isFinite(value) && value > 0),
				),
			)

			if (linkedVendorIds.length > 0) {
				const vendorResults = await Promise.all(
					linkedVendorIds.map(async (vendorId) => {
						try {
							const response = await fetch(`${apiUrl}vendor/byID/${vendorId}`)
							if (!response.ok) {
								return null
							}

							const data = await response.json()
							return {
								vendorID: data?.vendorID ?? data?.VendorID ?? vendorId,
								title: data?.title ?? data?.Title ?? data?.name ?? data?.Name ?? "",
								path: data?.path ?? data?.Path ?? "",
								slug: data?.slug ?? data?.Slug ?? "",
								isPublished: Boolean(data?.isPublished ?? data?.IsPublished),
							}
						} catch {
							return null
						}
					}),
				)

				vendors = vendorResults.filter(Boolean)
			}
		} catch (error) {
			console.error("Unable to load linked vendors for vendor portal:", error.message)
		}
	}

	return { props: { vendors } };
}
