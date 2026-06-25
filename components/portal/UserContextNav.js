import { useMemo } from "react"
import EntityContextNav from "@/components/portal/EntityContextNav"

export default function UserContextNav() {
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
    ]
  }, [])

  return <EntityContextNav title="User Context" items={items} showEntitySwitcher defaultEntityHref="/portal/user" />
}
