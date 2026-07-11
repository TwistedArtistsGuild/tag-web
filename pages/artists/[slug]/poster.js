/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/* eslint-disable @next/next/no-img-element */

import Head from "next/head"
import Image from "next/image"
import { useMemo, useRef, useState } from "react"

import { sanitizeCardHtml, stripHtmlText } from "@/components/security/sanitize"
import serverFetch from "@/libs/serverFetch"

const SITE_URL = "https://twistedartistsguild.com"
const BLANK_IMAGE_URL = "/blank_image.png"

function pickField(record, ...keys) {
	for (const key of keys) {
		const value = record?.[key]
		if (value !== undefined && value !== null) {
			return value
		}
	}

	return undefined
}

function buildAbsoluteUrl(pathname) {
	return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
}

function formatSince(value) {
	if (!value) {
		return ""
	}

	const parsed = new Date(value)
	if (Number.isNaN(parsed.getTime())) {
		return String(value)
	}

	return parsed.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	})
}

function getPictureUrl(picture) {
	return (
		picture?.url ||
		picture?.URL ||
		picture?.normalizedURL ||
		picture?.NormalizedURL ||
		picture?.contentUrl ||
		picture?.contentURL ||
		picture?.src ||
		""
	)
}

export default function ArtistPosterPage({ artist, profilePic, coverPic, slug, qrUrl, qrDataUrl, canonicalUrl, fetchError }) {
	const printRef = useRef(null)
	const pdfRef = useRef(null)
	const [downloading, setDownloading] = useState(false)
	const [downloadError, setDownloadError] = useState("")

	const titleRichtext = pickField(artist, "titleRichtext", "TitleRichtext") || artist?.title || "Artist"
	const bylineRichtext = pickField(artist, "bylineRichtext", "BylineRichtext") || artist?.byline || ""
	const bioRichtext = pickField(artist, "biographyRichtext", "BiographyRichtext") || artist?.biography || ""
	const titleText = stripHtmlText(titleRichtext) || "Artist"
	const bylineText = stripHtmlText(bylineRichtext)
	const bioText = stripHtmlText(bioRichtext)
	const coverUrl = getPictureUrl(coverPic) || getPictureUrl(artist?.coverPic) || BLANK_IMAGE_URL
	const profileUrl = getPictureUrl(profilePic) || getPictureUrl(artist?.profilePic) || BLANK_IMAGE_URL
	const seoTags = String(artist?.seoTags || artist?.SEOTags || "")
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean)
	const sinceText = formatSince(artist?.since || artist?.applied)

	const handleDownloadPdf = async () => {
		if (!pdfRef.current) {
			return
		}

		setDownloading(true)
		setDownloadError("")
		try {
			const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
				import("html2canvas"),
				import("jspdf"),
			])

			const canvas = await html2canvas(pdfRef.current, {
				scale: 2,
				useCORS: true,
				backgroundColor: "#ffffff",
			})

			const imageData = canvas.toDataURL("image/png")
			const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" })
			const pageWidth = pdf.internal.pageSize.getWidth()
			const pageHeight = pdf.internal.pageSize.getHeight()
			const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
			const width = canvas.width * ratio
			const height = canvas.height * ratio
			const marginX = (pageWidth - width) / 2
			const marginY = (pageHeight - height) / 2

			pdf.addImage(imageData, "PNG", marginX, marginY, width, height)
			pdf.save(`${slug || "artist"}-poster.pdf`)
		} catch (error) {
			setDownloadError(error?.message || "Unable to generate PDF.")
		} finally {
			setDownloading(false)
		}
	}

	const posterTitle = useMemo(() => `${titleText} Poster`, [titleText])

	if (fetchError) {
		return (
			<div className="min-h-screen bg-white px-6 py-10 text-slate-900">
				<Head>
					<title>Artist Poster Unavailable</title>
				</Head>
				<div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8">
					<h1 className="text-2xl font-semibold">Artist poster unavailable</h1>
					<p className="mt-3 text-sm text-slate-700">{fetchError}</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>{posterTitle}</title>
			</Head>
			<div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 print:bg-white print:p-0">
				<style jsx global>{`
					a {
						text-decoration: none;
						color: #464feb;
					}
					tr th, tr td {
						border: 1px solid #e6e6e6;
					}
					tr th {
						background-color: #f5f5f5;
					}
					@media print {
						@page {
							margin: 0;
							size: auto;
						}
						body {
							background: #ffffff;
						}
						.bg-warning.text-warning-content.sticky.top-0.z-50 {
							display: none !important;
						}
						.site-shell > header,
						.site-shell > footer,
						.site-shell > aside,
						.site-shell .themed-footer,
						.site-shell [aria-label="Left sidebar navigation"] {
							display: none !important;
						}
						.site-main,
						.site-main-inner {
							margin: 0 !important;
							padding: 0 !important;
							max-width: none !important;
						}
						.print-hidden {
							display: none !important;
						}
						.print-shell {
							box-shadow: none !important;
							border: 0 !important;
							border-radius: 0 !important;
							margin: 0 !important;
							max-width: none !important;
						}
						.print-break-avoid {
							break-inside: avoid;
						}
					}
				`}</style>

				<div className="print-hidden mx-auto mb-4 flex max-w-4xl items-center justify-between gap-3">
					<div>
						<h1 className="text-2xl font-semibold">Artist Poster</h1>
						<p className="text-sm text-slate-600">Print-ready artist handout with QR code.</p>
					</div>
					<div className="flex gap-2">
						<button type="button" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white" onClick={() => window.print()}>
							Print
						</button>
						<button
							type="button"
							className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
							disabled={downloading}
							onClick={handleDownloadPdf}
						>
							{downloading ? "Preparing PDF..." : "Download as PDF"}
						</button>
					</div>
				</div>
				{downloadError ? (
					<div className="print-hidden mx-auto mb-4 max-w-4xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{downloadError}
					</div>
				) : null}

				<div aria-hidden="true" className="pointer-events-none fixed left-[-200vw] top-0 opacity-0">
					<div
						ref={pdfRef}
						style={{
							width: "960px",
							background: "#ffffff",
							color: "#0f172a",
							fontFamily: 'ui-sans-serif, system-ui, sans-serif',
							border: "1px solid #e2e8f0",
							borderRadius: "24px",
							overflow: "hidden",
						}}
					>
						<div style={{ height: "320px", width: "100%", background: "#e2e8f0" }}>
							<img src={coverUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
						</div>
						<div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "32px", padding: "40px" }}>
							<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
								<div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
									<img src={profileUrl} alt="" style={{ width: "96px", height: "96px", objectFit: "cover", borderRadius: "16px", border: "1px solid #e2e8f0" }} />
									<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
										<div style={{ fontSize: "40px", lineHeight: 1.1, fontWeight: 600 }}>{titleText}</div>
										{bylineText ? <div style={{ fontSize: "20px", color: "#334155" }}>{bylineText}</div> : null}
										{sinceText ? <div style={{ fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#64748b" }}>Since {sinceText}</div> : null}
									</div>
								</div>
								<table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
									<tbody>
										<tr><th style={{ width: "160px", padding: "10px 12px", textAlign: "left", border: "1px solid #e6e6e6", background: "#f5f5f5" }}>Artist Page</th><td style={{ padding: "10px 12px", border: "1px solid #e6e6e6" }}>{canonicalUrl}</td></tr>
										<tr><th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #e6e6e6", background: "#f5f5f5" }}>Slug</th><td style={{ padding: "10px 12px", border: "1px solid #e6e6e6" }}>{slug}</td></tr>
										<tr><th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #e6e6e6", background: "#f5f5f5" }}>SEO Tags</th><td style={{ padding: "10px 12px", border: "1px solid #e6e6e6" }}>{seoTags.length > 0 ? seoTags.join(", ") : "Not specified"}</td></tr>
									</tbody>
								</table>
								<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
									<div style={{ fontSize: "20px", fontWeight: 600 }}>Artist Overview</div>
									<div style={{ fontSize: "14px", lineHeight: 1.7, color: "#334155" }}>{bioText || "Artist biography coming soon."}</div>
								</div>
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "center", border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: "16px", padding: "24px" }}>
								<div style={{ fontSize: "20px", fontWeight: 600 }}>Scan to view artist</div>
								<img src={qrDataUrl || qrUrl} alt="" style={{ width: "224px", height: "224px", margin: "0 auto", borderRadius: "16px", border: "1px solid #e2e8f0", background: "#ffffff", padding: "12px" }} />
								<div style={{ fontSize: "14px", color: "#475569" }}>Use this code to open the live artist page from a phone.</div>
								<div style={{ fontSize: "14px", fontWeight: 500, wordBreak: "break-all", color: "#464feb" }}>{canonicalUrl}</div>
							</div>
						</div>
					</div>
				</div>

				<article ref={printRef} className="print-shell print-break-avoid mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
					<div className="relative h-64 w-full bg-slate-200 md:h-80">
						<Image
							src={coverPic?.url || BLANK_IMAGE_URL}
							alt={coverPic?.altText || "Cover Picture"}
							fill
							style={{ objectFit: "cover" }}
							priority
						/>
					</div>

					<div className="grid gap-8 p-8 md:grid-cols-[1.8fr_1fr] md:p-10">
						<section className="space-y-6">
							<div className="flex items-start gap-4">
								<img
									src={profileUrl}
									alt={`${titleText} profile`}
									className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
									onError={(event) => {
										event.currentTarget.src = "/blank_image.png"
									}}
								/>
								<div className="min-w-0 space-y-2">
									<h2 className="text-4xl font-semibold leading-tight">{titleText}</h2>
									{bylineText ? (
										<div className="text-lg text-slate-700">{bylineText}</div>
									) : null}
									{sinceText ? <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Since {sinceText}</p> : null}
								</div>
							</div>

							<table className="w-full border-collapse text-left text-sm">
								<tbody>
									<tr>
										<th className="w-40 px-3 py-2 font-semibold">Artist Page</th>
										<td className="px-3 py-2"><a href={canonicalUrl}>{canonicalUrl}</a></td>
									</tr>
									<tr>
										<th className="px-3 py-2 font-semibold">Slug</th>
										<td className="px-3 py-2">{slug}</td>
									</tr>
									<tr>
										<th className="px-3 py-2 font-semibold">SEO Tags</th>
										<td className="px-3 py-2">{seoTags.length > 0 ? seoTags.join(", ") : "Not specified"}</td>
									</tr>
								</tbody>
							</table>

							<div className="space-y-3">
								<h3 className="text-xl font-semibold">Artist Overview</h3>
								{bioRichtext ? (
									<div className="prose prose-slate max-w-none text-sm leading-6" dangerouslySetInnerHTML={{ __html: sanitizeCardHtml(bioRichtext) }} />
								) : (
									<p className="text-sm leading-6 text-slate-700">{bioText || "Artist biography coming soon."}</p>
								)}
							</div>
						</section>

						<aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
							<h3 className="text-lg font-semibold">Scan to view artist</h3>
							<img src={qrDataUrl || qrUrl} alt={`QR code for ${titleText}`} className="mx-auto h-56 w-56 rounded-2xl border border-slate-200 bg-white p-3" />
							<p className="text-sm text-slate-600">Use this code to open the live artist page from a phone.</p>
							<a href={canonicalUrl} className="break-all text-sm font-medium">{canonicalUrl}</a>
						</aside>
					</div>
				</article>
			</div>
		</>
	)
}

