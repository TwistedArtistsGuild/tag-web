/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import SocialReactions from '@/components/social/Reactions';

/**
 * CardSocial - Reusable social interaction component for cards
 * Now uses modern social reaction icons instead of old-style counters
 */
const CardSocial = ({ 
    targetId,
    targetType = 'artist',
    orientation = 'horizontal',
    size = 'medium'
}) => {
    const sizeConfig = {
        small: {
            socialPadding: 'p-2'
        },
        medium: {
            socialPadding: 'p-3'
        },
        large: {
            socialPadding: 'p-4'
        }
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    const socialLayoutClass = orientation === 'vertical'
        ? `flex flex-row items-center justify-center ${config.socialPadding} bg-base-200 rounded-b-box`
        : `flex flex-col items-center justify-center ${config.socialPadding} bg-base-200 rounded-r-box`;

    return (
        <div className={socialLayoutClass}>
            {/* Social Reactions Component - Modern reaction icons */}
            <SocialReactions
                targetId={targetId}
                targetType={targetType}
                size={size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'md'}
                showDetails={size !== 'small'}
                showQuickReactions={true}
                readOnly={false}
                currentUser={{ id: 'demo-user', username: 'DemoUser' }}
                initialReactions={[
                    { emoji: '👍', userId: 'user1', username: 'ArtLover', timestamp: new Date().toISOString() },
                    { emoji: '❤️', userId: 'user2', username: 'CreativeFan', timestamp: new Date().toISOString() }
                ]}
            />
        </div>
    );
};

export default CardSocial;
