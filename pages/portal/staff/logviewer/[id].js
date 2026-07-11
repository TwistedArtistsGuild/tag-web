/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


//change to displaying an individual log (from Blogs)
import shortDateOptions from "@/utils/shortdateoptions"
import { getServerSession } from "next-auth/next"

import TagSEO from "@/components/TagSEO"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { isAdmin, isStaff } from "@/utils/authHelpers"
import serverFetch from "@/libs/serverFetch"

const Logviewer = props => {
	const options = shortDateOptions

	return (
      <div className="flex flex-col items-center justify-evenly min-h-screen w-full">
			<TagSEO metadataProp={{ title: "Log Viewer", description: "View detailed staff log entries.", keywords: "staff, logs, admin", robots: "noindex, nofollow", og: { title: "Log Viewer", description: "View detailed staff log entries." } }} canonicalSlug="portal/staff/logviewer/[id]" />
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
									<td> <div className="text-xs text-base-content/60">
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

export async function getServerSideProps(context) {
	const { id } = context.params

	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(`/portal/staff/logviewer/${id}`)}`,
				permanent: false,
			},
		}
	}

	if (!isStaff(session) && !isAdmin(session)) {
		return {
			notFound: true,
		}
	}
 
	// If we are running in debug mode, log the active API URL
	if (process.env.DEBUG === "true") {
		console.log(`Fetching log: ${id}, path: ${context.pathname}`)
	} 

	const res = await serverFetch(`/log/${id}`)
	const data = await res.json ()

	if (!res.ok || !data) {
		return { notFound: true }
	}

	return {
		props: {
			log: data,
		},
	}
}

export default Logviewer
