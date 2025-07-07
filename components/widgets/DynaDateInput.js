/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import React from 'react';

/**
 * A specialized input component for date and datetime fields
 * 
 * @param {Object} props - Component properties
 * @param {string} props.name - Input field name
 * @param {string} props.id - Input field ID
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.disabled - Whether the field is disabled
 * @param {boolean} props.readOnly - Whether the field is read-only
 * @param {boolean} props.includeTime - Whether to include time input (true for datetime, false for date)
 * @param {string} props.className - CSS class name
 * @returns {JSX.Element} - Rendered component
 */
const DateInput = (props) => {
  // Format ISO date string to HTML datetime-local format
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      // Try to parse the date string
      const date = new Date(dateStr);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      
      // Format for datetime-local input (YYYY-MM-DDThh:mm)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return props.includeTime 
        ? `${year}-${month}-${day}T${hours}:${minutes}` 
        : `${year}-${month}-${day}`;
    } catch (e) {
      console.warn('Error formatting date:', e);
      return '';
    }
  };

  // Format input value back to ISO format on change
  const handleChange = (e) => {
    if (!e.target.value) {
      props.onChange({ target: { name: props.name, value: '' } });
      return;
    }
    
    try {
      // Parse the input value as a date
      const inputDate = new Date(e.target.value);
      
      // Format back to ISO string
      props.onChange({ 
        target: { 
          name: props.name, 
          value: inputDate.toISOString() 
        } 
      });
    } catch (e) {
      console.warn('Error parsing date:', e);
      props.onChange(e);
    }
  };

  // Apply read-only styles
  const baseClassName = props.className || "input input-bordered w-full";
  const className = props.readOnly 
    ? `${baseClassName} bg-base-300 cursor-not-allowed` 
    : baseClassName;

  return (
    <>
      <input
        type={props.includeTime ? "datetime-local" : "date"}
        id={props.id}
        name={props.name}
        value={formatDateForInput(props.value)}
        onChange={handleChange}
        placeholder={props.placeholder}
        className={className}
        required={props.required}
        disabled={props.disabled}
        readOnly={props.readOnly}
        aria-label={props.label}
        aria-required={props.required ? "true" : "false"}
      />
      {/* For debugging - can be removed in production */}
      {process.env.NODE_ENV === 'development' && props.value && (
        <div className="text-xs text-gray-500 mt-1">
          Stored value: {props.value}
        </div>
      )}
    </>
  );
};

export default DateInput;