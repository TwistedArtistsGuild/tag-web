/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link"
import { sanitizeCardHtml, stripHtmlText } from "@/components/security/sanitize"

/**
 * Default social media platforms and their URLs (for TAG app)
 */
export const DEFAULT_SOCIALS = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/twistedartistsguild/",
    handle: "twistedartistsguild",
    purpose: "Community updates and events",
    color: "#1877f2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/twistedartistsguild/",
    handle: "@twistedartistsguild",
    purpose: "View beautiful portfolio and finished work",
    color: "#c13584",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
      </svg>
    ),
  },
  {
    name: "Threads",
    url: "https://www.threads.net/@twistedartistsguild",
    handle: "@twistedartistsguild",
    purpose: "Short posts, updates, and conversation",
    color: "#111111",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M367.7 246.3c-5.5-48.8-23.8-87.1-54.6-114.4-28.8-25.6-66.1-38.3-111.2-38.3-54.7 0-98.4 18.6-130 55.3-30.6 35.4-46.1 84.9-46.1 147.1 0 62.1 15.5 111.6 46.1 147 31.6 36.7 75.3 55.3 130 55.3 42.1 0 76.9-11.3 105-34.4 29.9-24.7 48.4-59.7 55-104.1h-58.1c-4.2 25.1-15.1 44.2-32.9 57.4-17 12.6-38.4 18.9-64.1 18.9-33.4 0-59.8-10.3-79.1-30.7-18.8-19.8-28.7-47.2-29.7-82.1h231.5c5.1-18.5 7.6-40.1 7.6-64.9 0-14-.7-26.2-2-36.8zM135.2 236c1.7-28.1 10.9-49.9 27.5-65.4 17.5-16.4 40.5-24.7 69.1-24.7 29 0 52.1 8.2 69.2 24.6 15.7 15 24.6 36.8 26.4 65.5H135.2z" />
      </svg>
    ),
  },
  {
    name: "X",
    url: "https://x.com/twistedartists",
    handle: "@twistedartists",
    purpose: "News, drops, and quick updates",
    color: "#111111",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M389.2 48h70.6L305.6 224.2 488 464H345.8L233.6 317.3 105.4 464H34.8l165-188.8L24 48h145.8l101.5 133.1L389.2 48zm-24.8 373.8h39.1L148.6 88.2h-42z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@twistedartistsguild",
    handle: "@twistedartistsguild",
    purpose: "Full tutorials and artist interviews",
    color: "#ff0000",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/twistedartistsguild",
    handle: "twistedartistsguild",
    purpose: "Professional collaborations and news",
    color: "#0077b5",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
      </svg>
    ),
  },
]

/**
 * Common sales platforms for artists
 */
export const DEFAULT_STORES = [
  {
    name: "Etsy",
    url: "https://www.etsy.com",
    handle: "Shop on Etsy",
    purpose: "Buy handmade & unique items",
    color: "#f1641e",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <path d="M8 7h8v2h-6v2h5v2h-5v2h6v2H8z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Redbubble",
    url: "https://www.redbubble.com",
    handle: "Redbubble",
    purpose: "Print-on-demand apparel & art",
    color: "#e81828",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 16V8h3c1.8 0 2.9.9 2.9 2.4 0 1-.5 1.7-1.4 2.1l2.1 3.5h-2l-1.7-3h-1v3h-2zm2-4.6h1c.7 0 1.1-.3 1.1-.9 0-.6-.4-.9-1.1-.9h-1v1.8z" fill="currentColor" />
      </svg>
    ),
  },
]

function resolveSocialIcon(name) {
  return DEFAULT_SOCIALS.find((d) => d.name.toLowerCase() === (name || "").toLowerCase())?.icon || null
}

function resolveStoreIcon(name) {
  return DEFAULT_STORES.find((d) => d.name.toLowerCase() === (name || "").toLowerCase())?.icon || null
}

