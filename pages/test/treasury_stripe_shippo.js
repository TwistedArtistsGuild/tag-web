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
import getApiURL from "@/components/widgets/GetApiURL"
import { stripHtmlText } from "@/components/security/sanitize"

const DEFAULT_PLATFORM_FEE_RATE = 0.065
const DEFAULT_TAX_RATE = 0.07
const DEFAULT_STRIPE_RATE = 0.029
const DEFAULT_STRIPE_FLAT_CENTS = 30

const DEFAULT_ADDRESS_FROM = {
  name: "TAG Fulfillment",
  street1: "1092 Indian Summer Ct",
  city: "San Jose",
  state: "CA",
  zip: "95122",
  country: "US",
  email: "shipping@twistedartistsguild.com",
  phone: "4159876543",
}

const DEFAULT_ADDRESS_TO = {
  name: "Collector Test",
  street1: "965 Mission St #572",
  city: "San Francisco",
  state: "CA",
  zip: "94103",
  country: "US",
  email: "collector@example.com",
  phone: "4151234567",
}

const DEFAULT_PARCEL = {
  length: "10",
  width: "15",
  height: "4",
  distanceUnit: "in",
  weight: "1",
  massUnit: "lb",
}

function computeArtistGroup(items, feeRate, taxRate, stripeRate, stripeFlatCents, shippingCents = 0) {
  const grossCents = items.reduce((sum, item) => sum + toItemGrossCents(item), 0)
  const platformFeeCents = Math.round(grossCents * feeRate)
  const taxCents = Math.round(grossCents * taxRate)
  const stripeFeeCents = Math.round(grossCents * stripeRate) + stripeFlatCents
  const artistNetCents = grossCents - platformFeeCents - taxCents - shippingCents
  const tagNetCents = platformFeeCents - stripeFeeCents
  return { grossCents, platformFeeCents, taxCents, stripeFeeCents, shippingCents, artistNetCents, tagNetCents }
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
  const title = stripHtmlText(artist.title) || "Untitled Artist"
  const path = stripHtmlText(artist.path) || "no-path"
  const id = artist.artistID != null ? artist.artistID : "n/a"
  return `${title} (${path}) #${id}`
}

function normalizeCurrencyCode(value) {
  return String(value || "USD").trim().toUpperCase()
}

function toRateAmountCents(rate) {
  return Math.round(Number(rate?.amount || 0) * 100)
}

function toItemQuantity(value) {
  const parsed = Math.floor(Number(value) || 1)
  return parsed > 0 ? parsed : 1
}

