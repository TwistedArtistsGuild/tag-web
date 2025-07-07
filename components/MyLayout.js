/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


///////////////// Imports
import "react-tooltip/dist/react-tooltip.css"
import { useEffect, useState } from "react"
import { Inter } from "next/font/google"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import NextNProgress from "nextjs-progressbar"
import { Toaster } from "react-hot-toast"
import { Tooltip } from "react-tooltip"
import ErrorBoundary from "./ErrorBoundary"
import config from "@/config"
import Header from "/components/Header/Header"
import Footer from "/components/Footer"
import Sidebar from "/components/Sidebar"

const font = Inter({ subsets: ["latin"] })

/**
 * Main layout component that wraps all pages
 * Provides consistent header, footer, and navigation elements
 * Uses a flexbox approach to ensure footer positioning:
 * - When content is short: Footer sits at bottom of viewport
 * - When content is long: Footer sits after the content
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.sidebarProps - Properties to pass to the sidebar component
 * @param {Array} props.sidebarProps.pageSections - Page sections for table of contents navigation
 * @param {React.ReactNode} props.children - Child components to render in the main content area
 * @returns {JSX.Element} Layout component with header, sidebar, content area, and footer
 */
export default function Layout (props) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { sidebarProps = {} } = props
    const { pageSections = [] } = sidebarProps || {}
    const router = useRouter()
    const { data } = useSession()
    const [isMounted, setIsMounted] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        
        // Add scroll event listener to track page scroll for proper spacing
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    return (
        // Most errors are caught in ErrorBoundary to show a nice error page
        <ErrorBoundary>
            <style jsx global>{`
                html {
                font-family: ${font.style.fontFamily};
                }
            `}</style>
            {/* Automatically show a progress bar at the top when navigating between pages */}
            <NextNProgress
                color={config.colors.main}
                options={{ showSpinner: false }}
            />
            {/* Use a wrapper div with min-h-screen to ensure full viewport height coverage */}
            <div className="flex flex-col min-h-screen">
                {/* Main header is not sticky but will push content down */}
                <Header pageSections={pageSections} />
                {/* Sidebar is positioned absolute/fixed depending on viewport */}
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} {...sidebarProps} />
                {/* Main content area - flex-1 makes it expand to fill available space */}
                {/* Add top padding ONLY when scrolled to account for the sticky secondary header */}
                <main 
                    className={`flex-1 p-4 lg:ml-64 transition-all duration-300 ${scrolled ? 'pt-16' : 'pt-4'}`}
                >
                    {props.children}
                </main>
                {/* Footer sits at the bottom naturally due to flexbox */}
                <Footer />
            </div>
            {/* Only show toast notifications after client-side hydration */}
            {isMounted && (
                <Toaster
                    toastOptions={{
                        duration: 3000,
                    }}
                />
            )}
           {/* Show tooltips if any JSX elements has these 2 attributes: data-tooltip-id="tooltip" data-tooltip-content="" */}
            <Tooltip
                id="tooltip"
                className="z-[60] !opacity-100 max-w-sm shadow-lg"
            />
        </ErrorBoundary>
    )
}
