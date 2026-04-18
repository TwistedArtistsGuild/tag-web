/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import { useState, useEffect } from "react"
import DOMPurify from "dompurify"
import TiptapEditor from "@/components/social/tiptap-editor"

/**
 * @deprecated Use TiptapEditor directly with actionPreset="submit-cancel".
 * This wrapper will be removed in a future release.
 */
export default function Wysiwyg({ formattedData, onSubmit, onCancel, placeholder = "Enter your comment..." }) {
	const [value, setValue] = useState("")
	const [editorContent, setEditorContent] = useState("")
	const [isEditing, setIsEditing] = useState(true)

	useEffect(() => {
		if (formattedData) {
			setValue(formattedData)
			setEditorContent(formattedData)
		}
	}, [formattedData])

	const onChangeHandler = (content) => {
		setValue(content)
		setEditorContent(content)
	}

	const handleSubmit = (html) => {
		setEditorContent(html)
		if (onSubmit) {
			onSubmit(html)
		}
		setIsEditing(false)
	}

	const handleCancel = () => {
		if (onCancel) {
			onCancel()
		}
		setIsEditing(false)
	}

	return (
		<div className="bg-base-100 rounded-lg">
			{isEditing ? (
				<>
					<TiptapEditor
						value={value}
						onChange={onChangeHandler}
						placeholder={placeholder}
						className="bg-base-100"
						preset="minimal"
						minHeight={100}
						actionPreset="submit-cancel"
						submitLabel={formattedData ? "Update" : "Post Comment"}
						cancelLabel="Cancel"
						emptySubmitMessage="Write something before posting."
						onSubmit={handleSubmit}
						onCancel={handleCancel}
					/>
				</>
			) : (
				<>
					<div>
						<div
							className="p-4 bg-base-100 rounded-lg"
							dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(editorContent) }}
						/>
					</div>
					<button className="btn btn-sm btn-secondary mt-2" onClick={() => setIsEditing(true)}>Edit</button>
				</>
			)}
		</div>
	)
}
