/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

/* eslint-disable @next/next/no-img-element */

import Head from "next/head"
import { useMemo, useRef, useState } from "react"

import getApiURL from "@/components/widgets/GetApiURL"
import { sanitizeDefaultHtml, stripHtmlText } from "@/components/security/sanitize"

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

function formatCurrency(value) {
	const numeric = Number(value)
	if (!Number.isFinite(numeric)) {
		return "Price unavailable"
	}

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(numeric)
}

function formatDate(value) {
	if (!value) {
		return ""
	}

	const parsed = new Date(value)
	if (Number.isNaN(parsed.getTime())) {
		return String(value)
	}

	return parsed.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	})
}

export default function ListingPosterPage({ listing, artistSlug, listingSlug, canonicalUrl, qrUrl, fetchError }) {
	const printRef = useRef(null)
	const pdfRef = useRef(null)
	const [downloading, setDownloading] = useState(false)
	const [downloadError, setDownloadError] = useState("")

	const titleRichtext = pickField(listing, "titleRichtext", "TitleRichtext") || listing?.title || "Listing"
	const descriptionRichtext = pickField(listing, "descriptionRichtext", "DescriptionRichtext") || listing?.description || ""
	const artistTitleRichtext = pickField(listing?.artist, "titleRichtext", "TitleRichtext") || listing?.artist?.title || "Artist"
	const artistBylineRichtext = pickField(listing?.artist, "bylineRichtext", "BylineRichtext") || listing?.artist?.byline || ""
	const titleText = stripHtmlText(titleRichtext) || "Listing"
	const artistText = stripHtmlText(artistTitleRichtext) || "Artist"
	const artistBylineText = stripHtmlText(artistBylineRichtext)
	const descriptionText = stripHtmlText(descriptionRichtext)
	const artistProfileUrl = listing?.artist?.profilePic?.url || listing?.artist?.profilePic?.URL || BLANK_IMAGE_URL
	const priceText = formatCurrency(listing?.price)
	const createdText = formatDate(listing?.created)
	const categoryText = listing?.artCategory?.category || "Not specified"

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
			pdf.save(`${artistSlug || "artist"}-${listingSlug || "listing"}-poster.pdf`)
		} catch (error) {
			setDownloadError(error?.message || "Unable to generate PDF.")
		} finally {
			setDownloading(false)
		}
	}

	const pageTitle = useMemo(() => `${titleText} Poster`, [titleText])

	if (fetchError) {
		return (
			<div className="min-h-screen bg-white px-6 py-10 text-slate-900">
				<Head>
					<title>Listing Poster Unavailable</title>
				</Head>
				<div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8">
					<h1 className="text-2xl font-semibold">Listing poster unavailable</h1>
					<p className="mt-3 text-sm text-slate-700">{fetchError}</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<Head>
				<title>{pageTitle}</title>
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
						<h1 className="text-2xl font-semibold">Listing Poster</h1>
						<p className="text-sm text-slate-600">Printable price tag with QR code back to the listing page.</p>
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
						<div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "0" }}>
							<div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "40px" }}>
								<div style={{ display: "flex", flexDirection: "column", gap: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "24px" }}>
									<div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "#64748b" }}>Twisted Artists Guild Listing</div>
									<div style={{ fontSize: "40px", lineHeight: 1.1, fontWeight: 600 }}>{titleText}</div>
								</div>
								<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
									<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
										<div style={{ fontSize: "18px", fontWeight: 600 }}>Item Image</div>
										<div style={{ minHeight: "280px", borderRadius: "16px", border: "1px dashed #cbd5e1", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", textAlign: "center", color: "#64748b" }}>
											{/* Future: wire a dedicated listing/item image field here when one exists in the DB/API. */}
											Item image placeholder
										</div>
									</div>
									<div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "16px", alignItems: "start", border: "1px solid #e2e8f0", borderRadius: "16px", background: "#f8fafc", padding: "20px" }}>
										<div style={{ fontSize: "18px", fontWeight: 600 }}>Artist</div>
										<div style={{ gridColumn: "1 / -1", fontSize: "18px", fontWeight: 600 }}>Artist</div>
										<img src={artistProfileUrl} alt="" style={{ width: "72px", height: "72px", borderRadius: "14px", objectFit: "cover", border: "1px solid #e2e8f0" }} />
										<div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: 0 }}>
											<div style={{ fontSize: "18px", fontWeight: 600 }}>{artistText}</div>
											{artistBylineText ? <div style={{ fontSize: "14px", color: "#475569" }}>{artistBylineText}</div> : null}
											<div style={{ fontSize: "14px", color: "#64748b" }}>Artist slug: {artistSlug}</div>
										</div>
									</div>
								</div>
								<table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
									<tbody>
										<tr><th style={{ width: "160px", padding: "10px 12px", textAlign: "left", border: "1px solid #e6e6e6", background: "#f5f5f5" }}>Price</th><td style={{ padding: "10px 12px", border: "1px solid #e6e6e6", fontSize: "18px", fontWeight: 600 }}>{priceText}</td></tr>
										<tr><th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #e6e6e6", background: "#f5f5f5" }}>Category</th><td style={{ padding: "10px 12px", border: "1px solid #e6e6e6" }}>{categoryText}</td></tr>
										<tr><th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #e6e6e6", background: "#f5f5f5" }}>Created</th><td style={{ padding: "10px 12px", border: "1px solid #e6e6e6" }}>{createdText || "Not specified"}</td></tr>
										<tr><th style={{ padding: "10px 12px", textAlign: "left", border: "1px solid #e6e6e6", background: "#f5f5f5" }}>Listing Page</th><td style={{ padding: "10px 12px", border: "1px solid #e6e6e6" }}>{canonicalUrl}</td></tr>
									</tbody>
								</table>
								<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
									<div style={{ fontSize: "20px", fontWeight: 600 }}>Description</div>
									<div style={{ fontSize: "14px", lineHeight: 1.7, color: "#334155" }}>{descriptionText || "Description coming soon."}</div>
								</div>
							</div>
							<div style={{ display: "flex", flexDirection: "column", gap: "20px", borderLeft: "1px solid #e2e8f0", background: "#f8fafc", padding: "40px", textAlign: "center" }}>
								<div style={{ fontSize: "20px", fontWeight: 600 }}>Scan to verify price</div>
								<img src={qrUrl} alt="" style={{ width: "224px", height: "224px", margin: "0 auto", borderRadius: "16px", border: "1px solid #e2e8f0", background: "#ffffff", padding: "12px" }} />
								<div style={{ fontSize: "14px", color: "#475569" }}>Customers can scan this code to open the live listing page and confirm the current price.</div>
								<div style={{ fontSize: "14px", fontWeight: 500, wordBreak: "break-all", color: "#464feb" }}>{canonicalUrl}</div>
								<div style={{ border: "1px dashed #cbd5e1", borderRadius: "16px", background: "#ffffff", padding: "20px", textAlign: "left" }}>
									<div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#64748b" }}>Quick Facts</div>
									<div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
										<div><strong>Artist:</strong> {artistText}</div>
										<div><strong>Listing Slug:</strong> {listingSlug}</div>
										<div><strong>Artist Slug:</strong> {artistSlug}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<article ref={printRef} className="print-shell print-break-avoid mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-[1.5fr_1fr]">
					<section className="space-y-6 p-8 md:p-10">
						<div className="space-y-3 border-b border-slate-200 pb-6">
							<p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Twisted Artists Guild Listing</p>
							<h2 className="text-4xl font-semibold leading-tight">{titleText}</h2>
						</div>

						<div className="space-y-6">
							<div className="space-y-3">
								<h3 className="text-lg font-semibold">Item Image</h3>
								<div className="flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
									{/* Future: wire a dedicated listing/item image field here when one exists in the DB/API. */}
									No item image available yet.
								</div>
							</div>

							<div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
								<h3 className="text-lg font-semibold">Artist</h3>
								<div className="flex items-start gap-4">
									<img src={artistProfileUrl} alt={`${artistText} profile`} className="h-18 w-18 rounded-2xl border border-slate-200 object-cover" />
									<div className="min-w-0 space-y-1">
										<div className="text-lg font-semibold text-slate-900">{artistText}</div>
										{artistBylineText ? <div className="text-sm text-slate-600">{artistBylineText}</div> : null}
									</div>
								</div>
							</div>
						</div>

						<table className="w-full border-collapse text-left text-sm">
							<tbody>
								<tr>
									<th className="w-40 px-3 py-2 font-semibold">Price</th>
									<td className="px-3 py-2 text-lg font-semibold">{priceText}</td>
								</tr>
								<tr>
									<th className="px-3 py-2 font-semibold">Category</th>
									<td className="px-3 py-2">{categoryText}</td>
								</tr>
								<tr>
									<th className="px-3 py-2 font-semibold">Created</th>
									<td className="px-3 py-2">{createdText || "Not specified"}</td>
								</tr>
								<tr>
									<th className="px-3 py-2 font-semibold">Listing Page</th>
									<td className="px-3 py-2"><a href={canonicalUrl}>{canonicalUrl}</a></td>
								</tr>
							</tbody>
						</table>

						<div className="space-y-3">
							<h3 className="text-xl font-semibold">Description</h3>
							{descriptionRichtext ? (
								<div className="prose prose-slate max-w-none text-sm leading-6" dangerouslySetInnerHTML={{ __html: sanitizeDefaultHtml(descriptionRichtext) }} />
							) : (
								<p className="text-sm leading-6 text-slate-700">{descriptionText || "Description coming soon."}</p>
							)}
						</div>
					</section>

					<aside className="space-y-5 border-t border-slate-200 bg-slate-50 p-8 text-center md:border-l md:border-t-0 md:p-10">
						<h3 className="text-lg font-semibold">Scan to verify price</h3>
						<img src={qrUrl} alt={`QR code for ${titleText}`} className="mx-auto h-56 w-56 rounded-2xl border border-slate-200 bg-white p-3" />
						<p className="text-sm text-slate-600">Customers can scan this code to open the live listing page and confirm the current price.</p>
						<a href={canonicalUrl} className="break-all text-sm font-medium">{canonicalUrl}</a>
						<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-left">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick Facts</p>
							<dl className="mt-3 space-y-2 text-sm">
								<div>
									<dt className="font-semibold">Artist</dt>
									<dd>{artistText}</dd>
								</div>
								<div>
									<dt className="font-semibold">Listing Slug</dt>
									<dd>{listingSlug}</dd>
								</div>
								<div>
									<dt className="font-semibold">Artist Slug</dt>
									<dd>{artistSlug}</dd>
								</div>
							</dl>
						</div>
					</aside>
				</article>
			</div>
		</>
	)
}

