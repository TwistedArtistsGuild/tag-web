
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { SessionProvider } from "next-auth/react"
import "@/styles/globals.css"
import MyLayout from "/components/MyLayout"
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
 * Main application component that wraps all pages
 * Handles:
 * - Next-Auth session provider
 * - Application context
 * - Layout system
 * - Application Insights telemetry
 * 
 * @param {Object} props - Component properties
 * @param {React.Component} props.Component - The page component to render
 * @param {Object} props.pageProps - Props to pass to the page component
 * @param {Object} props.pageProps.session - Next Auth session data
 * @param {Object} props.pageProps.sidebarProps - Sidebar configuration
 * @returns {JSX.Element} Wrapped application with providers and layout
 */
export default function App({
	Component,
	pageProps: { session, sidebarProps, ...pageProps },
}) {
	// State to control banner visibility (no persistence between navigations)
	const [showDevBanner, setShowDevBanner] = useState(true);
	
	// Allow pages to override the default layout if needed
	const getLayout = Component.getLayout || ((page) => page)

	// Initialize Application Insights for telemetry and error tracking
	useEffect(() => {
		// Banner will always be visible on initial page load/navigation
		setShowDevBanner(true);
		
		if (!appInsightsInitialized) {
			// Check for connection string in environment variables
			const connectionString = process.env.APPINSIGHTS || process.env.NEXT_PUBLIC_APPINSIGHTS

			if (connectionString) {
				try {
					// Parse the connection string to extract the InstrumentationKey
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
	}, [Component]) // Re-run when Component changes (on navigation)
	
	// Handle closing the banner (temporary until next navigation)
	const closeBanner = () => {
		setShowDevBanner(false);
		// No sessionStorage - we want it to reappear on navigation/refresh
	};

	return (
		<SessionProvider session={session}>
			{/* Development banner - appears on all pages until closed */}
			{showDevBanner && (
				<div className="bg-warning text-warning-content text-center py-1 text-xs font-bold sticky top-0 z-50 flex justify-center items-center">
					<div className="flex-grow">⚠️ WEBSITE PROTOTYPE - PROOF OF CONCEPT - NOT FOR PRODUCTION USE - DATA IS LIKELY FAKED AND/OR MAY BE RESET WITHOUT NOTICE ⚠️</div>
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
			
			{/* Apply custom layout to page component if provided */}
			{getLayout(
				<AppWrapper>
					<MyLayout sidebarProps={sidebarProps}>
						<Component {...pageProps} />
					</MyLayout>
				</AppWrapper>
			)}
		</SessionProvider>
	)
}
