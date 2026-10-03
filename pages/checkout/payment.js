import { useState, useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCart } from '../../components/cart/CartContext';
import TagSEO from '../../components/TagSEO';
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";

function StripeEmbeddedPaymentForm({ clientSecret, amountCents, currency, buyerName, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return onError("Stripe is still loading.");

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return onError("Card entry is not ready.");

        setProcessing(true);

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: buyerName },
                },
            });

            if (result.error) {
                throw new Error(result.error.message || "Stripe payment failed");
            }
            if (result.paymentIntent?.status !== "succeeded") {
                throw new Error(`Stripe returned ${result.paymentIntent?.status}`);
            }

            onSuccess(result.paymentIntent);
        } catch (error) {
            onError(error?.message || "Stripe payment failed");
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-base-300 bg-base-100 p-4 shadow-inner">
                <CardElement options={{ hidePostalCode: true, style: { base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } } } }} />
            </div>
            <button type="submit" className={`btn btn-primary w-full h-14 text-lg ${processing ? "btn-disabled" : ""}`} disabled={processing || !stripe || !elements}>
                {processing ? <span className="loading loading-spinner"></span> : `Pay $${(amountCents / 100).toFixed(2)}`}
            </button>
        </form>
    );
}

export default function CheckoutPaymentPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const { cartItems, cartTotal } = useCart();
    const [mounted, setMounted] = useState(false);
    const hasInitialized = useRef(false);

    const [shippingAddress, setShippingAddress] = useState(null);
    const [selectedRate, setSelectedRate] = useState(null);
    const [shippoShipmentId, setShippoShipmentId] = useState(null);
    const [pageLoadingText, setPageLoadingText] = useState("Securing your items...");

    const [stripePublishableKey, setStripePublishableKey] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [paymentIntentId, setPaymentIntentId] = useState("");
    const [paymentError, setPaymentError] = useState("");

    const stripePromise = useMemo(() => (stripePublishableKey ? loadStripe(stripePublishableKey) : null), [stripePublishableKey]);

    useEffect(() => {
        setMounted(true);
        if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    useEffect(() => {
        if (status !== 'authenticated' || cartItems.length === 0 || hasInitialized.current) return;
        hasInitialized.current = true;

        const executeAutomatedCheckoutFlow = async () => {
            try {
                setPageLoadingText("Loading secure payment gateway...");
                const stripeRes = await fetch("/api/stripe/config");
                if (stripeRes.ok) {
                    const sData = await stripeRes.json();
                    setStripePublishableKey(sData.publishableKey);
                }

                const localAddrText = window.localStorage.getItem('checkout_shipping_address');
                if (!localAddrText) {
                    router.push('/checkout');
                    return;
                }
                const addressObj = JSON.parse(localAddrText);
                setShippingAddress(addressObj);
                console.log("Retrieved shipping address from localStorage:", addressObj);
                // Add robust defaults explicitly to intercept any empty strings returned from DB
                const safeDestPhone = (addressObj.phone || "6478983543").trim();
                const safeDestEmail = (addressObj.email || session?.user?.email || "support@twistedartistsguild.com").trim();

                const safeAddressTo = {
                    ...addressObj,
                    phone: safeDestPhone.length >= 10 ? safeDestPhone : "0000000000",
                    email: safeDestEmail
                };

                setPageLoadingText("Calculating best shipping rate...");
                const shippoRes = await fetch("/api/shippo/quote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        addressFrom: { 
                            name: "TAG Fulfillment", 
                            street1: "1092 Indian Summer Ct", 
                            city: "San Jose", 
                            state: "CA", 
                            zip: "95122", 
                            country: "US",
                            email: "support@twistedartistsguild.com",
                            phone: "4159876543" 
                        },
                        addressTo: safeAddressTo,
                        parcel: { length: "10", width: "15", height: "4", distanceUnit: "in", weight: "1", massUnit: "lb" },
                        dryRun: false
                    }),
                });
                const shippoData = await shippoRes.json();

                if (!shippoData.rates || shippoData.rates.length === 0) {
                    throw new Error(shippoData.error || "No shipping routes available for this destination.");
                }

                if (shippoData.shipmentId) setShippoShipmentId(shippoData.shipmentId);

                let cheapestRate = shippoData.rates[0];
                for (let i = 1; i < shippoData.rates.length; i++) {
                    if (Number(shippoData.rates[i].amount) < Number(cheapestRate.amount)) {
                        cheapestRate = shippoData.rates[i];
                    }
                }
                setSelectedRate(cheapestRate);

                setPageLoadingText("Finalizing totals...");
                const formattedCart = cartItems.map(item => ({
                    listingId: item.listingId,
                    listingTitle: item.listing.title,
                    price: item.listing.price,
                    quantity: item.quantity,
                    artistId: item.listing.artistID || item.artistID || 0,
                }));

                const intentRes = await fetch("/api/stripe/create-cart-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cart: formattedCart,
                        buyerUserId: session.user.id,
                        currency: "USD",
                        shippingAmountCents: Math.round(Number(cheapestRate.amount) * 100),
                        dryRun: false
                    }),
                });

                const intentBody = await intentRes.json();
                if (!intentRes.ok) throw new Error(intentBody?.error || "Unable to create Stripe intent");

                setPaymentIntentId(intentBody.paymentIntentId);
                setClientSecret(intentBody.clientSecret);
                setPageLoadingText("");
            } catch (err) {
                console.error("Automated Flow Error:", err);
                setPaymentError(err.message || "An error occurred during checkout setup.");
                setPageLoadingText("");
            }
        };

        executeAutomatedCheckoutFlow();
    }, [status, session, cartItems, router]);

    const handleSuccess = async (intent) => {
        setPageLoadingText("Generating Shipping Label and finalizing order...");
        let finalOrderNumber = "TAG-PENDING";

        try {
            const uniqueArtists = Array.from(new Set(cartItems.map((item) => String(item.listing?.artist?.title || "").trim()).filter(Boolean)));
            const artistSummary = uniqueArtists.join(", ");

            let labelUrl = null;
            let trackingNum = null;

            if (selectedRate?.objectId && shippoShipmentId) {
                const labelReq = await fetch("/api/shippo/purchase-label", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rateObjectId: selectedRate.objectId,
                        paymentIntentId: intent.id,
                        shipmentId: shippoShipmentId,
                        artistSummary: artistSummary,
                        dryRun: false
                    }),
                });

                if (labelReq.ok) {
                    const lData = await labelReq.json();
                    labelUrl = lData.labelUrl;
                    trackingNum = lData.trackingNumber;
                } else {
                    const err = await labelReq.json();
                    console.error("Non-fatal label generation error", err);
                }
            }

            const res = await fetch(`/api/order/place-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: parseInt(session.user.id),
                    paymentIntentId: intent.id,
                    shippingLabelUrl: labelUrl,
                    trackingNumber: trackingNum
                })
            });

            if (res.ok) {
                const orderData = await res.json();
                finalOrderNumber = orderData.orderNumber;
            }

        } catch (error) {
            console.error("Order completion error: ", error);
        } finally {
            router.push(`/orders/success?orderNumber=${finalOrderNumber}`);
        }
    };

    if (!mounted || status === 'loading' || pageLoadingText !== "") {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4 z-50">
                <TagSEO metadataProp={{ title: "Processing" }} canonicalSlug="checkout/payment" />
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <p className="text-lg font-medium text-base-content/70 animate-pulse">{pageLoadingText || "Processing Payment..."}</p>
            </div>
        );
    }

    const finalTotal = isNaN(cartTotal) ? 0 : cartTotal;

    return (
        <div className="min-h-screen bg-base-200 py-8 lg:py-12">
            <TagSEO metadataProp={{ title: "Payment" }} canonicalSlug="checkout/payment" />
            <div className="container mx-auto px-4 max-w-2xl space-y-6">
                <h1 className="text-3xl font-extrabold text-primary text-center">Complete Your Order</h1>
                {paymentError && <div className="alert alert-error mb-4 shadow"><span>{paymentError}</span></div>}
                
                <div className="card bg-base-100 shadow-xl border border-primary/10">
                    <div className="card-body">
                        <div className="bg-base-200 rounded-box p-4 mb-4 text-sm flex justify-between items-center">
                            <div>
                                <span className="font-bold block text-base-content/80 mb-1">Shipping Included</span>
                                {selectedRate && (
                                    <span className="text-base-content/60">{selectedRate.provider} • Est. {selectedRate.estimatedDays || selectedRate.durationTerms || "2-5"} Days</span>
                                )}
                            </div>
                            <span className="badge badge-success badge-outline">Calculated</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-base-200 pb-4 mb-6">
                            <div>
                                <h2 className="text-base-content/60 font-semibold mb-1">Total Due</h2>
                                <p className="text-xs text-base-content/40">Includes artwork, shipping, and fees.</p>
                            </div>
                            <span className="text-4xl font-mono text-primary font-bold tracking-tight">${finalTotal.toFixed(2)}</span>
                        </div>
                        {clientSecret && stripePromise ? (
                            <Elements stripe={stripePromise}>
                                <StripeEmbeddedPaymentForm
                                    clientSecret={clientSecret}
                                    amountCents={finalTotal * 100}
                                    currency="USD"
                                    buyerName={session?.user?.name}
                                    onSuccess={handleSuccess}
                                    onError={setPaymentError}
                                />
                            </Elements>
                        ) : (
                            <div className="text-center text-error border border-error/20 bg-error/5 p-4 rounded-box">
                                Payment gateway could not be loaded. Please refresh the page or try again later.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}