/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/



import fs from "fs"
import path from "path"
import { remark } from "remark"
import html from "remark-html"
import sanitizeHtml from "sanitize-html"

export async function getMarkdownContent(filePath) {
	const fullPath = path.join(process.cwd(), filePath)
	const fileContents = fs.readFileSync(fullPath, "utf8")

	const processedContent = await remark()
		.use(html)
		.process(fileContents)

	return sanitizeHtml(processedContent.toString())
}