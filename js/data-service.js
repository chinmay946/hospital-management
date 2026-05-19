// Data Service - Hospital Management System
// Manages mock data and backend data operations

const ApiClient = {
    baseUrl: CONFIG && CONFIG.API && CONFIG.API.BASE_URL ? CONFIG.API.BASE_URL : '/api',

    buildQuery(params = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.append(key, value);
            }
        });
        return query.toString() ? `?${query.toString()}` : '';
    },

    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = Object.assign({ 'Accept': 'application/json' }, options.headers || {});

        if (options.body && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, Object.assign({}, options, { headers, credentials: 'same-origin' }));
        const payload = await response.text().then(text => {
            try {
                return text ? JSON.parse(text) : null;
            } catch (error) {
                return text;
            }
        });

        if (!response.ok) {
            const error = new Error(payload && payload.error ? payload.error : response.statusText);
            error.status = response.status;
            error.payload = payload;
            throw error;
        }

        return payload;
    },

    get(path, params = {}) {
        const query = this.buildQuery(params);
        return this.request(`${path}${query}`, { method: 'GET' });
    },

    post(path, body) {
        return this.request(path, { method: 'POST', body: JSON.stringify(body) });
    },

    put(path, body) {
        return this.request(path, { method: 'PUT', body: JSON.stringify(body) });
    },

    delete(path) {
        return this.request(path, { method: 'DELETE' });
    }
};

