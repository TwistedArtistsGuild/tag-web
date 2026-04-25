/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/widgets/tiptap-editor";

export default function TTTitleLine({ value, onChange, allowedFonts = [] }) {
  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-4 space-y-3">

      <TiptapEditor
        value={value}
        onChange={onChange}
        placeholder="Write your title..."
        preset="minimal"
        singleLine
        minHeight={56}
        fontScope="title"
        allowedFonts={allowedFonts}
        enableSingleLineFontSelection
        headingLevels={[1, 2, 3]}
      />
    </div>
  );
}