/**
 * ContactList Card Component
 * Displays social media links and custom contact information for a user or artist.
 * Compact layout optimized for 1/4 panel width and minimal dead space.
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - User object (optional, for fallback name/display)
 * @param {Object} props.artist - Artist object (optional, for fallback name/display)
 * @param {string} props.displayName - Display name for the card (overrides user/artist name)
 * @param {Array} props.socials - Custom socials array; defaults to TAG app socials
 * @param {Object} props.contactInfo - Custom contact info
 * @param {string} props.contactInfo.email - Email address
 * @param {string} props.contactInfo.location - Location (city, county, state or region)
 * @param {Array} props.contactInfo.customUrls - Array of {label, url, purpose} objects
 * @param {Array} props.stores - Store links with SVG logos; defaults to empty
 * @param {Array} props.salesPlatforms - Backward-compatible alias for stores
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showIdentity - Show large-mode name/byline/description header
 * @param {boolean} props.compact - Compact mode (smaller spacing/icons) - default for panels
 * @param {boolean} props.iconOnly - Icon-only mode with tooltips (full icon row)
 * @returns {JSX.Element} Contact list card component
 */
export default function ContactCard({
  user,
  artist,
  displayName,
  subtitle = "",
  description = "",
  socials = DEFAULT_SOCIALS,
  contactInfo = {},
  stores = [],
  salesPlatforms = [],
  className = "",
  showIdentity = true,
  compact = true,
  iconOnly = false,
  contactsHref = "",
  textRenderMode = "strip",
}) {
  const rawName = displayName || artist?.username || user?.username || "Contact"
  const rawSubtitle = subtitle || ""
  const rawDescription = description || ""
  const renderHtml = textRenderMode === "html"

  const name = renderHtml ? rawName : stripHtmlText(rawName)
  const subtitleText = renderHtml ? rawSubtitle : stripHtmlText(rawSubtitle)
  const descriptionText = renderHtml ? rawDescription : stripHtmlText(rawDescription)

  const nameHtml = sanitizeCardHtml(rawName)
  const subtitleHtml = sanitizeCardHtml(rawSubtitle)
  const descriptionHtml = sanitizeCardHtml(rawDescription)
  const storeLinks = stores.length > 0 ? stores : salesPlatforms

  if (iconOnly) {
    // Icon-only mode with tooltips
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {/* Location tooltip if available */}
        {contactInfo.location && (
          <div className="tooltip" data-tip={`📍 ${contactInfo.location}`}>
            <button className="btn btn-sm btn-outline border-base-300 bg-base-100 hover:bg-base-200 btn-circle text-lg text-base-content">📍</button>
          </div>
        )}

        {/* Email tooltip */}
        {contactInfo.email && (
          <a href={`mailto:${contactInfo.email}`} className="tooltip" data-tip={contactInfo.email}>
            <button className="btn btn-sm btn-outline border-base-300 bg-base-100 hover:bg-base-200 btn-circle text-lg text-base-content">✉️</button>
          </a>
        )}

        {/* Social icons */}
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tooltip"
            data-tip={`${social.handle} - ${social.purpose}`}
          >
            <button className="btn btn-sm btn-outline border-base-300 bg-base-100 hover:bg-base-200 btn-circle" style={{ color: social.color }}>
              <span className="h-6 w-6 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current">
                {resolveSocialIcon(social.name)}
              </span>
            </button>
          </a>
        ))}

        {/* Stores */}
        {storeLinks.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tooltip"
            data-tip={`${platform.handle} - ${platform.purpose}`}
          >
            <button className="btn btn-sm btn-outline border-base-300 bg-base-100 hover:bg-base-200 btn-circle" style={{ color: platform.color }}>
              <span className="h-6 w-6 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current">
                {resolveSocialIcon(social.name)}
              </span>
            </button>
          </a>
        ))}
      </div>
    )
  }

  if (!compact) {
    return (
      <div className={`card bg-base-100 border border-base-300 p-4 ${className}`}>
        {showIdentity && (
          <div className="pb-3 border-b border-base-300">
            {renderHtml ? (
              <div
                className="text-lg font-semibold text-base-content [&_h1]:text-lg [&_h2]:text-lg [&_h3]:text-lg"
                dangerouslySetInnerHTML={{ __html: nameHtml }}
              />
            ) : (
              <h2 className="text-lg font-semibold text-base-content">{name}</h2>
            )}
            {subtitleText && (
              renderHtml ? (
                <div
                  className="text-sm text-base-content/80 mt-0.5"
                  dangerouslySetInnerHTML={{ __html: subtitleHtml }}
                />
              ) : (
                <p className="text-sm text-base-content/80 mt-0.5">{subtitleText}</p>
              )
            )}
            {descriptionText && (
              renderHtml ? (
                <div
                  className="text-sm text-base-content/70 mt-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              ) : (
                <p className="text-sm text-base-content/70 mt-2 leading-relaxed">{descriptionText}</p>
              )
            )}
          </div>
        )}

        <div className={`${showIdentity ? "mt-4" : "mt-0"} grid grid-cols-1 lg:grid-cols-2 gap-6`}>
          <div>
            {(contactInfo.location || contactInfo.primaryAddressText || contactInfo.phone || contactInfo.email || contactInfo.customUrls?.length > 0) && (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/70 mb-2">Contact</p>

                {contactInfo.location && (
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg text-base-content/60 leading-6">📍</span>
                    <div>
                      <div className="text-sm text-base-content">{contactInfo.location}</div>
                    </div>
                  </div>
                )}

                {contactInfo.primaryAddressText && (
                  <div className="mb-2">
                    <div className="text-[11px] uppercase tracking-wide text-base-content/60">Primary Address</div>
                    <div className="text-sm text-base-content wrap-break-word">{contactInfo.primaryAddressText}</div>
                  </div>
                )}

                {contactInfo.email && (
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg text-base-content/60 leading-6">✉</span>
                    <a href={`mailto:${contactInfo.email}`} className="text-sm text-base-content hover:text-primary underline underline-offset-2 break-all">
                      {contactInfo.email}
                    </a>
                  </div>
                )}

                {contactInfo.phone && (
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg text-base-content/60 leading-6">☎</span>
                    <span className="text-sm text-base-content break-all">{contactInfo.phone}</span>
                  </div>
                )}

                {contactInfo.customUrls && contactInfo.customUrls.length > 0 && (
                  <div>
                    {contactInfo.customUrls.map((customUrl, idx) => (
                      <div key={idx} className="flex items-start gap-2 mb-2">
                        <span className="text-lg text-base-content/60 leading-6">🔗</span>
                        <div className="min-w-0 flex-1">
                          <a
                            href={customUrl.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-base-content hover:text-primary underline underline-offset-2 break-all"
                          >
                            {customUrl.label || customUrl.url}
                          </a>
                          {customUrl.purpose && <div className="text-xs text-base-content/75 break-all">{customUrl.purpose}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            {socials.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/70 mb-2">Follow</p>
                <div className="flex flex-col gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="group flex items-start gap-2 transition-transform hover:scale-[1.02] p-2 rounded hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span className="h-6 w-6 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current shrink-0 mt-0.5" style={{ color: social.color }}>
                        {resolveSocialIcon(social.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-base-content group-hover:text-primary transition-colors break-all">{social.handle}</div>
                        {social.purpose && <div className="text-xs text-base-content/75 break-all">{social.purpose}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {storeLinks.length > 0 && (
              <div className="pt-3 border-t border-base-300">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-base-content/70 mb-2">Stores</p>
                <div className="flex flex-col gap-2">
                  {storeLinks.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={platform.name}
                      className="group flex items-start gap-2 transition-transform hover:scale-[1.02] p-2 rounded hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span className="h-6 w-6 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current shrink-0 mt-0.5" style={{ color: platform.color }}>
                        {resolveStoreIcon(platform.name)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-base-content group-hover:text-primary transition-colors break-all">{platform.handle}</div>
                        {platform.purpose && <div className="text-xs text-base-content/75 break-all">{platform.purpose}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const padding = "p-2"
  const sectionMargin = "mt-1.5"

  return (
    <div className={`card bg-base-100 border border-base-300 ${padding} ${className}`}>
      {/* Card title */}
      {renderHtml ? (
        <div
          className={`font-semibold text-base-content ${compact ? "text-xs" : "text-sm"} mb-2 [&_h1]:text-inherit [&_h2]:text-inherit [&_h3]:text-inherit`}
          dangerouslySetInnerHTML={{ __html: nameHtml }}
        />
      ) : (
        <div className={`font-semibold text-base-content ${compact ? "text-xs" : "text-sm"} mb-2 truncate`}>{name}</div>
      )}

      {/* Location at top - compact single line */}
      {contactInfo.location && (
        <div className="flex items-center gap-1 mb-2 text-xs text-base-content truncate">
          <span className="shrink-0">📍</span>
          <span className="text-base-content/75 truncate">{contactInfo.location}</span>
        </div>
      )}

      {/* Social Media Links - compact icon row */}
      {socials.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tooltip tooltip-sm"
              data-tip={`${social.handle} - ${social.purpose}`}
            >
              <button className="btn btn-xs btn-outline border-base-300 bg-base-100 hover:bg-base-200 btn-circle" style={{ color: social.color }}>
                <span className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current">
                  {resolveSocialIcon(social.name)}
                </span>
              </button>
            </a>
          ))}
        </div>
      )}

      {/* Custom Contact Info */}
      {(contactInfo.email || contactInfo.phone || contactInfo.customUrls?.length > 0) && (
        <div className={`${sectionMargin} border-t border-base-300 pt-1.5`}>
          {/* Email */}
          {contactInfo.email && (
            <div className="flex items-center gap-1 mb-1 text-xs text-base-content truncate">
              <span className="shrink-0">✉</span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-xs text-base-content hover:text-primary underline underline-offset-2 truncate"
              >
                {contactInfo.email}
              </a>
            </div>
          )}

          {contactInfo.phone && (
            <div className="flex items-center gap-1 mb-1 text-xs text-base-content truncate">
              <span className="shrink-0">☎</span>
              <span className="text-xs text-base-content/75 truncate">{contactInfo.phone}</span>
            </div>
          )}

          {/* Custom URLs - compact icon row */}
          {contactInfo.customUrls && contactInfo.customUrls.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {contactInfo.customUrls.map((customUrl, idx) => (
                <a
                  key={idx}
                  href={customUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tooltip tooltip-sm"
                  data-tip={`${customUrl.label || customUrl.url}${customUrl.purpose ? ` - ${customUrl.purpose}` : ''}`}
                >
                  <button className="btn btn-xs btn-outline border-base-300 bg-base-100 hover:bg-base-200 btn-circle text-base-content">
                    <span className="text-xs">🔗</span>
                  </button>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stores - compact icon row */}
      {storeLinks.length > 0 && (
        <div className={`${sectionMargin} border-t border-base-300 pt-1.5`}>
          <div className="flex flex-wrap gap-1">
            {storeLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tooltip tooltip-sm"
                data-tip={`${platform.handle} - ${platform.purpose}`}
              >
                <button className="btn btn-xs btn-outline border-base-300 bg-base-100 hover:bg-base-200 btn-circle" style={{ color: platform.color }}>
                  <span className="h-4 w-4 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current">
                    {resolveStoreIcon(platform.name)}
                  </span>
                </button>
              </a>
            ))}
          </div>
        </div>
      )}

      {contactsHref && (
        <div className="mt-2 pt-2 border-t border-base-300 text-right">
          <Link href={contactsHref} className="text-xs text-primary hover:underline">
            View full contact info →
          </Link>
        </div>
      )}
    </div>
  )
}
