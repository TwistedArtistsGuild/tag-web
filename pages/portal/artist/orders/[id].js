import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import TagSEO from '@/components/TagSEO';
import { IoArrowBackOutline, IoPrintOutline, IoRocketOutline } from 'react-icons/io5';

export default function ArtistFulfillmentDetailsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    // Hardcode matching the index.js logic for testing. Update this to dynamic auth context when available.
    const activeArtistId = 2; 

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    const fetchOrderDetails = async () => {
        if (!session?.user?.id || !id) return;
        try {
            const res = await fetch(`/api/order/${id}?artistId=${activeArtistId}`);
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
            } else {
                router.push('/portal/artist/orders');
            }
        } catch (e) {
            console.error("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && id) fetchOrderDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, session, id, baseApiUrl]);

    const handleMarkAsShipped = async () => {
        setUpdating(true);
        try {
            const res = await fetch(`${baseApiUrl}/order/${id}/ship?artistId=${activeArtistId}`, {
                method: "POST"
            });
            
            if (res.ok) {
                // Refresh the order to grab the exact new DB State
                await fetchOrderDetails();
            } else {
                alert("Failed to update order status.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error updating status.");
        } finally {
            setUpdating(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (!order) return <div className="min-h-screen grid place-items-center">Order not found or unauthorized.</div>;

    const artistSpecificItems = order.items.filter(i => i.listing?.artistID === activeArtistId);
    const artistSubtotal = artistSpecificItems.reduce((acc, curr) => acc + (curr.quantity * curr.unitPriceCents), 0);
    const isShipped = order.status === 'Shipped';

    return (
        <div className="min-h-screen bg-base-200 py-8 lg:py-12">
            <TagSEO metadataProp={{ title: `Fulfill ${order.orderNumber}` }} canonicalSlug={`portal/artist/orders/${id}`} />
            
            <div className="container mx-auto px-4 max-w-4xl">
                
                <Link href="/portal/artist/orders" className="btn btn-ghost btn-sm mb-6 flex w-fit items-center gap-2 text-base-content/70">
                    <IoArrowBackOutline /> Back to portal
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary">Fulfill Order #{order.orderNumber}</h1>
                        <p className="text-sm text-base-content/60 mt-1">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* LEFT COL: Items */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="card bg-base-100 shadow border border-base-300">
                            <div className="card-body">
                                <h2 className="card-title border-b border-base-200 pb-2 flex justify-between">
                                    <span>Pack these items</span>
                                    <span className="text-sm font-normal opacity-70">{artistSpecificItems.length} listed</span>
                                </h2>
                                
                                <div className="space-y-4 mt-2">
                                    {artistSpecificItems.map(item => {
                                        const listing = item.listing || {};
                                        const title = listing.title || "Unknown Item";
                                        const imageUrl = listing.defaultImageURL || listing.pictures?.[0]?.url || "/blank_image.png";

                                        return (
                                            <div key={item.id} className="flex gap-4 p-4 bg-base-200 rounded-box border border-base-300">
                                                <div className="relative w-20 h-20 bg-base-300 rounded overflow-hidden flex-shrink-0">
                                                    <Image src={imageUrl} alt={title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h3 className="font-bold text-sm leading-tight line-clamp-1 mb-1">{title}</h3>
                                                    <p className="text-xs font-mono text-base-content/60 mb-2">SKU: {listing.sku || listing.path || "N/A"}</p>
                                                    <div className="flex justify-between items-center mt-auto">
                                                        <span className="badge badge-primary font-bold">Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COL: Shipping Actions */}
                    <div className="space-y-6">
                        <div className={`card bg-base-100 shadow border border-primary/20 ${isShipped ? 'opacity-80' : ''}`}>
                            <div className="card-body bg-primary/5 rounded-box">
                                <h2 className="card-title text-primary text-xl">Fulfillment Status</h2>
                                <span className={`badge badge-lg ${isShipped ? 'badge-success' : 'badge-warning'} badge-outline my-2 font-bold`}>
                                    {isShipped ? 'Shipped ✔' : 'Awaiting Shipment'}
                                </span>

                                {order.trackingNumber && (
                                    <p className="text-xs font-mono opacity-80 mt-2">Tracking: {order.trackingNumber}</p>
                                )}
                                
                                <div className="divider mt-0 mb-2"></div>
                                
                                <button 
                                    className="btn btn-primary w-full shadow my-2 gap-2"
                                    disabled={!order.shippingLabelUrl}
                                    onClick={() => {
                                        if(order.shippingLabelUrl) window.open(order.shippingLabelUrl, '_blank');
                                    }}
                                >
                                    <IoPrintOutline size={18} /> Print Shipping Label
                                </button>
                                
                                <button 
                                    className="btn btn-outline btn-success w-full gap-2 transition-colors disabled:bg-success/20 disabled:text-success"
                                    disabled={updating || isShipped}
                                    onClick={handleMarkAsShipped}
                                >
                                    {updating ? <span className="loading loading-spinner loading-xs"></span> : <IoRocketOutline size={18} />}
                                    {isShipped ? "Packaged & Sent" : "Mark as Shipped"}
                                </button>
                                
                                <p className="text-xs text-base-content/50 text-center mt-2">
                                    Clicking Mark as Shipped will notify the buyer instantly.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow border border-base-300">
                            <div className="card-body">
                                <h2 className="card-title text-base pb-2 border-b border-base-200">Financial Breakdown</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70">Gross (Your Items)</span>
                                        <span className="font-mono">${(artistSubtotal / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70 text-warning">- TAG Fee (6.5%)</span>
                                        <span className="font-mono text-warning">-${(artistSubtotal * 0.065 / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-base-content/70 text-warning">- Stripe Fee</span>
                                        <span className="font-mono text-warning">-${((artistSubtotal * 0.029 / 100) + 0.30).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-success pt-2 border-t border-base-200 mt-2">
                                        <span>Estimated Net</span>
                                        <span className="font-mono">${((artistSubtotal - (artistSubtotal * 0.065) - (artistSubtotal * 0.029) - 30) / 100).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// NextJS Static Gen fallback
export function getServerSideProps() {
    return { props: {} }
}