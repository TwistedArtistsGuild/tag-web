import { useMemo, useState } from "react"
import TagSEO from "@/components/TagSEO"
import Link from "next/link"

const WARNING_GROUPS = [
	{
		title: "Sexual & Nudity-Related",
		items: [
			{ key: "nudity", label: "Nudity", policy: "allowed", defaultHidden: false, note: "Allowed broadly; parental consent for under 18." },
			{ key: "nudity_implicit", label: "Nudity - Sexually Implicit", policy: "optIn", defaultHidden: true, note: "Restricted to registered users 18+." },
			{ key: "nudity_explicit", label: "Nudity - Sexually Explicit", policy: "autoHide", defaultHidden: true, note: "Hidden by default, payments disabled, moderation approval required." },
		],
	},
	{
		title: "Violence & Physical Harm",
		items: [
			{ key: "violence", label: "Violence", policy: "optIn", defaultHidden: false, note: "Physical conflict or harm without graphic detail." },
			{ key: "gore", label: "Violence - Graphic / Gore", policy: "optIn", defaultHidden: true, note: "Graphic injury, blood, or bodily harm." },
			{ key: "war", label: "War / Armed Conflict", policy: "optIn", defaultHidden: false, note: "Combat, warfare, or military violence." },
			{ key: "self_harm", label: "Self-Harm Themes", policy: "ageGate", defaultHidden: true, note: "References to self-injury or suicide." },
		],
	},
	{
		title: "Language, Social, and Other Sensitive Content",
		items: [
			{ key: "strong_language", label: "Strong Language", policy: "optIn", defaultHidden: false, note: "Profanity or explicit verbal content." },
			{ key: "harassment", label: "Harassment or Bullying", policy: "optIn", defaultHidden: true, note: "Threats or degrading behavior." },
			{ key: "horror", label: "Horror / Fear Themes", policy: "optIn", defaultHidden: true, note: "Content intended to deeply unsettle." },
		],
	},
]

const VISIBILITY_MODES = {
	alwaysShow: {
		label: "Always Show",
		description: "Load the content normally with its warning label visible.",
		badge: "badge-success",
	},
	optIn: {
		label: "Opt-In",
		description: "Load the warning text first, then require an extra click to reveal the content.",
		badge: "badge-warning",
	},
	autoHide: {
		label: "Auto-Hide",
		description: "Exclude this content style at the database/query level so it does not appear in the feed.",
		badge: "badge-error",
	},
}

const DEFAULT_MODE_BY_POLICY = {
	allowed: "alwaysShow",
	optIn: "optIn",
	ageGate: "optIn",
	autoHide: "autoHide",
}

const flattenDefaults = () => {
	const defaults = {}
	for (const group of WARNING_GROUPS) {
		for (const item of group.items) {
			defaults[item.key] = item.defaultHidden ? "autoHide" : "alwaysShow"
		}
	}
	return defaults
}

