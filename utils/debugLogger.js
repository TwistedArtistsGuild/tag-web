/* Copyright (C) Twisted Artists Guild - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * Enhanced debug logger with more structured output and conditional logging
 * Only logs in development or when DEBUG flag is enabled
 */
const debugLogger = {
  /**
   * Check if debug mode is enabled
   * @returns {boolean}
   */
  isDebugMode() {
    return process.env.NEXT_PUBLIC_DEBUG === 'true' || 
           process.env.NODE_ENV === 'development';
  },

  /**
   * Log general messages
   * @param {string} category - Log category (e.g., 'Form', 'API')
   * @param {string} message - Primary message
   * @param {any} data - Optional data to log
   */
  log(category, message, data) {
    if (!this.isDebugMode()) return;
    
    const timestamp = new Date().toISOString();
    console.log(
      `%c[${timestamp}] [${category}] ${message}`,
      'color: #2563eb; font-weight: bold;'
    );
    
    if (data !== undefined) {
      console.log(data);
    }
  },

  /**
   * Log API request details
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {any} body - Request body
   */
  apiRequest(method, url, body) {
    if (!this.isDebugMode()) return;
    
    console.group(`%c📤 API Request: ${method} ${url}`, 'color: #0891b2; font-weight: bold;');
    console.log('URL:', url);
    console.log('Method:', method);
    if (body) console.log('Body:', body);
    console.groupEnd();
  },

  /**
   * Log API response details
   * @param {string} url - Request URL
   * @param {number} status - HTTP status code
   * @param {any} data - Response data
   */
  apiResponse(url, status, data) {
    if (!this.isDebugMode()) return;
    
    const isSuccess = status >= 200 && status < 300;
    
    console.group(
      `%c📥 API Response: ${status} ${isSuccess ? '✅' : '❌'} ${url}`,
      `color: ${isSuccess ? '#059669' : '#dc2626'}; font-weight: bold;`
    );
    console.log('Status:', status);
    console.log('Data:', data);
    console.groupEnd();
  },

  /**
   * Log form event details
   * @param {string} formId - Form identifier
   * @param {string} event - Event name
   * @param {any} data - Event data
   */
  formEvent(formId, event, data) {
    if (!this.isDebugMode()) return;
    
    console.group(`%c📝 Form Event: ${formId} - ${event}`, 'color: #8b5cf6; font-weight: bold;');
    if (data) console.log(data);
    console.groupEnd();
  },

  /**
   * Log errors with enhanced formatting
   * @param {string} category - Error category
   * @param {Error|string} error - Error object or message
   * @param {any} context - Additional context data
   */
  error(category, error, context) {
    if (!this.isDebugMode()) return;
    
    console.group(`%c❌ ERROR: ${category}`, 'color: #dc2626; font-weight: bold;');
    
    if (error instanceof Error) {
      console.error(error);
    } else {
      console.error(error);
    }
    
    if (context) {
      console.log('Context:', context);
    }
    
    console.groupEnd();
  }
};

export default debugLogger;