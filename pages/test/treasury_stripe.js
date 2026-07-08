/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useEffect, useMemo, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import TagSEO from "@/components/TagSEO"

const DEFAULT_PLATFORM_FEE_RATE = 0.065
const DEFAULT_TAX_RATE = 0.07
const DEFAULT_STRIPE_RATE = 0.029
const DEFAULT_STRIPE_FLAT_CENTS = 30

function computeArtistGroup(items, feeRate, taxRate, stripeRate, stripeFlatCents) {
  const grossCents = items.reduce((sum, item) => sum + Math.round(Number(item.price) * 100), 0)
  const platformFeeCents = Math.round(grossCents * feeRate)
  const taxCents = Math.round(grossCents * taxRate)
  const stripeFeeCents = Math.round(grossCents * stripeRate) + stripeFlatCents
  const artistNetCents = grossCents - platformFeeCents - taxCents
  const tagNetCents = platformFeeCents - stripeFeeCents
  return { grossCents, platformFeeCents, taxCents, stripeFeeCents, artistNetCents, tagNetCents }
}

function groupByArtist(cartItems) {
  return cartItems.reduce((acc, item) => {
    if (!acc[item.artistId]) {
      acc[item.artistId] = {
        artistId: item.artistId,
        artistTitle: item.artistTitle,
        artistPath: item.artistPath,
        items: [],
      }
    }
    acc[item.artistId].items.push(item)
    return acc
  }, {})
}

function getArtistLabel(artist) {
  if (!artist) return "Unknown artist"
  const title = artist.title || "Untitled Artist"
  const path = artist.path || "no-path"
  const id = artist.artistID != null ? artist.artistID : "n/a"
  return `${title} (${path}) #${id}`
}

function StripeEmbeddedPaymentForm({ clientSecret, amountCents, currency, buyerLabel, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError("")

    if (!stripe || !elements) {
      setLocalError("Stripe is still loading.")
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setLocalError("Card entry is not ready.")
      return
    }

    setProcessing(true)

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: buyerLabel,
          },
        },
      })

      if (result.error) {
        throw new Error(result.error.message || "Stripe payment failed")
      }

      if (result.paymentIntent?.status !== "succeeded") {
        throw new Error(`Stripe returned ${result.paymentIntent?.status || "unknown"} status`)
      }

      onSuccess(result.paymentIntent)
    } catch (error) {
      setLocalError(error?.message || "Stripe payment failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="rounded-lg border border-base-300 bg-base-100 p-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <div className="text-xs opacity-70">
        Use a Stripe test card such as 4242 4242 4242 4242.
      </div>
      {localError && <div className="alert alert-error"><span>{localError}</span></div>}
      <button type="submit" className={`btn btn-secondary ${processing ? "btn-disabled" : ""}`} disabled={processing || !stripe || !elements}>
        {processing ? "Processing payment..." : `Pay ${(amountCents / 100).toFixed(2)} ${currency}`}
      </button>
    </form>
  )
}

