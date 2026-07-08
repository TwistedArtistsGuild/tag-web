import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import TagSEO from '@/components/TagSEO';
import { IoArrowBackOutline, IoReceiptOutline, IoAnalyticsOutline, IoOpenOutline } from 'react-icons/io5';

export default function OrderDetailsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { id } = router.query;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!session?.user?.id || !id) return;
            try {
                const numericalUserId = parseInt(session.user.id, 10);
                const res = await fetch(`/api/order/${id}?userId=${numericalUserId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                } else {
                    router.push('/user/orders');
                }
            } catch (e) {
                console.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated' && id) fetchOrderDetails();
    }, [status, session, id, router]);

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (!order) return <div className="min-h-screen grid place-items-center">Order not found.</div>;

    const isShipped = order.status === 'Shipped' || order.status === 'Delivered';

    return (
        <div className="min-h-screen bg-base-200 py-8 lg:py-12">
            <TagSEO metadataProp={{ title: `Order ${order.orderNumber}` }} canonicalSlug={`user/orders/${id}`} />

            <div className="container mx-auto px-4 max-w-4xl">

                <Link href="/user/orders" className="btn btn-ghost btn-sm mb-6 flex w-fit items-center gap-2 text-base-content/70">
                    <IoArrowBackOutline /> Back to all orders
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 bg-base-100 p-6 rounded-box shadow border border-base-300">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
                            <IoReceiptOutline /> Order #{order.orderNumber}
                        </h1>
                        <p className="text-sm text-base-content/60 mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <span className={`badge badge-lg ${order.status === 'Processing' ? 'badge-warning' : 'badge-success'} badge-outline shadow-sm font-semibold`}>
                            {order.status === 'Processing' ? 'Preparing for Shipment' : order.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Left Column: Shipment & Items */}
                    <div className="md:col-span-3 space-y-6">
                        
                        {/* Shipping Tracking Card - Only shows when tracking exists! */}
                        {isShipped && order.trackingNumber && (
                            <div className="card bg-base-100 shadow border border-primary/20 bg-primary/5">
                                <div className="card-body py-4 px-6 flex flex-row justify-between items-center">
                                    <div>
                                        <h2 className="text-sm text-base-content/70 font-semibold mb-1 flex items-center gap-1">
                                            <IoAnalyticsOutline /> Tracking Information
                                        </h2>
                                        <p className="font-mono font-bold text-lg text-primary">{order.trackingNumber}</p>
                                    </div>
                                    <button 
                                        onClick={() => window.open(`https://goshippo.com/tracking?track=${order.trackingNumber}`, '_blank')}
                                        className="btn btn-primary btn-sm md:btn-md gap-2 shadow"
                                    >
                                        Track Package <IoOpenOutline />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Items Purchased Card */}
                        <div className="card bg-base-100 shadow border border-base-300">
                            <div className="card-body">
                                <h2 className="card-title border-b border-base-200 pb-2">Items Included</h2>
                                <div className="space-y-4 mt-2">
                                    {order.items.map(item => {
                                        const listing = item.listing || {};
                                        const title = listing.title || "Unknown Item";
                                        const imageUrl = listing.defaultImageURL || listing.pictures?.[0]?.url || "/blank_image.png";
                                        const artist = listing.artist?.title || "Artist";

                                        return (
                                            <div key={item.id} className="flex gap-4 p-2">
                                                <div className="relative w-24 h-24 bg-base-300 rounded overflow-hidden flex-shrink-0 border border-base-200">
                                                    <Image src={imageUrl} alt={title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h3 className="font-bold text-base leading-tight line-clamp-1">{title}</h3>
                                                    <p className="text-sm text-secondary font-medium">{artist}</p>
                                                    <div className="flex justify-between items-center mt-2 bg-base-200/50 p-2 rounded">
                                                        <span className="text-xs text-base-content/70">Qty: {item.quantity}</span>
                                                        <span className="font-mono font-bold text-sm">${(item.unitPriceCents / 100).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Mini Summary */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="card bg-base-100 shadow border border-base-300">
                            <div className="card-body p-5">
                                <h2 className="card-title text-base border-b border-base-200 pb-2">Order Summary</h2>
                                
                                <div className="space-y-2 text-sm mt-2">
                                    <div className="flex justify-between text-base-content/70">
                                        <span>Items</span>
                                        <span>{order.items.reduce((ac, cv) => ac + cv.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold pt-3 border-t border-base-200 mt-2">
                                        <span>Total Paid</span>
                                        <span className="text-primary font-mono">${(order.totalCents / 100).toFixed(2)}</span>
                                    </div>
                                    
                                    {order.stripePaymentIntentId && (
                                        <div className="mt-4 text-xs opacity-50 break-all text-center border-t border-base-200 pt-2">
                                            Txn: {order.stripePaymentIntentId.split('_').slice(-1)}
                                        </div>
                                    )}
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