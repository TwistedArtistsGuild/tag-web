/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



///////////////// Imports
import Link from "next/link"
import styles from "/styles/components/dynamicRequest.module.css"
import shortDateOptions from "/utils/shortdateoptions"
import TagSEO from "@/components/TagSEO"

const Log = props => {
	const options = shortDateOptions
	
	const pageMetaData = {
		title: "Artist Portal",
		description: "Dashboard and Reports",
		keywords: "Artist, Dashboard, Reports",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Artist Portal",
			description: "Dashboard and Reports",
		},
	}

	return (
		<div className={styles.container}>
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/logviewer" />
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
								</tr>
							</thead>
							<tbody>
								{props.logs.map((log) => (
									<tr key={`log#${log.lognum}`}>
										<td>
											<Link
												href="/portal/logviewer/[lognum]"
												as={`/portal/logviewer/${log.lognum}`}
												className={styles.link}>
												{log.lognum}
											</Link>
										</td>
										<td>{log.tags}</td>
										<td>{log.shorttext}</td>
										<td>{log.longtext}</td>
										<td>{log.critical}</td>
										<td> <div className={styles.time}>
											{new Date(log.logtimestamp.toString()).toLocaleDateString("en-US", options)}
										</div> </td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}

Log.getInitialProps = async function () {

	const api_url = process.env.NEXT_PUBLIC_TAG_API_URL
    
	//Staging API can be added here if needed

	const res = await fetch(api_url + "log/")
	const data = await res.json()
    
	return {
		logs: data,
	}
}

export default Log