export async function getServerSideProps(context) {
	const { slug, L_slug } = context.params
	const apiUrl = getApiURL()
	const canonicalUrl = buildAbsoluteUrl(`/artists/${slug}/listings/${L_slug}`)
	const qrUrl = `/api/qr?url=${encodeURIComponent(canonicalUrl)}&size=320`

	try {
		const listingResponse = await fetch(`${apiUrl}listing/artist/${encodeURIComponent(slug)}/listing/${encodeURIComponent(L_slug)}`)
		if (!listingResponse.ok) {
			return {
				props: {
					listing: null,
					artistSlug: slug,
					listingSlug: L_slug,
					canonicalUrl,
					qrUrl,
					fetchError: `Unable to load listing poster data (${listingResponse.status}).`,
				},
			}
		}

		const listingPayload = await listingResponse.json()
		const listingData = Array.isArray(listingPayload) ? listingPayload[0] || null : listingPayload
		const listingId = listingData?.listingID || listingData?.ListingID || listingData?.listingId || null

		if (!listingId) {
			return {
				props: {
					listing: listingData,
					artistSlug: slug,
					listingSlug: L_slug,
					canonicalUrl,
					qrUrl,
					fetchError: "Listing data was returned without a resolvable ID.",
				},
			}
		}

		const byIdResponse = await fetch(`${apiUrl}listing/byID/${listingId}`)
		const byIdPayload = byIdResponse.ok ? await byIdResponse.json() : null
		const byIdData = Array.isArray(byIdPayload) ? byIdPayload[0] || null : byIdPayload

		const mergedListing = {
			...(listingData || {}),
			...(byIdData || {}),
			artist: {
				...(listingData?.artist || {}),
				...(byIdData?.artist || {}),
			},
			artCategory: byIdData?.artCategory || listingData?.artCategory || null,
			coverPic: byIdData?.coverPic || listingData?.coverPic || null,
			gallery: byIdData?.gallery || listingData?.gallery || null,
		}

		return {
			props: {
				listing: mergedListing,
				artistSlug: slug,
				listingSlug: L_slug,
				canonicalUrl,
				qrUrl,
				fetchError: null,
			},
		}
	} catch (error) {
		return {
			props: {
				listing: null,
				artistSlug: slug,
				listingSlug: L_slug,
				canonicalUrl,
				qrUrl,
				fetchError: error?.message || "Unable to load listing poster data.",
			},
		}
	}
}
