/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/tiptap/tiptap-editor";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeHeadingLevel(level) {
  const numericLevel = Number(level);
  if (!Number.isInteger(numericLevel) || numericLevel < 1 || numericLevel > 3) {
    return 2;
  }

  return numericLevel;
}

function resolveFontScope(headingLevel, fontScope) {
  if (fontScope) {
    return fontScope;
  }

  if (headingLevel === 1) {
    return "title";
  }

  if (headingLevel === 2) {
    return "title";
  }

  return "medium";
}

function forceHeadingTag(html, headingLevel = 2) {
  const normalizedLevel = normalizeHeadingLevel(headingLevel);
  const targetTag = `h${normalizedLevel}`;
  const raw = String(html || "").trim();
  if (!raw) {
    return "";
  }

  const plainText = raw
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return "";
  }

  // Extract text-align from the first block-level tag
  let textAlignMatch = raw.match(/style="[^"]*text-align:\s*(left|center|right)/i);
  let textAlign = textAlignMatch ? textAlignMatch[1].toLowerCase() : null;

  // Preserve inline formatting (like font-family spans) while normalizing block container to h2.
  const inlineContent = raw
    .replace(/<\/?(p|h1|h2|h3|div)[^>]*>/gi, "")
    .replace(/\n/g, "")
    .trim();

  const alignStyle = textAlign ? ` style="text-align: ${textAlign}"` : "";

  if (!inlineContent) {
    return `<${targetTag}${alignStyle}>${escapeHtml(plainText)}</${targetTag}>`;
  }

  return `<${targetTag}${alignStyle}>${inlineContent}</${targetTag}>`;
}

export default function TTTitleLine({
  value,
  onChange,
  allowedFonts = [],
  showAlignmentControls = true,
  headingLevel = 2,
  placeholder,
  fontScope,
}) {
  const normalizedLevel = normalizeHeadingLevel(headingLevel);
  const resolvedFontScope = resolveFontScope(normalizedLevel, fontScope);

  const handleTitleChange = (nextHtml) => {
    onChange(forceHeadingTag(nextHtml, normalizedLevel));
  };

  const placeholderByLevel =
    normalizedLevel === 1
      ? "Write your primary heading..."
      : normalizedLevel === 2
        ? "Write your title..."
        : "Write your subheading...";

  const headingFontSizes = {
    1: "clamp(3.25rem, 8.5vw, 4.9rem)",
    2: "clamp(1.55rem, 3vw, 2.2rem)",
    3: "clamp(1.05rem, 1.9vw, 1.4rem)",
  };

  const headingLineHeights = {
    1: "1.05",
    2: "1.14",
    3: "1.3",
  };

  const headingWeights = {
    1: 800,
    2: 600,
    3: 600,
  };

  const headingLetterSpacing = {
    1: "-0.03em",
    2: "-0.01em",
    3: "0.02em",
  };

  const levelClassName = `titleline-editor-preview level-${normalizedLevel}`;

  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-4 space-y-3 shadow-sm">
      <style jsx global>{`
        .titleline-editor-preview .ProseMirror {
          min-height: 0 !important;
          padding: 0.35rem 0.5rem !important;
          white-space: nowrap !important;
          overflow-x: auto !important;
          overflow-y: hidden !important;
          display: block;
          width: max-content;
          min-width: 100%;
        }

        .titleline-editor-preview .ProseMirror h1,
        .titleline-editor-preview .ProseMirror h2,
        .titleline-editor-preview .ProseMirror h3,
        .titleline-editor-preview .ProseMirror p {
          display: inline-block;
          white-space: nowrap;
          font-size: ${headingFontSizes[normalizedLevel]};
          line-height: ${headingLineHeights[normalizedLevel]};
          font-weight: ${headingWeights[normalizedLevel]};
          letter-spacing: ${headingLetterSpacing[normalizedLevel]};
          margin: 0;
        }
      `}</style>

      <TiptapEditor
        value={value}
        onChange={handleTitleChange}
        placeholder={placeholder || placeholderByLevel}
        preset="minimal"
        className={levelClassName}
        singleLine
        minHeight={1}
        fontScope={resolvedFontScope}
        allowedFonts={allowedFonts}
        enableSingleLineFontSelection
        showAlignmentControls={showAlignmentControls}
        allowStrikethrough={false}
        headingLevels={[]}
      />
    </div>
  );
}
