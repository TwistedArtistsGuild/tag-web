import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"

function normalizePath(value) {
  return String(value || "").split("?")[0].split("#")[0]
}

function resolveActiveHref(currentPath, items) {
  const normalizedCurrent = normalizePath(currentPath)

  const matching = items
    .filter((item) => !item.disabled && item.href)
    .filter((item) => normalizedCurrent === item.href || normalizedCurrent.startsWith(`${item.href}/`))

  if (matching.length === 0) {
    return ""
  }

  // Prefer the most specific matching path.
  return matching.sort((a, b) => b.href.length - a.href.length)[0].href
}

export default function EntityContextNav({
  title,
  titleContent = null,
  titleSideContent = null,
  items = [],
  topContent = null,
  showEntitySwitcher = false,
  defaultEntityHref = "/portal/user",
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const [hasLinkedVendor, setHasLinkedVendor] = useState(false)
  const [hasLinkedVenue, setHasLinkedVenue] = useState(false)

  useEffect(() => {
    if (!showEntitySwitcher) {
      return
    }

    const userId = Number(session?.user?.id || 0)

    if (userId <= 0) {
      setHasLinkedVendor(false)
      setHasLinkedVenue(false)
      return
    }

    let isCancelled = false

    const loadLinkedEntityFlags = async () => {
      try {
        const [vendorLinksResponse, venueLinksResponse] = await Promise.all([
          fetch(`/api/linker_vendortouser`),
          fetch(`/api/linker_usertovenue/byUserID/${userId}`),
        ])

        const vendorLinksRaw = vendorLinksResponse.ok ? await vendorLinksResponse.json() : []
        const venueLinksRaw = venueLinksResponse.ok ? await venueLinksResponse.json() : []

        const linkedVendorIds = Array.from(
          new Set(
            (Array.isArray(vendorLinksRaw) ? vendorLinksRaw : [])
              .filter((row) => Number(row?.userID || row?.UserID || row?.userId || row?.UserId || 0) === userId)
              .map((row) => Number(row?.vendorID || row?.VendorID || row?.vendorId || row?.VendorId || 0))
              .filter((value) => Number.isFinite(value) && value > 0),
          ),
        )

        const hasVenueRows = Array.isArray(venueLinksRaw) && venueLinksRaw.length > 0

        if (!isCancelled) {
          setHasLinkedVendor(linkedVendorIds.length > 0)
          setHasLinkedVenue(hasVenueRows)
        }
      } catch {
        if (!isCancelled) {
          setHasLinkedVendor(false)
          setHasLinkedVenue(false)
        }
      }
    }

    loadLinkedEntityFlags()

    return () => {
      isCancelled = true
    }
  }, [session?.user?.id, showEntitySwitcher])

  const roleList = Array.isArray(session?.user?.roles) ? session.user.roles : []
  const isAdmin = roleList.includes("admin")
  const isStaff = roleList.includes("staff")
  const isArtist = roleList.includes("artist")

  const switchOptions = useMemo(() => {
    const options = [{ label: "User", href: "/portal/user" }]

    if (isArtist || isStaff || isAdmin) {
      options.push({ label: "Artist", href: "/portal/artist" })
    }

    if (hasLinkedVendor) {
      options.push({ label: "Vendor", href: "/portal/vendor" })
    }

    if (hasLinkedVenue) {
      options.push({ label: "Venue", href: "/portal/venue" })
    }

    if (isStaff || isAdmin) {
      options.push({ label: "Staff", href: "/portal/staff" })
    }

    return options
  }, [hasLinkedVendor, hasLinkedVenue, isAdmin, isArtist, isStaff])

  const activeHref = useMemo(() => {
    return resolveActiveHref(router.asPath || router.pathname || "", items)
  }, [items, router.asPath, router.pathname])

  const renderedItems = useMemo(
    () => [
      ...items,
      {
        key: "back-to-portal",
        label: "Back to Portal",
        href: "/portal",
        purpose: "Return to the portal landing page.",
        suffix: "↩",
      },
    ],
    [items],
  )

  const activeEntityHref = useMemo(() => {
    const currentPath = String(router.asPath || router.pathname || "")
    const active = switchOptions.find((option) => currentPath === option.href || currentPath.startsWith(`${option.href}/`))
    return active?.href || defaultEntityHref
  }, [defaultEntityHref, router.asPath, router.pathname, switchOptions])

  const resolvedTitleContent = useMemo(() => {
    if (titleContent) {
      return titleContent
    }

    if (!showEntitySwitcher) {
      return null
    }

    return (
      <div className="w-full max-w-xs">
        <select
          className="select select-sm select-bordered w-full font-semibold"
          value={activeEntityHref}
          onChange={(event) => {
            const nextHref = event.target.value
            if (nextHref && nextHref !== activeEntityHref) {
              router.push(nextHref)
            }
          }}
        >
          {switchOptions.map((option) => (
            <option key={option.href} value={option.href}>
              {option.label} Context
            </option>
          ))}
        </select>
      </div>
    )
  }, [activeEntityHref, router, showEntitySwitcher, switchOptions, titleContent])

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 md:px-8 md:pt-6">
      <div className="card bg-base-100 border border-base-300 shadow">
        <div className="card-body p-4 gap-2">
          {topContent ? <div className="mb-1">{topContent}</div> : null}
          {resolvedTitleContent ? (
            <div className="flex flex-wrap items-center gap-2">
              {resolvedTitleContent}
              {titleSideContent}
            </div>
          ) : (
            <h2 className="text-lg font-semibold text-base-content">{title}</h2>
          )}
          <div className="flex flex-wrap gap-2">
            {renderedItems.map((item) => {
              if (item.disabled) {
                return (
                  <button
                    key={item.key || item.label}
                    type="button"
                    title={item.purpose}
                    className="btn btn-sm btn-outline btn-disabled"
                    disabled
                  >
                    {item.label}
                  </button>
                )
              }

              const isActive = activeHref === item.href
              return (
                <Link
                  key={item.key || item.href}
                  href={item.href}
                  title={item.purpose}
                  className={`btn btn-sm ${isActive ? "btn-primary" : "btn-outline"}`}
                >
                  <span>{item.label}</span>
                  {item.suffix ? <span aria-hidden="true">{item.suffix}</span> : null}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
