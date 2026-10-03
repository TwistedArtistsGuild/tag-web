/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getServerSession } from "next-auth/next"

import TagSEO from "@/components/TagSEO"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isStaff } from "@/utils/authHelpers"

export default function BugViewerDetailPage() {
	const router = useRouter()
	const { id } = router.query
	const [item, setItem] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [status, setStatus] = useState("new")
	const [note, setNote] = useState("")
	const [saving, setSaving] = useState(false)

	const loadItem = async () => {
		if (!id) return
		setLoading(true)
		setError("")
		try {
			const response = await fetch(`/api/bug-report/${id}`)
			const body = await response.json().catch(() => ({}))
			if (!response.ok) {
				throw new Error(body?.error || "Failed to load report")
			}
			setItem(body.item)
			setStatus(body?.item?.status || "new")
		} catch (loadError) {
			setError(loadError?.message || "Failed to load report")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const run = async () => {
			await loadItem()
		}

		run()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id])

	const saveNote = async (event) => {
		event.preventDefault()
		setSaving(true)
		setError("")
		try {
			const response = await fetch(`/api/bug-report/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ note, status }),
			})
			const body = await response.json().catch(() => ({}))
			if (!response.ok) {
				throw new Error(body?.error || "Failed to update report")
			}
			setItem(body.item)
			setStatus(body?.item?.status || "new")
			setNote("")
		} catch (saveError) {
			setError(saveError?.message || "Failed to update report")
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="min-h-screen bg-base-200 text-base-content p-4 md:p-6">
			<TagSEO
				metadataProp={{
					title: "Bug Report Detail",
					description: "Staff bug report detail view",
					keywords: "bug reports, detail",
					robots: "noindex, nofollow",
					og: { title: "Bug Report Detail", description: "Staff bug report detail view" },
				}}
				canonicalSlug="portal/staff/bugviewer/[id]"
			/>

			<div className="max-w-6xl mx-auto space-y-4">
				<div className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 p-4">
					<div>
						<h1 className="text-2xl font-bold">Bug Report</h1>
						<p className="text-sm text-base-content/70 font-mono">{id}</p>
					</div>
					<Link href="/portal/staff/bugviewer" className="btn btn-outline btn-sm">Back</Link>
				</div>

				{loading && <div className="alert"><span>Loading report...</span></div>}
				{error && <div className="alert alert-error"><span>{error}</span></div>}

				{!loading && item && (
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<div className="lg:col-span-2 space-y-4">
							<div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-3">
								<div><span className="font-semibold">Status:</span> <span className="badge badge-outline">{item.status || "new"}</span></div>
								<div><span className="font-semibold">Short Description:</span> {item.shortDescription || "-"}</div>
								<div><span className="font-semibold">Expected Behavior:</span> {item.expectedBehavior || "-"}</div>
								<div><span className="font-semibold">Detailed Description:</span> {item.longDescription || "-"}</div>
								<div><span className="font-semibold">Reporter Email:</span> {item.reporterEmail || "-"}</div>
								<div><span className="font-semibold">Created:</span> {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</div>
							</div>

							<div className="rounded-xl border border-base-300 bg-base-100 p-4">
								<h2 className="text-lg font-semibold mb-2">Diagnostics</h2>
								<pre className="bg-base-200 rounded-lg p-3 text-xs overflow-auto max-h-90">{JSON.stringify(item?.diagnostics || [], null, 2)}</pre>
							</div>
						</div>

						<div className="space-y-4">
							<div className="rounded-xl border border-base-300 bg-base-100 p-4">
								<h2 className="text-lg font-semibold mb-2">Staff Notes</h2>
								<form className="space-y-3" onSubmit={saveNote}>
									<label className="form-control">
										<span className="label-text">Status</span>
										<select className="select select-bordered" value={status} onChange={(e) => setStatus(e.target.value)}>
											<option value="new">new</option>
											<option value="triaged">triaged</option>
											<option value="in-progress">in-progress</option>
											<option value="resolved">resolved</option>
											<option value="closed">closed</option>
										</select>
									</label>

									<label className="form-control">
										<span className="label-text">Add Note</span>
										<textarea
											className="textarea textarea-bordered min-h-32"
											value={note}
											onChange={(e) => setNote(e.target.value)}
											placeholder="Add triage notes, fix details, or follow-up actions"
										/>
									</label>

									<button type="submit" className={`btn btn-primary w-full ${saving ? "btn-disabled" : ""}`} disabled={saving}>
										{saving ? "Saving..." : "Save"}
									</button>
								</form>
							</div>

							<div className="rounded-xl border border-base-300 bg-base-100 p-4 space-y-3">
								{(item.staffNotes || []).length === 0 && <div className="text-sm text-base-content/70">No staff notes yet.</div>}
								{(item.staffNotes || []).slice().reverse().map((entry) => (
									<div key={entry.noteId} className="rounded-lg border border-base-300 p-3">
										<div className="text-xs text-base-content/70">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ""}</div>
										<div className="text-sm mt-1 whitespace-pre-wrap">{entry.note}</div>
										<div className="text-xs mt-2 text-base-content/60">{entry?.author?.name || entry?.author?.email || "staff"}</div>
									</div>
								))}
							</div>
						</div>
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
