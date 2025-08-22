/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/

import React, { useState, useEffect, useMemo, useReducer, useCallback, memo } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import DateInput from "./DynaDateInput";

// Constants for field types and request methods
const FIELD_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  DATETIME: 'datetime',
  DATETIME_LOCAL: 'datetime-local',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  TEL: 'tel',
  URL: 'url'
};

const REQUEST_TYPES = {
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete'
};

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

// Form state reducer for better state management
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        values: {
          ...state.values,
          [action.fieldName]: action.value
        },
        fieldErrors: {
          ...state.fieldErrors,
          [action.fieldName]: null // Clear field error when user types
        }
      };
    case 'SET_INITIAL_VALUES':
      return {
        ...state,
        values: action.values
      };
    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        isSubmitting: false
      };
    case 'SET_FIELD_ERRORS':
      return {
        ...state,
        fieldErrors: action.errors
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
        fieldErrors: {}
      };
    case 'RESET_FORM':
      return {
        values: {},
        isSubmitting: false,
        error: null,
        fieldErrors: {}
      };
    default:
      return state;
  }
};

// Utility functions
const normalizeFieldProperty = (field, property) => {
  const capitalizedProperty = property.charAt(0).toUpperCase() + property.slice(1);
  return field[property] || field[capitalizedProperty];
};

const getFieldValue = (formValues, fieldName, field) => {
  let value = formValues[fieldName] !== undefined ? formValues[fieldName] : "";
  
  if (field.type === FIELD_TYPES.CHECKBOX) {
    return Boolean(value === true || value === "true");
  }
  
  if (value === null || value === undefined) {
    return "";
  }
  
  if (typeof value !== "string" && typeof value !== "boolean") {
    return String(value);
  }
  
  return value;
};

const getFieldClassName = (field, isReadOnly, hasError) => {
  const baseClassName = normalizeFieldProperty(field, 'className') || 
    `${field.type === FIELD_TYPES.TEXTAREA ? 'textarea' : 
      field.type === FIELD_TYPES.SELECT ? 'select' : 'input'} 
     ${field.type === FIELD_TYPES.TEXTAREA ? 'textarea-bordered' : 
       field.type === FIELD_TYPES.SELECT ? 'select-bordered' : 'input-bordered'} 
     w-full`;
  
  let className = baseClassName;
  
  if (isReadOnly) {
    className += ' input-disabled bg-base-200 cursor-not-allowed opacity-60';
  }
  
  if (hasError) {
    className += ' input-error border-error';
  }
  
  return className;
};

// FormHeader component - memoized to prevent unnecessary re-renders
const FormHeader = memo(({ metadata }) => {
  if (!metadata?.h1) return null;
  
  return (
    <div className="mb-6">
      <div className="space-y-2">
        {metadata.h1 && (
          <h1 className="text-3xl font-bold text-base-content">
            {metadata.h1}
          </h1>
        )}
        {metadata.h2 && (
          <h2 className="text-xl font-semibold text-base-content/80">
            {metadata.h2}
          </h2>
        )}
        {metadata.h3 && (
          <h3 className="text-lg font-medium text-base-content/70">
            {metadata.h3}
          </h3>
        )}
      </div>
      {metadata.formBody && (
        <div className="mt-4 text-base-content/80">
          {metadata.formBody}
        </div>
      )}
    </div>
  );
});

FormHeader.displayName = 'FormHeader';

