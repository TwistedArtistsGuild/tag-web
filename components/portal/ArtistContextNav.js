import { useMemo } from "react"
import { useRouter } from "next/router"
import EntityContextNav from "@/components/portal/EntityContextNav"

export default function ArtistContextNav() {
  const router = useRouter()
  const slug = String(router.query?.slug || "").trim()

  const items = useMemo(() => {
    return [
      {
        key: "artist-home",
        label: "Artist Home",
        href: "/portal/artist",
        purpose: "Overview page for artist-linked entities.",
      },
      {
        key: "artist-register",
        label: "Register Artist",
        href: "/join/artist",
        purpose: "Start a new artist onboarding flow.",
      },
      {
        key: "artist-slug",
        label: "Artist Workspace",
        href: slug ? `/portal/artist/${slug}` : "",
        purpose: "Open slug-scoped artist workspace.",
        disabled: !slug,
      },
      {
        key: "artist-edit",
        label: "Profile Edit",
        href: slug ? `/portal/artist/${slug}/edit` : "",
        purpose: "Edit artist profile content and metadata.",
        disabled: !slug,
      },
      {
        key: "artist-contacts",
        label: "Manage Contacts",
        href: slug ? `/portal/artist/${slug}/manage-contacts` : "",
        purpose: "Manage contacts linked to this artist.",
        disabled: !slug,
      },
      {
        key: "artist-create-listing",
        label: "Create Listing",
        href: slug ? `/portal/artist/${slug}/listing/create` : "",
        purpose: "Create a listing inside this artist workspace.",
        disabled: !slug,
      },
    ]
  }, [slug])

  return <EntityContextNav title="Artist Context" items={items} showEntitySwitcher defaultEntityHref="/portal/artist" />
}
