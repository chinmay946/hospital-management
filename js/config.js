// Hospital Management System - Configuration

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: '/api',
        TIMEOUT: 10000,
        ENDPOINTS: {
            PATIENTS: '/patients',
            APPOINTMENTS: '/appointments',
            DOCTORS: '/doctors',
            BILLING: '/billing',
            INVOICES: '/invoices',
            REPORTS: '/reports',
            DEPARTMENTS: '/departments',
            USERS: '/users'
        }
    },

    // Application Settings
    APP: {
        NAME: 'HospitalCare Management System',
        VERSION: '1.0.0',
        THEME: 'light', // 'light' or 'dark'
        LANGUAGE: 'en', // 'en', 'es', 'fr', 'de'
        TIMEZONE: 'UTC'
    },

    // Feature Flags
    FEATURES: {
        ENABLE_NOTIFICATIONS: true,
        ENABLE_REAL_TIME_UPDATES: false,
        ENABLE_DARK_MODE: true,
        ENABLE_EXPORT: true,
        ENABLE_PRINT: true,
        ENABLE_ADVANCED_ANALYTICS: false
    },

    // Dashboard Settings
    DASHBOARD: {
        REFRESH_INTERVAL: 300000, // 5 minutes
        STATS_TO_SHOW: ['patients', 'appointments', 'doctors', 'revenue'],
        SHOW_BED_AVAILABILITY: true,
        SHOW_RECENT_ACTIVITIES: true
    },

    // Pagination
    PAGINATION: {
        PAGE_SIZE: 10,
        MAX_RESULTS: 1000
    },

    // Time Formats
    FORMATS: {
        DATE: 'YYYY-MM-DD',
        TIME: 'HH:mm',
        DATETIME: 'YYYY-MM-DD HH:mm',
        CURRENCY: 'USD'
    },

    // Roles and Permissions
    ROLES: {
        ADMIN: 'admin',
        DOCTOR: 'doctor',
        NURSE: 'nurse',
        RECEPTIONIST: 'receptionist',
        PATIENT: 'patient'
    },

    // Status Values
    STATUS: {
        APPOINTMENT: {
            SCHEDULED: 'scheduled',
            CONFIRMED: 'confirmed',
            PENDING: 'pending',
            COMPLETED: 'completed',
            CANCELLED: 'cancelled',
            NO_SHOW: 'no_show'
        },
        PATIENT: {
            ACTIVE: 'active',
            DISCHARGED: 'discharged',
            ADMITTED: 'admitted',
            TRANSFERRED: 'transferred'
        },
        INVOICE: {
            PAID: 'paid',
            PENDING: 'pending',
            OVERDUE: 'overdue',
            CANCELLED: 'cancelled'
        }
    },

    // Department List
    DEPARTMENTS: [
        { id: 1, name: 'Cardiology', icon: '❤️' },
        { id: 2, name: 'Neurology', icon: '🧠' },
        { id: 3, name: 'Orthopedics', icon: '🦴' },
        { id: 4, name: 'General Medicine', icon: '👨‍⚕️' },
        { id: 5, name: 'Pediatrics', icon: '👶' },
        { id: 6, name: 'Psychiatry', icon: '🧠' },
        { id: 7, name: 'Surgery', icon: '🔪' },
        { id: 8, name: 'Emergency', icon: '🚑' }
    ],

    // Default Mock Data Settings
    MOCK_DATA: {
        ENABLED: true,
        TOTAL_PATIENTS: 1248,
        TOTAL_DOCTORS: 45,
        TOTAL_APPOINTMENTS_TODAY: 23,
        MONTHLY_REVENUE: 125000
    },

    // Email Configuration (for notifications)
    EMAIL: {
        ENABLED: false,
        FROM: 'noreply@hospitalcare.com',
        SMTP_SERVER: 'smtp.gmail.com',
        SMTP_PORT: 587
    },

    // Notification Settings
    NOTIFICATIONS: {
        POSITION: 'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        DURATION: 3000, // milliseconds
        MAX_STACK: 5 // Maximum notifications to show at once
    },

    // Logging
    LOGGING: {
        ENABLED: true,
        LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SEND_TO_SERVER: false
    },

    // Validation Rules
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        PHONE_PATTERN: /^[0-9\-\+\(\)\s]+$/,
        EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        MIN_PATIENT_AGE: 0,
        MAX_PATIENT_AGE: 150,
        MIN_DOCTOR_EXPERIENCE: 0
    },

    // Cache Settings
    CACHE: {
        ENABLED: true,
        DURATION: 3600000, // 1 hour
        CLEAR_ON_UPDATE: true
    },

    // Security
    SECURITY: {
        REQUIRE_AUTHENTICATION: true,
        SESSION_TIMEOUT: 1800000, // 30 minutes
        ALLOW_REMEMBER_ME: true,
        ENABLE_2FA: false
    }
};

// Utility Functions

/**
 * Get configuration value
 * @param {string} path - Configuration path (e.g., 'API.BASE_URL')
 * @param {*} defaultValue - Default value if not found
 */
function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

/**
 * Set configuration value
 * @param {string} path - Configuration path
 * @param {*} value - New value
 */
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let obj = CONFIG;
    
    for (const key of keys) {
        if (!(key in obj)) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    
    obj[lastKey] = value;
}

/**
 * Build API URL
 * @param {string} endpoint - Endpoint name
 * @param {object} params - Query parameters
 */
function getApiUrl(endpoint, params = {}) {
    const baseUrl = getConfig('API.BASE_URL');
    let url = baseUrl + endpoint;
    
    if (Object.keys(params).length > 0) {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        url += '?' + queryString;
    }
    
    return url;
}

/**
 * Make API request
 * @param {string} endpoint - Endpoint path
 * @param {object} options - Request options
 */
async function apiCall(endpoint, options = {}) {
    const {
        method = 'GET',
        data = null,
        headers = {},
        timeout = getConfig('API.TIMEOUT')
    } = options;

    const url = getApiUrl(endpoint, method === 'GET' ? data : {});
    
    const fetchOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (method !== 'GET' && data) {
        fetchOptions.body = JSON.stringify(data);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string
 */
function formatDate(date, format = getConfig('FORMATS.DATE')) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 */
function formatCurrency(amount, currency = getConfig('FORMATS.CURRENCY')) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Validate email
 * @param {string} email - Email to validate
 */
function isValidEmail(email) {
    const pattern = getConfig('VALIDATION.EMAIL_PATTERN');
    return pattern.test(email);
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 */
function isValidPhone(phone) {
    const pattern = getConfig('VALIDATION.PHONE_PATTERN');
    return pattern.test(phone);
}

/**
 * Check user role permission
 * @param {string} userRole - User role
 * @param {string} requiredRole - Required role
 */
function hasPermission(userRole, requiredRole) {
    const roles = getConfig('ROLES');
    const userRoleValue = Object.values(roles).indexOf(userRole);
    const requiredRoleValue = Object.values(roles).indexOf(requiredRole);
    
    // Admin has access to everything
    if (userRole === roles.ADMIN) {
        return true;
    }
    
    return userRoleValue <= requiredRoleValue;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        getConfig,
        setConfig,
        getApiUrl,
        apiCall,
        formatDate,
        formatCurrency,
        isValidEmail,
        isValidPhone,
        hasPermission
    };
}
