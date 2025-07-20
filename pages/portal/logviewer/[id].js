/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


//change to displaying an individual log (from Blogs)
import shortDateOptions from "/utils/shortdateoptions"

const Logviewer = props => {
	const options = shortDateOptions

	return (
		<div className="flex flex-col items-center justify-evenly min-h-screen w-full">
			<div className="w-full max-w-4xl p-4">
				<h1 className="text-4xl font-bold mb-8 text-primary">Log viewer</h1>
        
				<div>
					<div>
						<table className="table w-full">
							<thead>
								<tr>
									<th>Tags</th>
									<th>Short Text</th>
									<th>Long Text</th>
									<th>Critical</th>
									<th>Log Timestamp</th>
									<th>Userfk</th>
									<th>Artistfk</th>
									<th>Listingfk</th>
									<th>Logged Data</th>
								</tr>
							</thead>
							<tbody>
    
								<tr>
									<td>{props.log.tags}</td>
									<td>{props.log.shorttext}</td>
									<td>{props.log.longtext}</td>
									<td>{props.log.critical.toString()}</td>
									<td> <div className="text-xs text-gray-500">
										{new Date(props.log.logtimestamp.toString()).toLocaleDateString("en-US", options)}
									</div> </td>
									<td>{props.log.userfk}</td>
									<td>{props.log.artistfk}</td>
									<td>{props.log.listingfk}</td>
									<td>{props.log.loggeddata}</td>
								</tr>

							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

	)
}

Logviewer.getInitialProps = async function (context) {
	const {id} = context.query

	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
 
	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log(`Fetching log: ${id}, path: ${context.pathname}`)
	} 

	const res = await fetch (api_url + `log/${id}`)
	const data = await res.json ()

	return {
		log: data,
	}
}

export default Logviewer
