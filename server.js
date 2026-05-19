const express = require('express');
const cors = require('cors');
const path = require('path');
const { readDB, writeDB, formatId, paginate } = require('./server/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

function filterItems(items, query, searchableFields = []) {
    return items.filter(item => {
        if (query.q) {
            const term = query.q.toLowerCase();
            const haystack = searchableFields.length
                ? searchableFields.map(field => (item[field] || '').toString().toLowerCase()).join(' ')
                : JSON.stringify(item).toLowerCase();
            if (!haystack.includes(term)) {
                return false;
            }
        }

        if (query.department && item.department) {
            if (item.department.toLowerCase() !== query.department.toLowerCase()) {
                return false;
            }
        }

        if (query.status && item.status) {
            if (item.status.toLowerCase() !== query.status.toLowerCase()) {
                return false;
            }
        }

        if (query.patientId && item.patientId) {
            if (item.patientId !== query.patientId) {
                return false;
            }
        }

        if (query.doctorId && item.doctorId) {
            if (item.doctorId !== query.doctorId) {
                return false;
            }
        }

        if (query.date && item.date) {
            if (item.date !== query.date) {
                return false;
            }
        }

        return true;
    });
}

app.get('/api/ping', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/departments', async (req, res) => {
    try {
        const db = await readDB();
        res.json(db.departments || []);
    } catch (error) {
        res.status(500).json({ error: 'Unable to load departments.' });
    }
});

app.get('/api/patients', async (req, res) => {
    try {
        const db = await readDB();
        const filtered = filterItems(db.patients, req.query, ['firstName', 'lastName', 'email', 'department', 'id']);
        res.json(paginate(filtered, Number(req.query.page) || 1, Number(req.query.limit) || 20));
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve patients.' });
    }
});

app.get('/api/patients/:id', async (req, res) => {
    try {
        const db = await readDB();
        const patient = db.patients.find(p => p.id === req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found.' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve patient.' });
    }
});

app.post('/api/patients', async (req, res) => {
    try {
        const db = await readDB();
        const patient = {
            id: formatId('P', db.patients, 3),
            firstName: req.body.firstName || 'Unknown',
            lastName: req.body.lastName || 'Patient',
            age: req.body.age || null,
            email: req.body.email || '',
            phone: req.body.phone || '',
            department: req.body.department || 'General',
            status: req.body.status || 'Active',
            admissionDate: req.body.admissionDate || new Date().toISOString().split('T')[0],
            condition: req.body.condition || '',
            bloodType: req.body.bloodType || '',
            allergies: req.body.allergies || ''
        };

        db.patients.push(patient);
        await writeDB(db);
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create patient.' });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    try {
        const db = await readDB();
        const patient = db.patients.find(p => p.id === req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found.' });
        }

        Object.assign(patient, req.body);
        await writeDB(db);
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update patient.' });
    }
});

app.delete('/api/patients/:id', async (req, res) => {
    try {
        const db = await readDB();
        const index = db.patients.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Patient not found.' });
        }
        db.patients.splice(index, 1);
        await writeDB(db);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete patient.' });
    }
});

app.get('/api/doctors', async (req, res) => {
    try {
        const db = await readDB();
        const filtered = filterItems(db.doctors, req.query, ['firstName', 'lastName', 'department', 'specialization', 'id']);
        res.json(paginate(filtered, Number(req.query.page) || 1, Number(req.query.limit) || 20));
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve doctors.' });
    }
});