export default function TreasuryTestPage() {
  const [buyer, setBuyer] = useState("")
  const [cart, setCart] = useState([])
  const [pickArtistId, setPickArtistId] = useState("")
  const [pickListingId, setPickListingId] = useState("")
  const [dryRun, setDryRun] = useState(true)
  const [stripeEventType, setStripeEventType] = useState("payment_intent.succeeded")
  const [currency, setCurrency] = useState("USD")
  const [platformFeeRate, setPlatformFeeRate] = useState(DEFAULT_PLATFORM_FEE_RATE)
  const [taxRate, setTaxRate] = useState(DEFAULT_TAX_RATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState(null)
  const [users, setUsers] = useState([])
  const [artists, setArtists] = useState([])
  const [pickListings, setPickListings] = useState([])
  const [stripeTestCard, setStripeTestCard] = useState("4242424242424242")
  const [stripePublishableKey, setStripePublishableKey] = useState("")
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState("")
  const [stripeClientSecret, setStripeClientSecret] = useState("")
  const [stripePaymentLoading, setStripePaymentLoading] = useState(false)
  const [stripePaymentError, setStripePaymentError] = useState("")
  const [stripePaymentStatus, setStripePaymentStatus] = useState("idle")
  const [stripePaymentAmountCents, setStripePaymentAmountCents] = useState(0)

  const stripePromise = useMemo(() => (stripePublishableKey ? loadStripe(stripePublishableKey) : null), [stripePublishableKey])

  useEffect(() => {
    Promise.all([
      fetch(`/api/user`).then((r) => (r.ok ? r.json() : [])),
      fetch(`/api/artist`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([u, a]) => {
        setUsers(Array.isArray(u) ? u : [])
        setArtists(Array.isArray(a) ? a : [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch("/api/stripe/config")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.publishableKey) {
          setStripePublishableKey(data.publishableKey)
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!apiUrl || !pickArtistId) return
    let cancelled = false
    fetch(`/api/listing/artist/${pickArtistId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) setPickListings(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setPickListings([])
      })

    return () => {
      cancelled = true
    }
  }, [apiUrl, pickArtistId])


  const resetStripePaymentState = () => {
    setStripeClientSecret("")
    setStripePaymentIntentId("")
    setStripePaymentStatus("idle")
    setStripePaymentError("")
    setStripePaymentAmountCents(0)
  }
  const addToCart = () => {
    if (!pickArtistId || !pickListingId) return
    const artist = artists.find((a) => String(a.artistID) === pickArtistId)
    const listing = pickListings.find((l) => String(l.listingID) === pickListingId)
    if (!artist || !listing) return
    if (cart.find((c) => c.listingId === pickListingId)) return

    resetStripePaymentState()
    setCart((prev) => [
      ...prev,
      {
        listingId: pickListingId,
        listingTitle: listing.title || listing.path,
        price: listing.price ?? 0,
        artistId: pickArtistId,
        artistTitle: getArtistLabel(artist),
        artistPath: artist.path,
      },
    ])
    setPickListingId("")
  }

  const removeFromCart = (listingId) => {
    resetStripePaymentState()
    setCart((prev) => prev.filter((c) => c.listingId !== listingId))
  }

  const receiptTotals = useMemo(() => {
    const grossCents = cart.reduce((sum, item) => sum + Math.round(Number(item.price) * 100), 0)
    const feeCents = Math.round(grossCents * platformFeeRate)
    const taxCents = Math.round(grossCents * taxRate)
    return { grossCents, feeCents, taxCents }
  }, [cart, platformFeeRate, taxRate])

  const prepareStripePayment = async () => {
    if (!buyer || cart.length === 0) {
      setStripePaymentError("Select a buyer and add at least one listing to the cart.")
      return
    }

    setStripePaymentLoading(true)
    setStripePaymentError("")

    try {
      const response = await fetch("/api/stripe/create-cart-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart,
          buyerUserId: buyer,
          currency,
        }),
      })
      const body = await response.json()
      if (!response.ok) {
        throw new Error(body?.error || "Unable to create Stripe payment intent")
      }

      setStripePaymentIntentId(body.paymentIntentId || "")
      setStripeClientSecret(body.clientSecret || "")
      setStripePaymentAmountCents(Number(body.amountCents) || receiptTotals.grossCents)
      setStripePaymentStatus("requires_payment_method")
    } catch (error) {
      setStripePaymentError(error?.message || "Unable to create Stripe payment intent")
    } finally {
      setStripePaymentLoading(false)
    }
  }

  const handleStripePaymentSuccess = (paymentIntent) => {
    setStripePaymentIntentId(paymentIntent.id)
    setStripePaymentStatus(paymentIntent.status || "succeeded")
    setStripePaymentError("")
  }

  const submit = async () => {
    if (!buyer || cart.length === 0) {
      setError("Select a buyer and add at least one listing to the cart.")
      return
    }

    if (!dryRun && stripePaymentStatus !== "succeeded") {
      setError("Complete the embedded Stripe payment before posting live Modern Treasury events.")
      return
    }

    setLoading(true)
    setError("")
    setResults(null)

    const grouped = groupByArtist(cart)
    const eventBase = `treasury_sim_${Date.now()}`

    try {
      const responses = await Promise.all(
        Object.values(grouped).map(async (group, idx) => {
          const fees = computeArtistGroup(group.items, platformFeeRate, taxRate, DEFAULT_STRIPE_RATE, DEFAULT_STRIPE_FLAT_CENTS)
          const payload = {
            stripeEventId: `${eventBase}_a${group.artistId}_${idx}`,
            stripeEventType,
            stripePaymentIntentId: stripePaymentIntentId || `pi_preview_${Date.now()}_${idx}`,
            orderId: group.items.map((item) => item.listingId).join(","),
            amountTotalCents: fees.grossCents,
            amountTaxCents: fees.taxCents,
            amountShippingCents: 0,
            platformFeeCents: fees.platformFeeCents,
            stripeFeeCents: fees.stripeFeeCents,
            shippingCostCents: 0,
            sellerType: "artist",
            currency,
            dryRun,
            prototypeAction: "purchase",
            ecosystemScenario: "user-buys-art",
            buyerUserId: buyer,
            sellerAccountId: group.artistId,
            vendorAccountId: "",
            description: `Purchase of ${group.items.length} listing(s) from ${group.artistTitle}`,
          }

          const response = await fetch(`/api/treasury/stripe-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
          const body = await response.json()
          if (!response.ok) throw new Error(body?.detail || body?.error || `Failed for artist ${group.artistTitle}`)
          return { group, fees, payload, response: body }
        })
      )
      setResults(responses)
    } catch (submissionError) {
      setError(submissionError?.message || "Submission failed")
    } finally {
      setLoading(false)
    }
  }

  const buyerUser = users.find((u) => String(u.userID) === buyer)
  const artistCount = Object.keys(groupByArtist(cart)).length

  const pageMetaData = {
    title: "Treasury Stripe Sandbox",
    description: "Simulate a multi-artist purchase, pay inside the page with Stripe Elements, and inspect Modern Treasury ledger entries per artist subaccount.",
    keywords: "treasury, stripe, elements, checkout, accounting, ledger, test",
    robots: "noindex, nofollow",
    og: {
      title: "Treasury Stripe Sandbox",
      description: "Simulate a multi-artist purchase, pay inside the page with Stripe Elements, and inspect Modern Treasury ledger entries per artist subaccount.",
    },
  }

  const buyerLabel = buyerUser?.displayName || buyerUser?.username || `User #${buyer}`

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="test/treasury_stripe" />
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body pb-4">
            <h1 className="card-title text-2xl">Treasury Stripe Sandbox</h1>
            <p className="text-sm opacity-70">
              Build a cart of listings from any number of artists. Create an embedded Stripe payment form, complete a sandbox card payment inside the page, and then post one Modern Treasury ledger event per artist subaccount.
            </p>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body py-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">Execution Mode</p>
                <p className="text-xs opacity-70">Dry Run builds and returns the payload without writing to Modern Treasury.</p>
              </div>
              <div className="join" role="group" aria-label="Execution mode">
                <button type="button" className={`btn btn-sm join-item ${dryRun ? "btn-warning" : "btn-ghost"}`} onClick={() => setDryRun(true)}>Dry Run</button>
                <button type="button" className={`btn btn-sm join-item ${dryRun ? "btn-ghost" : "btn-success"}`} onClick={() => setDryRun(false)}>Live</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="font-semibold text-lg">1 — Select Buyer</h2>
            <label className="form-control max-w-sm">
              <span className="label-text">User account making the purchase</span>
              <select className="select select-bordered" value={buyer} onChange={(e) => { resetStripePaymentState(); setBuyer(e.target.value) }}>
                <option value="">— select user —</option>
                {users.map((u) => (
                  <option key={u.userID} value={String(u.userID)}>
                    {u.displayName || u.username || `User #${u.userID}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="font-semibold text-lg">2 — Build Cart</h2>
            <p className="text-xs opacity-60 mb-3">Pick an artist, then a listing. Repeat to add items from multiple artists.</p>
            <div className="flex flex-wrap gap-3 items-end">
              <label className="form-control">
                <span className="label-text">Artist</span>
                <select className="select select-bordered" value={pickArtistId} onChange={(e) => { setPickArtistId(e.target.value); setPickListingId("") }}>
                  <option value="">— select artist —</option>
                  {artists.map((a) => (
                    <option key={a.artistID} value={String(a.artistID)}>
                      {getArtistLabel(a)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-control">
                <span className="label-text">Listing</span>
                <select
                  className="select select-bordered"
                  value={pickListingId}
                  onChange={(e) => setPickListingId(e.target.value)}
                  disabled={!pickArtistId || pickListings.length === 0}
                >
                  <option value="">
                    {!pickArtistId ? "Select an artist first" : pickListings.length === 0 ? "No listings found" : "— select listing —"}
                  </option>
                  {pickListings.map((l) => (
                    <option key={l.listingID} value={String(l.listingID)}>
                      {l.title || l.path}{l.price != null ? ` — $${Number(l.price).toFixed(2)}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn btn-primary" disabled={!pickArtistId || !pickListingId} onClick={addToCart}>
                Add to Cart
              </button>
            </div>

            {cart.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Listing</th>
                      <th>Artist</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Platform Fee</th>
                      <th className="text-right">Tax</th>
                      <th className="text-right">Artist Net</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const gross = Math.round(Number(item.price) * 100)
                      const fee = Math.round(gross * platformFeeRate)
                      const tax = Math.round(gross * taxRate)
                      const artistNet = gross - fee - tax
                      return (
                        <tr key={item.listingId}>
                          <td>{item.listingTitle}</td>
                          <td className="opacity-70">{item.artistTitle}</td>
                          <td className="text-right">${(gross / 100).toFixed(2)}</td>
                          <td className="text-right text-warning">${(fee / 100).toFixed(2)}</td>
                          <td className="text-right opacity-60">${(tax / 100).toFixed(2)}</td>
                          <td className="text-right text-success">${(artistNet / 100).toFixed(2)}</td>
                          <td><button type="button" className="btn btn-ghost btn-xs" onClick={() => removeFromCart(item.listingId)}>x</button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold border-t border-base-300">
                      <td colSpan={2}>Cart Total</td>
                      <td className="text-right">${(receiptTotals.grossCents / 100).toFixed(2)}</td>
                      <td className="text-right text-warning">${(receiptTotals.feeCents / 100).toFixed(2)}</td>
                      <td className="text-right opacity-60">${(receiptTotals.taxCents / 100).toFixed(2)}</td>
                      <td className="text-right text-success">${((receiptTotals.grossCents - receiptTotals.feeCents - receiptTotals.taxCents) / 100).toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-sm opacity-40 mt-4">Cart is empty.</p>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="font-semibold text-lg">3 — Stripe Sandbox Payment + Modern Treasury</h2>
            <p className="text-xs opacity-60 mb-3">
              {artistCount > 1
                ? `${artistCount} artists in cart — Stripe will collect the full cart total, then Modern Treasury will post one ledger event per artist subaccount.`
                : "One artist is in the cart — Stripe will collect the full cart total before the Modern Treasury post."}
            </p>

            {!stripePublishableKey && (
              <div className="alert alert-warning mb-3">
                <span>Stripe publishable key is not loaded yet. Check your environment variables.</span>
              </div>
            )}

            {stripePaymentError && (
              <div className="alert alert-error mb-3">
                <span>{stripePaymentError}</span>
              </div>
            )}

            {stripePaymentStatus === "succeeded" && stripePaymentIntentId && (
              <div className="alert alert-success mb-3">
                <span>Stripe payment succeeded: <span className="font-mono">{stripePaymentIntentId}</span></span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-end mb-4">
              <label className="form-control">
                <span className="label-text text-sm">Suggested Test Card</span>
                <select className="select select-bordered select-sm" value={stripeTestCard} onChange={(e) => setStripeTestCard(e.target.value)}>
                  <option value="4242424242424242">Visa Success (4242)</option>
                  <option value="4000000000000002">Visa Declined (4000)</option>
                  <option value="378282246310005">Amex Success (3782)</option>
                  <option value="6011111111111117">Discover Success (6011)</option>
                  <option value="3530111333300000">JCB Success (3530)</option>
                </select>
              </label>
              <div className="text-xs opacity-70 max-w-md">
                Create the payment intent first, then pay inside the embedded Stripe card form. Test cards from Stripe work here.
              </div>
              <button
                type="button"
                className={`btn btn-secondary btn-sm ${stripePaymentLoading ? "btn-disabled" : ""}`}
                disabled={stripePaymentLoading || !buyer || cart.length === 0}
                onClick={prepareStripePayment}
              >
                {stripePaymentLoading ? "Creating Payment Intent..." : "Prepare Embedded Stripe Form"}
              </button>
            </div>

            {stripeClientSecret && stripePromise && (
              <div className="mb-4 rounded-lg border border-base-300 p-4 bg-base-200">
                <div className="mb-3 text-sm font-medium">Embedded Stripe Card Form</div>
                <Elements stripe={stripePromise}>
                  <StripeEmbeddedPaymentForm
                    clientSecret={stripeClientSecret}
                    amountCents={stripePaymentAmountCents || receiptTotals.grossCents}
                    currency={currency}
                    buyerLabel={buyerLabel}
                    onSuccess={handleStripePaymentSuccess}
                  />
                </Elements>
              </div>
            )}

            {stripePaymentIntentId && (
              <div className="alert alert-info mb-4">
                <div>
                  <h3 className="font-semibold">Stripe payment ready for MT posting</h3>
                  <p className="text-xs opacity-80 font-mono break-all">{stripePaymentIntentId}</p>
                </div>
              </div>
            )}

            <div className="divider text-xs">Modern Treasury Configuration</div>

            <div className="flex flex-wrap gap-3 items-end mb-4">
              <label className="form-control">
                <span className="label-text">Stripe Event Type</span>
                <select className="select select-bordered select-sm" value={stripeEventType} onChange={(e) => setStripeEventType(e.target.value)}>
                  <option value="payment_intent.succeeded">payment_intent.succeeded</option>
                  <option value="checkout.session.completed">checkout.session.completed</option>
                  <option value="charge.refunded">charge.refunded</option>
                  <option value="charge.dispute.created">charge.dispute.created</option>
                </select>
              </label>
              <label className="form-control">
                <span className="label-text">Currency</span>
                <input className="input input-bordered input-sm w-20" value={currency} onChange={(e) => { resetStripePaymentState(); setCurrency(e.target.value) }} />
              </label>
              <label className="form-control">
                <span className="label-text">Platform Fee %</span>
                <input
                  type="number"
                  className="input input-bordered input-sm w-24"
                  min={0}
                  max={100}
                  step={0.5}
                  value={(platformFeeRate * 100).toFixed(1)}
                  onChange={(e) => setPlatformFeeRate(Number(e.target.value) / 100)}
                />
              </label>
              <label className="form-control">
                <span className="label-text">Tax Rate %</span>
                <input
                  type="number"
                  className="input input-bordered input-sm w-24"
                  min={0}
                  max={100}
                  step={0.5}
                  value={(taxRate * 100).toFixed(1)}
                  onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
                />
              </label>
            </div>

            {error && <div className="alert alert-error mb-3"><span>{error}</span></div>}
            <button
              type="button"
              className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
              disabled={loading || !buyer || cart.length === 0 || (!dryRun && stripePaymentStatus !== "succeeded")}
              onClick={submit}
            >
              {loading ? "Posting..." : `Post ${artistCount || ""} MT Ledger Event${artistCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </div>

        {results && (
          <div className="space-y-4">
            <div className="card bg-base-100 shadow border border-primary">
              <div className="card-body">
                <h2 className="font-semibold text-lg">
                  Buyer Receipt — {buyerLabel}
                </h2>
                <p className="text-xs opacity-60 mb-2">All purchased items and the total charged to their payment method.</p>
                {stripePaymentIntentId && (
                  <div className="alert alert-info mb-3">
                    <span className="text-xs">Stripe PaymentIntent: <span className="font-mono">{stripePaymentIntentId}</span></span>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Listing</th>
                        <th>Artist</th>
                        <th className="text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.listingId}>
                          <td>{item.listingTitle}</td>
                          <td className="opacity-70">{item.artistTitle}</td>
                          <td className="text-right">${Number(item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold">
                        <td colSpan={2}>Total Charged</td>
                        <td className="text-right">${(receiptTotals.grossCents / 100).toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {results.map(({ group, fees, response }) => (
              <div key={group.artistId} className="card bg-base-100 shadow border border-success">
                <div className="card-body">
                  <h2 className="font-semibold text-lg">
                    Artist Subaccount — {group.artistTitle}
                    <span className="text-xs font-normal opacity-50 ml-2">/{group.artistPath}</span>
                  </h2>
                  <p className="text-xs opacity-60 mb-3">
                    What this artist&apos;s MT virtual account records: items sold, platform fee deducted, net payable to their bank.
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="table table-sm">
                      <thead><tr><th>Listing Sold</th><th className="text-right">Price</th></tr></thead>
                      <tbody>
                        {group.items.map((item) => (
                          <tr key={item.listingId}>
                            <td>{item.listingTitle}</td>
                            <td className="text-right">${Number(item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-base-200 rounded p-3">
                      <div className="text-xs opacity-60">Collected from Buyer</div>
                      <div className="text-lg font-semibold">${(fees.grossCents / 100).toFixed(2)}</div>
                    </div>
                    <div className="bg-base-200 rounded p-3">
                      <div className="text-xs opacity-60">Artist Net</div>
                      <div className="text-lg font-semibold text-success">${(fees.artistNetCents / 100).toFixed(2)}</div>
                    </div>
                    <div className="bg-base-200 rounded p-3">
                      <div className="text-xs opacity-60">Tax Withheld ({(taxRate * 100).toFixed(0)}%)</div>
                      <div className="text-lg font-semibold opacity-60">-${(fees.taxCents / 100).toFixed(2)}</div>
                    </div>
                    <div className="bg-base-200 rounded p-3">
                      <div className="text-xs opacity-60">TAG Earns (after {(platformFeeRate * 100).toFixed(0)}% fee − Stripe)</div>
                      <div className="text-lg font-semibold text-primary">${(fees.tagNetCents / 100).toFixed(2)}</div>
                    </div>
                    <div className="bg-base-200 rounded p-3">
                      <div className="text-xs opacity-60">Stripe Fee</div>
                      <div className="text-lg font-semibold opacity-50">-${(fees.stripeFeeCents / 100).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="collapse collapse-arrow border border-base-300 rounded-lg">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-medium">MT Ledger Payload &amp; Response</div>
                    <div className="collapse-content">
                      <pre className="bg-base-300 p-3 rounded text-xs overflow-x-auto">{JSON.stringify(response, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


