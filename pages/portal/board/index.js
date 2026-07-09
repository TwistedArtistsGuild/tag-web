/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { getServerSession } from "next-auth/next"

import TagSEO from "@/components/TagSEO"
import BoardContextNav from "@/components/portal/BoardContextNav"
import { stripHtmlText } from "@/components/security/sanitize"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isStaff } from "@/utils/authHelpers"

function getStatusBadgeClass(status) {
	const normalizedStatus = String(status || "").toLowerCase()
	if (normalizedStatus === "closed") return "badge-error"
	if (normalizedStatus === "seconded") return "badge-success"
	return "badge-warning"
}

const UPCOMING_BOARD_DECISIONS = [
	{ topic: "Q3 campaign budget reallocation", date: "Jul 8", owner: "Treasurer", readiness: "Brief drafted" },
	{ topic: "Artist onboarding SLA revision", date: "Jul 12", owner: "Operations", readiness: "Needs legal pass" },
	{ topic: "Marketplace fee policy update", date: "Jul 19", owner: "Finance", readiness: "Data review in progress" },
]

const TRUST_AND_SAFETY_QUEUE = [
	{ label: "Open moderation escalations", value: 6 },
	{ label: "Pending fraud investigations", value: 2 },
	{ label: "Vendor dispute cases", value: 4 },
]

function DashboardCard({ title, badge, children }) {
	return (
		<section className="card bg-base-100 shadow border border-base-300">
			<div className="card-body gap-3">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<h2 className="text-lg font-semibold text-base-content">{title}</h2>
					{badge ? <span className="badge badge-ghost">{badge}</span> : null}
				</div>
				{children}
			</div>
		</section>
	)
}