app.get('/api/doctors/:id', async (req, res) => {
    try {
        const db = await readDB();
        const doctor = db.doctors.find(d => d.id === req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve doctor.' });
    }
});

app.post('/api/doctors', async (req, res) => {
    try {
        const db = await readDB();
        const doctor = {
            id: formatId('D', db.doctors, 3),
            firstName: req.body.firstName || 'New',
            lastName: req.body.lastName || 'Doctor',
            title: req.body.title || 'Dr.',
            email: req.body.email || '',
            phone: req.body.phone || '',
            department: req.body.department || 'General Medicine',
            license: req.body.license || '',
            experience: req.body.experience || 0,
            rating: req.body.rating || 4,
            status: req.body.status || 'active',
            specialization: req.body.specialization || ''
        };

        db.doctors.push(doctor);
        await writeDB(db);
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create doctor.' });
    }
});

app.put('/api/doctors/:id', async (req, res) => {
    try {
        const db = await readDB();
        const doctor = db.doctors.find(d => d.id === req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found.' });
        }
        Object.assign(doctor, req.body);
        await writeDB(db);
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update doctor.' });
    }
});

app.get('/api/appointments', async (req, res) => {
    try {
        const db = await readDB();
        const filtered = filterItems(db.appointments, req.query, ['patientName', 'doctorName', 'department', 'id']);
        res.json(paginate(filtered, Number(req.query.page) || 1, Number(req.query.limit) || 20));
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve appointments.' });
    }
});

app.get('/api/appointments/:id', async (req, res) => {
    try {
        const db = await readDB();
        const appointment = db.appointments.find(a => a.id === req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve appointment.' });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const db = await readDB();
        const appointment = {
            id: formatId('A', db.appointments, 3),
            patientId: req.body.patientId || null,
            patientName: req.body.patientName || 'Unknown Patient',
            doctorId: req.body.doctorId || null,
            doctorName: req.body.doctorName || 'Unknown Doctor',
            department: req.body.department || 'General',
            date: req.body.date || new Date().toISOString().split('T')[0],
            time: req.body.time || '09:00',
            duration: req.body.duration || 30,
            status: req.body.status || 'scheduled',
            notes: req.body.notes || ''
        };

        db.appointments.push(appointment);
        await writeDB(db);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create appointment.' });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    try {
        const db = await readDB();
        const appointment = db.appointments.find(a => a.id === req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        Object.assign(appointment, req.body);
        await writeDB(db);
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update appointment.' });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const db = await readDB();
        const index = db.appointments.findIndex(a => a.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }
        db.appointments.splice(index, 1);
        await writeDB(db);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete appointment.' });
    }
});

app.get('/api/invoices', async (req, res) => {
    try {
        const db = await readDB();
        const filtered = filterItems(db.invoices, req.query, ['patientName', 'status', 'id']);
        res.json(paginate(filtered, Number(req.query.page) || 1, Number(req.query.limit) || 20));
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve invoices.' });
    }
});

app.get('/api/invoices/:id', async (req, res) => {
    try {
        const db = await readDB();
        const invoice = db.invoices.find(i => i.id === req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found.' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve invoice.' });
    }
});

app.post('/api/invoices', async (req, res) => {
    try {
        const db = await readDB();
        const invoice = {
            id: formatId('INV', db.invoices, 3),
            patientId: req.body.patientId || null,
            patientName: req.body.patientName || 'Unknown Patient',
            amount: req.body.amount || 0,
            date: req.body.date || new Date().toISOString().split('T')[0],
            dueDate: req.body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: req.body.status || 'pending',
            items: req.body.items || []
        };

        db.invoices.push(invoice);
        await writeDB(db);
        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Unable to create invoice.' });
    }
});

app.put('/api/invoices/:id', async (req, res) => {
    try {
        const db = await readDB();
        const invoice = db.invoices.find(i => i.id === req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found.' });
        }
        Object.assign(invoice, req.body);
        await writeDB(db);
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update invoice.' });
    }
});

app.put('/api/invoices/:id/payment', async (req, res) => {
    try {
        const db = await readDB();
        const invoice = db.invoices.find(i => i.id === req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found.' });
        }
        invoice.status = req.body.status || 'paid';
        invoice.paymentMethod = req.body.paymentMethod || invoice.paymentMethod || 'online';
        invoice.paidAmount = req.body.paidAmount || invoice.amount;
        invoice.paidDate = new Date().toISOString().split('T')[0];
        await writeDB(db);
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ error: 'Unable to update invoice payment.' });
    }
});

app.get('/api/reports/statistics', async (req, res) => {
    try {
        const db = await readDB();
        const patients = db.patients;
        const invoices = db.invoices;
        const appointments = db.appointments;
        const doctors = db.doctors;

        const paidAmount = invoices.filter(i => i.status === 'paid').reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
        const pendingAmount = invoices.filter(i => i.status === 'pending').reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
        const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

        const stats = {
            patients: {
                total: patients.length,
                active: patients.filter(p => p.status.toLowerCase() === 'active').length,
                discharged: patients.filter(p => p.status.toLowerCase() === 'discharged').length,
                admitted: patients.filter(p => p.status.toLowerCase() === 'admitted').length
            },
            appointments: {
                total: appointments.length,
                confirmed: appointments.filter(a => a.status.toLowerCase() === 'confirmed').length,
                pending: appointments.filter(a => a.status.toLowerCase() === 'pending').length,
                completed: appointments.filter(a => a.status.toLowerCase() === 'completed').length,
                cancelled: appointments.filter(a => a.status.toLowerCase() === 'cancelled').length
            },
            revenue: {
                total: invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0),
                paid: paidAmount,
                pending: pendingAmount,
                overdue: overdueAmount
            },
            staff: {
                doctors: doctors.length,
                averageRating: doctors.length ? (doctors.reduce((sum, d) => sum + Number(d.rating || 0), 0) / doctors.length).toFixed(1) : '0.0'
            }
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Unable to generate statistics.' });
    }
});

app.post('/api/reports/generate', async (req, res) => {
    try {
        const db = await readDB();
        const reportType = req.body.type || 'summary';
        const startDate = req.body.startDate || null;
        const endDate = req.body.endDate || null;

        const report = {
            id: `R${Date.now()}`,
            type: reportType,
            createdAt: new Date().toISOString(),
            range: { startDate, endDate },
            metrics: {
                patients: db.patients.length,
                doctors: db.doctors.length,
                appointments: db.appointments.length,
                invoices: db.invoices.length,
                revenue: db.invoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0)
            },
            url: `http://localhost:${PORT}/reports/${reportType}-${Date.now()}.pdf`
        };

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: 'Unable to generate report.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const db = await readDB();
        const { email, password } = req.body;
        const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
        res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Unable to authenticate.' });
    }
});

app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found.' });
    }
    next();
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Hospital Management backend running on http://localhost:${PORT}`);
});
