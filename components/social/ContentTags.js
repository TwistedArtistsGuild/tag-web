/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

export const WARNING_DEFINITIONS = {
  "nudity": {
    group: "sexual",
    level: "general",
    description: "Non-sexual nudity; artistic or documentary context.",
  },
  "nudity-sexually-implicit": {
    group: "sexual",
    level: "ageRestricted",
    description: "Suggestive themes or implied sexual context.",
  },
  "nudity-sexually-explicit": {
    group: "sexual",
    level: "explicit",
    description: "Explicit sexual content.",
  },
  "violence": {
    group: "violence",
    level: "advisory",
    description: "Depictions of physical conflict or harm without graphic detail.",
  },
  "violence-graphic-gore": {
    group: "violence",
    level: "advisory",
    description: "Explicit injury, blood, or bodily harm.",
  },
  "war-armed-conflict": {
    group: "violence",
    level: "advisory",
    description: "Depictions of warfare, combat, or military violence.",
  },
  "self-harm-themes": {
    group: "psychological",
    level: "advisory",
    description: "References to self-injury or suicide (non-instructional).",
  },
  "psychological-distress": {
    group: "psychological",
    level: "advisory",
    description: "Extreme fear, anxiety, trauma, or mental anguish.",
  },
  "abuse-themes": {
    group: "psychological",
    level: "advisory",
    description: "Emotional, physical, or psychological abuse.",
  },
  "domestic-violence": {
    group: "psychological",
    level: "advisory",
    description: "Violence within domestic or intimate relationships.",
  },
  "trauma-oppression": {
    group: "psychological",
    level: "advisory",
    description: "Content addressing systemic harm, displacement, or historical trauma.",
  },
  "alcohol-use": {
    group: "substance",
    level: "advisory",
    description: "Depictions of drinking or intoxication.",
  },
  "drug-use": {
    group: "substance",
    level: "advisory",
    description: "Depictions of recreational or illicit drug use.",
  },
  "substance-abuse": {
    group: "substance",
    level: "advisory",
    description: "Content centered on addiction or dependency.",
  },
  "strong-language": {
    group: "behavior",
    level: "advisory",
    description: "Profanity or explicit verbal content.",
  },
  "harassment-or-bullying": {
    group: "behavior",
    level: "advisory",
    description: "Intimidation, threats, or degrading behavior.",
  },
  "hate-speech-or-slurs": {
    group: "behavior",
    level: "advisory",
    description: "Language targeting protected groups.",
  },
  "religious-imagery": {
    group: "sensitivity",
    level: "advisory",
    description: "Use or depiction of religious symbols or rituals.",
  },
  "cultural-sensitivity": {
    group: "sensitivity",
    level: "advisory",
    description: "Content engaging with cultures, traditions, or identities that may require contextual care.",
  },
  "political-content": {
    group: "sensitivity",
    level: "advisory",
    description: "Explicit political messaging, ideology, or protest.",
  },
  "medical-or-surgical-imagery": {
    group: "other",
    level: "advisory",
    description: "Non-graphic but potentially disturbing medical visuals.",
  },
  "death-mortality": {
    group: "other",
    level: "advisory",
    description: "Themes involving death, dying, or funerary practices.",
  },
  "body-horror": {
    group: "other",
    level: "advisory",
    description: "Distorted or unnatural depictions of the human body.",
  },
  "horror-fear-themes": {
    group: "other",
    level: "advisory",
    description: "Content intended to frighten or deeply unsettle.",
  },
}

const GROUP_STYLES = {
  sexual: { bg: "#f59e0b", border: "#d97706" },
  violence: { bg: "#db2777", border: "#be185d" },
  psychological: { bg: "#7c3aed", border: "#6d28d9" },
  substance: { bg: "#2563eb", border: "#1d4ed8" },
  behavior: { bg: "#0f766e", border: "#0f766e" },
  sensitivity: { bg: "#4f46e5", border: "#4338ca" },
  other: { bg: "#475569", border: "#334155" },
}

const AGE_RESTRICTED_STYLE = { bg: "#f97316", border: "#ea580c" }
const EXPLICIT_STYLE = { bg: "#dc2626", border: "#b91c1c" }

const normalizeKey = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const getWarningMeta = (value) => {
  const key = normalizeKey(value)
  const definition = WARNING_DEFINITIONS[key]

  if (!definition) {
    return {
      key,
      label: value,
      group: "other",
      level: "advisory",
      description: "Sensitive content advisory.",
    }
  }

  return {
    key,
    label: value,
    ...definition,
  }
}

const getWarningStyle = (meta) => {
  if (meta.level === "explicit") return EXPLICIT_STYLE
  if (meta.level === "ageRestricted") return AGE_RESTRICTED_STYLE
  return GROUP_STYLES[meta.group] || GROUP_STYLES.other
}

export const hasExplicitWarning = (warnings = []) =>
  warnings.some((warning) => getWarningMeta(warning).level === "explicit")

export const shouldHideSensitiveMedia = (warnings = [], hasViewerConsent = false) =>
  hasExplicitWarning(warnings) && !hasViewerConsent

export const extractContentWarnings = (source = {}) => {
  const warnings =
    source?.contentWarnings ||
    source?.contentwarnings ||
    source?.warnings ||
    source?.warningTags ||
    source?.contentTags ||
    []

  if (!Array.isArray(warnings)) {
    return []
  }

  return warnings
    .map((item) => {
      if (typeof item === "string") return item.trim()
      if (item && typeof item === "object") {
        return String(item.label || item.name || item.tag || item.title || "").trim()
      }
      return ""
    })
    .filter(Boolean)
}

export default function ContentTags({
  warnings = [],
  title = "Content Warnings",
  className = "",
  size = "md",
  showTitle = true,
}) {
  if (!warnings.length) {
    return null
  }

  const badgeSize = size === "sm" ? "badge-sm" : "badge-md"

  return (
    <div className={`rounded-t-box border-b border-base-300 bg-base-100/70 px-3 py-2 ${className}`}>
      {showTitle && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/60">{title}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {warnings.map((warning, index) => {
          const meta = getWarningMeta(warning)
          const style = getWarningStyle(meta)

          return (
            <span
              key={`${meta.key}-${index}`}
              className={`badge ${badgeSize} font-medium`}
              title={meta.description}
              style={{
                backgroundColor: style.bg,
                borderColor: style.border,
                color: "#ffffff",
                textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {meta.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function ContentWarningMediaGate({
  warnings = [],
  hasViewerConsent = false,
  onConsent,
  className = "",
  placeholderClassName = "",
  children,
}) {
  const blockMedia = shouldHideSensitiveMedia(warnings, hasViewerConsent)

  if (!blockMedia) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`rounded-box border border-error/30 bg-base-100/90 p-4 shadow-sm ${className}`}>
      <div className={`flex min-h-40 items-center justify-center text-center ${placeholderClassName}`}>
        <div className="max-w-xs space-y-2">
          <p className="text-sm font-semibold text-error">Explicit sexual content is hidden by default.</p>
          <p className="text-xs text-base-content/75">
            Viewer consent is required before media can be shown.
          </p>
          {typeof onConsent === "function" && (
            <button
              type="button"
              className="btn btn-error btn-sm"
              onClick={onConsent}
            >
              I Consent - Show Media
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