export default function ContentPreferences() {
	const initialVisibility = useMemo(() => flattenDefaults(), [])
	const [contentPreference, setContentPreference] = useState(initialVisibility)

	const pageMetaData = {
		title: "Content Preferences",
		description: "Adjust your content visibility and warning preferences.",
		keywords: "preferences, content warnings, user",
		robots: "noindex, nofollow",
		og: {
			title: "Content Preferences",
			description: "Adjust your content visibility and warning preferences.",
		},
	}

	const totalCount = Object.values(contentPreference).length
	const alwaysShowCount = Object.values(contentPreference).filter((value) => value === "alwaysShow").length
	const optInCount = Object.values(contentPreference).filter((value) => value === "optIn").length
	const autoHideCount = Object.values(contentPreference).filter((value) => value === "autoHide").length

	const updatePreference = (key, nextMode) => {
		setContentPreference((current) => ({
			...current,
			[key]: nextMode,
		}))
	}

	const resetToRecommended = () => {
		setContentPreference(flattenDefaults())
	}

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="user/preferences/content" />
			<div className="max-w-5xl mx-auto space-y-6">
				<div className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body">
						<div className="flex items-center justify-between gap-3 flex-wrap">
							<h1 className="text-2xl font-bold text-base-content">Content Preferences</h1>
							<Link href="/user/preferences" className="btn btn-sm btn-ghost">Back to Preferences</Link>
						</div>
						<p className="text-sm text-base-content/70">
							Wireframe for Issue #79: choose how each warning-tag type behaves in your feed and detail views.
						</p>
						<div className="flex flex-wrap items-center gap-2">
							<span className="badge badge-outline">{alwaysShowCount} always show</span>
							<span className="badge badge-outline">{optInCount} opt-in</span>
							<span className="badge badge-outline">{autoHideCount} auto-hide</span>
							<span className="badge badge-ghost">{totalCount} total categories</span>
						</div>
					</div>
				</div>

				<div className="alert alert-info shadow-sm">
					<div>
						<div className="font-semibold">Preference Behavior</div>
						<div className="text-sm opacity-80">Opt-in shows the warning text first, while auto-hide is intended to work as a database-level exclusion.</div>
					</div>
					<div className="flex gap-2 flex-wrap">
						<span className={`badge ${VISIBILITY_MODES.alwaysShow.badge}`}>{VISIBILITY_MODES.alwaysShow.label}</span>
						<span className={`badge ${VISIBILITY_MODES.optIn.badge}`}>{VISIBILITY_MODES.optIn.label}</span>
						<span className={`badge ${VISIBILITY_MODES.autoHide.badge}`}>{VISIBILITY_MODES.autoHide.label}</span>
					</div>
				</div>

				<div className="alert alert-warning shadow-sm">
					<div>
						<div className="font-semibold">Future Feature: Age-Restricted Accounts</div>
						<div className="text-sm opacity-80">
							Planned future behavior: a parent or guardian would complete moderation settings on behalf of a linked child account and be able to review what that child account has viewed and searched for. This is not part of the current implementation. For now, this page is only defining content moderation behavior.
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div className="card bg-base-100 shadow border border-base-300">
						<div className="card-body p-4">
							<div className="flex items-center gap-2">
								<span className={`badge ${VISIBILITY_MODES.alwaysShow.badge}`}>{VISIBILITY_MODES.alwaysShow.label}</span>
							</div>
							<p className="text-sm text-base-content/70">{VISIBILITY_MODES.alwaysShow.description}</p>
						</div>
					</div>
					<div className="card bg-base-100 shadow border border-base-300">
						<div className="card-body p-4">
							<div className="flex items-center gap-2">
								<span className={`badge ${VISIBILITY_MODES.optIn.badge}`}>{VISIBILITY_MODES.optIn.label}</span>
							</div>
							<p className="text-sm text-base-content/70">{VISIBILITY_MODES.optIn.description}</p>
						</div>
					</div>
					<div className="card bg-base-100 shadow border border-base-300">
						<div className="card-body p-4">
							<div className="flex items-center gap-2">
								<span className={`badge ${VISIBILITY_MODES.autoHide.badge}`}>{VISIBILITY_MODES.autoHide.label}</span>
							</div>
							<p className="text-sm text-base-content/70">{VISIBILITY_MODES.autoHide.description}</p>
						</div>
					</div>
				</div>

				{WARNING_GROUPS.map((group) => (
					<div key={group.title} className="card bg-base-100 shadow border border-base-300">
						<div className="card-body space-y-3">
							<h2 className="text-lg font-semibold text-base-content">{group.title}</h2>
							<div className="space-y-2">
								{group.items.map((item) => (
									<div key={item.key} className="rounded-box border border-base-300 p-3 bg-base-200/60">
										<div className="flex justify-between gap-3 flex-wrap items-start">
											<div className="min-w-0">
												<div className="font-medium text-base-content">{item.label}</div>
												<p className="text-xs text-base-content/70 mt-1">{item.note}</p>
											</div>
											<div className="flex items-center gap-2 flex-wrap">

												<div className="form-control gap-1">
													<label className="label p-0">
														<span className="label-text text-xs font-medium">Moderation preference</span>
													</label>
													<select
														className="select select-bordered select-sm min-w-40"
														value={contentPreference[item.key]}
														onChange={(event) => updatePreference(item.key, event.target.value)}
													>
														<option value="alwaysShow">Always Show</option>
														<option value="optIn">Opt-In</option>
														<option value="autoHide">Auto-Hide</option>
													</select>
												</div>
											</div>
										</div>
										<div className="mt-2 flex items-center gap-2 flex-wrap">
											<span className="text-xs text-base-content/60">Default behavior:</span>
											<span className={`badge badge-sm ${VISIBILITY_MODES[DEFAULT_MODE_BY_POLICY[item.policy]].badge}`}>
												{VISIBILITY_MODES[DEFAULT_MODE_BY_POLICY[item.policy]].label}
											</span>
										</div>

									</div>
								))}
							</div>
						</div>
					</div>
				))}

				<div className="card bg-base-100 shadow border border-base-300">
					<div className="card-body">
						<div className="flex gap-2 flex-wrap justify-between items-center">
							<p className="text-sm text-base-content/70">
								Wireframe behavior only for now. Save action is not connected yet.
							</p>
							<div className="flex gap-2 flex-wrap">
								<button type="button" className="btn btn-ghost" onClick={resetToRecommended}>Reset Recommended</button>
								<button type="button" className="btn btn-primary">Save Preferences (Mock)</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
