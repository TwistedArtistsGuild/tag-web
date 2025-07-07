/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import { useState, useRef } from "react"
import Image from "next/image"
import axios from "axios"

/**
 * Component for uploading multiple pictures with metadata.
 * @returns {JSX.Element}
 */
export default function UploadPictureForm1() {
	// Configurable maximum number of files
	const MAX_FILES = 5

	// State to hold files and their associated data
	const [filesData, setFilesData] = useState([]) // Array of { file, preview, uploadedUrl, showForm }
	const [context, setContext] = useState("twistedpassions")
	const fileInputRef = useRef(null)

	// Open the file selector dialog
	const handleClick = () => {
		fileInputRef.current.click()
	}

	// Handle file selection
	const handleFileSelect = (event) => {
		let selectedFiles = Array.from(event.target.files)
		console.log("Selected files:", selectedFiles)

		// Limit the number of files to MAX_FILES
		if (selectedFiles.length + filesData.length > MAX_FILES) {
			alert(`You can only upload up to ${MAX_FILES} files.`)
			selectedFiles = selectedFiles.slice(0, MAX_FILES - filesData.length)
		}

		// For each selected file, create a preview and initial data
		selectedFiles.forEach((selectedFile) => {
			const reader = new FileReader()
			reader.onloadend = () => {
				setFilesData((prevFilesData) => [
					...prevFilesData,
					{
						file: selectedFile,
						preview: reader.result,
						uploadedUrl: null,
						showForm: false,
						metadata: {}, // To store metadata fields
					},
				])
			}
			reader.readAsDataURL(selectedFile)
		})

		// Reset the file input value to allow selecting the same file again if needed
		event.target.value = null
	}

	// Handle file upload
	const handleConfirm = async (index) => {
		const fileData = filesData[index]
		const formData = new FormData()
		formData.append("file", fileData.file)
		formData.append("context", context)

		try {
			console.log("Uploading file:", fileData.file.name)
			const uploadResponse = await axios.post("/api/uploadHandler", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})

			const { new_urls } = uploadResponse.data
			const uploadedUrl = new_urls[0] // Assuming one URL returned per file

			// Update the filesData state with the uploaded URL and show the metadata form
			setFilesData((prevFilesData) => {
				const newFilesData = [...prevFilesData]
				newFilesData[index] = {
					...newFilesData[index],
					uploadedUrl,
					showForm: true,
				}
				return newFilesData
			})
		} catch (error) {
			console.error("Error uploading file:", error)
			alert("Error uploading file")
		}
	}

	// Handle metadata form submission
	const handleUploadMetadata = async (event, index) => {
		event.preventDefault()

		const fileData = filesData[index]

		// Prepare metadata to send to the REST API
		const formFields = new FormData(event.target)
		const pictureData = {}
		formFields.forEach((value, key) => {
			pictureData[key] = value
		})

		// Ensure height and width are parsed as numbers
		if (pictureData.height) {
			pictureData.height = parseInt(pictureData.height, 10)
		}
		if (pictureData.width) {
			pictureData.width = parseInt(pictureData.width, 10)
		}

		pictureData.url = fileData.uploadedUrl

		try {
			await axios.post(`${process.env.NEXT_PUBLIC_TAG_API_URL}picture`, pictureData, {
				headers: {
					"Content-Type": "application/json",
				},
			})

			alert("Metadata uploaded successfully")

			// Optionally, remove the file data from the state after successful upload
			// setFilesData((prevFilesData) => prevFilesData.filter((_, i) => i !== index));
		} catch (error) {
			console.error("Error uploading metadata:", error)
			alert("Error uploading metadata")
		}
	}

	const fieldsProp = [
		{
			name: "metadata",
			className: "styles.input",
			type: "text",
			placeholder: "Metadata",
			defaultValue: "",
			label: "Metadata",
		},
		{
			name: "title",
			className: "styles.input",
			type: "text",
			placeholder: "Title",
			defaultValue: "",
			label: "Title",
		},
		{
			name: "alttext",
			className: "styles.input",
			type: "text",
			placeholder: "Alt Text",
			defaultValue: "",
			label: "Alt Text",
		},
		{
			name: "height",
			className: "styles.input",
			type: "number",
			placeholder: "Height",
			defaultValue: "",
			label: "Height",
		},
		{
			name: "width",
			className: "styles.input",
			type: "number",
			placeholder: "Width",
			defaultValue: "",
			label: "Width",
		},
	]

	return (
		<div className="p-4 bg-base-200 rounded-lg">
			{/* File Selection Section */}
			<div className="form-control">
				<input
					type="file"
					multiple
					accept="image/*"
					ref={fileInputRef}
					style={{ display: "none" }}
					onChange={handleFileSelect}
				/>
				<input
					type="text"
					value={context}
					onChange={(e) => setContext(e.target.value)}
					placeholder="Context"
					className="input input-bordered mb-4"
				/>
				<button className="btn btn-primary" onClick={handleClick}>
          Select Files (up to {MAX_FILES})
				</button>
			</div>
			{/* Display Selected Files */}
			{filesData.length > 0 && (
				<div className="mt-4">
					{filesData.map((fileData, index) => (
						<div key={index} className="mb-4">
							<div className="card shadow-lg">
								<figure>
									{fileData.preview && (
										<Image
											src={fileData.preview}
											alt="Preview"
											layout="responsive"
											width={500}
											height={500}
										/>
									)}
								</figure>
								<div className="card-body">
									<p>Selected file:</p>
									<ul>
										<li>{fileData.file.name}</li>
									</ul>
									{fileData.uploadedUrl ? (
										<div>
											<p>Uploaded URL:</p>
											<input
												type="text"
												value={fileData.uploadedUrl}
												readOnly
												className="input input-bordered"
											/>
											{fileData.showForm && (
												<form onSubmit={(e) => handleUploadMetadata(e, index)} className="mt-4">
													{fieldsProp.map((field, i) => (
														<div key={i} className="form-control">
															<label className="label">
																<span className="label-text">{field.label}</span>
															</label>
															<input
																className="input input-bordered"
																type={field.type}
																placeholder={field.placeholder}
																name={field.name}
																defaultValue={field.defaultValue}
															/>
														</div>
													))}
													<button type="submit" className="btn btn-primary mt-4">
                            Upload Metadata
													</button>
												</form>
											)}
										</div>
									) : (
										<button className="btn btn-secondary mt-4" onClick={() => handleConfirm(index)}>
                      Confirm and Upload
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
