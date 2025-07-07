/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

"use client"
 
import { useRouter } from "next/navigation"
import { defaultButtonClass } from "/utils/formSettings"
 
export default function Page() {
	const router = useRouter()
 
	return (
		<button type="button" className={defaultButtonClass} onClick={() => router.push("/test/updateForms/testform")}>
			Redirect to /test/updateForms/testform
		</button>
	)
}