const DataService = {
    // Mock Patients Data
    patients: [
        {
            id: 'P001',
            firstName: 'John',
            lastName: 'Doe',
            age: 45,
            email: 'john.doe@email.com',
            phone: '555-0101',
            department: 'Cardiology',
            status: 'Active',
            admissionDate: '2024-05-10',
            condition: 'Stable',
            bloodType: 'O+',
            allergies: 'Penicillin'
        },
        {
            id: 'P002',
            firstName: 'Jane',
            lastName: 'Smith',
            age: 38,
            email: 'jane.smith@email.com',
            phone: '555-0102',
            department: 'Neurology',
            status: 'Active',
            admissionDate: '2024-05-12',
            condition: 'Improving',
            bloodType: 'A+',
            allergies: 'None'
        },
        {
            id: 'P003',
            firstName: 'Mike',
            lastName: 'Wilson',
            age: 52,
            email: 'mike.wilson@email.com',
            phone: '555-0103',
            department: 'Orthopedics',
            status: 'Discharged',
            admissionDate: '2024-04-28',
            condition: 'Recovered',
            bloodType: 'B+',
            allergies: 'Aspirin'
        }
    ],

    // Mock Doctors Data
    doctors: [
        {
            id: 'D001',
            firstName: 'Smith',
            lastName: '',
            title: 'Dr.',
            email: 'smith@hospital.com',
            phone: '555-1001',
            department: 'Cardiology',
            license: '#LIC12345',
            experience: 12,
            rating: 4.8,
            status: 'active',
            specialization: 'Heart Diseases',
            image: 'img/doc1.png'
        },
        {
            id: 'D002',
            firstName: 'Sarah',
            lastName: 'Johnson',
            title: 'Dr.',
            email: 'sarah.johnson@hospital.com',
            phone: '555-0102',
            department: 'Neurology',
            license: 'MED-987654',
            experience: 12,
            rating: 4.9,
            status: 'Active',
            specialization: 'Neurologist',
            image: 'img/doc2.png'
        },
        {
            id: 'D003',
            firstName: 'Brown',
            lastName: '',
            title: 'Dr.',
            email: 'brown@hospital.com',
            phone: '555-1003',
            department: 'Orthopedics',
            license: '#LIC12347',
            experience: 15,
            rating: 5,
            status: 'active',
            specialization: 'Sports Medicine'
        }
    ],

    // Mock Appointments Data
    appointments: [
        {
            id: 'A001',
            patientId: 'P001',
            patientName: 'John Doe',
            doctorId: 'D001',
            doctorName: 'Dr. Smith',
            department: 'Cardiology',
            date: '2024-05-18',
            time: '10:30',
            duration: 30,
            status: 'confirmed',
            notes: 'Regular checkup'
        },
        {
            id: 'A002',
            patientId: 'P002',
            patientName: 'Jane Smith',
            doctorId: 'D002',
            doctorName: 'Dr. Johnson',
            department: 'Neurology',
            date: '2024-05-18',
            time: '11:00',
            duration: 45,
            status: 'pending',
            notes: 'Follow-up consultation'
        }
    ],

    // Mock Invoices Data
    invoices: [
        {
            id: 'INV001',
            patientId: 'P001',
            patientName: 'John Doe',
            amount: 2500,
            date: '2024-05-10',
            dueDate: '2024-05-25',
            status: 'paid',
            items: [
                { description: 'Consultation', amount: 500 },
                { description: 'ECG Test', amount: 800 },
                { description: 'Medications', amount: 1200 }
            ]
        },
        {
            id: 'INV002',
            patientId: 'P002',
            patientName: 'Jane Smith',
            amount: 3800,
            date: '2024-05-12',
            dueDate: '2024-05-27',
            status: 'pending',
            items: [
                { description: 'Consultation', amount: 500 },
                { description: 'MRI Scan', amount: 2800 },
                { description: 'Consultation Follow-up', amount: 500 }
            ]
        }
    ],

    // Mock Reports Data
    reports: {
        patientStats: {
            newPatients: 156,
            totalAdmissions: 423,
            discharged: 389,
            currentPatients: 234
        },
        revenue: {
            total: 125000,
            paid: 98500,
            pending: 26500,
            overdue: 8000
        },
        appointments: {
            total: 892,
            completed: 856,
            cancelled: 36,
            noShow: 10
        },
        staff: {
            totalDoctors: 45,
            onDuty: 12,
            averageRating: 4.7,
            avgAppointments: 19.8
        }
    },

    async fetchPatients(params = {}) {
        try {
            const payload = await ApiClient.get(CONFIG.API.ENDPOINTS.PATIENTS, Object.assign({ limit: CONFIG.PAGINATION.MAX_RESULTS }, params));
            const items = Array.isArray(payload) ? payload : payload.data || [];
            if (Array.isArray(items)) {
                this.patients = items;
            }
            return this.patients;
        } catch (error) {
            console.warn('Unable to fetch patients from API, using local dataset.', error);
            return this.getAllPatients();
        }
    },

    async fetchDoctors(params = {}) {
        try {
            const payload = await ApiClient.get(CONFIG.API.ENDPOINTS.DOCTORS, Object.assign({ limit: CONFIG.PAGINATION.MAX_RESULTS }, params));
            const items = Array.isArray(payload) ? payload : payload.data || [];
            if (Array.isArray(items)) {
                this.doctors = items;
            }
            return this.doctors;
        } catch (error) {
            console.warn('Unable to fetch doctors from API, using local dataset.', error);
            return this.getAllDoctors();
        }
    },

    async fetchAppointments(params = {}) {
        try {
            const payload = await ApiClient.get(CONFIG.API.ENDPOINTS.APPOINTMENTS, Object.assign({ limit: CONFIG.PAGINATION.MAX_RESULTS }, params));
            const items = Array.isArray(payload) ? payload : payload.data || [];
            if (Array.isArray(items)) {
                this.appointments = items;
            }
            return this.appointments;
        } catch (error) {
            console.warn('Unable to fetch appointments from API, using local dataset.', error);
            return this.getAllAppointments();
        }
    },

    async fetchInvoices(params = {}) {
        try {
            const payload = await ApiClient.get(CONFIG.API.ENDPOINTS.INVOICES, Object.assign({ limit: CONFIG.PAGINATION.MAX_RESULTS }, params));
            const items = Array.isArray(payload) ? payload : payload.data || [];
            if (Array.isArray(items)) {
                this.invoices = items;
            }
            return this.invoices;
        } catch (error) {
            console.warn('Unable to fetch invoices from API, using local dataset.', error);
            return this.getAllInvoices();
        }
    },

    async fetchStatistics() {
        try {
            const payload = await ApiClient.get('/reports/statistics');
            return payload || this.getStatistics();
        } catch (error) {
            console.warn('Unable to fetch statistics from API, using local summary.', error);
            return this.getStatistics();
        }
    },

    async addPatient(patientData) {
        try {
            const newPatient = await ApiClient.post(CONFIG.API.ENDPOINTS.PATIENTS, patientData);
            if (newPatient && newPatient.id) {
                this.patients.unshift(newPatient);
            }
            return newPatient;
        } catch (error) {
            console.warn('Unable to save patient to API, adding locally.', error);
            return this.addPatientLocal(patientData);
        }
    },

    addPatientLocal(patientData) {
        const newId = 'P' + String(this.patients.length + 1).padStart(3, '0');
        const newPatient = {
            id: newId,
            ...patientData,
            status: patientData.status || 'Active',
            admissionDate: new Date().toISOString().split('T')[0]
        };
        this.patients.unshift(newPatient);
        return newPatient;
    },

    // Get all patients
    getAllPatients() {
        return this.patients;
    },

    // Get patient by ID
    getPatientById(id) {
        return this.patients.find(p => p.id === id);
    },

    // Update patient
    async updatePatient(id, updates) {
        try {
            const updatedPatient = await ApiClient.put(`${CONFIG.API.ENDPOINTS.PATIENTS}/${id}`, updates);
            const patient = this.getPatientById(id);
            if (patient) {
                Object.assign(patient, updatedPatient);
            }
            return updatedPatient;
        } catch (error) {
            console.warn('Unable to update patient through API, updating locally.', error);
            const patient = this.getPatientById(id);
            if (patient) {
                return Object.assign(patient, updates);
            }
            return null;
        }
    },

    async deletePatient(id) {
        try {
            await ApiClient.delete(`${CONFIG.API.ENDPOINTS.PATIENTS}/${id}`);
            return this.deletePatientLocal(id);
        } catch (error) {
            console.warn('Unable to delete patient from API, removing locally.', error);
            return this.deletePatientLocal(id);
        }
    },

    deletePatientLocal(id) {
        const index = this.patients.findIndex(p => p.id === id);
        if (index > -1) {
            return this.patients.splice(index, 1)[0];
        }
        return null;
    },

    // Search patients
    searchPatients(query) {
        const lowerQuery = query.toLowerCase();
        return this.patients.filter(p => 
            p.firstName.toLowerCase().includes(lowerQuery) ||
            p.lastName.toLowerCase().includes(lowerQuery) ||
            p.email.toLowerCase().includes(lowerQuery) ||
            p.id.toLowerCase().includes(lowerQuery)
        );
    },

    // Get all doctors
    getAllDoctors() {
        return this.doctors;
    },

    // Get doctor by ID
    getDoctorById(id) {
        return this.doctors.find(d => d.id === id);
    },

    async addDoctor(doctorData) {
        try {
            const newDoctor = await ApiClient.post(CONFIG.API.ENDPOINTS.DOCTORS, doctorData);
            if (newDoctor && newDoctor.id) {
                this.doctors.unshift(newDoctor);
            }
            return newDoctor;
        } catch (error) {
            console.warn('Unable to save doctor to API, adding locally.', error);
            return this.addDoctorLocal(doctorData);
        }
    },

    addDoctorLocal(doctorData) {
        const newId = 'D' + String(this.doctors.length + 1).padStart(3, '0');
        const newDoctor = {
            id: newId,
            ...doctorData,
            status: 'active',
            rating: doctorData.rating || 4
        };
        this.doctors.unshift(newDoctor);
        return newDoctor;
    },

    async updateDoctor(id, updates) {
        try {
            const updatedDoctor = await ApiClient.put(`${CONFIG.API.ENDPOINTS.DOCTORS}/${id}`, updates);
            const doctor = this.getDoctorById(id);
            if (doctor) {
                Object.assign(doctor, updatedDoctor);
            }
            return updatedDoctor;
        } catch (error) {
            console.warn('Unable to update doctor through API, updating locally.', error);
            const doctor = this.getDoctorById(id);
            if (doctor) {
                return Object.assign(doctor, updates);
            }
            return null;
        }
    },

    // Get all appointments
    getAllAppointments() {
        return this.appointments;
    },

    // Get appointments by patient ID
    getAppointmentsByPatient(patientId) {
        return this.appointments.filter(a => a.patientId === patientId);
    },

    // Get appointments by doctor ID
    getAppointmentsByDoctor(doctorId) {
        return this.appointments.filter(a => a.doctorId === doctorId);
    },

    async addAppointment(appointmentData) {
        try {
            const newAppointment = await ApiClient.post(CONFIG.API.ENDPOINTS.APPOINTMENTS, appointmentData);
            if (newAppointment && newAppointment.id) {
                this.appointments.unshift(newAppointment);
            }
            return newAppointment;
        } catch (error) {
            console.warn('Unable to save appointment to API, adding locally.', error);
            return this.addAppointmentLocal(appointmentData);
        }
    },

    addAppointmentLocal(appointmentData) {
        const newId = 'A' + String(this.appointments.length + 1).padStart(3, '0');
        const newAppointment = {
            id: newId,
            ...appointmentData,
            status: appointmentData.status || 'scheduled'
        };
        this.appointments.unshift(newAppointment);
        return newAppointment;
    },

    // Update appointment
    updateAppointment(id, updates) {
        const appointment = this.appointments.find(a => a.id === id);
        if (appointment) {
            Object.assign(appointment, updates);
            return appointment;
        }
        return null;
    },

    // Cancel appointment
    cancelAppointment(id) {
        return this.updateAppointment(id, { status: 'cancelled' });
    },

    // Get all invoices
    getAllInvoices() {
        return this.invoices;
    },

    // Get invoice by ID
    getInvoiceById(id) {
        return this.invoices.find(i => i.id === id);
    },

    // Get invoices by patient ID
    getInvoicesByPatient(patientId) {
        return this.invoices.filter(i => i.patientId === patientId);
    },

    async createInvoice(invoiceData) {
        try {
            const newInvoice = await ApiClient.post(CONFIG.API.ENDPOINTS.INVOICES, invoiceData);
            if (newInvoice && newInvoice.id) {
                this.invoices.unshift(newInvoice);
            }
            return newInvoice;
        } catch (error) {
            console.warn('Unable to save invoice to API, adding locally.', error);
            return this.createInvoiceLocal(invoiceData);
        }
    },

    createInvoiceLocal(invoiceData) {
        const newId = 'INV' + String(this.invoices.length + 1).padStart(3, '0');
        const newInvoice = {
            id: newId,
            ...invoiceData,
            status: invoiceData.status || 'pending',
            date: new Date().toISOString().split('T')[0]
        };
        this.invoices.unshift(newInvoice);
        return newInvoice;
    },

    // Update invoice status
    updateInvoiceStatus(id, status) {
        const invoice = this.getInvoiceById(id);
        if (invoice) {
            invoice.status = status;
            return invoice;
        }
        return null;
    },

    // Get statistics
    getStatistics() {
        return {
            totalPatients: this.patients.length,
            activePatients: this.patients.filter(p => p.status === 'Active').length,
            totalDoctors: this.doctors.length,
            totalAppointments: this.appointments.length,
            totalInvoices: this.invoices.length,
            totalRevenue: this.invoices.reduce((sum, i) => sum + i.amount, 0),
            paidInvoices: this.invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
            pendingInvoices: this.invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0)
        };
    },

    // Get today's appointments
    getTodayAppointments() {
        const today = new Date().toISOString().split('T')[0];
        return this.appointments.filter(a => a.date === today);
    },

    // Get overdue invoices
    getOverdueInvoices() {
        const today = new Date().toISOString().split('T')[0];
        return this.invoices.filter(i => i.status === 'pending' && i.dueDate < today);
    },

    // Export data to CSV
    exportToCSV(data, filename = 'export.csv') {
        let csv = '';
        
        if (Array.isArray(data) && data.length > 0) {
            // Add headers
            csv = Object.keys(data[0]).join(',') + '\n';
            
            // Add rows
            data.forEach(row => {
                csv += Object.values(row)
                    .map(val => typeof val === 'string' && val.includes(',') ? `"${val}"` : val)
                    .join(',') + '\n';
            });
        }

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },

    // Generate mock data report
    generateReport() {
        return this.reports;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}