function toItemGrossCents(item) {
  return Math.round(Number(item.price) * 100) * toItemQuantity(item.quantity)
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

export default function TreasuryStripeShippoPage() {
  const [buyer, setBuyer] = useState("")
  const [cart, setCart] = useState([])
  const [pickArtistId, setPickArtistId] = useState("")
  const [pickListingId, setPickListingId] = useState("")
  const [pickQuantity, setPickQuantity] = useState(1)
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
  const [stripePublishableKey, setStripePublishableKey] = useState("")
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState("")
  const [stripeClientSecret, setStripeClientSecret] = useState("")
  const [stripePaymentLoading, setStripePaymentLoading] = useState(false)
  const [stripePaymentError, setStripePaymentError] = useState("")
  const [stripePaymentStatus, setStripePaymentStatus] = useState("idle")
  const [stripePaymentAmountCents, setStripePaymentAmountCents] = useState(0)
  const [shippoAddressFrom, setShippoAddressFrom] = useState(DEFAULT_ADDRESS_FROM)
  const [shippoAddressTo, setShippoAddressTo] = useState(DEFAULT_ADDRESS_TO)
  const [shippoParcel, setShippoParcel] = useState(DEFAULT_PARCEL)
  const [shippoLoading, setShippoLoading] = useState(false)
  const [shippoError, setShippoError] = useState("")
  const [shippoShipmentId, setShippoShipmentId] = useState("")
  const [shippoRates, setShippoRates] = useState([])
  const [selectedShippoRateId, setSelectedShippoRateId] = useState("")
  const [shippoLabelLoading, setShippoLabelLoading] = useState(false)
  const [shippoLabelError, setShippoLabelError] = useState("")
  const [shippoLabel, setShippoLabel] = useState(null)
  const [copyStatus, setCopyStatus] = useState("")

  const apiUrl = useMemo(() => getApiURL(), [])
  const stripePromise = useMemo(() => (stripePublishableKey ? loadStripe(stripePublishableKey) : null), [stripePublishableKey])

  useEffect(() => {
    if (!apiUrl) return
    Promise.all([
      fetch(`${apiUrl}user`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${apiUrl}artist`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([u, a]) => {
        setUsers(Array.isArray(u) ? u : [])
        setArtists(Array.isArray(a) ? a : [])
      })
      .catch(() => {})
  }, [apiUrl])

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
    fetch(`${apiUrl}listing/artist/${pickArtistId}`)
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

  const selectedShippoRate = shippoRates.find((rate) => rate.objectId === selectedShippoRateId) || null
  const shippingAmountCents = selectedShippoRate ? toRateAmountCents(selectedShippoRate) : 0
  const buyerUser = users.find((u) => String(u.userID) === buyer)
  const buyerLabel = buyerUser?.displayName || buyerUser?.username || `User #${buyer}`
  const artistCount = Object.keys(groupByArtist(cart)).length
  const receiptTotals = useMemo(() => {
    const grossCents = cart.reduce((sum, item) => sum + toItemGrossCents(item), 0)
    const feeCents = Math.round(grossCents * platformFeeRate)
    const taxCents = Math.round(grossCents * taxRate)
    return { grossCents, feeCents, taxCents }
  }, [cart, platformFeeRate, taxRate])
  const totalChargeCents = receiptTotals.grossCents
  const estimateLineItemShippingCents = (lineGrossCents) => {
    if (!shippingAmountCents || !receiptTotals.grossCents) return 0
    return Math.round((shippingAmountCents * lineGrossCents) / receiptTotals.grossCents)
  }

  const clearShippoLabel = () => {
    setShippoLabel(null)
    setShippoLabelError("")
    setShippoLabelLoading(false)
  }

  const copyToClipboard = async (value, label) => {
    try {
      if (!navigator?.clipboard?.writeText) {
        setCopyStatus("Clipboard is unavailable in this browser context.")
        return
      }
      await navigator.clipboard.writeText(value)
      setCopyStatus(`${label} copied.`)
      setTimeout(() => setCopyStatus(""), 1500)
    } catch {
      setCopyStatus("Copy failed. Please copy manually.")
      setTimeout(() => setCopyStatus(""), 1500)
    }
  }

  const resetStripePaymentState = () => {
    setStripeClientSecret("")
    setStripePaymentIntentId("")
    setStripePaymentStatus("idle")
    setStripePaymentError("")
    setStripePaymentAmountCents(0)
  }

  const resetShippoRates = () => {
    setShippoError("")
    setShippoShipmentId("")
    setShippoRates([])
    setSelectedShippoRateId("")
    clearShippoLabel()
  }

  const resetDownstreamState = () => {
    resetStripePaymentState()
    resetShippoRates()
  }

  const updateShippoAddress = (setter, field, value) => {
    resetDownstreamState()
    setter((prev) => ({ ...prev, [field]: value }))
  }

  const updateShippoParcel = (field, value) => {
    resetDownstreamState()
    setShippoParcel((prev) => ({ ...prev, [field]: value }))
  }

  const addToCart = () => {
    if (!pickArtistId || !pickListingId) return
    const artist = artists.find((a) => String(a.artistID) === pickArtistId)
    const listing = pickListings.find((l) => String(l.listingID) === pickListingId)
    if (!artist || !listing) return

    const quantity = toItemQuantity(pickQuantity)

    resetDownstreamState()
    setCart((prev) => {
      const existing = prev.find((item) => item.listingId === pickListingId)
      if (existing) {
        return prev.map((item) =>
          item.listingId === pickListingId
            ? { ...item, quantity: toItemQuantity(item.quantity) + quantity }
            : item
        )
      }

      return [
        ...prev,
        {
          listingId: pickListingId,
          listingTitle: listing.title || listing.path,
          price: listing.price ?? 0,
          quantity,
          artistId: pickArtistId,
          artistTitle: getArtistLabel(artist),
          artistPath: artist.path,
        },
      ]
    })
    setPickListingId("")
    setPickQuantity(1)
  }

  const updateCartQuantity = (listingId, nextQuantity) => {
    resetDownstreamState()
    setCart((prev) =>
      prev.map((item) =>
        item.listingId === listingId
          ? { ...item, quantity: toItemQuantity(nextQuantity) }
          : item
      )
    )
  }

  const removeFromCart = (listingId) => {
    resetDownstreamState()
    setCart((prev) => prev.filter((c) => c.listingId !== listingId))
  }

  const requestShippoRates = async () => {
    setShippoLoading(true)
    setShippoError("")
    resetStripePaymentState()
    setShippoShipmentId("")
    setShippoRates([])
    setSelectedShippoRateId("")

    try {
      const response = await fetch("/api/shippo/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressFrom: shippoAddressFrom,
          addressTo: shippoAddressTo,
          parcel: shippoParcel,
          dryRun,
        }),
      })
      const body = await response.json()
      if (!response.ok) {
        throw new Error(body?.error || "Unable to get Shippo rates")
      }

      const rates = Array.isArray(body?.rates) ? body.rates : []
      setShippoShipmentId(body?.shipmentId || "")
      setShippoRates(rates)
      if (rates[0]?.objectId) {
        setSelectedShippoRateId(rates[0].objectId)
      }
    } catch (quoteError) {
      setShippoError(quoteError?.message || "Unable to get Shippo rates")
    } finally {
      setShippoLoading(false)
    }
  }

  const prepareStripePayment = async () => {
    if (!buyer || cart.length === 0) {
      setStripePaymentError("Select a buyer and add at least one listing to the cart.")
      return
    }

    if (!selectedShippoRate) {
      setStripePaymentError("Request Shippo rates and select a shipping option first.")
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
          shippingAmountCents: 0,
          dryRun,
        }),
      })
      const body = await response.json()
      if (!response.ok) {
        throw new Error(body?.error || "Unable to create Stripe payment intent")
      }

      setStripePaymentIntentId(body.paymentIntentId || "")
      setStripeClientSecret(body.clientSecret || "")
      setStripePaymentAmountCents(Number(body.amountCents) || totalChargeCents)
      setStripePaymentStatus(dryRun ? "succeeded" : "requires_payment_method")
      if (dryRun && body.paymentIntentId) {
        createShippoSampleLabel(body.paymentIntentId)
      }
    } catch (paymentError) {
      setStripePaymentError(paymentError?.message || "Unable to create Stripe payment intent")
    } finally {
      setStripePaymentLoading(false)
    }
  }

  const createShippoSampleLabel = async (paymentIntentId) => {
    if (!selectedShippoRate?.objectId) {
      setShippoLabelError("Select a Shippo rate before generating a label.")
      return
    }

    setShippoLabelLoading(true)
    setShippoLabelError("")
    setShippoLabel(null)

    const uniqueArtists = Array.from(new Set(cart.map((item) => String(item.artistTitle || "").trim()).filter(Boolean)))
    const artistSummary = uniqueArtists.join(", ")

    try {
      const response = await fetch("/api/shippo/purchase-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateObjectId: selectedShippoRate.objectId,
          paymentIntentId,
          shipmentId: shippoShipmentId,
          artistSummary,
          dryRun,
        }),
      })
      const body = await response.json()
      if (!response.ok) {
        throw new Error(body?.error || "Unable to generate Shippo sample label")
      }
      setShippoLabel(body)
    } catch (labelError) {
      setShippoLabelError(labelError?.message || "Unable to generate Shippo sample label")
    } finally {
      setShippoLabelLoading(false)
    }
  }

  const handleStripePaymentSuccess = (paymentIntent) => {
    setStripePaymentIntentId(paymentIntent.id)
    setStripePaymentStatus(paymentIntent.status || "succeeded")
    setStripePaymentError("")
    createShippoSampleLabel(paymentIntent.id)
  }

  const simulateStripeOutcome = async (outcome) => {
    const effectivePaymentIntentId = stripePaymentIntentId || (dryRun ? `pi_dryrun_manual_${Date.now()}` : "")
    if (!effectivePaymentIntentId) {
      setStripePaymentError("Prepare payment first so a payment intent is available.")
      return
    }

    if (!stripePaymentIntentId) {
      setStripePaymentIntentId(effectivePaymentIntentId)
    }

    if (outcome === "succeeded") {
      setStripePaymentStatus("succeeded")
      setStripePaymentError("")
      await createShippoSampleLabel(effectivePaymentIntentId)
      return
    }

    setStripePaymentStatus("requires_payment_method")
    setShippoLabel(null)
    setShippoLabelError("")
    setStripePaymentError("Payment denied (simulated)")
  }

  const submit = async () => {
    if (!buyer || cart.length === 0) {
      setError("Select a buyer and add at least one listing to the cart.")
      return
    }

    if (!selectedShippoRate) {
      setError("Request Shippo rates and select a shipping option before posting.")
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
    const eventBase = `treasury_shippo_sim_${Date.now()}`

    try {
      const groupedArtists = Object.values(grouped)
      const grossByArtist = groupedArtists.map((group) =>
        group.items.reduce((sum, item) => sum + toItemGrossCents(item), 0)
      )
      const totalGrossByArtist = grossByArtist.reduce((sum, value) => sum + value, 0)
      const shippingShares = groupedArtists.map(() => 0)
      if (shippingAmountCents > 0 && totalGrossByArtist > 0) {
        let allocated = 0
        groupedArtists.forEach((_, idx) => {
          if (idx === groupedArtists.length - 1) {
            shippingShares[idx] = shippingAmountCents - allocated
            return
          }
          const share = Math.round((shippingAmountCents * grossByArtist[idx]) / totalGrossByArtist)
          shippingShares[idx] = share
          allocated += share
        })
      }

      const responses = await Promise.all(
        groupedArtists.map(async (group, idx) => {
          const shippingShareCents = shippingShares[idx] || 0
          const fees = computeArtistGroup(group.items, platformFeeRate, taxRate, DEFAULT_STRIPE_RATE, DEFAULT_STRIPE_FLAT_CENTS, shippingShareCents)
          const payload = {
            stripeEventId: `${eventBase}_a${group.artistId}_${idx}`,
            stripeEventType,
            stripePaymentIntentId: stripePaymentIntentId || `pi_preview_${Date.now()}_${idx}`,
            orderId: group.items.map((item) => `${item.listingId}x${toItemQuantity(item.quantity)}`).join(","),
            amountTotalCents: fees.grossCents,
            amountTaxCents: fees.taxCents,
            amountShippingCents: shippingShareCents,
            platformFeeCents: fees.platformFeeCents,
            stripeFeeCents: fees.stripeFeeCents,
            shippingCostCents: shippingShareCents,
            sellerType: "artist",
            currency,
            dryRun,
            prototypeAction: "purchase",
            ecosystemScenario: "user-buys-art",
            buyerUserId: buyer,
            sellerAccountId: group.artistId,
            vendorAccountId: "",
            description: `Purchase of ${group.items.reduce((sum, item) => sum + toItemQuantity(item.quantity), 0)} item(s) from ${group.artistTitle} with ${selectedShippoRate.provider} ${selectedShippoRate.serviceLevel} shipping deduction`,
          }

          const response = await fetch(`${apiUrl}treasury/stripe-event`, {
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

  const pageMetaData = {
    title: "Treasury Stripe Shippo Sandbox",
    description: "Simulate a multi-artist purchase, request Shippo shipping rates, pay inside the page with Stripe Elements, and inspect Modern Treasury ledger entries.",
    keywords: "treasury, stripe, shippo, shipping, accounting, ledger, test",
    robots: "noindex, nofollow",
    og: {
      title: "Treasury Stripe Shippo Sandbox",
      description: "Simulate a multi-artist purchase, request Shippo shipping rates, pay inside the page with Stripe Elements, and inspect Modern Treasury ledger entries.",
    },
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <TagSEO metadataProp={pageMetaData} canonicalSlug="test/treasury_stripe_shippo" />
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body pb-4">
            <h1 className="card-title text-2xl">Treasury Stripe + Shippo Sandbox</h1>
            <p className="text-sm opacity-70">
              Build a cart, fetch live Shippo sandbox rates from address to address, choose a shipping option, pay inside the page with Stripe Elements, and then post one Modern Treasury ledger event per artist subaccount.
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
                <button
                  type="button"
                  className={`btn btn-sm join-item ${dryRun ? "btn-warning" : "btn-ghost"}`}
                  onClick={() => {
                    if (!dryRun) {
                      setDryRun(true)
                      resetDownstreamState()
                      setResults(null)
                      setError("")
                    }
                  }}
                >
                  Dry Run
                </button>
                <button
                  type="button"
                  className={`btn btn-sm join-item ${dryRun ? "btn-ghost" : "btn-success"}`}
                  onClick={() => {
                    if (dryRun) {
                      setDryRun(false)
                      resetDownstreamState()
                      setResults(null)
                      setError("")
                    }
                  }}
                >
                  Live
                </button>
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
              <label className="form-control">
                <span className="label-text">Qty</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className="input input-bordered w-24"
                  value={pickQuantity}
                  onChange={(e) => setPickQuantity(toItemQuantity(e.target.value))}
                />
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
                      <th className="text-right">Unit Price</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Line Total</th>
                      <th className="text-right">Platform Fee</th>
                      <th className="text-right">Tax</th>
                      <th className="text-right">Shipping</th>
                      <th className="text-right">Artist Net</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const unitPrice = Math.round(Number(item.price) * 100)
                      const quantity = toItemQuantity(item.quantity)
                      const gross = toItemGrossCents(item)
                      const fee = Math.round(gross * platformFeeRate)
                      const tax = Math.round(gross * taxRate)
                      const shipping = estimateLineItemShippingCents(gross)
                      const artistNet = gross - fee - tax - shipping
                      return (
                        <tr key={item.listingId}>
                          <td>{item.listingTitle}</td>
                          <td className="opacity-70">{item.artistTitle}</td>
                          <td className="text-right">${(unitPrice / 100).toFixed(2)}</td>
                          <td className="text-right">
                            <input
                              type="number"
                              min={1}
                              step={1}
                              className="input input-bordered input-xs w-16 text-right"
                              value={quantity}
                              onChange={(e) => updateCartQuantity(item.listingId, e.target.value)}
                            />
                          </td>
                          <td className="text-right font-medium">${(gross / 100).toFixed(2)}</td>
                          <td className="text-right text-warning">-${(fee / 100).toFixed(2)}</td>
                          <td className="text-right opacity-60">-${(tax / 100).toFixed(2)}</td>
                          <td className="text-right opacity-60">-${(shipping / 100).toFixed(2)}</td>
                          <td className="text-right text-success">${(artistNet / 100).toFixed(2)}</td>
                          <td><button type="button" className="btn btn-ghost btn-xs" onClick={() => removeFromCart(item.listingId)}>x</button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold border-t border-base-300">
                      <td colSpan={5}>Cart Total</td>
                      <td className="text-right text-warning">-${(receiptTotals.feeCents / 100).toFixed(2)}</td>
                      <td className="text-right opacity-60">-${(receiptTotals.taxCents / 100).toFixed(2)}</td>
                      <td className="text-right opacity-60">-${(shippingAmountCents / 100).toFixed(2)}</td>
                      <td className="text-right text-success">${((receiptTotals.grossCents - receiptTotals.feeCents - receiptTotals.taxCents - shippingAmountCents) / 100).toFixed(2)}</td>
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
            <h2 className="font-semibold text-lg">3 — Shippo Shipping Quote</h2>
            <p className="text-xs opacity-60 mb-3">Request address-to-address shipping rates from Shippo and pick one rate to add to the Stripe payment.</p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-3">
                <h3 className="font-medium">From Address</h3>
                <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.name} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "name", e.target.value)} placeholder="Name" />
                <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.street1} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "street1", e.target.value)} placeholder="Street" />
                <div className="grid grid-cols-2 gap-2">
                  <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.city} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "city", e.target.value)} placeholder="City" />
                  <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.state} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "state", e.target.value)} placeholder="State" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.zip} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "zip", e.target.value)} placeholder="ZIP" />
                  <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.country} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "country", e.target.value)} placeholder="Country" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.email} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "email", e.target.value)} placeholder="Email" />
                  <input className="input input-bordered input-sm w-full" value={shippoAddressFrom.phone} onChange={(e) => updateShippoAddress(setShippoAddressFrom, "phone", e.target.value)} placeholder="Phone" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">To Address</h3>
                <input className="input input-bordered input-sm w-full" value={shippoAddressTo.name} onChange={(e) => updateShippoAddress(setShippoAddressTo, "name", e.target.value)} placeholder="Name" />
                <input className="input input-bordered input-sm w-full" value={shippoAddressTo.street1} onChange={(e) => updateShippoAddress(setShippoAddressTo, "street1", e.target.value)} placeholder="Street" />
                <div className="grid grid-cols-2 gap-2">
                  <input className="input input-bordered input-sm w-full" value={shippoAddressTo.city} onChange={(e) => updateShippoAddress(setShippoAddressTo, "city", e.target.value)} placeholder="City" />
                  <input className="input input-bordered input-sm w-full" value={shippoAddressTo.state} onChange={(e) => updateShippoAddress(setShippoAddressTo, "state", e.target.value)} placeholder="State" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="input input-bordered input-sm w-full" value={shippoAddressTo.zip} onChange={(e) => updateShippoAddress(setShippoAddressTo, "zip", e.target.value)} placeholder="ZIP" />
                  <input className="input input-bordered input-sm w-full" value={shippoAddressTo.country} onChange={(e) => updateShippoAddress(setShippoAddressTo, "country", e.target.value)} placeholder="Country" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input className="input input-bordered input-sm w-full" value={shippoAddressTo.email} onChange={(e) => updateShippoAddress(setShippoAddressTo, "email", e.target.value)} placeholder="Email" />
                  <input className="input input-bordered input-sm w-full" value={shippoAddressTo.phone} onChange={(e) => updateShippoAddress(setShippoAddressTo, "phone", e.target.value)} placeholder="Phone" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <label className="form-control">
                <span className="label-text">Length</span>
                <input className="input input-bordered input-sm" value={shippoParcel.length} onChange={(e) => updateShippoParcel("length", e.target.value)} />
              </label>
              <label className="form-control">
                <span className="label-text">Width</span>
                <input className="input input-bordered input-sm" value={shippoParcel.width} onChange={(e) => updateShippoParcel("width", e.target.value)} />
              </label>
              <label className="form-control">
                <span className="label-text">Height</span>
                <input className="input input-bordered input-sm" value={shippoParcel.height} onChange={(e) => updateShippoParcel("height", e.target.value)} />
              </label>
              <label className="form-control">
                <span className="label-text">Weight</span>
                <input className="input input-bordered input-sm" value={shippoParcel.weight} onChange={(e) => updateShippoParcel("weight", e.target.value)} />
              </label>
              <label className="form-control">
                <span className="label-text">Distance Unit</span>
                <select className="select select-bordered select-sm" value={shippoParcel.distanceUnit} onChange={(e) => updateShippoParcel("distanceUnit", e.target.value)}>
                  <option value="in">in</option>
                  <option value="cm">cm</option>
                </select>
              </label>
              <label className="form-control">
                <span className="label-text">Mass Unit</span>
                <select className="select select-bordered select-sm" value={shippoParcel.massUnit} onChange={(e) => updateShippoParcel("massUnit", e.target.value)}>
                  <option value="lb">lb</option>
                  <option value="kg">kg</option>
                  <option value="oz">oz</option>
                  <option value="g">g</option>
                </select>
              </label>
            </div>

            {shippoError && <div className="alert alert-error mb-3"><span>{shippoError}</span></div>}

            <button type="button" className={`btn btn-accent btn-sm ${shippoLoading ? "btn-disabled" : ""}`} disabled={shippoLoading} onClick={requestShippoRates}>
              {shippoLoading ? "Requesting Shippo Rates..." : "Request Shippo Rates"}
            </button>

            {shippoShipmentId && (
              <div className="alert alert-info mt-4">
                <span className="text-xs">Shippo shipment: <span className="font-mono">{shippoShipmentId}</span></span>
              </div>
            )}

            {shippoRates.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Provider</th>
                      <th>Service</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shippoRates.map((rate) => (
                      <tr key={rate.objectId} className={selectedShippoRateId === rate.objectId ? "bg-base-200" : ""}>
                        <td>
                          <input type="radio" name="shippo-rate" className="radio radio-sm" checked={selectedShippoRateId === rate.objectId} onChange={() => { resetStripePaymentState(); setSelectedShippoRateId(rate.objectId) }} />
                        </td>
                        <td>{rate.provider}</td>
                        <td>{rate.serviceLevel}</td>
                        <td className="text-right">${Number(rate.amount || 0).toFixed(2)} {rate.currency}</td>
                        <td className="text-right">{rate.estimatedDays || rate.durationTerms || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="font-semibold text-lg">4 — Stripe Sandbox Payment + Modern Treasury</h2>
            <p className="text-xs opacity-60 mb-3">
              {dryRun
                ? "Dry Run mode simulates Stripe and Shippo responses locally and posts preview-only Modern Treasury events."
                : "Stripe charges artwork subtotal only. Shipping is treated as a deduction from artist proceeds, like tax and platform fee."}
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
            {shippoLabelLoading && (
              <div className="alert alert-info mb-3">
                <span>Generating Shippo sample label...</span>
              </div>
            )}
            {shippoLabelError && (
              <div className="alert alert-error mb-3">
                <span>{shippoLabelError}</span>
              </div>
            )}
            {shippoLabel?.labelUrl && (
              <div className="rounded-lg border border-success/30 bg-success/10 p-4 mb-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-semibold">Shippo Sample Label Ready</div>
                    <div className="text-xs opacity-70">
                      Transaction: <span className="font-mono">{shippoLabel.transactionId || "n/a"}</span>
                      {shippoLabel?.trackingNumber ? ` • Tracking: ${shippoLabel.trackingNumber}` : ""}
                    </div>
                  </div>
                  <a href={shippoLabel.labelUrl} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">
                    Open Label
                  </a>
                </div>
                <div className="rounded border border-base-300 overflow-hidden bg-base-100">
                  <iframe
                    title="Shippo Sample Label"
                    src={shippoLabel.labelUrl}
                    className="w-full h-135"
                  />
                </div>
                {shippoLabel?.test === true && (
                  <div className="text-xs opacity-70">Shippo test mode is active; label is SAMPLE and not mailable.</div>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div className="bg-base-200 rounded p-3">
                <div className="text-xs opacity-60">Artwork Total</div>
                <div className="text-lg font-semibold">${(receiptTotals.grossCents / 100).toFixed(2)}</div>
              </div>
              <div className="bg-base-200 rounded p-3">
                <div className="text-xs opacity-60">Selected Shipping (Deducted)</div>
                <div className="text-lg font-semibold">-${(shippingAmountCents / 100).toFixed(2)}</div>
              </div>
              <div className="bg-base-200 rounded p-3">
                <div className="text-xs opacity-60">Stripe Charge Total</div>
                <div className="text-lg font-semibold">${(totalChargeCents / 100).toFixed(2)}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-end mb-4">
              <div className="rounded border border-base-300 bg-base-200 p-3 text-xs space-y-2">
                <div className="font-medium">Stripe Test Credentials</div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-xs" onClick={() => copyToClipboard("4000000000000002", "Declined test card")}>Copy Declined Card</button>
                  <button type="button" className="btn btn-xs" onClick={() => copyToClipboard("4242424242424242", "Success test card")}>Copy Success Card</button>
                  <button type="button" className="btn btn-xs" onClick={() => copyToClipboard("123", "CVC")}>Copy CVC</button>
                  <button type="button" className="btn btn-xs" onClick={() => copyToClipboard("12/34", "Expiry")}>Copy Expiry</button>
                  <button type="button" className="btn btn-xs" onClick={() => copyToClipboard("94103", "ZIP")}>Copy ZIP</button>
                </div>
                <div className="opacity-70">Stripe does not allow prepopulating raw card number fields in Elements. Use copy buttons above to speed manual entry.</div>
                {copyStatus && <div className="text-success font-medium">{copyStatus}</div>}
              </div>
              <div className="text-xs opacity-70 max-w-md">
                Request Shippo rates first, choose one, then prepare the embedded Stripe form.
              </div>
              <button
                type="button"
                className={`btn btn-secondary btn-sm ${stripePaymentLoading ? "btn-disabled" : ""}`}
                disabled={stripePaymentLoading || !buyer || cart.length === 0 || !selectedShippoRate}
                onClick={prepareStripePayment}
              >
                {stripePaymentLoading ? "Creating Payment Intent..." : "Prepare Embedded Stripe Form"}
              </button>
            </div>

            {!dryRun && stripeClientSecret && stripePromise && (
              <div className="mb-4 rounded-lg border border-base-300 p-4 bg-base-200">
                <div className="mb-3 text-sm font-medium">Embedded Stripe Card Form</div>
                <Elements stripe={stripePromise}>
                  <StripeEmbeddedPaymentForm
                    clientSecret={stripeClientSecret}
                    amountCents={stripePaymentAmountCents || totalChargeCents}
                    currency={currency}
                    buyerLabel={buyerLabel}
                    onSuccess={handleStripePaymentSuccess}
                  />
                </Elements>
              </div>
            )}

            {(dryRun || stripePaymentIntentId) && (dryRun || !stripeClientSecret || !stripePromise) && (
              <div className="mb-4 rounded-lg border border-base-300 p-4 bg-base-200 space-y-3">
                <div className="text-sm font-medium">Manual Stripe Result (Testing)</div>
                <div className="text-xs opacity-70">
                  {dryRun
                    ? "Dry Run mode: use these buttons to simulate payment outcomes and trigger downstream Shippo/MT behavior."
                    : "Embedded Stripe form is not available right now. Use these buttons to simulate payment outcomes and continue testing Shippo and Modern Treasury flows."}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-success btn-sm" onClick={() => simulateStripeOutcome("succeeded")}>Simulate Payment Succeeded</button>
                  <button type="button" className="btn btn-error btn-sm" onClick={() => simulateStripeOutcome("denied")}>Simulate Payment Denied</button>
                </div>
              </div>
            )}

            {dryRun && stripePaymentIntentId && (
              <div className="alert alert-info mb-4">
                <span>Dry Run payment simulated: no live Stripe charge was created.</span>
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
                <input className="input input-bordered input-sm w-20" value={currency} onChange={(e) => { resetDownstreamState(); setCurrency(normalizeCurrencyCode(e.target.value)) }} />
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
              disabled={loading || !buyer || cart.length === 0 || !selectedShippoRate || (!dryRun && stripePaymentStatus !== "succeeded")}
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
                <h2 className="font-semibold text-lg">Buyer Receipt — {buyerLabel}</h2>
                <p className="text-xs opacity-60 mb-2">Artwork charged to the buyer. Shipping is tracked separately as a seller deduction.</p>
                {stripePaymentIntentId && (
                  <div className="alert alert-info mb-3">
                    <span className="text-xs">Stripe PaymentIntent: <span className="font-mono">{stripePaymentIntentId}</span></span>
                  </div>
                )}
                {selectedShippoRate && (
                  <div className="alert alert-info mb-3">
                    <span className="text-xs">Shippo rate: {selectedShippoRate.provider} {selectedShippoRate.serviceLevel} at ${Number(selectedShippoRate.amount || 0).toFixed(2)} {selectedShippoRate.currency}</span>
                  </div>
                )}
                {shippoLabel?.labelUrl && (
                  <div className="alert alert-success mb-3">
                    <span className="text-xs">Sample label generated: <a className="link link-success" href={shippoLabel.labelUrl} target="_blank" rel="noreferrer">open label PDF</a></span>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Line Item</th>
                        <th>Artist / Provider</th>
                        <th className="text-right">Qty</th>
                        <th className="text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.listingId}>
                          <td>{item.listingTitle}</td>
                          <td className="opacity-70">{item.artistTitle}</td>
                          <td className="text-right">{toItemQuantity(item.quantity)}</td>
                          <td className="text-right">${(toItemGrossCents(item) / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                      {selectedShippoRate && (
                        <tr>
                          <td>Shipping</td>
                          <td className="opacity-70">{selectedShippoRate.provider} {selectedShippoRate.serviceLevel}</td>
                          <td className="text-right">—</td>
                          <td className="text-right">-${Number(selectedShippoRate.amount || 0).toFixed(2)}</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold">
                        <td colSpan={3}>Total Charged</td>
                        <td className="text-right">${(totalChargeCents / 100).toFixed(2)}</td>
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
                    What this artist&apos;s MT virtual account records: items sold, platform fee deducted, tax withheld, shipping deducted, and net payable to their bank.
                  </p>
                  <div className="overflow-x-auto mb-4">
                    <table className="table table-sm">
                      <thead><tr><th>Listing Sold</th><th className="text-right">Qty</th><th className="text-right">Line Total</th></tr></thead>
                      <tbody>
                        {group.items.map((item) => (
                          <tr key={item.listingId}>
                            <td>{item.listingTitle}</td>
                            <td className="text-right">{toItemQuantity(item.quantity)}</td>
                            <td className="text-right">${(toItemGrossCents(item) / 100).toFixed(2)}</td>
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
                      <div className="text-xs opacity-60">Shipping Deduction</div>
                      <div className="text-lg font-semibold opacity-60">-${(fees.shippingCents / 100).toFixed(2)}</div>
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
