/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import moment from "moment"
import React from "react"

/**
 * Date component for formatting dates consistently across the application
 * 
 * @param {Object} props - Component props
 * @param {string} props.dateString - ISO date string to format
 * @param {string} props.format - Optional format string (defaults to "dddd D MMMM YYYY")
 * @param {boolean} props.relative - Whether to show relative time (e.g. "2 days ago")
 * @param {boolean} props.includeTime - Whether to include time in the format
 * @param {string} props.className - Optional CSS class name
 * @returns {JSX.Element} Formatted date
 */
export default function Date({ 
  dateString, 
  format, 
  relative = false, 
  includeTime = false,
  className = ""
}) {
  // Handle null or undefined date strings
  if (!dateString) {
    return <span className={className}>No date available</span>;
  }

  // Parse the date string using moment
  const date = moment(dateString);

  // Check if date is valid
  if (!date.isValid()) {
    console.warn(`Invalid date string provided: ${dateString}`);
    return <span className={className}>Invalid date</span>;
  }

  // Use provided format or default based on includeTime flag
  const defaultFormat = includeTime 
    ? "dddd D MMMM YYYY, h:mm A" 
    : "dddd D MMMM YYYY";
  
  const displayFormat = format || defaultFormat;

  // Return relative time if requested
  if (relative) {
    return (
      <time 
        dateTime={date.toISOString()} 
        title={date.format(displayFormat)}
        className={className}
      >
        {date.fromNow()}
      </time>
    );
  }

  // Return formatted date
  return (
    <time 
      dateTime={date.toISOString()} 
      className={className}
    >
      {date.format(displayFormat)}
    </time>
  );
}