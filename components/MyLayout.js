/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


 "use client"

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
import LeftSidebar from "/components/Sidebar-left"
import RightSidebar from "/components/Sidebar-right"
import { LayoutProvider, useLayout } from "./LayoutProvider"

const font = Inter({ subsets: ["latin"] })

/**
 * Layout Content Component - The actual layout implementation
 */
function LayoutContent(props) {
  const { isHeaderVisible, isLeftSidebarVisible, isRightSidebarVisible, isMobile } = useLayout()
  const { sidebarProps = {} } = props
  const { pageSections = [] } = sidebarProps || {}
  const router = useRouter()
  const { data } = useSession()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Adjusted topMargin to match the new header height
  const topMargin = isHeaderVisible ? "mt-2" : "mt-0" // Changed from mt-20 to mt-16
  const leftMargin = !isMobile && isLeftSidebarVisible ? "lg:ml-80" : ""
  const rightMargin = !isMobile && isRightSidebarVisible ? "lg:mr-80" : ""

  return (
    <ErrorBoundary>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>

      <NextNProgress color={config.colors.main} options={{ showSpinner: false }} />

      <div className="flex flex-col min-h-screen">
        <Header pageSections={pageSections} />
        <LeftSidebar {...(sidebarProps?.leftSidebarData || {})} />
        <RightSidebar {...(sidebarProps?.rightSidebarData || {})} />

        <main className={`flex-1 p-4 transition-all duration-300 ${topMargin} ${leftMargin} ${rightMargin}`}>
          {props.children}
        </main>

        <Footer className={`${leftMargin} ${rightMargin}`} />
      </div>

      {isMounted && (
        <Toaster
          toastOptions={{
            duration: 3000,
          }}
        />
      )}

      <Tooltip id="tooltip" className="z-[60] !opacity-100 max-w-sm shadow-lg" />
    </ErrorBoundary>
  )
}

export default function Layout(props) {
  return (
    <LayoutProvider>
      <LayoutContent {...props} />
    </LayoutProvider>
  )
}