/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

const FALLBACK_API_URL = "https://api.twistedartistsguild.com/api/"
const LOCAL_OVERRIDE_FALLBACK_URL = "http://localhost:5000/api/"

function ensureTrailingSlash(url) {
	if (!url) {
		return ""
	}

	return url.endsWith("/") ? url : `${url}/`
}

export default function getApiURL() {
	const isLocalOverride = process.env.LOCALOVERRIDE === "true"
	const isDebug = process.env.DEBUG === "true"

	if (isLocalOverride) {
		const localOverrideUrl = process.env.NEXT_PUBLIC_TAG_API_URL_LOCAL
		const resolvedLocalOverrideUrl = localOverrideUrl || LOCAL_OVERRIDE_FALLBACK_URL
		if (isDebug) {
			if (!localOverrideUrl) {
				console.log(`[GetApiURL] LOCALOVERRIDE enabled, but NEXT_PUBLIC_TAG_API_URL_LOCAL is missing. Falling back to ${LOCAL_OVERRIDE_FALLBACK_URL}`)
			}
			console.log(`[GetApiURL] LOCALOVERRIDE enabled. Using API URL: ${resolvedLocalOverrideUrl}`)
		}
		return ensureTrailingSlash(resolvedLocalOverrideUrl)
	}

	const configuredUrl = process.env.NEXT_PUBLIC_TAG_API_URL
	if (isDebug && !configuredUrl) {
		console.log(`[GetApiURL] NEXT_PUBLIC_TAG_API_URL is missing. Falling back to ${FALLBACK_API_URL}`)
	}

	return ensureTrailingSlash(configuredUrl || FALLBACK_API_URL)
}