export default function BoardLandingPage({ motions }) {
	const pageMetaData = {
		title: "Board Portal",
		description: "Board dashboard prototype and motion review landing page.",
		keywords: "board, motions, governance, dashboard",
		robots: "no-index, no-follow",
		og: {
			title: "Board Portal",
			description: "Board dashboard prototype and motion review landing page.",
		},
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/board" />
			<BoardContextNav />

			<div className="max-w-6xl mx-auto space-y-6">
				<section className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body gap-4">
						<div className="flex items-start gap-4 flex-wrap">
							<div>
								<div className="text-xs uppercase tracking-widest text-base-content/50">Board Workspace</div>
								<h1 className="text-3xl font-bold text-primary mt-1">Board Landing Dashboard</h1>
								<p className="text-base-content/70 mt-2 max-w-3xl">
									Prototype surface for governance workstreams. Review active motions quickly, then drill into full motion records for voting and procedural follow-through.
								</p>
							</div>
						</div>
					</div>
				</section>

				<DashboardCard title="Motion Lookup" badge="Live Data">
					{motions.length === 0 ? (
						<p className="text-sm text-base-content/70">No motions found yet. Once motions are created, this panel will list each motion and provide direct links for full review.</p>
					) : (
						<div className="space-y-3">
							{motions.slice(0, 8).map((motion) => (
								<article key={motion.id} className="rounded-box border border-base-300 bg-base-200/60 p-4">
									<div className="flex items-start justify-between gap-3 flex-wrap">
										<div>
											<h3 className="text-base font-semibold text-base-content">{stripHtmlText(motion.title) || "Untitled motion"}</h3>
											<p className="text-xs text-base-content/60 mt-1">Proposed by {motion?.proposedBy?.name || "Unknown"}</p>
										</div>
										<span className={`badge ${getStatusBadgeClass(motion.status)}`}>{motion.status || "Proposed"}</span>
									</div>

									<div className="mt-3">
										<Link href={`/portal/board/motions/${motion.id}`} className="link link-primary text-sm">
											Review this motion
										</Link>
									</div>
								</article>
							))}
						</div>
					)}
				</DashboardCard>

				<section className="card bg-base-100 shadow border border-warning/40">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h2 className="text-xl font-semibold text-base-content">Below Here Is Faked</h2>
							<span className="badge badge-warning">Prototype Data</span>
						</div>
						<p className="text-sm text-base-content/70">
							The dashboard modules below are placeholder governance widgets for board planning and UX validation.
						</p>
					</div>
				</section>

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
					<DashboardCard title="Membership Health Snapshot" badge="Faked">
						<div className="stats stats-vertical lg:stats-horizontal shadow-sm bg-base-200 w-full">
							<div className="stat px-3 py-2">
								<div className="stat-title text-xs">New Artist Applicants</div>
								<div className="stat-value text-2xl">84</div>
							</div>
							<div className="stat px-3 py-2">
								<div className="stat-title text-xs">Approved This Month</div>
								<div className="stat-value text-2xl">57</div>
							</div>
							<div className="stat px-3 py-2">
								<div className="stat-title text-xs">Attrition Risk</div>
								<div className="stat-value text-2xl">11%</div>
							</div>
						</div>
					</DashboardCard>

					<DashboardCard title="Platform Revenue Oversight" badge="Faked">
						<div className="space-y-3 text-sm">
							<div className="flex justify-between gap-4"><span>Gross marketplace sales (30d)</span><span className="font-semibold">$48,200</span></div>
							<div className="flex justify-between gap-4"><span>Guild service fees (30d)</span><span className="font-semibold">$4,616</span></div>
							<div className="flex justify-between gap-4"><span>Refund impact</span><span className="font-semibold text-warning">-$640</span></div>
							<progress className="progress progress-primary w-full" value="72" max="100"></progress>
						</div>
					</DashboardCard>

					<DashboardCard title="Social Campaign Impact" badge="Faked">
						<div className="space-y-2 text-sm">
							<div className="rounded-box border border-base-300 bg-base-200/60 p-3 flex justify-between"><span>Campaign Reach (30d)</span><span className="font-semibold">214k</span></div>
							<div className="rounded-box border border-base-300 bg-base-200/60 p-3 flex justify-between"><span>Click Through Rate</span><span className="font-semibold">3.7%</span></div>
							<div className="rounded-box border border-base-300 bg-base-200/60 p-3 flex justify-between"><span>Social-to-Sale Conversion</span><span className="font-semibold">1.9%</span></div>
						</div>
					</DashboardCard>

					<DashboardCard title="Trust & Safety Escalations" badge="Faked">
						<div className="space-y-2 text-sm">
							{TRUST_AND_SAFETY_QUEUE.map((row) => (
								<div key={row.label} className="rounded-box border border-base-300 bg-base-200/60 p-3 flex justify-between gap-3">
									<span>{row.label}</span>
									<span className="font-semibold">{row.value}</span>
								</div>
							))}
						</div>
					</DashboardCard>

					<DashboardCard title="Reliability & Incident Monitor" badge="Faked">
						<div className="space-y-3 text-sm">
							<div className="flex justify-between"><span>API uptime (30d)</span><span className="font-semibold">99.92%</span></div>
							<div className="flex justify-between"><span>Checkout incident minutes</span><span className="font-semibold">42</span></div>
							<div className="flex justify-between"><span>Median page load</span><span className="font-semibold">1.3s</span></div>
						</div>
					</DashboardCard>

					<DashboardCard title="Upcoming Board Decisions" badge="Faked">
						<div className="space-y-2 text-sm">
							{UPCOMING_BOARD_DECISIONS.map((decision) => (
								<div key={decision.topic} className="rounded-box border border-base-300 bg-base-200/60 p-3">
									<div className="font-medium">{decision.topic}</div>
									<div className="mt-1 text-base-content/70">{decision.date} · Owner: {decision.owner}</div>
									<div className="mt-1 text-xs text-base-content/60">{decision.readiness}</div>
								</div>
							))}
						</div>
					</DashboardCard>
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
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/board")}`,
				permanent: false,
			},
		}
	}

	// TODO(board-permission-role): Replace this temporary staff/admin gate with a dedicated board role/permission (for example: board:view).
	if (!isStaff(session) && !isAdmin(session)) {
		return {
			notFound: true,
		}
	}

	let motions = []

	try {
		const motionResponse = await fetch(`/api/motions`)
		if (motionResponse.ok) {
			const parsed = await motionResponse.json()
			if (Array.isArray(parsed)) {
				motions = parsed
			}
		}
	} catch (error) {
		console.warn("[portal/board] Failed to load motions for dashboard", error)
	}

	return {
		props: {
			motions,
		},
	}
}
