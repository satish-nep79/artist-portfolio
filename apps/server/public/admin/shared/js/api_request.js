/**
 * API Request Utility
 *
 * Centralized utility for making HTTP requests to the backend API.
 * Automatically handles authentication, JSON serialization, error handling,
 * and provides a consistent response structure.
 *
 * @module api_request
 */

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

/**
 * Check if a value is a valid non-JSON body type
 * @param {*} body - Body to check
 * @returns {boolean} True if body is FormData, Blob, ArrayBuffer, etc.
 */
function isNonJsonBody(body) {
    return (
        body instanceof FormData ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof URLSearchParams ||
        typeof body === 'string'
    );
}

/**
 * Build query string from object
 * @param {Object} params - Query parameters
 * @returns {string} Query string (without leading ?)
 */
function buildQueryString(params) {
    if (!params || typeof params !== 'object') {
        return '';
    }

    const searchParams = new URLSearchParams();

    Object.keys(params).forEach(key => {
        const value = params[key];

        // Skip undefined and null values
        if (value === undefined || value === null) {
            return;
        }

        // Handle arrays
        if (Array.isArray(value)) {
            value.forEach(item => {
                if (item !== undefined && item !== null) {
                    searchParams.append(key, String(item));
                }
            });
        } else {
            searchParams.append(key, String(value));
        }
    });

    return searchParams.toString();
}

/**
 * Make an HTTP request to the API
 *
 * @param {Object} config - Request configuration
 * @param {string} config.url - API endpoint URL
 * @param {string} [config.method='GET'] - HTTP method
 * @param {Object|FormData|string} [config.body] - Request body (for POST/PUT/PATCH) or query params (for GET/DELETE)
 * @param {Object} [config.params] - Query parameters (alternative to body for GET requests)
 * @param {Object} [config.headers] - Additional headers
 * @param {boolean} [config.includeAuth=true] - Include authentication token
 * @param {Object} [config.options] - Additional fetch options
 *
 * @returns {Promise<Object>} API response with structure:
 *   {
 *     success: boolean,
 *     status: number,
 *     message: string,
 *     data?: any
 *   }
 *
 * @example
 * // GET request with query params
 * const response = await apiRequest({
 *     url: '/api/v1/users',
 *     method: 'GET',
 *     params: { page: 1, limit: 10 }
 * });
 *
 * @example
 * // GET request with body converted to query params
 * const response = await apiRequest({
 *     url: '/api/v1/users',
 *     method: 'GET',
 *     body: { search: 'john', status: 'active' }
 * });
 *
 * @example
 * // POST request with body
 * const response = await apiRequest({
 *     url: '/api/v1/users',
 *     method: 'POST',
 *     body: { name: 'John', email: 'john@example.com' }
 * });
 *
 * @example
 * // Handle response
 * if (response.success) {
 *     console.log(response.data);
 * } else {
 *     console.error(response.message);
 * }
 */
