/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import TagMark from "@/components/TagMark"
import { MISSION_STATEMENT } from "@/components/MissionStatement"

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/twistedartistsguild/",
    icon: <path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6z" fill="currentColor" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/twistedartistsguild/",
    icon: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </g>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@twistedartistsguild?lang=en",
    icon: <path d="M16 3c.4 2.3 1.9 3.8 4 4v3.2c-1.5 0-2.9-.4-4-1.2v6.3A6.3 6.3 0 1 1 9.7 9v3.3a3 3 0 1 0 3 3V3z" fill="currentColor" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@twistedartistsguild",
    icon: <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.3.4-2.5.4-3.8s-.1-2.5-.4-3.8zM10 15V9l5.2 3z" fill="currentColor" />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/twistedartistsguild",
    icon: <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3zm6 0h3v1.7c.5-.9 1.7-2 3.6-2 3.4 0 4.4 2.2 4.4 5.2V21h-3v-6.3c0-1.6-.3-3-2.1-3s-2.4 1.3-2.4 3V21H9z" fill="currentColor" />,
  },
]

const LINK_COLUMNS = [
  {
    title: "About",
    links: [
      { href: "/about", label: "About" },
      { href: "/about/pricing", label: "Pricing" },
      { href: "/about/vendor", label: "Vendor" },
      { href: "/about/development", label: "Development" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/about/termsofservice", label: "Terms of Service" },
      { href: "/about/policies", label: "Guild Policies" },
      { href: "/about/codeofconduct", label: "Code of Conduct" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/careers", label: "Careers" },
      { href: "/portal", label: "Portals" },
    ],
  },
]

const LEGAL_LINKS = [
  { href: "/about/termsofservice", label: "Terms" },
  { href: "/about/policies/privacy-policy", label: "Privacy" },
  { href: "/about/codeofconduct", label: "Code of Conduct" },
]

/**
 * Site footer: the still TAG mark (no name text or logo image), the line and mission statement,
 * social tiles, three link columns and the legal bar. 4 columns, 2 on tablets, stacked on phones.
 * @returns {JSX.Element} Footer component
 */
export default function Footer() {
  return (
    <footer className="tag-footer">
      <div className="tag-container">
        <div className="tag-footer__grid">
          <div className="tag-footer__brand">
            <Link href="/" className="tag-footer__mark" aria-label="Twisted Artists Guild home">
              <TagMark title="Twisted Artists Guild" />
            </Link>
            <p>Empowering artists worldwide. Built by artists, for artists, so creativity can turn into sustainability.</p>
            <p className="tag-footer__mission">{MISSION_STATEMENT}</p>
            <ul className="tag-footer__socials">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">{social.icon}</svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {LINK_COLUMNS.map((column) => (
            <nav key={column.title} className="tag-footer__col" aria-label={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="tag-footer__bottom">
          <span>&copy; {new Date().getFullYear()} Twisted Artists Guild. All rights reserved.</span>
          <nav aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href}>{link.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
