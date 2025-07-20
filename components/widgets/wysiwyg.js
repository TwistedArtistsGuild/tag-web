/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import DOMPurify from "dompurify"
import "react-quill/dist/quill.snow.css"

// Dynamically import Quill
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
	ssr: false,
	loading: () => <p>Loading ...</p>,
})

export default function Wysiwyg({ formattedData, onSubmit, onCancel, placeholder = "Enter your comment..." }) {
	const [value, setValue] = useState("")
	const [quillContent, setQuillContent] = useState("")
	const [isEditing, setIsEditing] = useState(true)
	const quillRef = useRef()

	// Define toolbar options - simpler for comment systems
	const modules = {
		toolbar: [
			["bold", "italic", "underline"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link"],
			["clean"] // Removes formatting
		],
	}

	useEffect(() => {
		if (formattedData) {
			setValue(formattedData)
			setQuillContent(formattedData)
		}
	}, [formattedData])

	const onChangeHandler = (content) => {
		setValue(content)
		setQuillContent(content)
	}

	const handleSubmit = () => {
		// Don't submit empty comments (just HTML tags with no content)
		const textOnly = quillContent.replace(/<[^>]*>/g, '').trim()
		if (!textOnly) {
			// You could add an error message here
			return
		}
		
		if (onSubmit) {
			onSubmit(quillContent)
		}
		setIsEditing(false)
	}

	const handleCancel = () => {
		if (onCancel) {
			onCancel()
		} else {
			setIsEditing(false)
		}
	}

	return (
		<div className="bg-base-100 rounded-lg">
			{isEditing ? (
				<>
					<QuillNoSSRWrapper
						modules={modules}
						value={value}
						onChange={onChangeHandler}
						placeholder={placeholder}
						ref={quillRef}
						className="bg-base-100 rounded min-h-[100px]"
					/>
					<div className="flex gap-2 mt-2 justify-end">
						<button 
							className="btn btn-sm btn-outline" 
							onClick={handleCancel}
						>
							Cancel
						</button>
						<button 
							className="btn btn-sm btn-primary" 
							onClick={handleSubmit}
						>
							{formattedData ? "Update" : "Post Comment"}
						</button>
					</div>
				</>
			) : (
				<>
					<div>
						<div
							className="p-4 bg-base-100 rounded-lg"
							dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quillContent) }}
						/>
					</div>
					<button className="btn btn-sm btn-secondary mt-2" onClick={() => setIsEditing(true)}>Edit</button>
				</>
			)}
		</div>
	)
}