export async function apiRequest(config) {
    const {
        url,
        method = 'GET',
        body = null,
        params = null,
        headers = {},
        includeAuth = true,
        options = {},
    } = config;
    try {
        const upperMethod = method.toUpperCase();

        // Prepare headers
        const requestHeaders = { ...headers };

        // Automatically add authentication token from cookies
        if (includeAuth) {
            const authToken = getCookie('auth_token');
            if (authToken) {
                requestHeaders['Authorization'] = `Bearer ${authToken}`;
            }
        }

        // Build final URL with query parameters
        let finalUrl = url;

        // For GET, HEAD, DELETE methods, convert body/params to query string
        if (['GET', 'HEAD', 'DELETE'].includes(upperMethod)) {
            const queryParams = params || body;

            if (queryParams && typeof queryParams === 'object' && !isNonJsonBody(queryParams)) {
                const queryString = buildQueryString(queryParams);
                if (queryString) {
                    const separator = url.includes('?') ? '&' : '?';
                    finalUrl = `${url}${separator}${queryString}`;
                }
            }
        }

        // Prepare request body for POST, PUT, PATCH, etc.
        let requestBody = null;
        let shouldStringify = false;

        if (!['GET', 'HEAD'].includes(upperMethod)) {
            if (body !== null && body !== undefined) {
                // Check if body needs JSON serialization
                if (!isNonJsonBody(body)) {
                    shouldStringify = true;
                    requestHeaders['Content-Type'] = 'application/json';
                    requestBody = body;
                } else {
                    requestBody = body;
                }
            }
        }

        // Build fetch options
        const fetchOptions = {
            method: upperMethod,
            headers: requestHeaders,
            credentials: 'same-origin', // Include cookies
            ...options,
        };

        // Add body if present
        if (requestBody !== null && requestBody !== undefined) {
            fetchOptions.body = shouldStringify ? JSON.stringify(requestBody) : requestBody;
        }

        // Make the request
        const response = await fetch(finalUrl, fetchOptions);

        // Parse response
        let responseData = null;
        const contentType = response.headers.get('content-type');

        // Only attempt to parse JSON if content-type indicates JSON
        if (contentType && contentType.includes('application/json')) {
            try {
                responseData = await response.json();
            } catch (parseError) {
                // JSON parse failed - treat as empty response
                responseData = null;
            }
        }

        // If we got a structured API response, return it directly
        if (responseData && typeof responseData === 'object' && 'success' in responseData) {
            return responseData;
        }

        // Otherwise, construct a response based on HTTP status
        if (response.ok) {
            return {
                success: true,
                status: response.status,
                message: responseData?.message || 'Request successful',
                data: responseData,
            };
        } else {
            // HTTP error - construct error response
            return {
                success: false,
                status: response.status,
                message: responseData?.message || getDefaultErrorMessage(response.status),
            };
        }

    } catch (error) {
        // Network error or other unexpected error
        console.error('API Request Error:', error);

        // Return a consistent error response
        return {
            success: false,
            status: 0,
            message: 'Unable to connect to the server. Please check your internet connection and try again.',
        };
    }
}

/**
 * Get default error message for HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} Error message
 */
function getDefaultErrorMessage(status) {
    const messages = {
        400: 'Bad request',
        401: 'Unauthorized. Please log in.',
        403: 'Forbidden. You do not have permission to access this resource.',
        404: 'Resource not found',
        409: 'Conflict. The resource already exists.',
        422: 'Validation error',
        429: 'Too many requests. Please try again later.',
        500: 'Internal server error',
        502: 'Bad gateway',
        503: 'Service unavailable',
        504: 'Gateway timeout',
    };

    return messages[status] || `Request failed with status ${status}`;
}

/**
 * Convenience method for GET requests
 * @param {string} url - API endpoint URL
 * @param {Object} params - Query parameters
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} API response
 *
 * @example
 * const users = await get('/api/v1/users', { page: 1, limit: 10 });
 */
export async function get(url, params = null, options = {}) {
    return apiRequest({ url, method: 'GET', params, ...options });
}

/**
 * Convenience method for POST requests
 * @param {string} url - API endpoint URL
 * @param {Object} body - Request body
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} API response
 */
export async function post(url, body, options = {}) {
    return apiRequest({ url, method: 'POST', body, ...options });
}

/**
 * Convenience method for PUT requests
 * @param {string} url - API endpoint URL
 * @param {Object} body - Request body
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} API response
 */
export async function put(url, body, options = {}) {
    return apiRequest({ url, method: 'PUT', body, ...options });
}

/**
 * Convenience method for PATCH requests
 * @param {string} url - API endpoint URL
 * @param {Object} body - Request body
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} API response
 */
export async function patch(url, body, options = {}) {
    return apiRequest({ url, method: 'PATCH', body, ...options });
}

/**
 * Convenience method for DELETE requests
 * @param {string} url - API endpoint URL
 * @param {Object} params - Query parameters (optional)
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} API response
 */
export async function del(url, params = null, options = {}) {
    return apiRequest({ url, method: 'DELETE', params, ...options });
}

// Export default
export default {
    apiRequest,
    get,
    post,
    put,
    patch,
    del,
    delete: del, // Alias for delete
};
