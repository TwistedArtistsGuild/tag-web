import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCart } from '@/components/cart/CartContext';
import TagSEO from '@/components/TagSEO';
import { IoCheckmarkCircleOutline, IoArrowForwardOutline, IoBagCheckOutline } from 'react-icons/io5';

export default function OrderSuccessPage() {
    const { data: session } = useSession();
    const router = useRouter(); 
    const { clearCart } = useCart(); // Use the official clear function!
    const [mounted, setMounted] = useState(false);
    
    // Prevent double-clearing due to React StrictMode running useEffect twice
    const hasCleared = useRef(false);

    // Read the passed string ID from the Router directly!
    const orderNumber = router.query.orderNumber || 'TAG-PENDING';

    useEffect(() => {
        setMounted(true);
        
        if (!hasCleared.current) {
            hasCleared.current = true;
            try {
                // Instantly zero out Context array & LocalStorage
                clearCart(); 
                
                // Clear out stale Checkout forms
                window.localStorage.removeItem('checkout_shipping_address');
                window.localStorage.removeItem('checkout_billing_address');
            } catch (e) {
                console.error(e);
            }
        }
    }, [clearCart]);

    if (!mounted) return <div className="min-h-screen bg-base-200"></div>;

    return (
        <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
            <TagSEO metadataProp={{ title: "Order Confirmed" }} canonicalSlug="orders/success" />
            
            <div className="card bg-base-100 shadow-2xl max-w-xl w-full border-t-8 border-success animate-fade-in-up">
                <div className="card-body items-center text-center py-12">
                    
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-success/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                        <IoCheckmarkCircleOutline className="text-8xl text-success relative z-10" />
                    </div>
                    
                    <h1 className="text-4xl font-extrabold mb-2">Order Confirmed!</h1>
                    <p className="text-lg text-base-content/80 mb-8">
                        Thank you for supporting our artists, <span className="font-semibold text-base-content">{session?.user?.name || "Collector"}</span>.
                    </p>

                    <div className="bg-base-200 rounded-box p-6 w-full mb-8">
                        <div className="flex justify-between items-center border-b border-base-300 pb-4 mb-4">
                            <span className="text-base-content/60 font-medium">Order Number</span>
                            <span className="font-mono font-bold text-lg text-primary">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-base-content/60">Date</span>
                            <span className="font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-2">
                            <span className="text-base-content/60">Status</span>
                            <span className="badge badge-success badge-sm font-semibold">Processing</span>
                        </div>
                    </div>

                    <p className="text-sm text-base-content/60 mb-8 px-4">
                        We've received your payment and are notifying the artists. You will receive an email confirmation with shipping and tracking details shortly.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/listings" className="btn btn-outline flex-1 gap-2 border-base-300">
                            Discover More Art <IoArrowForwardOutline />
                        </Link>
                        <Link href="/user/orders" className="btn btn-primary flex-1 gap-2 shadow-lg">
                            <IoBagCheckOutline size={20} /> View My Orders
                        </Link>
                    </div>
                    
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-base-content/40 space-y-1">
                <p>Need help with your order?</p>
                <p>Contact support at <a href="mailto:support@twistedartistsguild.com" className="link hover:text-primary">support@twistedartistsguild.com</a></p>
            </div>
        </div>
    );
}

// Add simple animation styles to make it look highly polished
export function getStaticProps() {
    return {
        props: {}
    }
}