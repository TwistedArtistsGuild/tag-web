/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

const SearchPage = ({ initialSearchTerm, results: initialResults = [], status }) => {
	const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "")
	const [searchType, setSearchType] = useState("artist")
	const [orderBy, setOrderBy] = useState("relevance")
	const [results, setResults] = useState(initialResults)
	const router = useRouter()

	useEffect(() => {
		if (initialSearchTerm) {
			setResults(initialResults)
		}
	}, [initialSearchTerm, initialResults])

	const handleSearch = async () => {
		const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
		let endpoint = `${api_url}utility_search/search?keyword=${searchTerm}`
		try {
			const res = await fetch(endpoint)
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}
			const data = await res.json()
			console.log("Search results:", data) // Log the JSON response
			setResults(data)
		} catch (error) {
			console.error("An error has occurred with your search request: ", error)
		}
	}

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Search Page</h1>
			<div className="flex flex-col gap-4 mb-6">
				<input
					type="text"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder="Search..."
					className="input input-bordered w-full max-w-md"
				/>
				<select
					value={searchType}
					onChange={(e) => setSearchType(e.target.value)}
					className="select select-bordered w-full max-w-md"
				>
					<option value="artist">Artist</option>
					<option value="listing">Listing</option>
				</select>
				<select
					value={orderBy}
					onChange={(e) => setOrderBy(e.target.value)}
					className="select select-bordered w-full max-w-md"
				>
					<option value="relevance">Relevance</option>
					<option value="date">Date</option>
					<option value="popularity">Popularity</option>
				</select>
				<button onClick={handleSearch} className="btn btn-primary w-full max-w-md">
					Search
				</button>
			</div>
			<div>
				<h2 className="text-xl font-semibold mb-4">Results</h2>
				{results.length > 0 ? (
					<ul className="list-disc pl-5">
						{results.map((result, index) => (
							<li key={index} className="mb-2">
								{result.artistID ? (
									<Link href={`/artists/${result.path}`}>
										<a className="link link-primary">{result.byline}</a>
									</Link>
								) : (
									<Link href={`/listings/${result.listingID}`}>
										<a className="link link-primary">{result.title}</a>
									</Link>
								)}
							</li>
						))}
					</ul>
				) : (
					<p className="text-gray-500">No results found</p>
				)}
			</div>
		</div>
	)
}

SearchPage.getInitialProps = async function ({ query }) {
	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
	let data = []
	let status = 200
	const searchTerm = query.term || ""

	if (process.env.DEBUG === "true") {
		console.log("Artist data fetch starting via API: \n " + api_url + "utility_search/search?keyword=" + searchTerm)
	}

	try {
		const res = await fetch(`${api_url}utility_search/search?keyword=${searchTerm}`)
		status = res.status
		if (!res.ok) {
			throw new Error(`HTTP error! status: ${status}`)
		}
		data = await res.json()
		console.log("Initial search results:", data) // Log the JSON response
	} catch (error) {
		console.error("An error has occurred with your artist fetch request: ", error)
	}

	if (process.env.DEBUG === "true") {
		console.log(`Artist data fetched. Count: ${data.length}`)
	}

	return {
		initialSearchTerm: searchTerm,
		results: data,
		status: status,
	}
}

export default SearchPage
