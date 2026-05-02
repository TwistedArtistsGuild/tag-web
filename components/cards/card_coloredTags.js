/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/**
 * Colored tag / badge system.
 *
 * Usage:
 *   <ColoredTagCard
 *     label="Content Warnings"
 *     description="Marks content that some audiences may find sensitive."
 *     tags={[
 *       { text: "Violence", color: "red" },
 *       { text: "Fantasy", color: "blue" },
 *     ]}
 *   />
 *
 * Props:
 *   label        {string}   Section heading (e.g. "Content Warnings", "Category", "Genre")
 *   description  {string=}  Optional short description beneath the label
 *   tags         {Array}    Array of { text, color } objects
 *   size         {string=}  "sm" | "md" (default "md") — controls badge padding
 *   className    {string=}  Extra classes on the card wrapper
 */

const COLOR_MAP = {
  red:    { bg: "#dc2626", border: "#b91c1c" },
  green:  { bg: "#16a34a", border: "#15803d" },
  blue:   { bg: "#2563eb", border: "#1d4ed8" },
  purple: { bg: "#7c3aed", border: "#6d28d9" },
  orange: { bg: "#ea580c", border: "#c2410c" },
  yellow: { bg: "#ca8a04", border: "#a16207" },
};

const DEFAULT_STYLE = { bg: "#4b5563", border: "#374151" };

export default function ColoredTagCard({ label, description, tags = [], size = "md", className = "" }) {
  const badgeSize = size === "sm" ? "badge-sm" : "badge-md";

  return (
    <div className={`rounded-box border border-base-300/70 bg-base-100/60 p-4 shadow-sm backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-base-content/70">{description}</p>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => {
            const { bg, border } = COLOR_MAP[tag.color] ?? DEFAULT_STYLE;
            return (
              <span
                key={i}
                className={`badge ${badgeSize} font-medium`}
                style={{
                  backgroundColor: bg,
                  borderColor: border,
                  color: "#ffffff",
                  textShadow: "0 1px 2px rgba(0,0,0,0.55)",
                }}
              >
                {tag.text}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-base-content/40 italic">No tags yet.</p>
      )}
    </div>
  );
}
