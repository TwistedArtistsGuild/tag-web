/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import Link from "next/link";

export default function TestIndex() {
	return (
		<div className="p-4 bg-base-200">
			<h2 className="text-2xl font-bold text-primary">
        Links to Portal Resources
			</h2>
			<div className="mt-2">
				<Link href="/test/updateForms" className="link link-primary">
          /test/updateForms
				</Link>
			</div>
			<div className="mt-2">
				<Link href="/test/testuploadpic" className="link link-primary">
          /test/testuploadpic
				</Link>
			</div>
			<div className="mt-2">
				<Link href="/test/testlist" className="link link-primary">
          /test/testlist
				</Link>
			</div>
			<div className="mt-2">
				<Link href="/test/testquill" className="link link-primary">
          /test/testquill
				</Link>
			</div>
		</div>
	);
}
