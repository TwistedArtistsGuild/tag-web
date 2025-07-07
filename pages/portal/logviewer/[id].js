/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


//change to displaying an individual log (from Blogs)
import styles from "/styles/components/dynamicRequest.module.css"
import shortDateOptions from "/utils/shortdateoptions"

const Logviewer = props => {
	const options = shortDateOptions

	return (
		<div className={styles.container}>
			<div className={styles.topDisplay}>
				<h1 className={styles.title}>Log viewer</h1>
        
				<div>
					<div>
						<table>
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
									<td> <div className={styles.time}>
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
