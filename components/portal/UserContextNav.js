import { useMemo } from "react"
import { useRouter } from "next/router"
import EntityContextNav from "@/components/portal/EntityContextNav"

export default function UserContextNav() {
  const router = useRouter()
  const username = String(router.query?.username || "").trim()

  const items = useMemo(() => {
    return [
      {
        key: "user-home",
        label: "User Dashboard",
        href: "/portal/user",
        purpose: "Main account dashboard and module workspace.",
      },
      {
        key: "user-profile",
        label: "Profile",
        href: "/portal/user/profile",
        purpose: "Edit profile details and account identity fields.",
      },
      {
        key: "user-preferences",
        label: "Preferences",
        href: "/portal/user/preferences",
        purpose: "Configure user preferences and behavior settings.",
      },
      {
        key: "user-content",
        label: "Content Preferences",
        href: "/portal/user/preferences/content",
        purpose: "Set content warning filters and visibility defaults.",
      },
      {
        key: "user-settings",
        label: "Settings",
        href: "/portal/user/settings",
        purpose: "Access account settings, notifications, and password pages.",
      },
      {
        key: "user-username-edit",
        label: "Username Edit",
        href: username ? `/portal/user/${username}/edit` : "",
        purpose: "Open username-scoped edit workspace.",
        disabled: !username,
      },
    ]
  }, [username])

  return <EntityContextNav title="User Context" items={items} showEntitySwitcher defaultEntityHref="/portal/user" />
}
