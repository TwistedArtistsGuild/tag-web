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
	const normalizedPath = filePath.replace(/\\/g, "/")
	const relativePath = normalizedPath.startsWith("content/")
		? normalizedPath.slice("content/".length)
		: normalizedPath

	const contentRoot = path.join(process.cwd(), "content")
	const fullPath = path.resolve(contentRoot, relativePath)

	if (!fullPath.startsWith(contentRoot + path.sep) && fullPath !== contentRoot) {
		throw new Error("Invalid markdown path: must be within content directory")
	}

	const fileContents = fs.readFileSync(fullPath, "utf8")

	const processedContent = await remark()
		.use(html)
		.process(fileContents)

	return sanitizeHtml(processedContent.toString())
}