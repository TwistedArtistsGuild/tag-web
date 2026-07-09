/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



///////////////// Imports
import Link from "next/link"
import { useState, useMemo } from "react"
import { getServerSession } from "next-auth/next"
import shortDateOptions from "@/utils/shortdateoptions"
import TagSEO from "@/components/TagSEO"
import StaffContextNav from "@/components/portal/StaffContextNav"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isStaff } from "@/utils/authHelpers"

const Log = props => {
	const options = shortDateOptions
	const [search, setSearch] = useState("")
	const [sortColumn, setSortColumn] = useState("logtimestamp")
	const [sortDirection, setSortDirection] = useState("desc")
	const [filters, setFilters] = useState({
		tags: "",
		critical: "",
	})
	
	const pageMetaData = {
		title: "Log Viewer",
		description: "View and search system logs",
		keywords: "logs, system, staff",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Log Viewer",
			description: "View and search system logs",
		},
	}

	// Filter and sort logs
	const filteredAndSortedLogs = useMemo(() => {
		let filtered = props.logs.filter(log => {
			const searchTerm = search.toLowerCase()
			const matchesSearch = !searchTerm || 
				String(log.lognum).toLowerCase().includes(searchTerm) ||
				(log.tags || "").toLowerCase().includes(searchTerm) ||
				(log.shorttext || "").toLowerCase().includes(searchTerm) ||
				(log.longtext || "").toLowerCase().includes(searchTerm)

			const matchesTags = !filters.tags || (log.tags || "").toLowerCase().includes(filters.tags.toLowerCase())
			const matchesCritical = !filters.critical || String(log.critical).toLowerCase() === filters.critical.toLowerCase()

			return matchesSearch && matchesTags && matchesCritical
		})

		// Sort
		filtered.sort((a, b) => {
			let aVal = a[sortColumn]
			let bVal = b[sortColumn]

			if (sortColumn === "logtimestamp") {
				aVal = new Date(aVal || 0).getTime()
				bVal = new Date(bVal || 0).getTime()
			} else if (aVal && bVal) {
				aVal = String(aVal).toLowerCase()
				bVal = String(bVal).toLowerCase()
			}

			if (sortDirection === "asc") {
				return aVal > bVal ? 1 : -1
			} else {
				return aVal < bVal ? 1 : -1
			}
		})

		return filtered
	}, [props.logs, search, sortColumn, sortDirection, filters])

	const toggleSort = (column) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc")
		} else {
			setSortColumn(column)
			setSortDirection("desc")
		}
	}

	const SortHeader = ({ column, label }) => (
		<th 
			onClick={() => toggleSort(column)}
			className="cursor-pointer hover:bg-base-300 select-none"
		>
			<div className="flex items-center gap-2">
				{label}
				{sortColumn === column && (
					<span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
				)}
			</div>
		</th>
	)

	return (
		<div className="min-h-screen w-full bg-base-200">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/staff/logviewer" />
			<div className="p-4">
				<StaffContextNav />
				<div className="w-full space-y-4">
					<div className="card bg-base-100 shadow border border-base-300">
						<div className="card-body">
							<h1 className="text-3xl font-bold text-primary">Log Viewer</h1>
							<p className="text-base-content/70">Search, filter, and sort system logs</p>
						</div>
					</div>

					{/* Search and Filter Bar */}
					<div className="card bg-base-100 shadow border border-base-300">
						<div className="card-body space-y-4">
							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">Search Logs</span>
								</label>
								<input 
									type="text" 
									placeholder="Search by log ID, tags, short text, or long text..." 
									className="input input-bordered w-full"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="form-control">
									<label className="label">
										<span className="label-text">Filter by Tags</span>
									</label>
									<input 
										type="text" 
										placeholder="e.g., error, warning, info..."
										className="input input-bordered"
										value={filters.tags}
										onChange={(e) => setFilters({...filters, tags: e.target.value})}
									/>
								</div>

								<div className="form-control">
									<label className="label">
										<span className="label-text">Filter by Critical</span>
									</label>
									<select 
										className="select select-bordered"
										value={filters.critical}
										onChange={(e) => setFilters({...filters, critical: e.target.value})}
									>
										<option value="">All</option>
										<option value="true">True</option>
										<option value="false">False</option>
									</select>
								</div>
							</div>

							<div className="text-sm text-base-content/60">
								Showing {filteredAndSortedLogs.length} of {props.logs.length} logs
							</div>
						</div>
					</div>

					{/* Table */}
					<div className="card bg-base-100 shadow border border-base-300 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="table table-zebra w-full">
								<thead className="bg-base-300">
									<tr>
										<SortHeader column="lognum" label="Log ID" />
										<SortHeader column="tags" label="Tags" />
										<SortHeader column="shorttext" label="Short Text" />
										<SortHeader column="longtext" label="Long Text" />
										<SortHeader column="critical" label="Critical" />
										<SortHeader column="logtimestamp" label="Timestamp" />
									</tr>
								</thead>
								<tbody>
									{filteredAndSortedLogs.length > 0 ? (
										filteredAndSortedLogs.map((log) => (
											<tr key={`log#${log.lognum}`} className="hover:bg-base-200">
												<td>
													<Link
														href="/portal/staff/logviewer/[lognum]"
														as={`/portal/staff/logviewer/${log.lognum}`}
														className="link link-primary font-mono"
													>
														{log.lognum}
													</Link>
												</td>
												<td className="text-sm">{log.tags || "-"}</td>
												<td className="text-sm max-w-xs truncate">{log.shorttext || "-"}</td>
												<td className="text-sm max-w-xs truncate">{log.longtext || "-"}</td>
												<td>
													<span className={`badge ${log.critical ? "badge-error" : "badge-info"}`}>
														{String(log.critical)}
													</span>
												</td>
												<td className="text-xs text-base-content/60">
													{log.logtimestamp ? new Date(log.logtimestamp.toString()).toLocaleDateString("en-US", options) : "-"}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan="6" className="text-center py-8 text-base-content/50">
												No logs found matching your search criteria
											</td>
										</tr>
									)}
								</tbody>
							</table>
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
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/staff/logviewer")}`,
				permanent: false,
			},
		}
	}

	if (!isStaff(session) && !isAdmin(session)) {
		return {
			notFound: true,
		}
	}
    
	//Staging API can be added here if needed

	const res = await fetch("/api/log/")
	const data = await res.json()
    
	return {
		props: {
			logs: data,
		},
	}
}

export default Log