export async function getServerSideProps(context) {
	const { slug } = context.params
	const canonicalUrl = buildAbsoluteUrl(`/artists/${slug}`)
	const qrUrl = `/api/qr?url=${encodeURIComponent(canonicalUrl)}&size=320`
	const defaultPic = {
		picturenum: 1,
		context: "artists",
		slug: "default",
		metadata: "default",
		title: "default",
		alttext: "default",
		url: BLANK_IMAGE_URL,
	}

	const fetchData = async (url, defaultData) => {
		try {
			const response = await serverFetch(url)
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			return await response.json()
		} catch {
			return defaultData
		}
	}

	try {
		const artistData = await fetchData(`/artist/${encodeURIComponent(slug)}/profile`, {
			artist: null,
			profilePic: defaultPic,
			coverPic: defaultPic,
			listings: [],
			links: [],
		})

		if (!artistData?.artist) {
			return {
				props: {
					artist: null,
					profilePic: defaultPic,
					coverPic: defaultPic,
					slug,
					qrUrl,
					qrDataUrl: null,
					canonicalUrl,
					fetchError: "Unable to load artist poster data.",
				},
			}
		}

		const resolvedQrDataUrl = await import("qrcode").then(({ default: QRCode }) => QRCode.toDataURL(canonicalUrl, {
			width: 320,
			margin: 1,
			color: {
				dark: "#111111",
				light: "#ffffff",
			},
		})).catch(() => null)

		return {
			props: {
				artist: artistData.artist,
				profilePic: artistData.profilePic || defaultPic,
				coverPic: artistData.coverPic || defaultPic,
				slug,
				qrUrl,
				qrDataUrl: resolvedQrDataUrl,
				canonicalUrl,
				fetchError: null,
			},
		}
	} catch (error) {
		return {
			props: {
				artist: null,
				profilePic: null,
				coverPic: null,
				slug,
				qrUrl,
				qrDataUrl: null,
				canonicalUrl,
				fetchError: error?.message || "Unable to load artist poster data.",
			},
		}
	}
}
