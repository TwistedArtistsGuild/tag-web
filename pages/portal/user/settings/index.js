/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"

import { usePrivate } from "@/hooks/usePrivate"
import TagSEO from "@/components/TagSEO"
import UserContextNav from "@/components/portal/UserContextNav"

export default function Settings() {
  const [session, status] = usePrivate("/portal/user/settings")

  const [settings, setSettings] = useState({
    profileVisibility: "public",
    allowTagging: true,
    allowMentions: true,
    allowDirectMessages: "followers",
    allowCommentingOnPosts: true,
    twoFactorEnabled: false,
    loginAlerts: true,
    orderUpdatesByEmail: true,
    promoEmails: false,
    payoutCurrency: "USD",
    taxDocumentRegion: "US",
    defaultShippingCountry: "US",
  })

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }))
  }

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
          title: "User Settings",
          description: "Manage account, privacy, messaging, and sales defaults.",
          robots: "noindex, nofollow",
          keywords: "user settings, account settings, privacy, marketplace",
          og: {
            title: "User Settings",
            description: "Manage account, privacy, messaging, and sales defaults.",
          },
        }}
        canonicalSlug="portal/user/settings"
      />
      <UserContextNav />

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-base-content">User Settings</h1>
              <Link href="/portal/user" className="btn btn-sm btn-ghost">Back to Dashboard</Link>
            </div>
            <p className="text-sm text-base-content/70">Account and marketplace controls that define how your profile behaves across social and sales experiences.</p>
            <div className="alert alert-warning text-sm">
              <span>Settings are fully mapped here, but save wiring is intentionally disabled while persistence integration is finalized.</span>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body space-y-4">
            <h2 className="text-lg font-semibold text-base-content">Account Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-box border border-base-300 p-3">
                <div className="text-base-content/60">Name</div>
                <div className="font-medium">{session?.user?.name || "N/A"}</div>
              </div>
              <div className="rounded-box border border-base-300 p-3">
                <div className="text-base-content/60">Email</div>
                <div className="font-medium break-all">{session?.user?.email || "N/A"}</div>
              </div>
              <div className="rounded-box border border-base-300 p-3">
                <div className="text-base-content/60">User ID</div>
                <div className="font-medium">{session?.user?.id || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body space-y-4">
            <h2 className="text-lg font-semibold text-base-content">Privacy & Social Controls</h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile visibility</span>
              </label>
              <select
                value={settings.profileVisibility}
                onChange={(event) => updateSetting("profileVisibility", event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="public">Public</option>
                <option value="followers">Followers only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.allowTagging}
                onChange={(event) => updateSetting("allowTagging", event.target.checked)}
              />
              <span className="label-text">Allow others to tag me in posts and listings</span>
            </label>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.allowMentions}
                onChange={(event) => updateSetting("allowMentions", event.target.checked)}
              />
              <span className="label-text">Allow @mentions in comments and captions</span>
            </label>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Direct message access</span>
              </label>
              <select
                value={settings.allowDirectMessages}
                onChange={(event) => updateSetting("allowDirectMessages", event.target.value)}
                className="select select-bordered w-full"
              >
                <option value="everyone">Everyone</option>
                <option value="followers">Followers</option>
                <option value="nobody">Nobody</option>
              </select>
            </div>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.allowCommentingOnPosts}
                onChange={(event) => updateSetting("allowCommentingOnPosts", event.target.checked)}
              />
              <span className="label-text">Allow comments on my posts and listings</span>
            </label>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body space-y-4">
            <h2 className="text-lg font-semibold text-base-content">Security</h2>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.twoFactorEnabled}
                onChange={(event) => updateSetting("twoFactorEnabled", event.target.checked)}
              />
              <span className="label-text">Require two-factor authentication for sign in</span>
            </label>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.loginAlerts}
                onChange={(event) => updateSetting("loginAlerts", event.target.checked)}
              />
              <span className="label-text">Email me on new device sign-ins</span>
            </label>

            <div className="flex gap-2 flex-wrap">
              <button type="button" className="btn btn-sm btn-outline" disabled>Change Password</button>
              <button type="button" className="btn btn-sm btn-outline" disabled>Review Active Sessions</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body space-y-4">
            <h2 className="text-lg font-semibold text-base-content">Commerce Defaults</h2>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.orderUpdatesByEmail}
                onChange={(event) => updateSetting("orderUpdatesByEmail", event.target.checked)}
              />
              <span className="label-text">Email me order and shipping updates</span>
            </label>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.promoEmails}
                onChange={(event) => updateSetting("promoEmails", event.target.checked)}
              />
              <span className="label-text">Receive promotions and campaign emails</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Payout currency</span>
                </label>
                <select
                  value={settings.payoutCurrency}
                  onChange={(event) => updateSetting("payoutCurrency", event.target.value)}
                  className="select select-bordered"
                >
                  <option value="USD">USD</option>
                  <option value="CAD">CAD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tax region</span>
                </label>
                <select
                  value={settings.taxDocumentRegion}
                  onChange={(event) => updateSetting("taxDocumentRegion", event.target.value)}
                  className="select select-bordered"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="EU">European Union</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Default shipping country</span>
                </label>
                <select
                  value={settings.defaultShippingCountry}
                  onChange={(event) => updateSetting("defaultShippingCountry", event.target.value)}
                  className="select select-bordered"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body p-4 flex-row flex-wrap items-center justify-between gap-3">
            <button type="button" className="btn btn-primary" disabled>
              Save Settings
            </button>
            <div className="flex gap-2 flex-wrap">
              <button type="button" className="btn btn-ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                Logout
              </button>
            </div>
            <span className="text-xs text-base-content/60 w-full md:w-auto">Save is intentionally disabled until persistence wiring is enabled.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
