/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import TagSEO from "@/components/TagSEO";
import StaffContextNav from "@/components/portal/StaffContextNav";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { isAdmin, isStaff } from "@/utils/authHelpers";

export default function Portal_Staff() {
	const pageMetaData = {
		title: "Staff Portal",
		description: "Staff operational workspace and routing hub.",
		keywords: "Staff, Dashboard, Reports, Operations",
		robots: "no-index, no-follow",
		author: "Bobb Shields",
		viewport: "width=device-width, initial-scale=1.0",
		og: {
			title: "Staff Portal",
			description: "Staff operational workspace and routing hub.",
		},
	};

	return (
		<div className="min-h-screen bg-base-200 p-4 md:p-8">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="portal/staff" />				<StaffContextNav />			<div className="mx-auto max-w-6xl space-y-6">
				<section className="card bg-base-100 shadow-lg border border-base-300">
					<div className="card-body gap-3">
						<div>
							<p className="text-xs uppercase tracking-widest text-base-content/50">Portal Domain</p>
							<h1 className="text-3xl font-bold text-primary mt-1">Staff Workspace</h1>
						</div>
						<p className="text-base-content/75 max-w-3xl">
							Unified operations hub for dashboards, moderation workflows, bug triage, logs, CRM tools, and staff-only reporting surfaces.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user) {
		return {
			redirect: {
				destination: `/api/auth/signin?callbackUrl=${encodeURIComponent("/portal/staff")}`,
				permanent: false,
			},
		};
	}

	if (!isStaff(session) && !isAdmin(session)) {
		return {
			notFound: true,
		};
	}

	return { props: {} };
}
