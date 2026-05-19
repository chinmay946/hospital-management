// API Integration Examples - Hospital Management System
// This file shows how to connect the frontend to a backend API

/**
 * EXAMPLE 1: Fetch all patients from API
 * Replaces mock data with real API data
 */
async function loadPatientsFromAPI() {
    try {
        const response = await fetch('/api/patients');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const patients = await response.json();
        DataService.patients = patients;
        console.log('Patients loaded from API:', patients);
        return patients;
    } catch (error) {
        console.error('Error loading patients:', error);
        // Fall back to mock data if API fails
        return DataService.getAllPatients();
    }
}

/**
 * EXAMPLE 2: Add new patient to API
 */
async function addPatientToAPI(patientData) {
    try {
        const response = await fetch('/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}` // If using authentication
            },
            body: JSON.stringify(patientData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newPatient = await response.json();
        console.log('Patient added:', newPatient);
        return newPatient;
    } catch (error) {
        console.error('Error adding patient:', error);
        throw error;
    }
}

/**
 * EXAMPLE 3: Get patient details from API
 */
async function getPatientFromAPI(patientId) {
    try {
        const response = await fetch(`/api/patients/${patientId}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const patient = await response.json();
        return patient;
    } catch (error) {
        console.error('Error fetching patient:', error);
        return null;
    }
}

/**
 * EXAMPLE 4: Update patient information
 */
async function updatePatientAPI(patientId, updateData) {
    try {
        const response = await fetch(`/api/patients/${patientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(updateData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedPatient = await response.json();
        return updatedPatient;
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
    }
}

/**
 * EXAMPLE 5: Delete patient
 */
async function deletePatientAPI(patientId) {
    try {
        const response = await fetch(`/api/patients/${patientId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting patient:', error);
        throw error;
    }
}

/**
 * EXAMPLE 6: Fetch appointments from API
 */
async function loadAppointmentsFromAPI(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/appointments?${params}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const appointments = await response.json();
        DataService.appointments = appointments;
        return appointments;
    } catch (error) {
        console.error('Error loading appointments:', error);
        return DataService.getAllAppointments();
    }
}

/**
 * EXAMPLE 7: Schedule new appointment
 */
async function scheduleAppointmentAPI(appointmentData) {
    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newAppointment = await response.json();
        return newAppointment;
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        throw error;
    }
}

/**
 * EXAMPLE 8: Load invoices with filters
 */
async function loadInvoicesFromAPI(filters = {}) {
    try {
        const params = new URLSearchParams({
            status: filters.status || '',
            patientId: filters.patientId || '',
            startDate: filters.startDate || '',
            endDate: filters.endDate || ''
        });

        const response = await fetch(`/api/invoices?${params}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const invoices = await response.json();
        return invoices;
    } catch (error) {
        console.error('Error loading invoices:', error);
        return [];
    }
}

/**
 * EXAMPLE 9: Fetch doctors from API
 */
async function loadDoctorsFromAPI(departmentFilter = null) {
    try {
        const url = departmentFilter 
            ? `/api/doctors?department=${departmentFilter}`
            : '/api/doctors';

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const doctors = await response.json();
        DataService.doctors = doctors;
        return doctors;
    } catch (error) {
        console.error('Error loading doctors:', error);
        return DataService.getAllDoctors();
    }
}

/**
 * EXAMPLE 10: Generate report from API
 */
async function generateReportFromAPI(reportType, dateRange) {
    try {
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({
                type: reportType,
                startDate: dateRange.start,
                endDate: dateRange.end
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const report = await response.json();
        return report;
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
}

/**
 * EXAMPLE 11: Authentication - Login
 */
async function loginAPI(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`Login failed! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Store auth token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

/**
 * EXAMPLE 12: Get authentication token
 */
function getAuthToken() {
    return localStorage.getItem('authToken') || '';
}

/**
 * EXAMPLE 13: Logout
 */
function logoutAPI() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login page
    window.location.href = '/login.html';
}

/**
 * EXAMPLE 14: Generic API request with retry
 */
async function apiRequestWithRetry(url, options = {}, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${attempt} failed:`, error);
            
            if (attempt < maxRetries) {
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => 
                    setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
                );
            }
        }
    }
    
    throw lastError;
}

/**
 * EXAMPLE 15: Handle API errors globally
 */
function handleAPIError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        // Token expired, redirect to login
        logoutAPI();
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        alert('You do not have permission to perform this action');
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
        alert('The requested resource was not found');
    } else if (error.message.includes('500') || error.message.includes('Server Error')) {
        alert('A server error occurred. Please try again later');
    } else {
        alert('An error occurred: ' + error.message);
    }
}

/**
 * Integration Steps:
 * 
 * 1. Replace mock data calls with API calls:
 *    OLD: const patients = DataService.getAllPatients();
 *    NEW: const patients = await loadPatientsFromAPI();
 * 
 * 2. Set up authentication:
 *    - Implement login page
 *    - Store JWT token in localStorage
 *    - Add token to all API requests
 * 
 * 3. Handle responses:
 *    - Check status codes
 *    - Handle errors gracefully
 *    - Refresh token if expired
 * 
 * 4. Update UI:
 *    - Show loading indicators
 *    - Display error messages
 *    - Refresh data after changes
 * 
 * 5. Test thoroughly:
 *    - Test with actual API
 *    - Test error scenarios
 *    - Test on different network conditions
 */

// Backend API Endpoints Summary
/*
Authentication:
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user
- POST /api/auth/refresh - Refresh token
- GET /api/auth/me - Get current user

Patients:
- GET /api/patients - Get all patients
- POST /api/patients - Create patient
- GET /api/patients/:id - Get patient details
- PUT /api/patients/:id - Update patient
- DELETE /api/patients/:id - Delete patient
- GET /api/patients/:id/appointments - Get patient appointments
- GET /api/patients/:id/invoices - Get patient invoices

Appointments:
- GET /api/appointments - Get all appointments
- POST /api/appointments - Create appointment
- GET /api/appointments/:id - Get appointment details
- PUT /api/appointments/:id - Update appointment
- DELETE /api/appointments/:id - Cancel appointment

Doctors:
- GET /api/doctors - Get all doctors
- POST /api/doctors - Add doctor
- GET /api/doctors/:id - Get doctor details
- PUT /api/doctors/:id - Update doctor
- GET /api/doctors/department/:dept - Get doctors by department

Billing:
- GET /api/invoices - Get all invoices
- POST /api/invoices - Create invoice
- GET /api/invoices/:id - Get invoice details
- PUT /api/invoices/:id - Update invoice
- PUT /api/invoices/:id/payment - Record payment

Reports:
- GET /api/reports/statistics - Get hospital statistics
- POST /api/reports/generate - Generate custom report
- GET /api/reports/export - Export report data

Departments:
- GET /api/departments - Get all departments
- GET /api/departments/:id - Get department details

Staff:
- GET /api/staff - Get all staff
- POST /api/staff - Add staff member
- GET /api/staff/:id - Get staff details
*/
