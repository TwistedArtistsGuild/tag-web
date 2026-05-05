/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

export const config = {
	api: {
		bodyParser: false,
	},
}

export default async function handler(req, res) {
	res.status(410).json({
		error: "Deprecated endpoint",
		message: "Use /api/image/list with ?container=tagpictures&prefix=...",
	})
}