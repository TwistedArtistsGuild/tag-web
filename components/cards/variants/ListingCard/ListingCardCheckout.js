/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * ListingCardCheckout - Specialized card for checkout flows and purchase screens
 * Features pricing, purchase options, and streamlined buying experience
 */
const ListingCardCheckout = ({ 
    listing, 
    showPricing = true,
    showQuantity = true,
    onAddToCart = null,
    onBuyNow = null,
    className = '',
    ...otherProps 
}) => {
    const [imageError, setImageError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Extract listing path and artist path for URL construction
    const listingPath = listing?.Path || listing?.path;
    const artistPath = listing?.artist?.Path || listing?.artist?.path || listing?.artistPath;
    
    // Construct the proper URL if we have both paths
    let listingUrl = `/art/${listing?.PictureID || listing?.listingID || 'unknown'}`;
    if (artistPath && listingPath) {
        listingUrl = `/artists/${artistPath}/listings/${listingPath}`;
    }
    
    const imageUrl = listing?.url || listing?.imageUrl || listing?.URL || listing?.profilePic?.url || listing?.picture?.url || `https://picsum.photos/seed/art-${listing?.PictureID || listing?.listingID}/400/400`;
    const title = listing?.Title || listing?.title || 'Untitled';
    const altText = listing?.AltText || listing?.altText || title;
    const artist = listing?.artist || {};
    
    // Mock pricing data - in real app this would come from API
    const pricing = {
        basePrice: 299.99,
        salePrice: null,
        currency: 'USD',
        isAvailable: true,
        stockLevel: 'limited', // 'in-stock', 'limited', 'out-of-stock'
        shippingCost: 15.99,
        estimatedDelivery: '3-5 business days'
    };
    
    const displayPrice = pricing.salePrice || pricing.basePrice;
    const hasDiscount = pricing.salePrice && pricing.salePrice < pricing.basePrice;
    
    const handleAddToCart = async () => {
        if (onAddToCart) {
            setIsLoading(true);
            try {
                await onAddToCart(listing, quantity);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    const handleBuyNow = async () => {
        if (onBuyNow) {
            setIsLoading(true);
            try {
                await onBuyNow(listing, quantity);
            } finally {
                setIsLoading(false);
            }
        }
    };
    
    return (
        <div className={`card bg-base-100 shadow-xl ${className}`} {...otherProps}>
            <div className="card-body p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Section */}
                    <div className="lg:w-1/2">
                        <figure className="relative w-full h-80 lg:h-96">
                            {!imageError ? (
                                <Image
                                    src={imageUrl}
                                    alt={altText}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover rounded-lg"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="w-full h-full bg-base-200 flex items-center justify-center rounded-lg">
                                    <span className="text-4xl text-base-content/60">🖼️</span>
                                </div>
                            )}
                            
                            {/* Stock indicator */}
                            <div className="absolute top-4 right-4">
                                <div className={`badge ${
                                    pricing.stockLevel === 'in-stock' ? 'badge-success' :
                                    pricing.stockLevel === 'limited' ? 'badge-warning' : 'badge-error'
                                }`}>
                                    {pricing.stockLevel === 'in-stock' ? '✓ In Stock' :
                                     pricing.stockLevel === 'limited' ? '⚠ Limited' : '✗ Out of Stock'}
                                </div>
                            </div>
                        </figure>
                    </div>
                    
                    {/* Details Section */}
                    <div className="lg:w-1/2 flex flex-col">
                        {/* Title and Artist */}
                        <div className="mb-4">
                            <Link href={listingUrl}>
                                <h2 className="card-title text-2xl hover:text-primary transition-colors cursor-pointer">
                                    {title}
                                </h2>
                            </Link>
                            
                            {artist.title && (
                                <Link href={`/artists/${artistPath || artist.artistid}`}>
                                    <p className="text-lg text-base-content/80 hover:text-primary transition-colors cursor-pointer mt-1">
                                        by {artist.title}
                                    </p>
                                </Link>
                            )}
                        </div>
                        
                        {/* Pricing */}
                        {showPricing && (
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-bold text-primary">
                                        ${displayPrice.toFixed(2)}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-lg text-base-content/60 line-through">
                                            ${pricing.basePrice.toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-sm text-base-content/60">
                                        {pricing.currency}
                                    </span>
                                </div>
                                
                                {hasDiscount && (
                                    <div className="badge badge-secondary">
                                        Save ${(pricing.basePrice - pricing.salePrice).toFixed(2)}
                                    </div>
                                )}
                                
                                <div className="text-sm text-base-content/60 mt-2">
                                    + ${pricing.shippingCost} shipping • {pricing.estimatedDelivery}
                                </div>
                            </div>
                        )}
                        
                        {/* Quantity Selector */}
                        {showQuantity && pricing.isAvailable && (
                            <div className="mb-6">
                                <label className="label">
                                    <span className="label-text font-medium">Quantity</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        className="input input-bordered w-20 text-center" 
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                        max="10"
                                    />
                                    <button 
                                        className="btn btn-sm btn-outline"
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        disabled={quantity >= 10}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="mt-auto space-y-3">
                            {pricing.isAvailable ? (
                                <>
                                    <button 
                                        className="btn btn-primary btn-lg w-full"
                                        onClick={handleBuyNow}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Processing...' : 'Buy Now'}
                                    </button>
                                    <button 
                                        className="btn btn-outline btn-lg w-full"
                                        onClick={handleAddToCart}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                </>
                            ) : (
                                <button className="btn btn-disabled btn-lg w-full">
                                    Out of Stock
                                </button>
                            )}
                            
                            <Link href={listingUrl}>
                                <button className="btn btn-ghost btn-lg w-full">
                                    View Full Details
                                </button>
                            </Link>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="mt-4 p-4 bg-base-200 rounded-lg">
                            <div className="text-sm space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Secure payment processing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Free returns within 30 days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Certificate of authenticity included</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCardCheckout;
