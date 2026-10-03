import { useMemo } from "react"
import { useRouter } from "next/router"
import EntityContextNav from "@/components/portal/EntityContextNav"

export default function VendorContextNav() {
  const router = useRouter()
  const slug = String(router.query?.slug || "").trim()

  const items = useMemo(() => {
    return [
      {
        key: "vendor-home",
        label: "Vendor Home",
        href: "/portal/vendor",
        purpose: "Overview page for vendor-attributed entities.",
      },
      {
        key: "vendor-register",
        label: "Register Vendor",
        href: "/join/vendor",
        purpose: "Start a new vendor onboarding flow.",
      },
      {
        key: "vendor-slug",
        label: "Vendor Workspace",
        href: slug ? `/portal/vendor/${slug}` : "",
        purpose: "Open slug-scoped vendor workspace.",
        disabled: !slug,
      },
      {
        key: "vendor-edit",
        label: "Profile Edit",
        href: slug ? `/portal/vendor/${slug}/edit` : "",
        purpose: "Edit vendor profile metadata and contact details.",
        disabled: !slug,
      },
      {
        key: "vendor-manage",
        label: "Manage",
        href: slug ? `/portal/vendor/${slug}/manage` : "",
        purpose: "Manage vendor media and gallery operations.",
        disabled: !slug,
      },
    ]
  }, [slug])

  return <EntityContextNav title="Vendor Context" items={items} showEntitySwitcher defaultEntityHref="/portal/vendor" />
}
