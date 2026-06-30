import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import getApiURL from '@/components/widgets/GetApiURL';
import TagSEO from '@/components/TagSEO';
import { IoReceiptOutline } from 'react-icons/io5';

export default function ArtistOrdersPortalIndex() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const api_url = getApiURL();
    const baseApiUrl = api_url.endsWith('/') ? api_url.slice(0, -1) : api_url;

    // Hardcode matching the active component logic for testing
    const activeArtistId = 2; 

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    useEffect(() => {
        const fetchArtistOrders = async () => {
            try {
                const res = await fetch(`${baseApiUrl}/order/artist/${activeArtistId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (e) {
                console.error("Failed to load artist orders", e);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') fetchArtistOrders();
    }, [status, baseApiUrl, activeArtistId]);

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="min-h-screen bg-base-200 py-8 lg:py-12">
            <TagSEO metadataProp={{ title: "Fulfillment Portal" }} canonicalSlug="portal/artist/orders" />

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-3 mb-8">
                    <IoReceiptOutline className="text-4xl text-primary" />
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary">Fulfillment Portal</h1>
                        <p className="text-sm text-base-content/60">Manage orders, print shipping labels, and mark shipments complete.</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="card bg-base-100 shadow">
                        <div className="card-body items-center text-center py-16 text-base-content/60">
                            <p className="text-xl font-semibold mb-4">No active orders awaiting fulfillment.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-base-100 rounded-box shadow border border-base-300">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Date</th>
                                    <th>Items to ship</th>
                                    <th>Payout (Gross)</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => {
                                    const isShipped = order.status === 'Shipped';
                                    
                                    return (
                                    <tr key={order.id} className="hover:bg-base-200 transition-colors">
                                        <td className="font-mono font-bold text-primary">{order.orderNumber}</td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>{order.artistItems.length} item(s)</td>
                                        <td className="font-bold">${(order.artistSubtotalCents / 100).toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${isShipped ? 'badge-success' : 'badge-warning'} badge-outline badge-sm font-bold`}>
                                                {isShipped ? 'Shipped ✔' : 'Awaiting Fulfill'}
                                            </span>
                                        </td>
                                        <td>
                                            <Link 
                                                href={`/portal/artist/orders/${order.id}`} 
                                                className={`btn btn-sm ${isShipped ? 'btn-ghost border-base-300' : 'btn-outline btn-primary'}`}
                                            >
                                                {isShipped ? 'View Details' : 'Review & Ship'}
                                            </Link>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}