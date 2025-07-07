/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/


import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import DateInput from "./DynaDateInput";
import { useSession } from "next-auth/react";

/**
 * Dynamic Form component that renders form fields based on metadata
 * @param {Object} props - Component properties
 * @param {Object|Array} props.metadataProp - Form metadata configuration
 * @param {Object} props.formData - Initial form data values 
 * @param {string} props.request - Request type ("add" or "update")
 * @param {boolean} props.displayHeaders - Whether to display form headers
 * @returns {JSX.Element} - Rendered form component
 */
export default function DynaForm(props) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Unwrap the metadata object. If props.metadataProp is an array, take the first element.
  const rawMetadata = props.metadataProp || {};
  const metadata = useMemo(() => 
    Array.isArray(rawMetadata) ? rawMetadata[0] : rawMetadata, 
    [rawMetadata]
  );
  
  // Form state - clone initial data to avoid direct prop mutation
  const [formValues, setFormValues] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [requestMethod, setRequestMethod] = useState("POST");
  const [endpoint, setEndpoint] = useState("");

  const [submissionError, setSubmissionError] = useState(null);
  const [browserInfo, setBrowserInfo] = useState(null);
  
  // Get browser info for anonymous users
  useEffect(() => {
    // Only collect browser info if we're in a browser environment
    if (typeof window !== 'undefined') {
      const browserDetails = {
        // Safe, non-intrusive data collection
        userAgent: window.navigator.userAgent,
        language: window.navigator.language,
        doNotTrack: window.navigator.doNotTrack,
        cookiesEnabled: window.navigator.cookieEnabled,
        platform: window.navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        referrer: document.referrer || null,
        urlPath: window.location.pathname,
        // Add a timestamp for when the form was accessed
        formAccessTime: new Date().toISOString()
      };
      
      setBrowserInfo(browserDetails);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Anonymous user browser info:", browserDetails);
      }
    }
  }, []);

  // Initialize form data from props
  useEffect(() => {
    // Create form state with hidden field defaults
    const initialValues = { ...props.formData };
    
    // Add hidden field values
    if (metadata.forms_Fields && Array.isArray(metadata.forms_Fields)) {
      metadata.forms_Fields.forEach(field => {
        if (field.hidden && field.name) {
          initialValues[field.name] = 
            props.formData?.[field.name] !== undefined 
              ? props.formData[field.name] 
              : (field.defaultValue || "");
        }
      });
    }
    
    setFormValues(initialValues);
    
    // Debug output immediately on load - not waiting for form submission
    if (process.env.NODE_ENV === 'development') {
      console.group("🔍 DynaFormDB Debug Info - Initial Load");
      console.log("Form Metadata:", metadata);
      console.log("Form Initial Values:", initialValues);
      console.log("API Endpoint:", metadata.APIURL || `${process.env.NEXT_PUBLIC_TAG_API_URL}${metadata.APIURLpostfix || metadata.apiurLpostfix || ''}`);
      console.log("Request Type:", props.request);
      console.log("Session Data:", session);
      console.groupEnd();
    }
  }, [props.formData, metadata, session]);

  /**
   * Set up API endpoint and request method
   */
  useEffect(() => {
    // Check for direct APIURL first (takes precedence)
    if (metadata.APIURL) {
      setEndpoint(metadata.APIURL);
    } 
    // Fall back to constructing URL from API URL postfix if present
    else if (metadata.apiurlpostfix || metadata.APIURLpostfix) {
      const baseUrl = process.env.NEXT_PUBLIC_TAG_API_URL || "";
      const postfix = metadata.apiurlpostfix || metadata.APIURLpostfix || "";
      setEndpoint(`${baseUrl}${postfix}`);
    }
    
    // Map request type to HTTP method
    const requestMap = {
      add: "POST",
      update: "PUT",
      delete: "DELETE"
    };
    
    const method = requestMap[props.request] || "POST";
    setRequestMethod(method);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("DynaFormDB endpoint set to:", endpoint);
      console.log("DynaFormDB request method:", method);
    }
  }, [metadata, props.request]);

  /**
   * Handles input field changes and updates form state
   * @param {string} fieldName - Name of the field
   * @param {string|number|boolean} value - New value
   */
  const handleFieldChange = (fieldName, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldName]: value
    }));
    
    if (process.env.NEXT_PUBLIC_DEBUG === "true") {
      console.log(`Field changed: ${fieldName} = ${value}`);
    }
  };

  /**
   * Validates form data before submission
   * @returns {boolean} - Whether the form is valid
   */
  const validateForm = () => {
    // Validation is a future feature - for now, we're not validating anything
    // and just returning true to allow submission
    
    /* VALIDATION DISABLED - FUTURE FEATURE
    if (metadata.forms_Fields && Array.isArray(metadata.forms_Fields)) {
      const requiredFields = metadata.forms_Fields.filter(field => 
        field.validation && 
        (field.validation.includes('required') || field.validation.includes('validate_'))
      );
      
      for (const field of requiredFields) {
        const value = formValues[field.name];
        if (value === undefined || value === "" || value === null) {
          setFormError(`${field.label || field.name} is required`);
          return false;
        }
      }
    }
    */
    
    setFormError(null);
    return true;
  };

  /**
   * Handles form submission.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't submit multiple times
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) return;
    
    if (!endpoint) {
      setFormError("Missing API endpoint configuration");
      console.error("Form submission failed: No endpoint configured", { 
        metadata,
        APIURL: metadata.APIURL,
        apiurlpostfix: metadata.apiurlpostfix,
        APIURLpostfix: metadata.APIURLpostfix
      });
      return;
    }
    
    // Prepare submission data with user/session info
    const submissionData = {
      ...formValues,
      // Add user data if available, otherwise use browser info
      _submissionMetadata: {
        timestamp: new Date().toISOString(),
        // If we have session data, include authenticated user info
        ...(session?.user && {
          user: {
            id: session.user.id || session.user.sub || null,
            name: session.user.name || null,
            email: session.user.email || null,
            image: session.user.image || null,
          }
        }),
        // For anonymous users, add browser fingerprinting data
        ...(!session && {
          anonymous: true,
          browser: browserInfo || { 
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null 
          }
        })
      }
    };
    
    // Debug info in console at submission time
    if (process.env.NODE_ENV === 'development') {
      console.group("🚀 DynaFormDB Submission");
      console.log("API URL:", endpoint);
      console.log("Method:", requestMethod);
      console.log("Form Data:", submissionData);
      console.groupEnd();
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Security best practices:
      // 1. Always validate data on server-side too
      // 2. Use CSRF protection (handled by framework)
      // 3. Sanitize inputs after validation
      
      const response = await fetch(endpoint, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
          // Add CSRF token if available
          ...(window.csrfToken && { "X-CSRF-Token": window.csrfToken }),
          // Add session token if available
          ...(session?.accessToken && { "Authorization": `Bearer ${session.accessToken}` }),
        },
        credentials: "include", // Include cookies for auth sessions
        body: JSON.stringify(submissionData),
      });
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData?.message || responseData?.error || `Server responded with ${response.status}`);
      }
      
      // Debug successful submission in console
      if (process.env.NODE_ENV === 'development') {
        console.group("✅ DynaFormDB Success");
        console.log("Response:", responseData);
        console.log("Redirect URL:", metadata.redirectURL);
        console.groupEnd();
      }
      
      // Successful submission - redirect
      if (metadata.redirectURL) {
        router.push(metadata.redirectURL);
      } else {
        // If no redirect URL specified, show success message
        setFormError(null);
        alert("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setFormError(`Submission failed: ${error.message}`);
      setSubmissionError(error.message);
      
      // Debug error in console
      if (process.env.NODE_ENV === 'development') {
        console.group("❌ DynaFormDB Error");
        console.error("Error:", error);
        console.error("API URL:", endpoint);
        console.error("Form Data:", submissionData);
        console.groupEnd();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Renders a form field based on its type and configuration
   * @param {Object} field - Field configuration
   * @param {number} index - Field index 
   * @returns {JSX.Element} - Rendered field
   */
  const renderField = (field, index) => {
    // Skip rendering hidden fields (they're already in the form state)
    if (field.hidden === true || field.Hidden === true) {
      return null;
    }
    
    // Get the current value from form state or default
    // IMPORTANT FIX: Ensure we NEVER pass null or undefined to controlled inputs
    // React expects consistent input types throughout component lifecycle
    let currentValue = formValues[field.name] !== undefined ? formValues[field.name] : "";
    
    // For checkboxes, make sure the value is boolean
    if (field.type === "checkbox") {
      currentValue = Boolean(currentValue === true || currentValue === "true");
    } 
    // For all other inputs, ensure we have a string (or empty string)
    else if (currentValue === null || currentValue === undefined) {
      currentValue = "";
    } 
    // If we have a non-string value that's not null/undefined, convert to string
    else if (typeof currentValue !== "string" && typeof currentValue !== "boolean") {
      currentValue = String(currentValue);
    }
    
    // Check if field is read-only - handle both casing variations
    // We're explicitly checking for false to override any database settings
    const isReadOnly = props.overrideReadOnly === false &&
      (field.isReadOnly === true || field.IsReadOnly === true);
    
    // Disabled until future validation implementation
    const isRequired = false; // This is where validation will be used later
    
    // Debug field properties in development mode
    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_FORMS === 'true') {
      console.log(`Field "${field.name}":`, {
        value: currentValue,
        valueType: typeof currentValue,
        isReadOnly: isReadOnly,
        disabled: field.disabled === true || field.Disabled === true,
        hidden: field.hidden === true || field.Hidden === true
      });
    }
    
    // For date-type fields, use the DateInput component
    if (field.type === "date" || field.type === "datetime" || field.type === "datetime-local") {
      return (
        <div key={index} className="form-control">
          <label className="label" htmlFor={`field-${field.name}`}>
            <span className="label-text">
              {field.label || field.Label || field.name}
            </span>
            <div className="flex gap-2">
              {isReadOnly && <span className="label-text-alt text-secondary">Read Only</span>}
            </div>
          </label>
          <DateInput
            name={field.name}
            id={`field-${field.name}`}
            value={currentValue || ""} // Never pass null/undefined 
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            label={field.label || field.Label || field.name}
            placeholder={field.placeholder || field.Placeholder || ""}
            required={isRequired}
            disabled={field.disabled === true || field.Disabled === true}
            readOnly={isReadOnly}
            includeTime={field.type !== "date"}
            className={field.className || field.ClassName || "input input-bordered w-full"}
          />
        </div>
      );
    }
    
    // Apply read-only styles to class name
    const baseClassName = field.className || field.ClassName || "input input-bordered w-full";
    const className = isReadOnly 
      ? `${baseClassName} bg-base-300 cursor-not-allowed` 
      : baseClassName;
    
    // Shared attributes for all field types
    const sharedAttributes = {
      id: `field-${field.name}`,
      name: field.name,
      className,
      placeholder: field.placeholder || field.Placeholder || "",
      readOnly: isReadOnly,
      disabled: field.disabled === true || field.Disabled === true,
      // For non-checkbox inputs, ensure we always have a string value
      ...(field.type !== "checkbox" && { value: currentValue }),
      "aria-readonly": isReadOnly ? "true" : "false",
      onChange: (e) => handleFieldChange(field.name, 
        field.type === "checkbox" ? e.target.checked : e.target.value)
    };
    
    // Add field constraint attributes from DB model
    if (field.minlength) sharedAttributes.minLength = field.minlength;
    if (field.maxlength) sharedAttributes.maxLength = field.maxlength;
    if (field.min !== undefined) sharedAttributes.min = field.min;
    if (field.max !== undefined) sharedAttributes.max = field.max;
    if (field.autofocus === true || field.Autofocus === true) sharedAttributes.autoFocus = true;
    if (field.autocomplete !== undefined || field.Autocomplete !== undefined) {
      sharedAttributes.autoComplete = (field.autocomplete || field.Autocomplete) ? "on" : "off";
    }
    
    return (
      <div key={index} className="form-control">
        <label className="label" htmlFor={`field-${field.name}`}>
          <span className="label-text">
            {field.label || field.Label || field.name}
          </span>
          <div className="flex gap-2">
            {isReadOnly && <span className="label-text-alt text-secondary">Read Only</span>}
          </div>
        </label>
        
        {(() => {
          switch (field.type) {
            case "textarea":
              return (
                <textarea
                  {...sharedAttributes}
                  // Ensure textarea value is never null/undefined
                  value={currentValue}
                  className={isReadOnly ? `textarea textarea-bordered w-full bg-base-300 cursor-not-allowed` : "textarea textarea-bordered w-full"}
                  rows={field.height || field.Height || 3}
                  cols={field.width || field.Width || 20}
                />
              );
              
            case "select":
              return (
                <select
                  {...sharedAttributes}
                  value={currentValue}
                  className={isReadOnly ? `select select-bordered w-full bg-base-300 cursor-not-allowed` : "select select-bordered w-full"}
                >
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label || option.value}
                    </option>
                  )) || <option value="">No options available</option>}
                </select>
              );
              
            case "checkbox":
              return (
                <input
                  {...sharedAttributes}
                  type="checkbox"
                  checked={currentValue}
                  className={isReadOnly ? `checkbox bg-base-300 cursor-not-allowed` : "checkbox"}
                />
              );
              
            // Handle other common input types
            default:
              return (
                <input
                  {...sharedAttributes}
                  type={field.type || "text"}
                />
              );
          }
        })()}
      </div>
    );
  };

  // If metadata is missing, show an error message
  if (!metadata) {
    return (
      <div className="p-4 bg-base-200 rounded-lg">
        <div className="text-center text-gray-500" role="alert">
          <p>No form configuration available. Please check the API response or configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <form 
        className="space-y-4" 
        onSubmit={handleSubmit} 
        aria-label={metadata.h1 || "Dynamic form"}
        noValidate
      >
        {/* Display headers if not disabled */}
        {props.displayHeaders !== false && metadata.h1 && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold">{metadata.h1}</h1>
            {metadata.h2 && <h2 className="text-xl">{metadata.h2}</h2>}
            {metadata.h3 && <h3 className="text-lg">{metadata.h3}</h3>}
            {metadata.formBody && <div>{metadata.formBody}</div>}
          </div>
        )}
        
        {/* Render form fields */}
        {Array.isArray(metadata.forms_Fields) && metadata.forms_Fields.length > 0 && (
          metadata.forms_Fields.map((field, index) => renderField(field, index))
        )}

        {/* Submit button and error message placement */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <button 
            type="submit" 
            className="btn btn-primary" 
            aria-label={props.request === "add" ? "Add" : props.request === "update" ? "Update" : "Submit"}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </>
            ) : (
              props.request === "add" ? "Add" : 
              props.request === "update" ? "Update" : 
              "Submit"
            )}
          </button>
          
          {/* Error message right beside the submit button */}
          {formError && (
            <div className="alert alert-error p-2 md:flex-1" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm md:text-base">{formError}</span>
            </div>
          )}
        </div>
      </form>
      
      {/* Debug info showing session/user data in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 border-t pt-4 text-xs text-gray-500">
          <details>
            <summary className="cursor-pointer">User Data Being Submitted</summary>
            <pre className="mt-2 bg-gray-800 text-gray-200 p-2 rounded overflow-x-auto">
              {JSON.stringify(session?.user || { anonymous: true, browser: browserInfo || "Loading browser info..." }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
