/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useMemo, useState } from "react"
import TagSEO from "@/components/TagSEO"
import getApiURL from "@/components/widgets/GetApiURL"

const initialForm = {
	stripeEventId: "",
	stripeEventType: "checkout.session.completed",
	stripePaymentIntentId: "pi_test_123",
	orderId: "order_test_123",
	amountTotalCents: 12500,
	amountTaxCents: 800,
	amountShippingCents: 500,
	platformFeeCents: 1000,
	stripeFeeCents: 300,
	shippingCostCents: 400,
	sellerType: "artist",
	currency: "USD",
	description: "Treasury test page simulation",
	dryRun: true,
}

function toNumber(value) {
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : 0
}

export default function TreasuryTestPage() {
	const [form, setForm] = useState(initialForm)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [result, setResult] = useState(null)

	const apiUrl = useMemo(() => getApiURL(), [])

	const handleChange = (event) => {
		const { name, value, type, checked } = event.target
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}))
	}

	const submit = async (event) => {
		event.preventDefault()
		setLoading(true)
		setError("")
		setResult(null)

		const payload = {
			...form,
			amountTotalCents: toNumber(form.amountTotalCents),
			amountTaxCents: toNumber(form.amountTaxCents),
			amountShippingCents: toNumber(form.amountShippingCents),
			platformFeeCents: toNumber(form.platformFeeCents),
			stripeFeeCents: toNumber(form.stripeFeeCents),
			shippingCostCents: toNumber(form.shippingCostCents),
			stripeEventId: form.stripeEventId || `treasury_test_evt_${Date.now()}`,
		}

		try {
			const response = await fetch(`${apiUrl}treasury/stripe-event`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			})

			const body = await response.json()

			if (!response.ok) {
				throw new Error(body?.detail || body?.error || "Request failed")
			}

			setResult(body)
		} catch (submitError) {
			setError(submitError?.message || "Unable to submit treasury test payload")
		} finally {
			setLoading(false)
		}
	}

	const pageMetaData = {
		title: "Treasury Event Tester",
		description: "Test Stripe event accounting payloads sent to Modern Treasury integration.",
		keywords: "treasury, stripe, accounting, ledger, test",
		robots: "noindex, nofollow",
		og: {
			title: "Treasury Event Tester",
			description: "Test Stripe event accounting payloads sent to Modern Treasury integration.",
		},
	}

	return (
		<div className="min-h-screen bg-base-200 p-4">
			<TagSEO metadataProp={pageMetaData} canonicalSlug="test/treasury" />
			<div className="max-w-4xl mx-auto card bg-base-100 shadow-xl">
				<div className="card-body">
					<h1 className="card-title text-2xl">Treasury Event Tester</h1>
					<p className="text-sm opacity-80">
						Simulate Stripe webhook events and inspect resulting Modern Treasury ledger payloads.
					</p>

					<form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
						<label className="form-control">
							<span className="label-text">Stripe Event Type</span>
							<select name="stripeEventType" className="select select-bordered" value={form.stripeEventType} onChange={handleChange}>
								<option value="checkout.session.completed">checkout.session.completed</option>
								<option value="payment_intent.succeeded">payment_intent.succeeded</option>
								<option value="charge.refunded">charge.refunded</option>
								<option value="charge.dispute.created">charge.dispute.created</option>
							</select>
						</label>

						<label className="form-control">
							<span className="label-text">Seller Type</span>
							<select name="sellerType" className="select select-bordered" value={form.sellerType} onChange={handleChange}>
								<option value="artist">artist</option>
								<option value="vendor">vendor</option>
							</select>
						</label>

						<label className="form-control">
							<span className="label-text">Stripe Event Id</span>
							<input name="stripeEventId" className="input input-bordered" value={form.stripeEventId} onChange={handleChange} placeholder="auto-generated if blank" />
						</label>

						<label className="form-control">
							<span className="label-text">Payment Intent Id</span>
							<input name="stripePaymentIntentId" className="input input-bordered" value={form.stripePaymentIntentId} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Order Id</span>
							<input name="orderId" className="input input-bordered" value={form.orderId} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Currency</span>
							<input name="currency" className="input input-bordered" value={form.currency} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Gross Amount (cents)</span>
							<input type="number" name="amountTotalCents" className="input input-bordered" value={form.amountTotalCents} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Tax Amount (cents)</span>
							<input type="number" name="amountTaxCents" className="input input-bordered" value={form.amountTaxCents} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Shipping Revenue (cents)</span>
							<input type="number" name="amountShippingCents" className="input input-bordered" value={form.amountShippingCents} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Platform Fee (cents)</span>
							<input type="number" name="platformFeeCents" className="input input-bordered" value={form.platformFeeCents} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Stripe Fee (cents)</span>
							<input type="number" name="stripeFeeCents" className="input input-bordered" value={form.stripeFeeCents} onChange={handleChange} />
						</label>

						<label className="form-control">
							<span className="label-text">Shipping Cost (cents)</span>
							<input type="number" name="shippingCostCents" className="input input-bordered" value={form.shippingCostCents} onChange={handleChange} />
						</label>

						<label className="form-control md:col-span-2">
							<span className="label-text">Description</span>
							<input name="description" className="input input-bordered" value={form.description} onChange={handleChange} />
						</label>

						<label className="label cursor-pointer md:col-span-2">
							<span className="label-text">Dry Run</span>
							<input type="checkbox" name="dryRun" className="toggle toggle-primary" checked={form.dryRun} onChange={handleChange} />
						</label>

						<div className="md:col-span-2">
							<button className={`btn btn-primary ${loading ? "btn-disabled" : ""}`} type="submit" disabled={loading}>
								{loading ? "Submitting..." : "Submit Test Event"}
							</button>
						</div>
					</form>

					{error ? <div className="alert alert-error mt-4"><span>{error}</span></div> : null}

					{result ? (
						<div className="mt-6">
							<h2 className="font-semibold">Result</h2>
							<pre className="bg-base-300 p-3 rounded-lg overflow-x-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
