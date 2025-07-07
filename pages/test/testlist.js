/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"
import { defaultFieldClass } from "/utils/formSettings"

export default function TestList() {
	const [containers, setContainers] = useState([])
	const [selectedContainer, setSelectedContainer] = useState("")
	const [blobs, setBlobs] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchContainers = async () => {
			try {
				const response = await axios.get("/api/listBlobContainers")
				setContainers(response.data.containers)
				setSelectedContainer(response.data.containers[0] || "")
			} catch (err) {
				setError(err)
			}
		}

		fetchContainers()
	}, [])

	useEffect(() => {
		if (selectedContainer) {
			const fetchBlobs = async () => {
				setLoading(true)
				try {
					const response = await axios.get(`/api/listBlob?context=${selectedContainer}`)
					setBlobs(response.data.blobs)
				} catch (err) {
					setError(err)
				} finally {
					setLoading(false)
				}
			}

			fetchBlobs()
		}
	}, [selectedContainer])

	if (error) {
		return <div>Error: {error.message}</div>
	}

	return (
		<div>
			<h1>Select a Blob Container</h1>
			<form className="form-control">
				<label className="label" htmlFor="containerSelect">Container:</label>
				<select
					id="containerSelect"
					className={defaultFieldClass}
					value={selectedContainer}
					onChange={(e) => setSelectedContainer(e.target.value)}
				>
					{containers.map((container) => (
						<option key={container} value={container}>
							{container}
						</option>
					))}
				</select>
			</form>

			{loading && <div>Loading...</div>}

			{!loading && selectedContainer && (
				<div>
					<h1>List of Blobs in Container: {selectedContainer}</h1>
					<table className="table table-zebra w-full mt-4">
						<thead>
							<tr>
								<th>Name</th>
								<th>URL</th>
							</tr>
						</thead>
						<tbody>
							{blobs.map((blob) => (
								<tr key={blob.name}>
									<td>{blob.name}</td>
									<td>
										<Image src={blob.url} alt={blob.name} width={100} height={100} className="max-w-xs" />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}