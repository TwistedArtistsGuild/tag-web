/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import { useState } from "react"
import UploadPictureForm1 from "/components/widgets/uploadPic"
import { defaultFieldClass } from "/utils/formSettings";

export default function UploadPicPage(props) {
	const [context, setContext] = useState("twistedpassions")
	const [topFolder, setTopFolder] = useState("listing")

	return (
		<div>
			<h1>Upload Picture</h1>
			<form className="form-control">
				<div className="form-control">
					<label className="label">Context:</label>
					<input
						type="text"
						className={defaultFieldClass}
						value={context}
						onChange={(e) => setContext(e.target.value)}
						placeholder="Context"
					/>
				</div>
				<div className="form-control">
					<label className="label">Top Folder:</label>
					<input
						type="text"
						className={defaultFieldClass}
						value={topFolder}
						onChange={(e) => setTopFolder(e.target.value)}
						placeholder="Top Folder"
					/>
				</div>
			</form>
			<UploadPictureForm1 context={context} topFolder={topFolder} {...props} />
		</div>
	)
}