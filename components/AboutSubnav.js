/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"

const NAV_ITEMS = [
  { key: "pricing", href: "/about/pricing", label: "Pricing" },
  { key: "vendor", href: "/about/vendor", label: "Vendor" },
  { key: "development", href: "/about/development", label: "Development" },
]

export default function AboutSubnav({ activeItem, variant = "links" }) {
  const isButtonVariant = variant === "buttons"

  return (
    <nav className={isButtonVariant ? "sticky top-0 z-20 border-b border-base-300 bg-base-100/90 py-3 shadow-sm backdrop-blur" : "bg-base-100 shadow-md py-4"}>
      <div className={isButtonVariant ? "container mx-auto flex flex-wrap items-center justify-between gap-3 px-4" : "container mx-auto px-4 flex justify-between items-center"}>
        <Link href="/about" className={isButtonVariant ? "btn btn-ghost text-primary text-lg font-bold" : "text-primary font-bold text-lg"}>
          About Us
        </Link>
        <div className={isButtonVariant ? "flex flex-wrap gap-2" : "flex space-x-4"}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === activeItem

            return (
              <Link
                key={item.key}
                href={item.href}
                className={isButtonVariant
                  ? isActive
                    ? "btn btn-primary btn-sm"
                    : "btn btn-ghost btn-sm"
                  : isActive
                    ? "text-primary font-semibold"
                    : "text-base-content hover:text-primary"}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}