/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/widgets/tiptap-editor";

export default function TTArticle({ value, onChange, onSubmit, onCancel, actionPreset = "none", minHeight=240 }) {
	return (
		<div className="rounded-lg border border-base-300 bg-base-100 p-4 space-y-3">
			{/*<h2 className="text-lg font-semibold">Article / Blog</h2>*/}
			{actionPreset != "none" && (
				<p className="text-sm text-base-content/70">
					Full preset with Cancel / Post actions for long-form content.
				</p>
			)}
			<TiptapEditor
				value={value}
				onChange={onChange}
				placeholder="Write your article or blog post..."
				preset="full"
				fontScope="article"
				minHeight={minHeight}
				actionPreset={actionPreset}
				submitLabel="Post"
				cancelLabel="Cancel"
				emptySubmitMessage="Write something before posting."
				onSubmit={onSubmit}
				onCancel={onCancel}
			/>
		</div>
	);
}
