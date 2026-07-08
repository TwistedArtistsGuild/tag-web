import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import TagSEO from '@/components/TagSEO';
import { IoBagCheckOutline } from 'react-icons/io5';

export default function UserOrdersIndexPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseApiUrl = '/api'

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/');
    }, [status, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session?.user?.id) return;
            try {
                const numericalId = parseInt(session.user.id, 10);
                const res = await fetch(`${baseApiUrl}/order/user/${numericalId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (e) {
                console.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') fetchOrders();
    }, [status, session, baseApiUrl]);

    if (status === 'loading' || loading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="min-h-screen bg-base-200 py-8 lg:py-12">
            <TagSEO metadataProp={{ title: "My Orders" }} canonicalSlug="user/orders" />

            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-3 mb-8">
                    <IoBagCheckOutline className="text-4xl text-primary" />
                    <h1 className="text-3xl font-extrabold text-primary">My Orders</h1>
                </div>

                {orders.length === 0 ? (
                    <div className="card bg-base-100 shadow">
                        <div className="card-body items-center text-center py-16 text-base-content/60">
                            <p className="text-xl font-semibold mb-4">You have not placed any orders yet.</p>
                            <Link href="/listings" className="btn btn-primary">Start Shopping</Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <Link key={order.id} href={`/user/orders/${order.id}`}>
                                <div className="card bg-base-100 shadow border border-base-300 hover:border-primary transition-all cursor-pointer group">
                                    <div className="card-body p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="text-left w-full md:w-auto">
                                            <h2 className="font-mono font-bold text-lg text-primary">{order.orderNumber}</h2>
                                            <p className="text-sm text-base-content/70">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex w-full md:w-auto justify-between md:gap-8 items-center">
                                            <div className="text-left md:text-right">
                                                <p className="text-sm">Total</p>
                                                <p className="font-bold text-lg">${(order.totalCents / 100).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`badge ${order.status === 'Processing' ? 'badge-warning' : 'badge-success'} badge-outline`}>{order.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}