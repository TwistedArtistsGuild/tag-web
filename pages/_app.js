/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
"use client"

import { SessionProvider } from "next-auth/react"
import "@/styles/globals.css"
import EnhancedLayout from "/components/MyLayout"
import { AppWrapper } from "/components/Context"
import { useEffect, useState } from "react"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

// Flag to prevent multiple initializations across hot reloads
let appInsightsInitialized = false

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

  // Allow pages to override the default layout if needed
  const getLayout = Component.getLayout || ((page) => page)

  // Initialize Application Insights
  useEffect(() => {
    setShowDevBanner(true)

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

  const closeBanner = () => {
    setShowDevBanner(false)
  }

  return (
    <SessionProvider session={session}>
      {/* Your original development banner */}
      {showDevBanner && (
        <div className="bg-warning text-warning-content text-center py-1 text-xs font-bold sticky top-0 z-50 flex justify-center items-center">
          <div className="flex-grow">
            ⚠️ WEBSITE PROTOTYPE - PROOF OF CONCEPT - NOT FOR PRODUCTION USE - DATA IS LIKELY FAKED AND/OR MAY BE RESET
            WITHOUT NOTICE ⚠️
          </div>
          <button
            onClick={closeBanner}
            className="px-2 hover:bg-warning-content hover:bg-opacity-20 rounded transition-colors"
            title="Close this notification (will reappear on navigation)"
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
            <Component {...pageProps} />
          </EnhancedLayout>
        </AppWrapper>,
      )}
    </SessionProvider>
  )
}
