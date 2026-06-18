// Hospital Management System - Main Application JS

class HospitalManagementApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.sidebarOpen = true;
        this.currentPatientId = null;
        this.authenticated = false;
        this.currentTheme = 'dark';
        this.init();
    }

    init() {
        this.restoreThemeState();
        this.restoreAuthState();
        this.setupLogin();
        this.setupEventListeners();
        if (this.authenticated) {
            this.loadPage('dashboard').catch(error => console.error('Unable to initialize dashboard:', error));
        }
    }

    setupLogin() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById('loginUsername').value;
                const pass = document.getElementById('loginPassword').value;
                if (user === 'admin' && pass === 'admin') {
                    const loginContainer = document.getElementById('login-container');
                    const appContainer = document.getElementById('app-container');
                    if (loginContainer) loginContainer.style.display = 'none';
                    if (appContainer) {
                        appContainer.style.display = 'flex';
                        this.authenticated = true;
                        localStorage.setItem('hmsAuthenticated', 'true');
                        this.loadPage('dashboard').catch(error => console.error('Unable to initialize dashboard:', error));
                    }
                } else {
                    alert('Invalid credentials. Please use admin / admin.');
                }
            });
        }
    }

    restoreAuthState() {
        const isLoggedIn = localStorage.getItem('hmsAuthenticated') === 'true';
        this.authenticated = isLoggedIn;
        const loginContainer = document.getElementById('login-container');
        const appContainer = document.getElementById('app-container');
        if (isLoggedIn) {
            if (loginContainer) loginContainer.style.display = 'none';
            if (appContainer) appContainer.style.display = 'flex';
        } else {
            if (loginContainer) loginContainer.style.display = 'flex';
            if (appContainer) appContainer.style.display = 'none';
        }
    }

    restoreThemeState() {
        const storedTheme = localStorage.getItem('hmsTheme');
        const theme = storedTheme || 'dark';
        this.currentTheme = theme;
        document.body.classList.toggle('light-theme', theme === 'light');
        this.updateThemeToggleLabel();
    }

    toggleTheme() {
        const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.currentTheme = nextTheme;
        localStorage.setItem('hmsTheme', nextTheme);
        document.body.classList.toggle('light-theme', nextTheme === 'light');
        this.updateThemeToggleLabel();
        this.showNotification(`${nextTheme === 'light' ? 'Light' : 'Dark'} mode enabled.`, 'success');
    }

    updateThemeToggleLabel() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        if (this.currentTheme === 'light') {
            themeToggle.textContent = 'Switch to Dark Mode';
        } else {
            themeToggle.textContent = 'Switch to Light Mode';
        }
    }

    refreshDashboard() {
        if (this.currentPage === 'dashboard') {
            this.initDashboard();
            this.showNotification('Dashboard refreshed.', 'success');
        } else {
            this.showNotification('Switch to Dashboard to refresh metrics.', 'warning');
        }
    }

    showHelpSupport() {
        this.showNotification('Need help? Contact support@hospitalcare.com or use the documentation page.', 'info');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.loadPage(page);
            });
        });

        // Menu Toggle for Mobile
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Modal Controls
        this.setupModalControls();

        // Button Actions
        this.setupButtonActions();

        // Search functionality
        this.setupSearch();
    }

    async loadPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
        }

        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'patients': 'Patient Management',
            'appointments': 'Appointments',
            'doctors': 'Doctor & Staff Management',
            'billing': 'Billing & Payments',
            'reports': 'Reports & Analytics'
        };
        document.getElementById('page-title').textContent = titles[pageName];

        this.currentPage = pageName;

        // Initialize page-specific features
        await this.initPageFeatures(pageName);
    }

    async initPageFeatures(pageName) {
        switch(pageName) {
            case 'dashboard':
                await this.initDashboard();
                break;
            case 'patients':
                await this.initPatients();
                break;
            case 'appointments':
                await this.initAppointments();
                break;
            case 'doctors':
                await this.initDoctors();
                break;
            case 'billing':
                await this.initBilling();
                break;
            case 'reports':
                await this.initReports();
                break;
        }
    }

    async initDashboard() {
        const stats = await DataService.fetchStatistics();
        this.renderDashboard(stats);
    }

    renderDashboard(stats) {
        if (!stats) {
            return;
        }

        const patientCount = stats.totalPatients ?? stats.patients?.total ?? 0;
        const appointmentCount = DataService.getTodayAppointments().length;
        const doctorCount = stats.totalDoctors ?? stats.staff?.doctors ?? 0;
        const revenue = stats.totalRevenue ?? stats.revenue?.total ?? 0;

        const patientsElement = document.getElementById('total-patients');
        const appointmentElement = document.getElementById('todays-appointments');
        const doctorsElement = document.getElementById('active-doctors');
        const revenueElement = document.getElementById('monthly-revenue');

        const patientGrowthElement = document.getElementById('patient-growth');
        const revenueGrowthElement = document.getElementById('revenue-growth');

        if (patientsElement) patientsElement.textContent = patientCount.toLocaleString();
        if (appointmentElement) appointmentElement.textContent = appointmentCount.toLocaleString();
        if (doctorsElement) doctorsElement.textContent = doctorCount.toLocaleString();
        if (revenueElement) revenueElement.textContent = `$${revenue.toLocaleString()}`;

        // Simulated dynamic percentages based on local data growth vs baseline
        const prevPatients = Math.max(1, patientCount - 5);
        const patientGrowth = Math.round(((patientCount - prevPatients) / prevPatients) * 100);
        
        const prevRevenue = Math.max(1, revenue - 5000);
        const revenueGrowth = Math.round(((revenue - prevRevenue) / prevRevenue) * 100);

        if (patientGrowthElement) {
            patientGrowthElement.textContent = `+${patientGrowth}% from last month`;
            patientGrowthElement.style.color = 'var(--secondary)';
        }
        if (revenueGrowthElement) {
            revenueGrowthElement.textContent = `+${revenueGrowth}% from last month`;
            revenueGrowthElement.style.color = 'var(--secondary)';
        }
    }

    async initPatients() {
        const page = document.getElementById('patients');
        const filterInputs = page ? page.querySelectorAll('.filters .filter-input, .filters .filter-select') : [];
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.filterPatients());
        });

        await DataService.fetchPatients();
        this.renderPatients();
    }

    renderPatients() {
        const tbody = document.querySelector('#patientsTableBody');
        if (!tbody) {
            return;
        }

        const patients = DataService.getAllPatients();
        tbody.innerHTML = patients.map(patient => {
            const status = (patient.status || 'Active').toLowerCase();
            const statusClass = status === 'active'
                ? 'success'
                : status === 'discharged'
                    ? 'info'
                    : 'warning';

            return `
                <tr data-id="${patient.id}">
                    <td>#${patient.id}</td>
                    <td>${patient.firstName} ${patient.lastName}</td>
                    <td>${patient.age || ''}</td>
                    <td>${patient.department}</td>
                    <td><span class="badge badge-${statusClass}">${patient.status}</span></td>
                    <td>${patient.admissionDate}</td>
                    <td>
                        <button class="btn-icon" title="View" data-action="view">👁️</button>
                        <button class="btn-icon" title="Edit" data-action="edit">✏️</button>
                        <button class="btn-icon" title="Delete" data-action="delete">🗑️</button>
                    </td>
                </tr>
            `;
        }).join('');

        this.bindPatientActions();
    }

    bindPatientActions() {
        const tbody = document.querySelector('#patientsTableBody');
        if (!tbody) {
            return;
        }

        tbody.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', async () => {
                const patientId = button.closest('tr')?.getAttribute('data-id');
                if (!patientId) {
                    return;
                }

                const patient = DataService.getPatientById(patientId);
                if (!patient) {
                    return;
                }

                const action = button.getAttribute('data-action');
                if (action === 'view') {
                    this.openPatientModal('view', patient);
                    return;
                }

                if (action === 'edit') {
                    this.openPatientModal('edit', patient);
                    return;
                }

                if (action === 'delete') {
                    try {
                        await DataService.deletePatient(patientId);
                        this.renderPatients();
                        this.showNotification('Patient deleted successfully.', 'success');
                    } catch (error) {
                        console.error('Unable to delete patient:', error);
                        this.showNotification('Unable to delete patient at this time.', 'error');
                    }
                }
            });
        });
    }

    filterPatients(query = '') {
        const container = document.getElementById('patients');
        if (!container) {
            return;
        }

        const searchTerm = query || (container.querySelector('.filters .filter-input')?.value || '');
        const department = container.querySelector('.filters .filter-select:nth-of-type(1)')?.value || 'All Departments';
        const status = container.querySelector('.filters .filter-select:nth-of-type(2)')?.value || 'All Status';
        const lowerTerm = searchTerm.toLowerCase();

        const rows = document.querySelectorAll('#patientsTableBody tr');
        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const matchesSearch = rowText.includes(lowerTerm);
            const matchesDepartment = department === 'All Departments' || rowText.includes(department.toLowerCase());
            const matchesStatus = status === 'All Status' || rowText.includes(status.toLowerCase());
            row.style.display = matchesSearch && matchesDepartment && matchesStatus ? '' : 'none';
        });
    }

    async initAppointments() {
        const page = document.getElementById('appointments');
        const filterInputs = page ? page.querySelectorAll('.filters input, .filters select') : [];
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.filterAppointments());
        });

        await DataService.fetchAppointments();
        this.renderAppointments();
    }

    renderAppointments() {
        const grid = document.getElementById('appointmentsGrid');
        if (!grid) {
            return;
        }

        const appointments = DataService.getAllAppointments();
        grid.innerHTML = appointments.map(appointment => {
            const status = appointment.status || 'scheduled';
            const badgeClass = status === 'confirmed' ? 'success' : status === 'pending' ? 'warning' : status === 'info';

            return `
                <div class="appointment-card" data-id="${appointment.id}">
                    <div class="appointment-header">
                        <h3>${appointment.doctorName || 'TBD'}</h3>
                        <span class="badge badge-${badgeClass}">${status}</span>
                    </div>
                    <div class="appointment-details">
                        <p><strong>Patient:</strong> ${appointment.patientName || 'Unknown'}</p>
                        <p><strong>Time:</strong> ${appointment.time || 'TBD'}</p>
                        <p><strong>Department:</strong> ${appointment.department || 'General'}</p>
                        <p><strong>Duration:</strong> ${appointment.duration || 30} mins</p>
                    </div>
                    <div class="appointment-actions">
                        <button class="btn btn-small btn-info" data-action="view">View</button>
                        <button class="btn btn-small btn-danger" data-action="cancel">Cancel</button>
                    </div>
                </div>
            `;
        }).join('');
        this.bindAppointmentActions();
    }

    bindAppointmentActions() {
        const grid = document.getElementById('appointmentsGrid');
        if (!grid) return;

        grid.querySelectorAll('button[data-action]').forEach(button => {
            button.addEventListener('click', async () => {
                const appointmentId = button.closest('.appointment-card')?.getAttribute('data-id');
                if (!appointmentId) return;

                const appointment = DataService.getAllAppointments().find(a => a.id === appointmentId);
                if (!appointment) return;

                const action = button.getAttribute('data-action');
                if (action === 'view') {
                    this.showNotification(`Appointment Info:\nPatient: ${appointment.patientName}\nDoctor: ${appointment.doctorName}\nTime: ${appointment.time}\nStatus: ${appointment.status}`, 'info');
                } else if (action === 'cancel') {
                    if (confirm(`Are you sure you want to cancel the appointment for ${appointment.patientName}?`)) {
                        try {
                            appointment.status = 'cancelled';
                            this.renderAppointments();
                            if (this.currentPage === 'dashboard') this.initDashboard();
                            this.showNotification('Appointment cancelled successfully.', 'success');
                        } catch (error) {
                            this.showNotification('Unable to cancel appointment.', 'error');
                        }
                    }
                }
            });
        });
    }

    filterAppointments(query = '') {
        const container = document.getElementById('appointments');
        if (!container) {
            return;
        }

        const dateValue = container.querySelector('.filters .filter-input')?.value || '';
        const statusValue = container.querySelector('.filters .filter-select:nth-of-type(2)')?.value || 'All Status';
        const searchTerm = query || '';
        const lowerTerm = searchTerm.toLowerCase();
        const cards = document.querySelectorAll('#appointmentsGrid .appointment-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matchesSearch = !lowerTerm || text.includes(lowerTerm);
            const matchesDate = !dateValue || text.includes(dateValue.toLowerCase());
            const matchesStatus = statusValue === 'All Status' || text.includes(statusValue.toLowerCase());
            card.style.display = matchesSearch && matchesDate && matchesStatus ? '' : 'none';
        });
    }

    async initDoctors() {
        const page = document.getElementById('doctors');
        const filterInputs = page ? page.querySelectorAll('.filters input, .filters select') : [];
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.filterDoctors());
        });

        await DataService.fetchDoctors();
        this.renderDoctors();
    }

    renderDoctors() {
        const grid = document.getElementById('doctorsGrid');
        if (!grid) {
            return;
        }

        const doctors = DataService.getAllDoctors();
        grid.innerHTML = doctors.map(doctor => {
            const statusClass = (doctor.status || 'active').toLowerCase() === 'active' ? 'active' : 'inactive';
            const avatarContent = doctor.image 
                ? `<img src="${doctor.image}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
                : `👨‍⚕️`;
            return `
                <div class="doctor-card" data-id="${doctor.id}">
                    <div class="doctor-header">
                        <div class="doctor-avatar">${avatarContent}</div>
                        <div class="doctor-status ${statusClass}"></div>
                    </div>
                    <h3>${doctor.title || 'Dr.'} ${doctor.firstName} ${doctor.lastName}</h3>
                    <p class="department">${doctor.department || 'General Medicine'}</p>
                    <div class="doctor-info">
                        <p><strong>License:</strong> ${doctor.license || 'N/A'}</p>
                        <p><strong>Experience:</strong> ${doctor.experience || 0} years</p>
                        <p><strong>Rating:</strong> ${'⭐'.repeat(doctor.rating || 4)}</p>
                    </div>
                    <div class="doctor-actions">
                        <button class="btn btn-small btn-info" data-action="view">Profile</button>
                        <button class="btn btn-small btn-primary" data-action="edit">Edit</button>
                    </div>
                </div>
            `;
        }).join('');
        this.bindDoctorActions();
    }

    filterDoctors(query = '') {
        const container = document.getElementById('doctors');
        if (!container) {
            return;
        }

        const searchTerm = query || (container.querySelector('.filters .filter-input')?.value || '');
        const department = container.querySelector('.filters .filter-select')?.value || 'All Departments';
        const lowerTerm = searchTerm.toLowerCase();
        const cards = document.querySelectorAll('#doctorsGrid .doctor-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matchesSearch = !lowerTerm || text.includes(lowerTerm);
            const matchesDepartment = department === 'All Departments' || text.includes(department.toLowerCase());
            card.style.display = matchesSearch && matchesDepartment ? '' : 'none';
        });
    }

    async initBilling() {
        const page = document.getElementById('billing');
        const filterInputs = page ? page.querySelectorAll('.filters input, .filters select') : [];
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.filterBilling());
        });

        await DataService.fetchInvoices();
        this.renderInvoices();
    }

    renderInvoices() {
        const tbody = document.getElementById('invoicesTableBody');
        if (!tbody) {
            return;
        }

        const invoices = DataService.getAllInvoices();
        tbody.innerHTML = invoices.map(invoice => {
            const status = (invoice.status || 'pending').toLowerCase();
            const badgeClass = status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'info';
            const amountText = typeof invoice.amount === 'number' ? `$${invoice.amount.toLocaleString()}` : invoice.amount;

            return `
                <tr data-id="${invoice.id}">
                    <td>#${invoice.id}</td>
                    <td>${invoice.patientName || 'Unknown'}</td>
                    <td>${amountText}</td>
                    <td>${invoice.date || ''}</td>
                    <td>${invoice.dueDate || ''}</td>
                    <td><span class="badge badge-${badgeClass}">${invoice.status}</span></td>
                    <td>
                        <button class="btn-icon" title="View" data-action="view">👁️</button>
                        <button class="btn-icon" title="Download" data-action="download">⬇️</button>
                    </td>
                </tr>
            `;
        }).join('');
        this.bindInvoiceActions();
    }

    filterBilling(query = '') {
        const container = document.getElementById('billing');
        if (!container) {
            return;
        }

        const searchTerm = query || (container.querySelector('.filters .filter-input')?.value || '');
        const status = container.querySelector('.filters .filter-select')?.value || 'All Status';
        const lowerTerm = searchTerm.toLowerCase();
        const rows = document.querySelectorAll('#invoicesTableBody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matchesSearch = !lowerTerm || text.includes(lowerTerm);
            const matchesStatus = status === 'All Status' || text.includes(status.toLowerCase());
            row.style.display = matchesSearch && matchesStatus ? '' : 'none';
        });
    }

    bindDoctorActions() {
        const grid = document.getElementById('doctorsGrid');
        if (!grid) return;
        if (grid.dataset.doctorActionsBound === 'true') return;

        grid.dataset.doctorActionsBound = 'true';
        grid.addEventListener('click', (event) => {
            const button = event.target.closest('[data-action]');
            if (!button || !grid.contains(button)) return;

            const doctorId = button.closest('.doctor-card')?.getAttribute('data-id');
            if (!doctorId) return;

            const doctor = DataService.getDoctorById(doctorId);
            if (!doctor) return;

            const action = button.getAttribute('data-action');
            if (action === 'view') {
                this.openDoctorModal('view', doctor);
            } else if (action === 'edit') {
                this.openDoctorModal('edit', doctor);
            }
        });
    }

    bindInvoiceActions() {
        const tbody = document.getElementById('invoicesTableBody');
        if (!tbody) return;

        tbody.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const invoiceId = button.closest('tr')?.getAttribute('data-id');
                if (!invoiceId) return;

                const invoice = DataService.getInvoiceById(invoiceId);
                if (!invoice) return;

                const action = button.getAttribute('data-action');
                if (action === 'view') {
                    this.openInvoiceViewModal(invoice);
                } else if (action === 'download') {
                    this.downloadInvoice(invoice);
                }
            });
        });
    }

    openInvoiceViewModal(invoice) {
        const content = document.getElementById('invoiceDetailsContent');
        if (!content) return;
        
        let itemsHtml = invoice.items && invoice.items.length > 0 
            ? invoice.items.map(item => `
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 8px 0;">
                    <span>${item.description}</span>
                    <strong>$${item.amount}</strong>
                </div>
              `).join('')
            : '<p>No specific items found.</p>';

        content.innerHTML = `
            <div style="margin-bottom: 20px;">
                <p><strong>Invoice ID:</strong> #${invoice.id}</p>
                <p><strong>Patient:</strong> ${invoice.patientName || invoice.patientId}</p>
                <p><strong>Date:</strong> ${invoice.date || 'N/A'}</p>
                <p><strong>Due Date:</strong> ${invoice.dueDate || 'N/A'}</p>
                <p><strong>Status:</strong> <span class="badge badge-${invoice.status === 'paid' ? 'success' : invoice.status === 'pending' ? 'warning' : 'info'}">${invoice.status}</span></p>
            </div>
            <h4 style="margin-top: 10px; margin-bottom: 10px; color: var(--text-main);">Items</h4>
            <div style="background: var(--bg-hover); padding: 15px; border-radius: 8px;">
                ${itemsHtml}
                <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 18px;">
                    <strong>Total</strong>
                    <strong style="color: var(--primary);">$${invoice.amount}</strong>
                </div>
            </div>
        `;
        
        this.openModal(document.getElementById('invoiceViewModal'));
    }

    downloadInvoice(invoice) {
        let csv = `Invoice ID,Patient Name,Amount,Date,Due Date,Status\n`;
        csv += `${invoice.id},"${invoice.patientName}",${invoice.amount},${invoice.date},${invoice.dueDate},${invoice.status}\n`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${invoice.id}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.showNotification(`Invoice ${invoice.id} downloaded successfully!`, 'success');
    }

    async initReports() {
        const stats = await DataService.fetchStatistics();
        this.renderReportSummary(stats);
    }

    renderReportSummary(stats) {
        if (!stats) return;

        // Patients
        const totalPatients = stats.totalPatients || 0;
        const newP = document.getElementById('report-new-patients');
        const adm = document.getElementById('report-admissions');
        const dis = document.getElementById('report-discharged');
        if (newP) newP.textContent = totalPatients;
        if (adm) adm.textContent = Math.round(totalPatients * 0.8);
        if (dis) dis.textContent = Math.round(totalPatients * 0.7);

        // Revenue
        const rev = stats.totalRevenue || 0;
        const paid = stats.paidInvoices || 0;
        const pending = stats.pendingInvoices || 0;
        const totRevE = document.getElementById('report-total-revenue');
        const paidE = document.getElementById('report-paid-invoices');
        const pendE = document.getElementById('report-pending-payment');
        if (totRevE) totRevE.textContent = '$' + rev.toLocaleString();
        if (paidE) paidE.textContent = '$' + paid.toLocaleString();
        if (pendE) pendE.textContent = '$' + pending.toLocaleString();

        // Appointments
        const totalApp = stats.totalAppointments || 0;
        const appointmentsList = DataService.getAllAppointments();
        const completed = appointmentsList.filter(a => a.status === 'completed').length;
        const cancelled = appointmentsList.filter(a => a.status === 'cancelled').length;
        const totAppE = document.getElementById('report-total-appointments');
        const compE = document.getElementById('report-appointments-completed');
        const cancE = document.getElementById('report-appointments-cancelled');
        if (totAppE) totAppE.textContent = totalApp;
        if (compE) compE.textContent = completed;
        if (cancE) cancE.textContent = cancelled;

        // Staff
        const doctors = DataService.getAllDoctors();
        const totalDocE = document.getElementById('report-total-doctors');
        const avgRatE = document.getElementById('report-average-rating');
        const avgAppE = document.getElementById('report-avg-appointments');
        
        if (totalDocE) totalDocE.textContent = doctors.length;
        if (avgRatE) {
            const avg = doctors.length > 0 ? (doctors.reduce((s, d) => s + (d.rating || 4.5), 0) / doctors.length).toFixed(1) : '0.0';
            avgRatE.textContent = `${avg}/5`;
        }
        if (avgAppE) {
            const avgA = doctors.length > 0 ? (totalApp / doctors.length).toFixed(1) : '0';
            avgAppE.textContent = `${avgA}/month`;
        }
    }

    setupModalControls() {
        const modals = Array.from(document.querySelectorAll('.modal'));
        const addPatientBtn = document.getElementById('add-patient-btn');
        const addDoctorBtn = document.getElementById('add-doctor-btn');
        const addAppointmentBtn = document.getElementById('add-appointment-btn');
        const createInvoiceBtn = document.getElementById('create-invoice-btn');
        const closeButtons = document.querySelectorAll('.modal-close, .modal-close-btn');

        if (addPatientBtn) {
            addPatientBtn.addEventListener('click', () => this.openPatientModal('add'));
        }

        if (addDoctorBtn) {
            addDoctorBtn.addEventListener('click', () => this.openDoctorModal('add'));
        }

        if (addAppointmentBtn) {
            addAppointmentBtn.addEventListener('click', () => {
                this.populateAppointmentFormOptions();
                this.openModal('appointmentModal');
            });
        }

        if (createInvoiceBtn) {
            createInvoiceBtn.addEventListener('click', () => {
                this.populateInvoiceFormOptions();
                this.openModal('invoiceModal');
            });
        }

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    this.closeModal(modal);
                }
            });
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        const patientForm = document.querySelector('#patientModal .modal-form');
        if (patientForm) {
            patientForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addPatient(patientForm);
            });
        }

        const doctorForm = document.getElementById('doctorForm');
        if (doctorForm) {
            doctorForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addDoctor(doctorForm);
            });
        }

        const appointmentForm = document.getElementById('appointmentForm');
        if (appointmentForm) {
            appointmentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addAppointment(appointmentForm);
            });
        }

        const invoiceForm = document.getElementById('invoiceForm');
        if (invoiceForm) {
            invoiceForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addInvoice(invoiceForm);
            });
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    openPatientModal(mode = 'add', patient = null) {
        const modal = document.getElementById('patientModal');
        const title = modal?.querySelector('.modal-header h2');
        const submitButton = modal?.querySelector('button[type="submit"]');
        const form = modal?.querySelector('.modal-form');

        if (!modal || !title || !submitButton || !form) {
            return;
        }

        const isViewMode = mode === 'view';
        const isEditMode = mode === 'edit';

        title.textContent = isViewMode ? 'Patient Details' : isEditMode ? 'Edit Patient' : 'Add New Patient';
        submitButton.textContent = isEditMode ? 'Save Changes' : 'Add Patient';
        submitButton.style.display = isViewMode ? 'none' : '';

        const patientIdField = form.querySelector('input[name="patientId"]');
        if (patient) {
            if (patientIdField) {
                patientIdField.value = patient.id;
            }
            const firstNameInput = form.querySelector('input[name="firstName"]');
            const lastNameInput = form.querySelector('input[name="lastName"]');
            const emailInput = form.querySelector('input[name="email"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const dobInput = form.querySelector('input[name="dob"]');
            const departmentSelect = form.querySelector('select[name="department"]');

            if (firstNameInput) firstNameInput.value = patient.firstName || '';
            if (lastNameInput) lastNameInput.value = patient.lastName || '';
            if (emailInput) emailInput.value = patient.email || '';
            if (phoneInput) phoneInput.value = patient.phone || '';
            if (dobInput) dobInput.value = patient.dob || '';
            if (departmentSelect) {
                departmentSelect.querySelectorAll('option').forEach(option => {
                    option.selected = option.textContent === patient.department;
                });
            }
        } else {
            if (patientIdField) {
                patientIdField.value = '';
            }
            form.reset();
        }

        form.querySelectorAll('input, select').forEach(control => {
            if (control.name === 'patientId') {
                return;
            }
            control.disabled = isViewMode;
        });

        this.openModal('patientModal');
    }

    openDoctorModal(mode = 'add', doctor = null) {
        const modal = document.getElementById('doctorModal');
        const title = modal?.querySelector('.modal-header h2');
        const submitButton = modal?.querySelector('button[type="submit"]');
        const form = modal?.querySelector('.modal-form');

        if (!modal || !title || !submitButton || !form) {
            return;
        }

        const isViewMode = mode === 'view';
        const isEditMode = mode === 'edit';

        title.textContent = isViewMode ? 'Doctor Details' : isEditMode ? 'Edit Doctor' : 'Add New Doctor';
        submitButton.textContent = isEditMode ? 'Save Changes' : 'Add Doctor';
        submitButton.style.display = isViewMode ? 'none' : '';

        const doctorIdField = form.querySelector('input[name="doctorId"]');
        if (doctor) {
            if (doctorIdField) doctorIdField.value = doctor.id;
            
            const firstNameInput = form.querySelector('input[name="firstName"]');
            const lastNameInput = form.querySelector('input[name="lastName"]');
            const emailInput = form.querySelector('input[name="email"]');
            const phoneInput = form.querySelector('input[name="phone"]');
            const departmentSelect = form.querySelector('select[name="department"]');
            const specInput = form.querySelector('input[name="specialization"]');
            const licenseInput = form.querySelector('input[name="license"]');
            const expInput = form.querySelector('input[name="experience"]');

            if (firstNameInput) firstNameInput.value = doctor.firstName || '';
            if (lastNameInput) lastNameInput.value = doctor.lastName || '';
            if (emailInput) emailInput.value = doctor.email || '';
            if (phoneInput) phoneInput.value = doctor.phone || '';
            if (specInput) specInput.value = doctor.specialization || '';
            if (licenseInput) licenseInput.value = doctor.license || '';
            if (expInput) expInput.value = doctor.experience || '';
            if (departmentSelect) {
                departmentSelect.querySelectorAll('option').forEach(option => {
                    option.selected = option.textContent === doctor.department;
                });
            }
        } else {
            if (doctorIdField) doctorIdField.value = '';
            form.reset();
        }

        form.querySelectorAll('input, select').forEach(control => {
            if (control.name === 'doctorId') return;
            control.disabled = isViewMode;
        });

        this.openModal('doctorModal');
    }

    populateAppointmentFormOptions() {
        const patientSelect = document.getElementById('appointmentPatientSelect');
        const doctorSelect = document.getElementById('appointmentDoctorSelect');
        if (patientSelect) {
            patientSelect.innerHTML = `<option value="">Select Patient</option>` +
                DataService.getAllPatients().map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('');
        }
        if (doctorSelect) {
            doctorSelect.innerHTML = `<option value="">Select Doctor</option>` +
                DataService.getAllDoctors().map(d => `<option value="${d.id}">${d.title || 'Dr.'} ${d.firstName} ${d.lastName}</option>`).join('');
        }
    }

    populateInvoiceFormOptions() {
        const invoicePatientSelect = document.getElementById('invoicePatientSelect');
        if (invoicePatientSelect) {
            invoicePatientSelect.innerHTML = `<option value="">Select Patient</option>` +
                DataService.getAllPatients().map(p => `<option value="${p.id}">${p.firstName} ${p.lastName}</option>`).join('');
        }
    }

    async addPatient(form) {
        const formData = new FormData(form);
        const patientId = formData.get('patientId');
        const patientData = {
            firstName: formData.get('firstName') || '',
            lastName: formData.get('lastName') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            dob: formData.get('dob') || '',
            department: formData.get('department') || '',
            age: this.calculateAge(formData.get('dob'))
        };

        try {
            if (patientId) {
                await DataService.updatePatient(patientId, patientData);
                this.renderPatients();
                this.showNotification('Patient updated successfully!', 'success');
            } else {
                await DataService.addPatient(patientData);
                this.renderPatients();
                this.showNotification('Patient added successfully!', 'success');
            }

            form.reset();
            this.closeModal(document.getElementById('patientModal'));
            if (this.currentPage === 'dashboard') this.initDashboard();
        } catch (error) {
            console.error('Unable to save patient:', error);
            this.showNotification('Unable to save patient at this time. Please try again later.', 'error');
        }
    }

    async addDoctor(form) {
        const formData = new FormData(form);
        const doctorId = formData.get('doctorId');
        const doctorData = {
            firstName: formData.get('firstName') || '',
            lastName: formData.get('lastName') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            department: formData.get('department') || '',
            specialization: formData.get('specialization') || '',
            license: formData.get('license') || '',
            experience: Number(formData.get('experience')) || 0,
            status: 'active'
        };

        try {
            if (doctorId) {
                await DataService.updateDoctor(doctorId, doctorData);
                this.renderDoctors();
                this.showNotification('Doctor updated successfully!', 'success');
            } else {
                await DataService.addDoctor(doctorData);
                this.renderDoctors();
                this.showNotification('Doctor added successfully!', 'success');
            }
            form.reset();
            this.closeModal(document.getElementById('doctorModal'));
            if (this.currentPage === 'dashboard') this.initDashboard();
        } catch (error) {
            console.error('Unable to save doctor:', error);
            this.showNotification('Unable to save doctor at this time. Please try again later.', 'error');
        }
    }

    async addAppointment(form) {
        const formData = new FormData(form);
        const patientId = formData.get('patientId');
        const doctorId = formData.get('doctorId');
        const patientOption = form.querySelector(`#appointmentPatientSelect option[value="${patientId}"]`);
        const doctorOption = form.querySelector(`#appointmentDoctorSelect option[value="${doctorId}"]`);

        const appointmentData = {
            patientId,
            patientName: patientOption ? patientOption.textContent : '',
            doctorId,
            doctorName: doctorOption ? doctorOption.textContent : '',
            date: formData.get('date') || '',
            time: formData.get('time') || '',
            duration: Number(formData.get('duration')) || 30,
            status: formData.get('status') || 'scheduled',
            department: DataService.getDoctorById(doctorId)?.department || 'General',
            notes: ''
        };

        try {
            await DataService.addAppointment(appointmentData);
            this.renderAppointments();
            this.showNotification('Appointment scheduled successfully!', 'success');
            form.reset();
            this.closeModal(document.getElementById('appointmentModal'));
            if (this.currentPage === 'dashboard') this.initDashboard();
        } catch (error) {
            console.error('Unable to schedule appointment:', error);
            this.showNotification('Unable to schedule appointment at this time. Please try again later.', 'error');
        }
    }

    async addInvoice(form) {
        const formData = new FormData(form);
        const patientId = formData.get('patientId');
        const patientOption = form.querySelector(`#invoicePatientSelect option[value="${patientId}"]`);

        const invoiceData = {
            patientId,
            patientName: patientOption ? patientOption.textContent : '',
            amount: Number(formData.get('amount')) || 0,
            dueDate: formData.get('dueDate') || '',
            status: formData.get('status') || 'pending',
            items: []
        };

        try {
            await DataService.createInvoice(invoiceData);
            this.renderInvoices();
            this.showNotification('Invoice created successfully!', 'success');
            form.reset();
            this.closeModal(document.getElementById('invoiceModal'));
            if (this.currentPage === 'dashboard') this.initDashboard();
        } catch (error) {
            console.error('Unable to create invoice:', error);
            this.showNotification('Unable to create invoice at this time. Please try again later.', 'error');
        }
    }

    calculateAge(dob) {
        if (!dob) {
            return null;
        }

        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    setupButtonActions() {
        const exportReportBtn = document.getElementById('export-report-btn');
        const refreshBtn = document.getElementById('refresh-btn');
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => {
                this.exportReport();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        const notifBtn = document.querySelector('.notification-btn');
        const notifMenu = document.querySelector('.notification-menu');
        const settingsBtn = document.querySelector('.settings-btn');
        const settingsMenu = document.querySelector('.settings-menu');

        // Toggle notifications
        if (notifBtn && notifMenu) {
            notifBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close settings if open
                if (settingsMenu) settingsMenu.style.display = 'none';
                notifMenu.style.display = notifMenu.style.display === 'none' ? 'block' : 'none';
            });
        }

        // Toggle settings
        if (settingsBtn && settingsMenu) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Close notifications if open
                if (notifMenu) notifMenu.style.display = 'none';
                settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
            });
        }

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            if (settingsMenu) settingsMenu.style.display = 'none';
            if (notifMenu) notifMenu.style.display = 'none';
        });

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('app-container').style.display = 'none';
                document.getElementById('login-container').style.display = 'flex';
                localStorage.removeItem('hmsAuthenticated');
                this.authenticated = false;
                // Reset inputs
                document.getElementById('loginUsername').value = '';
                document.getElementById('loginPassword').value = '';
                this.showNotification('Logged out successfully.', 'success');
            });
        }

        // Add hover styles for settings menu items dynamically if css is not easily editable
        // and prevent default link jumping behavior
        document.querySelectorAll('.settings-item, .notif-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--bg-hover)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });
            
            if (item.id !== 'logout-btn') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Hide the menu
                    if (settingsMenu) settingsMenu.style.display = 'none';
                    if (notifMenu) notifMenu.style.display = 'none';

                    switch (item.id) {
                        case 'profile-settings':
                            this.showNotification('Profile settings will be available soon.', 'info');
                            break;
                        case 'system-preferences':
                            this.showNotification('System preferences are still in development.', 'info');
                            break;
                        case 'theme-toggle':
                            this.toggleTheme();
                            break;
                        case 'language-settings':
                            this.showNotification('Language options will be added soon. Default is English.', 'info');
                            break;
                        case 'help-support':
                            this.showHelpSupport();
                            break;
                        default:
                            const text = item.textContent.trim().replace('🚪 Logout', '');
                            this.showNotification(`${text} clicked.`, 'info');
                            break;
                    }
                });
            }
        });
    }

    setupSearch() {
        const searchBox = document.querySelector('.search-box input');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();

                switch (this.currentPage) {
                    case 'patients':
                        this.filterPatients(query);
                        break;
                    case 'doctors':
                        this.filterDoctors(query);
                        break;
                    case 'billing':
                        this.filterBilling(query);
                        break;
                    case 'appointments':
                        this.filterAppointments(query);
                        break;
                    case 'dashboard':
                        this.filterDashboard(query);
                        break;
                    case 'reports':
                        // Debounce notification or only show once for reports to avoid spam
                        if (!this._searchNotified) {
                            this.showNotification('Global search is not fully supported on Reports. Please navigate to Patients or Doctors.', 'warning');
                            this._searchNotified = true;
                            setTimeout(() => this._searchNotified = false, 5000);
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    }

    filterDashboard(query) {
        const container = document.getElementById('dashboard');
        if (!container) return;

        const lowerTerm = query.toLowerCase();
        
        // Filter recent activities
        const activityItems = container.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = !lowerTerm || text.includes(lowerTerm) ? 'flex' : 'none';
        });
    }

    toggleSidebar() {
        const nav = document.querySelector('.nav-menu');
        nav.classList.toggle('active');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${this.getNotificationColor(type)};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        return colors[type] || colors['info'];
    }

    exportReport() {
        // Create a simple CSV export
        const data = this.getReportData();
        const csv = this.convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hospital-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.showNotification('Report exported successfully!', 'success');
    }

    getReportData() {
        return [
            ['Metric', 'Value'],
            ['Total Patients', '1,248'],
            ['Active Doctors', '45'],
            ['Monthly Revenue', '$125,000'],
            ['Bed Occupancy', '75%'],
            ['Average Rating', '4.7/5']
        ];
    }

    convertToCSV(data) {
        return data.map(row => row.join(',')).join('\n');
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HospitalManagementApp();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.search-box input').focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('patientModal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    }
});
