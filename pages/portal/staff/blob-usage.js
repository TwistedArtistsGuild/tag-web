/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useState, useMemo } from "react"
import { getServerSession } from "next-auth/next"
import TagSEO from "@/components/TagSEO"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isStaff } from "@/utils/authHelpers"

export default function BlobUsageReport() {
	const [usage, setUsage] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [timestamp, setTimestamp] = useState("")

	const formatBytes = (bytes) => {
		if (!bytes) return "0 B"
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
		if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
	}

	const loadReport = async () => {
		setLoading(true)
		setError("")
		try {
			const response = await fetch("/api/blob/usage-report")
			const data = await response.json()
			if (!response.ok) {
				throw new Error(data.error || "Failed to load report")
			}
			setUsage(data.usage)
			setTimestamp(data.timestamp)
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadReport()
	}, [])

	const sortedContainers = useMemo(() => {
		if (!usage) return []
		return Object.entries(usage).map(([containerName, folders]) => {
			const sortedFolders = Object.entries(folders)
				.sort((a, b) => b[1].bytes - a[1].bytes)
				.map(([folderName, stats]) => ({
					name: folderName,
					...stats,
				}))
			const totalBytes = Object.values(folders).reduce((sum, f) => sum + f.bytes, 0)
			return {
				containerName,
				folders: sortedFolders,
				totalBytes,
			}
		})
	}, [usage])

	return (
		<div className="p-4 bg-base-200 min-h-screen">
			<TagSEO
				metadataProp={{
					title: "Blob Usage Report",
					description: "Azure Blob Storage usage analysis by container and folder",
					keywords: "storage, usage, report",
					robots: "noindex, nofollow",
					og: {
						title: "Blob Usage Report",
						description: "Storage usage analysis",
					},
				}}
				canonicalSlug="portal/staff/blob-usage"
			/>

			<div className="max-w-6xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold text-primary">Blob Storage Usage Report</h1>
					<button
						className="btn btn-sm btn-outline"
						onClick={loadReport}
						disabled={loading}
					>
						{loading ? "Loading..." : "Refresh"}
					</button>
				</div>

				{timestamp && (
					<div className="text-sm text-base-content/60 mb-4">
						Last updated: {new Date(timestamp).toLocaleString()}
					</div>
				)}

				{error && <div className="alert alert-error mb-6">{error}</div>}

				{loading ? (
					<div className="text-center py-12">
						<p className="text-base-content/60">Loading usage data...</p>
					</div>
				) : !usage ? (
					<div className="alert alert-warning">No data available</div>
				) : (
					<div className="space-y-6">
						{sortedContainers.map(({ containerName, folders, totalBytes }) => (
							<div key={containerName} className="card bg-base-100 shadow-md border border-base-300">
								<div className="card-body">
									<h2 className="card-title text-xl">{containerName}</h2>
									<div className="text-sm text-base-content/70 mb-4">
										Total: {formatBytes(totalBytes)} ({folders.reduce((sum, f) => sum + f.count, 0)} files)
									</div>

									<div className="overflow-x-auto">
										<table className="table table-sm">
											<thead>
												<tr>
													<th>Folder</th>
													<th>Files</th>
													<th>Size</th>
													<th>% of Total</th>
												</tr>
											</thead>
											<tbody>
												{folders.map((folder) => {
													const percentage =
														totalBytes > 0 ? ((folder.bytes / totalBytes) * 100).toFixed(1) : 0
													return (
														<tr key={folder.name}>
															<td className="font-mono text-sm break-all">
																{folder.name === "__root__" ? "(root)" : folder.name}
																{Object.keys(folder.subfolders || {}).length > 0 && (
																	<div className="text-xs text-base-content/60 mt-1">
																		Subfolders: {Object.keys(folder.subfolders).join(", ")}
																	</div>
																)}
															</td>
															<td>{folder.count}</td>
															<td>{formatBytes(folder.bytes)}</td>
															<td>
																<div className="flex items-center gap-2">
																	<div className="w-24 bg-base-300 rounded-full h-2">
																		<div
																			className="bg-primary h-2 rounded-full"
																			style={{ width: `${Math.min(percentage, 100)}%` }}
																		/>
																	</div>
																	<span className="text-sm">{percentage}%</span>
																</div>
															</td>
														</tr>
													)
												})}
											</tbody>
										</table>
									</div>

									{folders.some((f) => Object.keys(f.subfolders || {}).length > 0) && (
										<div className="mt-4 pt-4 border-t border-base-300">
											<details className="collapse collapse-arrow bg-base-200">
												<summary className="collapse-title text-sm font-semibold">
													Subfolder Details
												</summary>
												<div className="collapse-content">
													<div className="space-y-3 mt-3">
														{folders.map((folder) => {
															const subfolders = Object.entries(
																folder.subfolders || {}
															).sort((a, b) => b[1].bytes - a[1].bytes)

															if (subfolders.length === 0) return null

															return (
																<div key={folder.name}>
																	<h4 className="text-sm font-semibold text-base-content/80">
																		{folder.name === "__root__" ? "(root)" : folder.name}
																	</h4>
																	<div className="ml-4 space-y-1 text-xs">
																		{subfolders.map(([subfolder, stats]) => (
																			<div
																				key={subfolder}
																				className="flex justify-between text-base-content/70"
																			>
																				<span>{subfolder}</span>
																				<span>
																					{formatBytes(stats.bytes)} ({stats.count} files)
																				</span>
																			</div>
																		))}
																	</div>
																</div>
															)
														})}
													</div>
												</div>
											</details>
										</div>
									)}
								</div>
							</div>
						))}
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
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/staff/blob-usage")}`,
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