// FormField component - memoized for performance
const FormField = memo(({ 
  field, 
  value, 
  error, 
  onChange, 
  isReadOnly, 
  index 
}) => {
  // Skip rendering hidden fields
  if (normalizeFieldProperty(field, 'hidden') === true) {
    return null;
  }

  const fieldId = `field-${field.name}`;
  const hasError = Boolean(error);
  const isDisabled = normalizeFieldProperty(field, 'disabled') === true;
  
  // Get field attributes
  const fieldAttributes = {
    id: fieldId,
    name: field.name,
    placeholder: normalizeFieldProperty(field, 'placeholder') || "",
    readOnly: isReadOnly,
    disabled: isDisabled,
    "aria-readonly": isReadOnly ? "true" : "false",
    "aria-invalid": hasError ? "true" : "false",
    "aria-describedby": hasError ? `${fieldId}-error` : undefined
  };

  // Add constraint attributes
  const minLength = normalizeFieldProperty(field, 'minlength');
  const maxLength = normalizeFieldProperty(field, 'maxlength');
  const min = field.min;
  const max = field.max;
  const autoFocus = normalizeFieldProperty(field, 'autofocus');
  const autoComplete = normalizeFieldProperty(field, 'autocomplete');

  if (minLength) fieldAttributes.minLength = minLength;
  if (maxLength) fieldAttributes.maxLength = maxLength;
  if (min !== undefined) fieldAttributes.min = min;
  if (max !== undefined) fieldAttributes.max = max;
  if (autoFocus === true) fieldAttributes.autoFocus = true;
  if (autoComplete !== undefined) {
    fieldAttributes.autoComplete = autoComplete ? "on" : "off";
  }

  const renderInput = () => {
    const inputClassName = getFieldClassName(field, isReadOnly, hasError);

    // Handle date fields with DateInput component
    if ([FIELD_TYPES.DATE, FIELD_TYPES.DATETIME, FIELD_TYPES.DATETIME_LOCAL].includes(field.type)) {
      return (
        <DateInput
          {...fieldAttributes}
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          label={normalizeFieldProperty(field, 'label') || field.name}
          includeTime={field.type !== FIELD_TYPES.DATE}
          className={inputClassName}
        />
      );
    }

    // Handle different input types
    switch (field.type) {
      case FIELD_TYPES.TEXTAREA:
        return (
          <textarea
            {...fieldAttributes}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputClassName}
            rows={normalizeFieldProperty(field, 'height') || 3}
            cols={normalizeFieldProperty(field, 'width') || 20}
          />
        );

      case FIELD_TYPES.SELECT:
        return (
          <select
            {...fieldAttributes}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputClassName}
          >
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label || option.value}
              </option>
            )) || <option value="">No options available</option>}
          </select>
        );

      case FIELD_TYPES.CHECKBOX:
        return (
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                {...fieldAttributes}
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(field.name, e.target.checked)}
                className={`checkbox ${isReadOnly ? 'checkbox-disabled' : ''} ${hasError ? 'checkbox-error' : ''}`}
              />
              <span className="label-text">
                {normalizeFieldProperty(field, 'label') || field.name}
              </span>
            </label>
          </div>
        );

      default:
        return (
          <input
            {...fieldAttributes}
            type={field.type || FIELD_TYPES.TEXT}
            value={value}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={inputClassName}
          />
        );
    }
  };

  // For checkbox, return early since it has its own label structure
  if (field.type === FIELD_TYPES.CHECKBOX) {
    return (
      <div key={index} className="form-control">
        {renderInput()}
        {hasError && (
          <div className="label">
            <span id={`${fieldId}-error`} className="label-text-alt text-error">
              {error}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div key={index} className="form-control">
      <label className="label" htmlFor={fieldId}>
        <span className="label-text font-medium">
          {normalizeFieldProperty(field, 'label') || field.name}
        </span>
        <div className="flex gap-2">
          {isReadOnly && (
            <span className="label-text-alt text-base-content/60">
              Read Only
            </span>
          )}
        </div>
      </label>
      {renderInput()}
      {hasError && (
        <div className="label">
          <span id={`${fieldId}-error`} className="label-text-alt text-error">
            {error}
          </span>
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

// Custom hook for form validation
const useFormValidation = () => {
  const validateField = useCallback((fieldName, value, field) => {
    const validation = normalizeFieldProperty(field, 'validation');
    if (!validation) return null;

    if (validation.includes('required') && (!value || value.toString().trim() === '')) {
      return `${normalizeFieldProperty(field, 'label') || field.name} is required`;
    }

    if (field.type === FIELD_TYPES.EMAIL && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }

    if (field.minLength && value && value.length < field.minLength) {
      return `Minimum length is ${field.minLength} characters`;
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `Maximum length is ${field.maxLength} characters`;
    }

    return null;
  }, []);

  const validateForm = useCallback((formValues, fields) => {
    const errors = {};
    let isValid = true;

    if (fields && Array.isArray(fields)) {
      fields.forEach(field => {
        const error = validateField(field.name, formValues[field.name], field);
        if (error) {
          errors[field.name] = error;
          isValid = false;
        }
      });
    }

    return { isValid, errors };
  }, [validateField]);

  return { validateField, validateForm };
};

// Custom hook for browser info collection
const useBrowserInfo = () => {
  const [browserInfo, setBrowserInfo] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserDetails = {
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
        formAccessTime: new Date().toISOString()
      };
      
      setBrowserInfo(browserDetails);
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Anonymous user browser info:", browserDetails);
      }
    }
  }, []);

  return browserInfo;
};

/**
 * Dynamic Form component that renders form fields based on metadata
 * @param {Object} props - Component properties
 * @param {Object|Array} props.metadataProp - Form metadata configuration
 * @param {Object} props.formData - Initial form data values 
 * @param {string} props.request - Request type ("add" or "update")
 * @param {boolean} props.displayHeaders - Whether to display form headers
 * @param {boolean} props.overrideReadOnly - Override read-only field settings
 * @returns {JSX.Element} - Rendered form component
 */
export default function DynaForm(props) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Memoize metadata processing
  const metadata = useMemo(() => {
    const rawMetadata = props.metadataProp || {};
    return Array.isArray(rawMetadata) ? rawMetadata[0] : rawMetadata;
  }, [props.metadataProp]);
  
  // Initialize form state with reducer
  const [formState, dispatch] = useReducer(formReducer, {
    values: {},
    isSubmitting: false,
    error: null,
    fieldErrors: {}
  });

  const [requestMethod, setRequestMethod] = useState("POST");
  const [endpoint, setEndpoint] = useState("");
  
  // Custom hooks
  const browserInfo = useBrowserInfo();
  const { validateField, validateForm } = useFormValidation();

  // Initialize form data from props
  useEffect(() => {
    const initialValues = { ...props.formData };
    
    // Add hidden field values
    if (metadata.forms_Fields && Array.isArray(metadata.forms_Fields)) {
      metadata.forms_Fields.forEach(field => {
        if (normalizeFieldProperty(field, 'hidden') && field.name) {
          initialValues[field.name] = 
            props.formData?.[field.name] !== undefined 
              ? props.formData[field.name] 
              : (normalizeFieldProperty(field, 'defaultValue') || "");
        }
      });
    }
    
    dispatch({ type: 'SET_INITIAL_VALUES', values: initialValues });
    
    // Debug output in development
    if (process.env.NODE_ENV === 'development') {
      console.group("🔍 DynaFormDB Debug Info - Initial Load");
      console.log("Form Metadata:", metadata);
      console.log("Form Initial Values:", initialValues);
      console.log("API Endpoint:", metadata.APIURL );
      console.log("Request Type:", props.request);
      console.log("Session Data:", session);
      console.groupEnd();
    }
  }, [props.formData, metadata, session, props.request]);

  // Set up API endpoint and request method
  useEffect(() => {
    let newEndpoint = "";
    
    // Debug logging for endpoint construction
    if (process.env.NODE_ENV === 'development') {
      console.group("🔗 DynaFormDB Endpoint Construction");
      console.log("Metadata:", metadata);
      console.log("metadata.APIURL:", metadata.APIURL);
    }
    
    // Check for direct APIURL first (this should be the primary method)
    if (metadata.APIURL) {
      newEndpoint = metadata.APIURL;
      if (process.env.NODE_ENV === 'development') {
        console.log("✅ Using direct APIURL:", newEndpoint);
      }
    } 
    // Fall back to constructing URL from API URL postfix (handle database typo: apiurLpostfix)
    else if (metadata.apiurlpostfix || metadata.apiurLpostfix || metadata.APIURLpostfix) {
      const baseUrl = process.env.NEXT_PUBLIC_TAG_API_URL || "";
      const postfix = metadata.apiurlpostfix || metadata.apiurLpostfix || metadata.APIURLpostfix || "";
      newEndpoint = `${baseUrl}${postfix}`;
      
      // For UPDATE requests, we need to append the ID to the endpoint
      if (props.request === REQUEST_TYPES.UPDATE && props.formData) {
        // Try to find an ID field in the form data
        const idField = props.formData.blogID || props.formData.id || props.formData.ID;
        if (idField) {
          newEndpoint += `/${idField}`;
          if (process.env.NODE_ENV === 'development') {
            console.log("✅ UPDATE request detected, appending ID to URL");
          }
        }
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log("✅ Constructed URL from postfix:", newEndpoint);
      }
    }
    // No fallback - if no endpoint is configured, that's an error
    else {
      if (process.env.NODE_ENV === 'development') {
        console.error("❌ No API endpoint configured in metadata. Expected metadata.APIURL or metadata.apiurlpostfix/APIURLpostfix");
      }
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Final endpoint:", newEndpoint);
      console.groupEnd();
    }
    
    setEndpoint(newEndpoint);
    
    // Map request type to HTTP method
    const requestMap = {
      [REQUEST_TYPES.ADD]: HTTP_METHODS.POST,
      [REQUEST_TYPES.UPDATE]: HTTP_METHODS.PUT,
      [REQUEST_TYPES.DELETE]: HTTP_METHODS.DELETE
    };
    
    const method = requestMap[props.request] || HTTP_METHODS.POST;
    setRequestMethod(method);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("DynaFormDB request method:", method);
      console.log("DynaFormDB final endpoint:", newEndpoint);
    }
  }, [metadata, props.request, props.formData]);

  // Memoized field change handler
  const handleFieldChange = useCallback((fieldName, value) => {
    dispatch({ type: 'SET_FIELD_VALUE', fieldName, value });
    
    // Validate field on change if validation is enabled
    if (metadata.forms_Fields) {
      const field = metadata.forms_Fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(fieldName, value, field);
        if (error) {
          dispatch({ type: 'SET_FIELD_ERRORS', errors: { [fieldName]: error } });
        }
      }
    }
    
    if (process.env.NEXT_PUBLIC_DEBUG === "true") {
      console.log(`Field changed: ${fieldName} = ${value}`);
    }
  }, [metadata.forms_Fields, validateField]);

  // Memoized form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Don't submit multiple times
    if (formState.isSubmitting) return;
    
    // Validate form
    const validation = validateForm(formState.values, metadata.forms_Fields);
    if (!validation.isValid) {
      dispatch({ type: 'SET_FIELD_ERRORS', errors: validation.errors });
      return;
    }
    
    if (!endpoint) {
      const errorDetails = {
        metadata,
        APIURL: metadata.APIURL,
        apiurlpostfix: metadata.apiurlpostfix,
        APIURLpostfix: metadata.APIURLpostfix,
        endpoint: endpoint,
        NEXT_PUBLIC_TAG_API_URL: process.env.NEXT_PUBLIC_TAG_API_URL
      };
      
      dispatch({ 
        type: 'SET_ERROR', 
        error: "Missing API endpoint configuration. Check console for details." 
      });
      
      console.error("Form submission failed: No endpoint configured", errorDetails);
      
      // Additional debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.group("❌ DynaFormDB Endpoint Configuration Error");
        console.error("Current endpoint:", endpoint);
        console.error("Expected metadata.APIURL:", metadata.APIURL);
        console.error("Expected metadata.apiurlpostfix:", metadata.apiurlpostfix);
        console.error("Expected metadata.APIURLpostfix:", metadata.APIURLpostfix);
        console.error("Base URL:", process.env.NEXT_PUBLIC_TAG_API_URL);
        console.error("Full metadata object:", metadata);
        console.groupEnd();
      }
      
      return;
    }
    
    // Prepare submission data with user/session info
    const submissionData = {
      ...formState.values,
      _submissionMetadata: {
        timestamp: new Date().toISOString(),
        ...(session?.user && {
          user: {
            id: session.user.id || session.user.sub || null,
            name: session.user.name || null,
            email: session.user.email || null,
            image: session.user.image || null,
          }
        }),
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
    
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    dispatch({ type: 'CLEAR_ERRORS' });
    
    try {
      // Security best practices: server-side validation, CSRF protection, input sanitization
      const response = await fetch(endpoint, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== 'undefined' && window.csrfToken && { "X-CSRF-Token": window.csrfToken }),
          ...(session?.accessToken && { "Authorization": `Bearer ${session.accessToken}` }),
        },
        credentials: "include",
        body: JSON.stringify(submissionData),
      });
      
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        throw new Error(responseData?.message || responseData?.error || `Server responded with ${response.status}`);
      }
      
      // Debug successful submission
      if (process.env.NODE_ENV === 'development') {
        console.group("✅ DynaFormDB Success");
        console.log("Response:", responseData);
        console.log("Redirect URL:", metadata.redirectURL);
        console.groupEnd();
      }
      
      // Successful submission - redirect or show success
      if (metadata.redirectURL) {
        router.push(metadata.redirectURL);
      } else {
        // Reset form and show success message
        dispatch({ type: 'RESET_FORM' });
        // In a real app, you might want to show a toast or modal instead of alert
        alert("Form submitted successfully!");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      dispatch({ type: 'SET_ERROR', error: `Submission failed: ${error.message}` });
      
      // Debug error
      if (process.env.NODE_ENV === 'development') {
        console.group("❌ DynaFormDB Error");
        console.error("Error:", error);
        console.error("API URL:", endpoint);
        console.error("Form Data:", submissionData);
        console.groupEnd();
      }
    }
  }, [formState.isSubmitting, formState.values, validateForm, metadata, endpoint, requestMethod, session, browserInfo, router]);

  // If metadata is missing, show an error message
  if (!metadata) {
    return (
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="alert alert-warning" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>No form configuration available. Please check the API response or configuration.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-lg max-w-4xl mx-auto">
      <div className="card-body">
        {/* Form Header */}
        {props.displayHeaders !== false && (
          <FormHeader metadata={metadata} />
        )}
        
        {/* Form */}
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit} 
          aria-label={metadata.h1 || "Dynamic form"}
          noValidate
        >
          {/* Render form fields */}
          {Array.isArray(metadata.forms_Fields) && metadata.forms_Fields.length > 0 ? (
            <div className="grid gap-4">
              {metadata.forms_Fields.map((field, index) => (
                <FormField
                  key={field.name || index}
                  field={field}
                  value={getFieldValue(formState.values, field.name, field)}
                  error={formState.fieldErrors[field.name]}
                  onChange={handleFieldChange}
                  isReadOnly={props.overrideReadOnly === false && normalizeFieldProperty(field, 'isReadOnly') === true}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>No form fields configured.</span>
            </div>
          )}

          {/* Submit button and error messages */}
          <div className="card-actions justify-between items-start flex-col sm:flex-row gap-4">
            <button 
              type="submit" 
              className={`btn btn-primary min-w-32 ${formState.isSubmitting ? 'loading' : ''}`}
              aria-label={props.request === REQUEST_TYPES.ADD ? "Add" : props.request === REQUEST_TYPES.UPDATE ? "Update" : "Submit"}
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : (
                props.request === REQUEST_TYPES.ADD ? "Add" : 
                props.request === REQUEST_TYPES.UPDATE ? "Update" : 
                "Submit"
              )}
            </button>
            
            {/* Global form error */}
            {formState.error && (
              <div className="alert alert-error flex-1 min-w-0" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm sm:text-base">{formState.error}</span>
              </div>
            )}
          </div>
        </form>
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 border-t border-base-300 pt-4">
            <details className="collapse collapse-arrow bg-base-200">
              <summary className="collapse-title text-sm font-medium cursor-pointer">
                Debug: User Data Being Submitted
              </summary>
              <div className="collapse-content">
                <pre className="text-xs bg-base-300 text-base-content p-3 rounded overflow-x-auto mt-2">
                  {JSON.stringify(
                    session?.user || { 
                      anonymous: true, 
                      browser: browserInfo || "Loading browser info..." 
                    }, 
                    null, 
                    2
                  )}
                </pre>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

// Default props
DynaForm.defaultProps = {
  formData: {},
  request: REQUEST_TYPES.ADD,
  displayHeaders: true,
  overrideReadOnly: true
};
