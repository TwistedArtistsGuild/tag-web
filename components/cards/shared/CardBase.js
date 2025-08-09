/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import Link from "next/link";
import Image from "next/image";

/**
 * CardBase - Shared base component for all card types
 * Provides common layout structure and styling
 */
const CardBase = ({ 
    children,
    orientation = 'horizontal',
    size = 'medium',
    className = ''
}) => {
    const baseClasses = "card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out border border-base-300 rounded-box group";
    
    const orientationClasses = orientation === 'vertical' 
        ? 'card' 
        : 'card lg:card-side';
    
    const sizeClasses = {
        small: 'max-w-sm',
        medium: 'max-w-md', 
        large: 'max-w-2xl',
        fullwidth: 'w-full max-w-none'
    };

    const cardClassName = `${baseClasses} ${orientationClasses} ${sizeClasses[size]} w-full ${className}`;

    return (
        <div className={cardClassName}>
            {children}
        </div>
    );
};

/**
 * CardImage - Reusable image component for cards
 */
const CardImage = ({ 
    src, 
    alt, 
    width, 
    height, 
    className = '',
    containerClassName = '',
    priority = false
}) => {
    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                style={{ objectFit: "cover" }}
                className={`group-hover:scale-105 transition-transform duration-300 ${className}`}
                priority={priority}
            />
        </div>
    );
};

/**
 * CardHeader - Reusable header section with profile picture and name
 */
const CardHeader = ({ 
    profilePic, 
    title, 
    byline, 
    size = 'medium',
    orientation = 'horizontal',
    href = null
}) => {
    const sizeConfig = {
        small: {
            image: { width: 48, height: 48 },
            imageContainer: 'w-12 h-12',
            title: 'text-sm font-medium',
            byline: 'text-xs',
            gap: 'gap-1'
        },
        medium: {
            image: { width: 64, height: 64 },
            imageContainer: 'w-16 h-16',
            title: 'text-base font-semibold',
            byline: 'text-sm',
            gap: 'gap-2'
        },
        large: {
            image: { width: 96, height: 96 },
            imageContainer: 'w-24 h-24',
            title: 'text-lg font-semibold',
            byline: 'text-sm',
            gap: 'gap-2'
        },
        fullwidth: {
            image: { width: 128, height: 128 },
            imageContainer: 'w-32 h-32',
            title: 'text-xl font-bold',
            byline: 'text-base',
            gap: 'gap-3'
        }
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    const headerContent = (
        <div className={`flex items-center ${config.gap} ${orientation === 'vertical' ? 'justify-center' : ''}`}>
            <CardImage
                src={profilePic.url}
                alt={profilePic.alttext}
                width={config.image.width}
                height={config.image.height}
                containerClassName={`${config.imageContainer} rounded-full border-2 border-base-300 flex-shrink-0`}
                className="rounded-full"
            />
            <div className="flex-grow min-w-0">
                <h2 className={`card-title ${config.title} text-primary m-0`}>
                    {title}
                </h2>
                <p className={`${config.byline} text-base-content/60 m-0`}>
                    {byline}
                </p>
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block bg-base-100/80 hover:bg-base-200/90 rounded-lg p-2 -m-2 transition-colors duration-200 backdrop-blur-sm">
                {headerContent}
            </Link>
        );
    }

    return (
        <div className="bg-base-100/60 rounded-lg p-2 -m-2 backdrop-blur-sm">
            {headerContent}
        </div>
    );
};

export { CardBase, CardImage, CardHeader };
