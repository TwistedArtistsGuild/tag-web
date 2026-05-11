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

function forceTitleHeading(html) {
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
    return `<h2${alignStyle}>${escapeHtml(plainText)}</h2>`;
  }

  return `<h2${alignStyle}>${inlineContent}</h2>`;
}

export default function TTTitleLine({ value, onChange, allowedFonts = [], showAlignmentControls = true }) {
  const handleTitleChange = (nextHtml) => {
    onChange(forceTitleHeading(nextHtml));
  };

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-4 space-y-3">
      <style jsx global>{`
        .titleline-editor-preview .ProseMirror {
          min-height: 0 !important;
          padding: 0.35rem 0.5rem !important;
        }

        .titleline-editor-preview .ProseMirror h1,
        .titleline-editor-preview .ProseMirror h2,
        .titleline-editor-preview .ProseMirror h3,
        .titleline-editor-preview .ProseMirror p {
          font-size: clamp(2.1rem, 5vw, 4.5rem);
          line-height: 1.05;
          font-weight: 700;
          margin: 0;
        }
      `}</style>

      <TiptapEditor
        value={value}
        onChange={handleTitleChange}
        placeholder="Write your title..."
        preset="minimal"
        className="titleline-editor-preview"
        singleLine
        minHeight={1}
        fontScope="title"
        allowedFonts={allowedFonts}
        enableSingleLineFontSelection
        showAlignmentControls={true}
        allowStrikethrough={false}
        headingLevels={[]}
      />
    </div>
  );
}
