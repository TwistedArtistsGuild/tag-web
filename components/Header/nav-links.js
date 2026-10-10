/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/** Main navigation, shared by the desktop header and the mobile menu. The header is the only main nav. */
export const NAV_LINKS = [
  { href: "/art/", label: "Browse" },
  { href: "/artists", label: "Artists" },
  { href: "/events", label: "Events" },
  { href: "/blogs", label: "Blog" },
  { href: "/news", label: "News" },
  { href: "/contests/", label: "Contests" },
]

/** The Bloomscroll logo pill in the header opens the social feed (as before the redesign). */
export const BLOOMSCROLL_HREF = "/feed"

export const BLOOMSCROLL_LOGO = "/BLOOMSCROLL OFFICIAL/LOGO/BS (HORIZONTAL) V1.png"
export const TAG_LOGO = "/TAG OFFICIAL/LOGOS/HORIZONTAL (HOLLOW WHITE).png"


/**
 * True when `path` is the link's page or one of its sub-pages.
 * @param {string} path current router path
 * @param {string} href link target
 */
export function isActivePath(path, href) {
  const clean = (value) => String(value || "/").split("?")[0].split("#")[0].replace(/\/+$/, "").toLowerCase() || "/"
  const current = clean(path)
  const target = clean(href)
  if (target === "/") return current === "/"
  return current === target || current.startsWith(`${target}/`)
}