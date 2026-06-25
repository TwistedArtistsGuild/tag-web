/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useMemo, useState } from "react"
import Link from "next/link"

import { usePrivate } from "@/hooks/usePrivate"
import TagSEO from "@/components/TagSEO"
import UserContextNav from "@/components/portal/UserContextNav"

function buildDefaultPreferences(sessionUser) {
  return {
    theme: sessionUser?.preferences?.theme || "light",
    language: sessionUser?.preferences?.language || "en",
    feedStyle: "balanced",
    defaultFeedScope: "following",
    autoplayMedia: false,
    blurSensitiveMedia: true,
    compactCards: false,
    reduceMotion: false,
  }
}

export default function Preferences() {
  const [session, status] = usePrivate("/portal/user/preferences")
  const [prefs, setPrefs] = useState(() => buildDefaultPreferences(session?.user))

  const updatePref = (key, value) => {
    setPrefs((current) => ({ ...current, [key]: value }))
  }

  const preferenceSummary = useMemo(() => {
    const feedModeLabel = {
      relaxed: "Relaxed discovery",
      balanced: "Balanced mix",
      focused: "Focused relevance",
    }[prefs.feedStyle]

    const scopeLabel = {
      following: "Following",
      recommended: "Recommended",
      latest: "Latest",
    }[prefs.defaultFeedScope]

    return `${feedModeLabel} · ${scopeLabel} feed`
  }, [prefs.defaultFeedScope, prefs.feedStyle])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-base-200 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body items-center py-12">
              <span className="loading loading-ghost loading-lg"></span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <TagSEO
        metadataProp={{
          title: "User Preferences",
          description: "Tune feed and experience preferences.",
          robots: "noindex, nofollow",
          keywords: "user preferences, feed settings, personalization",
          og: {
            title: "User Preferences",
            description: "Tune feed and experience preferences.",
          },
        }}
        canonicalSlug="portal/user/preferences"
      />
      <UserContextNav />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-base-content">User Preferences</h1>
              <Link href="/portal/user" className="btn btn-sm btn-ghost">Back to Dashboard</Link>
            </div>
            <p className="text-sm text-base-content/70">
              Personalization controls for your feed and interface experience.
            </p>
            <div className="alert alert-info text-sm">
              <span>
                Preference categories are wired and organized here. Save behavior will be connected separately.
              </span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-lg font-semibold text-base-content">Feed Experience</h2>
              <span className="badge badge-outline">{preferenceSummary}</span>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Feed style</span>
              </label>
              <select
                value={prefs.feedStyle}
                onChange={(event) => updatePref("feedStyle", event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="relaxed">Relaxed discovery</option>
                <option value="balanced">Balanced mix</option>
                <option value="focused">Focused relevance</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Default feed scope</span>
              </label>
              <select
                value={prefs.defaultFeedScope}
                onChange={(event) => updatePref("defaultFeedScope", event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="following">Following</option>
                <option value="recommended">Recommended</option>
                <option value="latest">Latest</option>
              </select>
            </div>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={prefs.autoplayMedia}
                onChange={(event) => updatePref("autoplayMedia", event.target.checked)}
                className="toggle toggle-primary"
              />
              <span className="label-text">Autoplay media previews in feed</span>
            </label>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={prefs.blurSensitiveMedia}
                onChange={(event) => updatePref("blurSensitiveMedia", event.target.checked)}
                className="toggle toggle-primary"
              />
              <span className="label-text">Blur sensitive content by default</span>
            </label>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body space-y-4">
            <h2 className="text-lg font-semibold text-base-content">Interface Defaults</h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Theme</span>
              </label>
              <select
                value={prefs.theme}
                onChange={(event) => updatePref("theme", event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Language</span>
              </label>
              <select
                value={prefs.language}
                onChange={(event) => updatePref("language", event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={prefs.compactCards}
                onChange={(event) => updatePref("compactCards", event.target.checked)}
                className="toggle toggle-primary"
              />
              <span className="label-text">Use compact listing and post cards</span>
            </label>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                checked={prefs.reduceMotion}
                onChange={(event) => updatePref("reduceMotion", event.target.checked)}
                className="toggle toggle-primary"
              />
              <span className="label-text">Reduce motion in transitions and animations</span>
            </label>

            <div className="flex gap-3 flex-wrap items-center">
              <button
                className="btn btn-primary"
                disabled
                type="button"
              >
                Save Preferences
              </button>
              <span className="text-xs text-base-content/60">Save action is intentionally disabled until persistence wiring is finalized.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
