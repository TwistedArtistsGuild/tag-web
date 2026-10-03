import { useMemo } from "react"
import { useRouter } from "next/router"
import EntityContextNav from "@/components/portal/EntityContextNav"

export default function VenueContextNav() {
  const router = useRouter()
  const slug = String(router.query?.slug || "").trim()

  const items = useMemo(() => {
    return [
      {
        key: "venue-home",
        label: "Venue Home",
        href: "/portal/venue",
        purpose: "Overview page for venue-attributed entities.",
      },
      {
        key: "venue-register",
        label: "Register Venue",
        href: "/join/venue",
        purpose: "Start a new venue onboarding flow.",
      },
      {
        key: "venue-slug",
        label: "Venue Workspace",
        href: slug ? `/portal/venue/${slug}` : "",
        purpose: "Open slug-scoped venue workspace.",
        disabled: !slug,
      },
      {
        key: "venue-edit",
        label: "Profile Edit",
        href: slug ? `/portal/venue/${slug}/edit` : "",
        purpose: "Edit venue profile and workspace details.",
        disabled: !slug,
      },
    ]
  }, [slug])

  return <EntityContextNav title="Venue Context" items={items} showEntitySwitcher defaultEntityHref="/portal/venue" />
}
