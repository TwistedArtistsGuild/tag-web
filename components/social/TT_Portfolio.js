/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/widgets/tiptap-editor";

export default function TTPortfolio({ value, onChange, onSaveDraft, onPublish }) {
	return (
		<div className="rounded-lg border border-base-300 bg-base-100 p-4 space-y-3">
			<h2 className="text-lg font-semibold">Portfolio</h2>
			<p className="text-sm text-base-content/70">
				Full preset with Save Draft / Publish workflow.
			</p>
			<TiptapEditor
				value={value}
				onChange={onChange}
				placeholder="Describe your portfolio piece..."
				preset="full"
				fontScope="portfolio"
				minHeight={240}
				actionPreset="save-publish"
				saveDraftLabel="Save Draft"
				publishLabel="Publish"
				emptySubmitMessage="Add some content before saving."
				onSaveDraft={onSaveDraft}
				onPublish={onPublish}
			/>
		</div>
	);
}
