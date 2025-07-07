/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import { useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function ThemeDropdownMenu({
  themes,
  currentTheme,
  onThemeChange,
  className,
  isOpen,
  onToggle,
}) {
  const dropdownRef = useRef(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) onToggle();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // Format the theme name for display (capitalize and replace hyphens)
  const formatThemeName = (theme) => {
    return theme
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 ${className}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="hidden md:inline">Theme</span>
        <FiChevronDown 
          className={`transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          size={20}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-md shadow-xl z-[100] animate-opacity overflow-auto max-h-96 theme-dropdown-container">
          <div className="p-2">
            <div className="text-sm font-semibold mb-2 px-2 text-primary">Select Theme</div>
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => {
                  onThemeChange(theme);
                  onToggle();
                }}
                className={`w-full text-left px-4 py-2 hover:bg-base-300 rounded-md transition-colors ${
                  currentTheme === theme ? 'bg-primary/20 font-semibold' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Theme color preview dot - uses data-theme to actually show the theme's color */}
                  <div 
                    data-theme={theme} 
                    className="w-4 h-4 rounded-full border border-base-content/20 flex items-center justify-center theme-color-preview"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: 'hsl(var(--p))',
                        boxShadow: theme === 'tag-theme' ? '0 0 5px hsl(var(--p)), 0 0 10px hsl(var(--p))' : 'none'
                      }}
                    ></div>
                  </div>
                  
                  <span className="theme-name">{formatThemeName(theme)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}