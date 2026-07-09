import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCart } from '@/components/cart/CartContext';
import TagSEO from '@/components/TagSEO';
import { IoAddOutline, IoRemoveOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { IoCartOutline } from 'react-icons/io5';

// Reusable Address Form Component
const AddressForm = ({ type, data, onChange, readOnly = false, isNew = true }) => {
    if (!isNew) {
        return (
            <div className="bg-base-200 p-4 rounded-box flex flex-col gap-1">
                <p className="font-bold text-lg">{data.name}</p>
                <p>{data.street1}</p>
                {data.street2 && <p>{data.street2}</p>}
                <p>{data.city}, {data.state} {data.zip}</p>
                <p>{data.country}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full col-span-1 md:col-span-2">
                <label className="label"><span className="label-text">Full Name</span></label>
                <input type="text" className="input input-bordered w-full" value={data.name || ''} onChange={e => onChange(type, 'name', e.target.value)} disabled={readOnly} placeholder="Jane Doe" required />
            </div>
            <div className="form-control w-full col-span-1 md:col-span-2">
                <label className="label"><span className="label-text">Street Address</span></label>
                <input type="text" className="input input-bordered w-full" value={data.street1 || ''} onChange={e => onChange(type, 'street1', e.target.value)} disabled={readOnly} placeholder="123 Art Street" required />
            </div>
            <div className="form-control w-full col-span-1 md:col-span-2">
                <label className="label"><span className="label-text">Apt / Suite / Other (Optional)</span></label>
                <input type="text" className="input input-bordered w-full" value={data.street2 || ''} onChange={e => onChange(type, 'street2', e.target.value)} disabled={readOnly} />
            </div>
            <div className="form-control w-full">
                <label className="label"><span className="label-text">City</span></label>
                <input type="text" className="input input-bordered w-full" value={data.city || ''} onChange={e => onChange(type, 'city', e.target.value)} disabled={readOnly} required />
            </div>
            <div className="form-control w-full">
                <label className="label"><span className="label-text">State / Province</span></label>
                <input type="text" className="input input-bordered w-full" value={data.state || ''} onChange={e => onChange(type, 'state', e.target.value)} disabled={readOnly} required />
            </div>
            <div className="form-control w-full">
                <label className="label"><span className="label-text">ZIP / Postal Code</span></label>
                <input type="text" className="input input-bordered w-full" value={data.zip || ''} onChange={e => onChange(type, 'zip', e.target.value)} disabled={readOnly} required />
            </div>
            <div className="form-control w-full">
                <label className="label"><span className="label-text">Country</span></label>
                <select className="select select-bordered w-full" value={data.country || 'US'} onChange={e => onChange(type, 'country', e.target.value)} disabled={readOnly}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                </select>
            </div>
        </div>
    );
};

export default function CheckoutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { cartItems, cartTotal, updateQuantity } = useCart();
    
    const [mounted, setMounted] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const baseApiUrl = '/api';

    // Available Address Array
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedShippingId, setSelectedShippingId] = useState("new");
    const [selectedBillingId, setSelectedBillingId] = useState("new");

    // Form Data State (For when "new" is selected)
    const [shippingAddress, setShippingAddress] = useState({});
    const [billingAddress, setBillingAddress] = useState({});

    useEffect(() => {
        setMounted(true);
        if (status === 'unauthenticated') {
            router.push(`/api/auth/signin?callbackUrl=/checkout`);
        }
    }, [status, router]);

    // Load ALL existing user addresses based exactly on your JSON output
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!session?.user?.id) return;
            try {
                const userIdStr = session.user.id;
                const res = await fetch(`${baseApiUrl}/contact/user/${userIdStr}?includePrivate=true`);
                
                if (res.ok) {
                    const data = await res.json();
                    
                    // The ContactController returns a custom viewmodel array "contacts"
                    const contactsList = Array.isArray(data.contacts) ? data.contacts : [];
                    
                    const extractedAddresses = contactsList
                        .filter(c => c && c.contactType === "address" && c.address)
                        .map(c => ({
                            id: c.contactId, // Use contactId as unique key for selection
                            contactId: c.contactId,
                            name: c.address.name || session.user.name || "Saved Address", // JSON doesn't show a name block, fallback to user name
                            street1: c.address.line1 || c.address.addressLine1 || '',
                            street2: c.address.line2 || c.address.addressLine2 || '',
                            city: c.address.city || '',
                            state: c.address.state || '',
                            zip: c.address.postalCode || c.address.zipCode || '',
                            country: c.address.country || 'US'
                        }));
                    
                    if (extractedAddresses.length > 0) {
                        setSavedAddresses(extractedAddresses);
                        setSelectedShippingId(extractedAddresses[0].id.toString());
                        if (sameAsShipping) setSelectedBillingId(extractedAddresses[0].id.toString());
                    }
                }
            } catch (err) {
                console.error("Failed to load user addresses", err);
            }
        };

        if (status === 'authenticated') {
            fetchAddresses();
        }
    }, [status, session, baseApiUrl]); // securely encapsulated

    const handleAddressChange = (type, field, value) => {
        if (type === 'shipping') {
            setShippingAddress(prev => ({ ...prev, [field]: value }));
            if (sameAsShipping) {
                setBillingAddress(prev => ({ ...prev, [field]: value }));
            }
        } else {
            setBillingAddress(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSameAsShippingToggle = () => {
        setSameAsShipping(!sameAsShipping);
        if (!sameAsShipping) {
            setSelectedBillingId(selectedShippingId);
            setBillingAddress({ ...shippingAddress });
        }
    };

    // Helper to safely construct and link a new address via API
    const saveAddressAndLink = async (addressData) => {
        const rawUserId = session.user.id;
        
        // 1. Create Address
        const addrRes = await fetch(`${baseApiUrl}/Address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                addressLine1: addressData.street1,
                addressLine2: addressData.street2,
                city: addressData.city,
                state: addressData.state,
                postalCode: addressData.zip,
                country: addressData.country,
                contactName: addressData.name
            })
        });
        if (!addrRes.ok) throw new Error("Failed to save address details.");
        const savedAddr = await addrRes.json();
        const addressId = savedAddr.addressID || savedAddr.id;

        // 2. Create Contact Wrapper
        const contactRes = await fetch(`${baseApiUrl}/contact`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                addressId: addressId,
                contactType: "address"
            })
        });
        if (!contactRes.ok) throw new Error("Failed to create Contact wrapper.");
        const contactObj = await contactRes.json();
        const contactId = contactObj.contactID || contactObj.id;

        // 3. Link Contact to User
        await fetch(`${baseApiUrl}/LinkerEntityToContact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contactID: contactId,
                userID: Number(rawUserId) ? Number(rawUserId) : null,
                userIdString: isNaN(rawUserId) ? rawUserId : null,
                displayOrder: 1
            })
        });

        return { ...addressData, id: addressId, contactId };
    };

    const handleProceedToPayment = async (e) => {
        e.preventDefault();
        if (!session?.user?.id) return alert("You must be logged in to checkout.");
        
        setIsProcessing(true);
        try {
            // Check Shipping
            let finalShippingAddress = null;
            if (selectedShippingId === "new") {
                finalShippingAddress = await saveAddressAndLink(shippingAddress);
            } else {
                finalShippingAddress = savedAddresses.find(a => a.id.toString() === selectedShippingId.toString());
            }

            // Check Billing
            let finalBillingAddress = null;
            if (sameAsShipping) {
                finalBillingAddress = finalShippingAddress;
            } else if (selectedBillingId === "new") {
                finalBillingAddress = await saveAddressAndLink(billingAddress);
            } else {
                finalBillingAddress = savedAddresses.find(a => a.id.toString() === selectedBillingId.toString());
            }

            if(typeof window !== "undefined") {
                 window.localStorage.setItem('checkout_shipping_address', JSON.stringify(finalShippingAddress));
                 window.localStorage.setItem('checkout_billing_address', JSON.stringify(finalBillingAddress));
            }
            router.push(`/checkout/payment`);
            
        } catch (error) {
            console.error(error);
            alert("There was an error processing your address. Please try again.");
            setIsProcessing(false);
        }
    };

    if (!mounted || status === 'loading') return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
                <TagSEO metadataProp={{ title: "Checkout" }} canonicalSlug="checkout" />
                <div className="card bg-base-100 shadow-xl max-w-md w-full text-center">
                    <div className="card-body items-center py-12">
                        <IoCartOutline className="text-6xl text-base-content/20 mb-4" />
                        <h2 className="card-title text-2xl mb-2">Your Cart is Empty</h2>
                        <p className="text-base-content/60 mb-6">Looks like you haven't added any artwork to your cart yet.</p>
                        <Link href="/listings" className="btn btn-primary">Discover Art</Link>
                    </div>
                </div>
            </div>
        );
    }

    const activeShippingData = selectedShippingId === "new" ? shippingAddress : savedAddresses.find(a => a.id.toString() === selectedShippingId.toString());
    const activeBillingData = selectedBillingId === "new" ? billingAddress : savedAddresses.find(a => a.id.toString() === selectedBillingId.toString());

    return (
        <div className="min-h-screen bg-base-200 py-8 lg:py-12">
            <TagSEO metadataProp={{ title: "Secure Checkout" }} canonicalSlug="checkout" />
            
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-primary mb-8 text-center flex items-center justify-center gap-2">
                    <IoShieldCheckmarkOutline /> Secure Checkout
                </h1>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* LEFT COLUMN: Addresses */}
                    <div className="w-full lg:w-3/5 space-y-6">
                        <form id="checkout-form" onSubmit={handleProceedToPayment}>
                            {/* Shipping Details */}
                            <div className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b border-base-200 pb-2 gap-2">
                                        <h2 className="card-title text-xl">1. Shipping Address</h2>
                                        {savedAddresses.length > 0 && (
                                            <select 
                                                className="select select-sm select-bordered w-full sm:max-w-xs bg-base-200 focus:bg-base-100 transition-colors" 
                                                value={selectedShippingId} 
                                                onChange={(e) => setSelectedShippingId(e.target.value)}
                                                disabled={isProcessing}
                                            >
                                                {savedAddresses.map(addr => (
                                                    <option key={`ship-${addr.id}`} value={addr.id.toString()}>
                                                        {addr.street1}, {addr.city}
                                                    </option>
                                                ))}
                                                <option value="new">+ Add New Address form</option>
                                            </select>
                                        )}
                                    </div>
                                    
                                    <AddressForm 
                                        type="shipping" 
                                        data={activeShippingData || {}} 
                                        onChange={handleAddressChange} 
                                        readOnly={isProcessing} 
                                        isNew={selectedShippingId === "new"}
                                    />
                                </div>
                            </div>

                            {/* Billing Details */}
                            <div className="card bg-base-100 shadow-sm border border-base-300 mt-6">
                                <div className="card-body">
                                    <div className="flex flex-wrap items-center justify-between border-b border-base-200 pb-2 mb-4">
                                        <h2 className="card-title text-xl">2. Billing Address</h2>
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input 
                                                type="checkbox" 
                                                className="checkbox checkbox-primary checkbox-sm" 
                                                checked={sameAsShipping}
                                                onChange={handleSameAsShippingToggle}
                                                disabled={isProcessing}
                                            />
                                            <span className="label-text font-medium">Same as shipping</span>
                                        </label>
                                    </div>
                                    
                                    {!sameAsShipping && (
                                        <div className="animate-fade-in space-y-4 pt-2">
                                            {savedAddresses.length > 0 && (
                                                <div className="flex justify-end mb-2">
                                                    <select 
                                                        className="select select-sm select-bordered w-full sm:max-w-xs bg-base-200 focus:bg-base-100 transition-colors" 
                                                        value={selectedBillingId} 
                                                        onChange={(e) => setSelectedBillingId(e.target.value)}
                                                        disabled={isProcessing}
                                                    >
                                                        {savedAddresses.map(addr => (
                                                            <option key={`bill-${addr.id}`} value={addr.id.toString()}>
                                                                {addr.street1}, {addr.city}
                                                            </option>
                                                        ))}
                                                        <option value="new">+ Add New Address form</option>
                                                    </select>
                                                </div>
                                            )}
                                           
                                            <AddressForm 
                                                type="billing" 
                                                data={activeBillingData || {}} 
                                                onChange={handleAddressChange} 
                                                readOnly={isProcessing} 
                                                isNew={selectedBillingId === "new"}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Order Summary (Cart Items) */}
                    <div className="w-full lg:w-2/5">
                        <div className="card bg-base-100 shadow-md border border-base-300 sticky top-24">
                            <div className="card-body">
                                <h2 className="card-title text-xl mb-4 border-b border-base-200 pb-2">Order Summary</h2>
                                
                                <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                                    {cartItems.map((item) => {
                                        const listing = item.listing || {};
                                        const title = listing.title || "Unknown Item";
                                        const price = Number(listing.price || 0);
                                        const artist = listing.artist?.title || "Artist";
                                        const imageUrl = listing.defaultImageURL || listing.pictures?.[0]?.url || "/blank_image.png";

                                        return (
                                            <div key={item.listingId} className="flex gap-4 p-2 hover:bg-base-200 rounded-box transition-colors">
                                                <div className="relative w-16 h-16 bg-base-300 rounded overflow-hidden flex-shrink-0">
                                                    <Image src={imageUrl} alt={title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h3 className="font-bold text-sm leading-tight line-clamp-1">{title}</h3>
                                                    <p className="text-xs text-base-content/60">{artist}</p>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="flex items-center bg-base-100 rounded border border-base-300 shadow-sm">
                                                            <button type="button" onClick={() => updateQuantity(item.listingId, item.quantity - 1)} className="px-2 py-0.5 hover:bg-base-200"><IoRemoveOutline size={14}/></button>
                                                            <span className="px-2 text-xs font-semibold select-none">{item.quantity}</span>
                                                            <button type="button" onClick={() => updateQuantity(item.listingId, item.quantity + 1)} className="px-2 py-0.5 hover:bg-base-200"><IoAddOutline size={14}/></button>
                                                        </div>
                                                        <span className="font-mono font-bold text-sm">${(price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="divider my-2"></div>

                                {/* Totals */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Subtotal</span>
                                        <span className="font-mono font-medium">${(isNaN(cartTotal) ? 0 : cartTotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-base-200 mt-2">
                                        <span>Total Due</span>
                                        <span className="text-primary font-mono">${(isNaN(cartTotal) ? 0 : cartTotal).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <button 
                                        type="submit" 
                                        form="checkout-form"
                                        disabled={isProcessing}
                                        className="btn btn-primary w-full shadow-lg h-14 text-lg"
                                    >
                                        {isProcessing ? <span className="loading loading-spinner"></span> : "Save & Continue to Payment"}
                                    </button>
                                    <p className="text-center text-xs text-base-content/60 flex items-center justify-center gap-1">
                                        <IoShieldCheckmarkOutline /> 256-bit encryption. Safe & secure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}