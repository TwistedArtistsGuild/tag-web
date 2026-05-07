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
			{ key: "hate_speech", label: "Hate Speech or Slurs", policy: "autoHide", defaultHidden: true, note: "Subject to moderation/restriction." },
			{ key: "horror", label: "Horror / Fear Themes", policy: "optIn", defaultHidden: true, note: "Content intended to deeply unsettle." },
		],
	},
]

const POLICY_META = {
	allowed: { label: "Allowed", badge: "badge-success" },
	optIn: { label: "Opt-In", badge: "badge-warning" },
	ageGate: { label: "Age-Gate", badge: "badge-info" },
	autoHide: { label: "Auto-Hide", badge: "badge-error" },
}

const flattenDefaults = () => {
	const defaults = {}
	for (const group of WARNING_GROUPS) {
		for (const item of group.items) {
			defaults[item.key] = item.defaultHidden
		}
	}
	return defaults
}

export default function ContentPreferences() {
	const initialVisibility = useMemo(() => flattenDefaults(), [])
	const [hiddenByDefault, setHiddenByDefault] = useState(initialVisibility)

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

	const hiddenCount = Object.values(hiddenByDefault).filter(Boolean).length
	const totalCount = Object.values(hiddenByDefault).length

	const toggleHidden = (key) => {
		setHiddenByDefault((current) => ({
			...current,
			[key]: !current[key],
		}))
	}

	const resetToRecommended = () => {
		setHiddenByDefault(flattenDefaults())
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
							Wireframe for Issue #79: choose which warning-tag types are hidden by default in your feed.
						</p>
						<div className="flex flex-wrap items-center gap-2">
							<span className="badge badge-outline">{hiddenCount} hidden by default</span>
							<span className="badge badge-outline">{totalCount - hiddenCount} visible by default</span>
							<span className="badge badge-ghost">Warnings enabled by default</span>
						</div>
					</div>
				</div>

				<div className="alert alert-info shadow-sm">
					<div>
						<div className="font-semibold">Policy Legend</div>
						<div className="text-sm opacity-80">Auto-hide and age-gated categories may still override personal preferences.</div>
					</div>
					<div className="flex gap-2 flex-wrap">
						<span className={`badge ${POLICY_META.allowed.badge}`}>{POLICY_META.allowed.label}</span>
						<span className={`badge ${POLICY_META.optIn.badge}`}>{POLICY_META.optIn.label}</span>
						<span className={`badge ${POLICY_META.ageGate.badge}`}>{POLICY_META.ageGate.label}</span>
						<span className={`badge ${POLICY_META.autoHide.badge}`}>{POLICY_META.autoHide.label}</span>
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
												<span className={`badge ${POLICY_META[item.policy].badge}`}>{POLICY_META[item.policy].label}</span>
												<label className="label cursor-pointer gap-2 p-0">
													<span className="label-text text-xs">Hide by default</span>
													<input
														type="checkbox"
														className="toggle toggle-sm toggle-primary"
														checked={hiddenByDefault[item.key]}
														onChange={() => toggleHidden(item.key)}
													/>
												</label>
											</div>
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
