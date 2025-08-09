/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useState } from 'react';
import { 
  Share2,
  X,
  Mail 
} from 'lucide-react';
import { 
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube
} from 'react-icons/fa';

/**
 * Share Component - Provides social media sharing functionality
 * @param {Object} props - Component properties
 * @param {string} props.url - URL to share (defaults to current page)
 * @param {string} props.title - Title for the shared content
 * @param {string} props.description - Description for the shared content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size variant: 'small', 'medium', 'large'
 * @param {boolean} props.minimal - Show minimal version (icon only)
 * @returns {JSX.Element} Share component
 */
const Share = ({ 
  url = '',
  title = 'Check this out!',
  description = 'Shared from Twisted Artists Guild',
  className = '',
  size = 'medium',
  minimal = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get current URL on client side only
  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return url || window.location.href;
    }
    return url || '';
  };

  // Size configurations
  const sizeConfig = {
    small: {
      button: 'btn-sm',
      icon: 'w-4 h-4',
      modal: 'max-w-sm',
      socialIcon: 'w-5 h-5',
      text: 'text-xs'
    },
    medium: {
      button: 'btn-md',
      icon: 'w-5 h-5', 
      modal: 'max-w-md',
      socialIcon: 'w-6 h-6',
      text: 'text-sm'
    },
    large: {
      button: 'btn-lg',
      icon: 'w-6 h-6',
      modal: 'max-w-lg',
      socialIcon: 'w-8 h-8',
      text: 'text-base'
    }
  };

  const config = sizeConfig[size];

  const handleShare = (platform) => {
    const currentUrl = getCurrentUrl();
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
        break;
      case 'instagram':
        // Instagram doesn't have direct URL sharing, so we'll copy to clipboard
        if (typeof window !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(`${title} - ${getCurrentUrl()}`);
          alert('Link copied to clipboard! You can now paste it in your Instagram story or bio.');
        }
        return;
      case 'tiktok':
        // TikTok doesn't have direct URL sharing, so we'll copy to clipboard
        if (typeof window !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(`${title} - ${getCurrentUrl()}`);
          alert('Link copied to clipboard! You can now paste it in your TikTok video description.');
        }
        return;
      case 'youtube':
        // YouTube doesn't have direct URL sharing, so we'll copy to clipboard
        if (typeof window !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(`${title} - ${getCurrentUrl()}`);
          alert('Link copied to clipboard! You can now paste it in your YouTube video description.');
        }
        return;
      case 'email':
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
        break;
      default:
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setIsOpen(false);
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      key: 'facebook',
      icon: FaFacebook,
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Instagram', 
      key: 'instagram',
      icon: FaInstagram,
      color: 'hover:text-pink-600',
      bgColor: 'hover:bg-pink-50'
    },
    {
      name: 'TikTok',
      key: 'tiktok', 
      icon: FaTiktok,
      color: 'hover:text-black',
      bgColor: 'hover:bg-gray-100'
    },
    {
      name: 'YouTube',
      key: 'youtube',
      icon: FaYoutube,
      color: 'hover:text-red-600',
      bgColor: 'hover:bg-red-50'
    },
    {
      name: 'Email',
      key: 'email',
      icon: Mail,
      color: 'hover:text-green-600',
      bgColor: 'hover:bg-green-50'
    }
  ];

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`btn ${config.button} btn-ghost ${className} ${
          minimal ? 'btn-circle' : ''
        }`}
        title="Share"
        aria-label="Share content"
      >
        <Share2 className={config.icon} />
        {!minimal && <span className={`ml-1 ${config.text}`}>Share</span>}
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsOpen(false)}>
          <div className={`bg-base-100 rounded-lg p-6 ${config.modal} w-full mx-4`} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share this content</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close share dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Preview */}
            <div className="mb-6 p-3 bg-base-200 rounded">
              <h4 className={`font-medium ${config.text} mb-1`}>{title}</h4>
              <p className={`text-base-content/60 ${config.text === 'text-xs' ? 'text-xs' : 'text-sm'} mb-2`}>
                {description}
              </p>
              <p className={`text-base-content/40 ${config.text === 'text-xs' ? 'text-xs' : 'text-sm'} break-all`}>
                {getCurrentUrl()}
              </p>
            </div>

            {/* Social Platform Buttons */}
            <div className="space-y-2">
              <p className={`text-base-content/80 mb-3 ${config.text}`}>
                Choose a platform to share:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {socialPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <button
                      key={platform.key}
                      onClick={() => handleShare(platform.key)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${platform.color} ${platform.bgColor} hover:border-current`}
                    >
                      <IconComponent className={config.socialIcon} />
                      <span className={`font-medium ${config.text}`}>
                        Share on {platform.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Share;
