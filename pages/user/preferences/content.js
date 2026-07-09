import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import TagSEO from "@/components/TagSEO"
import { toast } from "react-hot-toast" // Assuming you use a toast library for feedback

const VISIBILITY_MODES = {
    alwaysShow: { label: "Always Show", badge: "badge-success", description: "Load content normally." },
    optIn: { label: "Opt-In", badge: "badge-warning", description: "Warning text first, click to reveal." },
    autoHide: { label: "Auto-Hide", badge: "badge-error", description: "Excluded from your feed entirely." },
}

const DEFAULT_MODE_BY_POLICY = {
    allowed: "alwaysShow",
    optIn: "optIn",
    ageGate: "optIn",
    autoHide: "autoHide",
}
export default function ContentPreferences({ embedded = false }) {
    const { data: session } = useSession()
    const [warningGroups, setWarningGroups] = useState([])
    const [contentPreference, setContentPreference] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const totalCount = Object.values(contentPreference).length
    const alwaysShowCount = Object.values(contentPreference).filter((value) => value === "alwaysShow").length
    const optInCount = Object.values(contentPreference).filter((value) => value === "optIn").length
    const autoHideCount = Object.values(contentPreference).filter((value) => value === "autoHide").length

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const res = await fetch(`/api/ContentPreference?userId=${session?.user?.id}`, {
                    headers: {
                        'Authorization': `Bearer ${session?.accessToken}`, // Assuming your session holds the JWT
                        'Content-Type': 'application/json'
                    }
                })
                if (!res.ok) throw new Error("Failed to fetch preferences")

                const data = await res.json()
                setWarningGroups(data)

                // Initialize local state mapping Key -> PreferenceMode
                const initialPrefs = {}
                data.forEach(group => {
                    group.items.forEach(item => {
                        // Priority: User saved pref > Default based on policy
                        initialPrefs[item.key] = item.userPreference ||
                            (item.defaultHidden ? "autoHide" : "alwaysShow")
                    })
                })
                setContentPreference(initialPrefs)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (session) fetchPreferences()
    }, [session])

    const updatePreference = (key, nextMode) => {
        setContentPreference(prev => ({ ...prev, [key]: nextMode }))
    }

    const savePreferences = async () => {
        setSaving(true)
        try {
            const payload = []
            warningGroups.forEach(group => {
                group.items.forEach(item => {
                    payload.push({
                        userId: session?.user?.id,//TODO: Remove it once authorization is implemented in APIs
                        itemId: item.id,
                        preferenceMode: contentPreference[item.key]
                    })
                })
            })

            const res = await fetch(`/api/ContentPreference`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success("Preferences updated successfully!")
            }
        } catch (err) {
            toast.error("Failed to save preferences.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-10 text-center">Loading your preferences...</div>

    const content = (
        <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="card bg-base-100 shadow-lg border border-base-300">
                    <div className="card-body">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-base-content">Content Preferences</h1>
                            <button
                                onClick={savePreferences}
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                            >
                                Save Changes
                            </button>
                        </div>
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

                {warningGroups.map((group) => (
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
                                            className="select select-bordered select-sm min-w-37.5"
                                            value={contentPreference[item.key]}
                                            onChange={(e) => updatePreference(item.key, e.target.value)}
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
            </div>
    )

    if (embedded) {
        return content
    }

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={{ title: "Content Preferences", description: "Manage your content moderation and visibility preferences.", robots: "noindex, nofollow", keywords: "user preferences, content settings", og: { title: "Content Preferences", description: "Manage your content moderation and visibility preferences." } }} canonicalSlug="user/preferences/content" />
            {content}
        </div>
    )
}
