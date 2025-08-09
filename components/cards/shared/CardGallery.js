/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

/**
 * CardGallery - Configurable gallery component for artwork display
 * @param {Array} images - Array of image objects with {original, thumbnail, description, title}
 * @param {Object} config - Configuration options for gallery features
 * @param {string} className - Additional CSS classes
 * @param {string} size - Gallery size variant (small, medium, large, fullwidth)
 * @param {number} maxHeight - Maximum height in pixels
 */
const CardGallery = ({ 
    images = [],
    config = {},
    className = '',
    size = 'medium',
    maxHeight = 400
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Default configuration
    const defaultConfig = {
        showPlayButton: false,
        showFullscreenButton: true,
        showThumbnails: true,
        showBullets: true,
        showNav: true,
        thumbnailPosition: "bottom",
        useBrowserFullscreen: true,
        slideInterval: 5000,
        lazyLoad: true,
        showDescriptions: true,
        showTitles: true,
        autoPlay: false
    };

    // Size-specific configurations
    const sizeConfigs = {
        small: {
            showPlayButton: false,
            showFullscreenButton: false,
            showThumbnails: false,
            showBullets: false,
            showNav: true,
            showDescriptions: false,
            showTitles: false,
            maxHeight: 200
        },
        medium: {
            showPlayButton: false,
            showFullscreenButton: true,
            showThumbnails: true,
            showBullets: true,
            showNav: true,
            showDescriptions: true,
            showTitles: true,
            maxHeight: 400
        },
        large: {
            showPlayButton: true,
            showFullscreenButton: true,
            showThumbnails: true,
            showBullets: true,
            showNav: true,
            showDescriptions: true,
            showTitles: true,
            maxHeight: 500
        },
        fullwidth: {
            showPlayButton: true,
            showFullscreenButton: true,
            showThumbnails: true,
            showBullets: true,
            showNav: true,
            showDescriptions: true,
            showTitles: true,
            maxHeight: 600
        }
    };

    // Merge configurations
    const sizeConfig = sizeConfigs[size] || sizeConfigs.medium;
    const finalConfig = { ...defaultConfig, ...sizeConfig, ...config };
    const finalMaxHeight = config.maxHeight || sizeConfig.maxHeight || maxHeight;

    // Handle empty images
    if (!images || images.length === 0) {
        return (
            <div className={`text-center text-gray-500 p-4 ${className}`}>
                <p>No artwork available to display.</p>
            </div>
        );
    }

    // For small galleries with simple nav only
    if (size === 'small' && !finalConfig.showThumbnails && !finalConfig.showBullets) {
        return (
            <div className={`relative ${className}`}>
                <div className="aspect-video rounded-lg overflow-hidden bg-base-300">
                    <img
                        src={images[currentIndex]?.url || images[currentIndex]?.original || "/placeholder.svg"}
                        alt={images[currentIndex]?.alttext || images[currentIndex]?.description || "Artwork"}
                        className="w-full h-full object-cover"
                        style={{ maxHeight: `${finalMaxHeight}px` }}
                    />
                </div>
                
                {/* Simple nav arrows for small galleries */}
                {images.length > 1 && finalConfig.showNav && (
                    <>
                        <button
                            onClick={() => setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 border-none text-white hover:bg-black/70"
                            aria-label="Previous image"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 border-none text-white hover:bg-black/70"
                            aria-label="Next image"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </>
                )}

                {/* Image counter for small galleries */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        );
    }

    // Transform images to format expected by react-image-gallery
    const galleryImages = images.map(img => ({
        original: img.url || img.original,
        thumbnail: img.url || img.thumbnail || img.original,
        description: img.alttext || img.description,
        title: img.title
    }));

    // Full-featured gallery using react-image-gallery
    return (
        <div className={`rounded-lg overflow-hidden ${className}`} style={{ maxHeight: `${finalMaxHeight}px` }}>
            <ImageGallery
                items={galleryImages}
                showPlayButton={finalConfig.showPlayButton}
                showFullscreenButton={finalConfig.showFullscreenButton}
                showThumbnails={finalConfig.showThumbnails}
                showBullets={finalConfig.showBullets}
                showNav={finalConfig.showNav}
                thumbnailPosition={finalConfig.thumbnailPosition}
                additionalClass="artwork-gallery"
                useBrowserFullscreen={finalConfig.useBrowserFullscreen}
                slideInterval={finalConfig.slideInterval}
                lazyLoad={finalConfig.lazyLoad}
                autoPlay={finalConfig.autoPlay}
                renderItem={(item) => (
                    <div className="image-gallery-image">
                        <img
                            src={item.original || "/placeholder.svg"}
                            alt={item.description}
                            style={{ 
                                objectFit: "contain", 
                                maxHeight: `${finalMaxHeight - 100}px`, 
                                margin: "0 auto" 
                            }}
                        />
                        {finalConfig.showDescriptions && item.description && (
                            <div className="image-gallery-description">{item.description}</div>
                        )}
                    </div>
                )}
                renderThumbInner={(item) => (
                    <div className="image-gallery-thumbnail-inner">
                        <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.description}
                            className="image-gallery-thumbnail-image"
                            style={{ objectFit: "cover", height: "80px" }}
                        />
                        {finalConfig.showTitles && item.title && (
                            <div className="image-gallery-thumbnail-label">{item.title}</div>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default CardGallery;
