/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/router"
import "@/styles/globals.css"
import EnhancedLayout from "@/components/MyLayout"
import { AppWrapper } from "@/components/Context"
import TagSEO from "@/components/TagSEO"
import { useEffect, useState } from "react"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { MessagingRealtimeProvider } from '@/components/messaging/MessagingRealtimeProvider'

// Flag to prevent multiple initializations across hot reloads
let appInsightsInitialized = false
const DEV_BANNER_DISMISS_KEY = "tag_dev_banner_dismiss_until"
const DEV_BANNER_RESHOW_MS = 5 * 60 * 1000

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env.NEXT_PUBLIC_APPINSIGHTS,
  },
})

/**
 * Enhanced App Component - keeps your original structure but adds collapsible layout
 */
export default function App({ Component, pageProps: { session, sidebarProps, ...pageProps } }) {
  const [showDevBanner, setShowDevBanner] = useState(true)
  const [bannerReady, setBannerReady] = useState(false)
  // Keep initial render deterministic across server/client to avoid hydration mismatch.
  const [nowMs, setNowMs] = useState(0)
  const router = useRouter()

  // Allow pages to override the default layout if needed
  const getLayout = Component.getLayout || ((page) => page)

  // Initialize Application Insights
  useEffect(() => {
    if (!appInsightsInitialized) {
      const connectionString = process.env.APPINSIGHTS || process.env.NEXT_PUBLIC_APPINSIGHTS

      if (connectionString) {
        try {
          const instrumentationKeyMatch = connectionString.match(/InstrumentationKey=([^;]+)/)
          const instrumentationKey = instrumentationKeyMatch ? instrumentationKeyMatch[1] : null

          if (instrumentationKey) {
            appInsights.config.instrumentationKey = instrumentationKey
            appInsights.loadAppInsights()
            appInsightsInitialized = true
            console.log("Application Insights initialized successfully")
          } else {
            console.error("Error: Unable to extract InstrumentationKey from Application Insights connection string.")
          }
        } catch (error) {
          console.error("Error initializing Application Insights:", error)
        }
      } else {
        console.warn("Application Insights connection string not found. Telemetry disabled.")
      }
    }
  }, [Component])

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    const timer = window.setInterval(() => {
      setNowMs(Date.now())
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const now = Date.now()
    const dismissUntilMs = Number(window.localStorage.getItem(DEV_BANNER_DISMISS_KEY) || "0")
    const shouldShowBanner = !Number.isFinite(dismissUntilMs) || dismissUntilMs <= now

    const initTimer = window.setTimeout(() => {
      setShowDevBanner(shouldShowBanner)
      setBannerReady(true)
    }, 0)

    if (shouldShowBanner) {
      return () => window.clearTimeout(initTimer)
    }

    const waitMs = Math.max(0, dismissUntilMs - now)
    const restoreTimer = window.setTimeout(() => {
      window.localStorage.removeItem(DEV_BANNER_DISMISS_KEY)
      setShowDevBanner(true)
    }, waitMs)

    return () => {
      window.clearTimeout(initTimer)
      window.clearTimeout(restoreTimer)
    }
  }, [])

  const closeBanner = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(DEV_BANNER_DISMISS_KEY, String(Date.now() + DEV_BANNER_RESHOW_MS))
    }
    setShowDevBanner(false)
  }

  const buildNumber = process.env.NEXT_PUBLIC_BUILD_NUMBER || process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "local"
  const localDevStartedAt = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_LOCAL_DEV_STARTED_AT : ""
  const localDevStartedMs = localDevStartedAt ? Date.parse(localDevStartedAt) : NaN
  const localUptimeMs = Number.isFinite(localDevStartedMs) ? Math.max(0, nowMs - localDevStartedMs) : 0
  const uptimeHours = Math.floor(localUptimeMs / 3600000)
  const uptimeMinutes = Math.floor((localUptimeMs % 3600000) / 60000)
  const uptimeSeconds = Math.floor((localUptimeMs % 60000) / 1000)
  const localUptime = `${String(uptimeHours).padStart(2, "0")}:${String(uptimeMinutes).padStart(2, "0")}:${String(uptimeSeconds).padStart(2, "0")}`
  const environmentDetail = process.env.NODE_ENV === "development"
    ? `Dev uptime ${localUptime}`
    : `Build ${String(buildNumber || "local").slice(0, 12)}`
  const bannerMessage = `Early access notice: this platform is actively being refined and some features may change without notice. ${environmentDetail}.`

  const canonicalSlug = (router.asPath || "/").split("?")[0].split("#")[0].replace(/^\//, "")
  const fallbackTitle = canonicalSlug
    ? `${canonicalSlug.replace(/[-_/]/g, " ")} | Twisted Artists Guild`
    : "Twisted Artists Guild"
  const fallbackSeo = {
    title: fallbackTitle,
    description: "A creator-focused community and marketplace for artists and supporters.",
    keywords: "artists, art community, marketplace",
    og: {
      title: fallbackTitle,
      description: "A creator-focused community and marketplace for artists and supporters.",
    },
  }

  return (
    <SessionProvider session={session}>
      <MessagingRealtimeProvider>
        {/* Your original development banner */}
        {bannerReady && showDevBanner && (
          <div className="bg-warning text-warning-content text-center py-1 text-xs font-bold sticky top-0 z-50 flex justify-center items-center">
            <div className="grow">
              {bannerMessage}
            </div>
            <button
              onClick={closeBanner}
              className="px-2 hover:bg-warning-content hover:bg-opacity-20 rounded transition-colors"
              title="Close this notification (returns in 5 minutes)"
              aria-label="Close development environment notification"
            >
              ✕
            </button>
          </div>
        )}

        {/* Enhanced Layout with your original structure */}
        {getLayout(
          <AppWrapper>
            <EnhancedLayout sidebarProps={sidebarProps}>
              <TagSEO metadataProp={fallbackSeo} canonicalSlug={canonicalSlug} />
              <Component {...pageProps} />
            </EnhancedLayout>
          </AppWrapper>,
        )}
      </MessagingRealtimeProvider>
    </SessionProvider>
  )
}

