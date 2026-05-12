/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import TiptapEditor from "@/components/tiptap/tiptap-editor";

export default function TTArticle({
	value,
	onChange,
	onSubmit,
	onCancel,
	actionPreset = "none",
	minHeight = 240,
	uploadContext,
	toolbarSlot,
	mediaToolbarSlot,
	onPickImageFromLibrary,
	onGalleryPreviewClick,
	showAlignmentControls = true,
}) {
	const resolvedMinHeight = Math.max(Number(minHeight) || 0, 180);

	return (
		<div className="rounded-box border border-base-300 bg-base-100 p-4 space-y-3 shadow-sm">
			<style jsx global>{`
				.article-editor-preview.ProseMirror h3,
				.article-editor-preview.ProseMirror h4,
				.article-editor-preview.ProseMirror h5 {
					margin: 0.85em 0 0.45em;
					line-height: 1.2;
				}

				.article-editor-preview.ProseMirror h3 {
					font-size: 1.7rem;
					font-weight: 700;
					letter-spacing: -0.015em;
				}

				.article-editor-preview.ProseMirror h4 {
					font-size: 1.35rem;
					font-weight: 700;
					letter-spacing: 0.01em;
					text-transform: uppercase;
				}

				.article-editor-preview.ProseMirror h5 {
					font-size: 1.1rem;
					font-weight: 600;
					letter-spacing: 0.04em;
					text-transform: uppercase;
				}

				.article-editor-preview.ProseMirror ul,
				.article-editor-preview.ProseMirror ol {
					margin: 0.85em 0;
					padding-left: 1.75rem;
				}

				.article-editor-preview.ProseMirror ul {
					list-style: disc;
				}

				.article-editor-preview.ProseMirror ol {
					list-style: decimal;
				}

				.article-editor-preview.ProseMirror li {
					margin: 0.3em 0;
				}

				.article-editor-preview.ProseMirror li > p {
					margin: 0;
				}
			`}</style>
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
				className="article-editor-preview"
				fontScope="article"
				minHeight={resolvedMinHeight}
				actionPreset={actionPreset}
				submitLabel="Post"
				cancelLabel="Cancel"
				emptySubmitMessage="Write something before posting."
				onSubmit={onSubmit}
				onCancel={onCancel}
				uploadContext={uploadContext}
				toolbarSlot={toolbarSlot}
				mediaToolbarSlot={mediaToolbarSlot}
				headingLevels={[3, 4, 5]}
				onPickImageFromLibrary={onPickImageFromLibrary}
				onGalleryPreviewClick={onGalleryPreviewClick}
				showAlignmentControls={showAlignmentControls}
				resizable
			/>
		</div>
	);
}
