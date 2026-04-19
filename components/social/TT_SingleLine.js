/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/widgets/tiptap-editor";

export default function TTSingleLine({ value, onChange }) {
	return (
		<div className="rounded-lg border border-base-300 bg-base-100 p-4 space-y-3">
			{/*<h2 className="text-lg font-semibold">Single Line</h2>*/}
			{/*<p className="text-sm text-base-content/70">*/}
			{/*	Short inline input for titles, taglines, and display names.*/}
			{/*</p>*/}
			<TiptapEditor
				value={value}
				onChange={onChange}
				placeholder="Short text with formatting..."
				preset="minimal"
				singleLine
				minHeight={44}
			/>
		</div>
	);
}
