# Hospital Management System - Backend API Specification

This document defines the API endpoints and data structures for the Hospital Management System backend.

## Base URL
```
https://api.hospitalcare.com/v1
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@hospital.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGc...",
  "user": {
    "id": "U001",
    "firstName": "Admin",
    "lastName": "User",
    "email": "user@hospital.com",
    "role": "admin"
  }
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer <TOKEN>

Response (200):
{
  "message": "Logged out successfully"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_value"
}

Response (200):
{
  "token": "new_jwt_token"
}
```

---

## Patients Endpoints

### Get All Patients
```http
GET /patients?page=1&limit=10&department=Cardiology&status=Active
Authorization: Bearer <TOKEN>

Response (200):
{
  "data": [
    {
      "id": "P001",
      "firstName": "John",
      "lastName": "Doe",
      "age": 45,
      "email": "john.doe@email.com",
      "phone": "555-0101",
      "department": "Cardiology",
      "status": "Active",
      "admissionDate": "2024-05-10",
      "condition": "Stable",
      "bloodType": "O+",
      "allergies": "Penicillin",
      "lastUpdated": "2024-05-18T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1248,
    "pages": 125
  }
}
```

### Get Patient Details
```http
GET /patients/:id
Authorization: Bearer <TOKEN>

Response (200):
{
  "id": "P001",
  "firstName": "John",
  "lastName": "Doe",
  "age": 45,
  "email": "john.doe@email.com",
  "phone": "555-0101",
  "department": "Cardiology",
  "status": "Active",
  "admissionDate": "2024-05-10",
  "condition": "Stable",
  "bloodType": "O+",
  "allergies": ["Penicillin"],
  "address": "123 Main St",
  "emergencyContact": "555-0100",
  "insurance": "ABC Insurance",
  "medicalHistory": [
    {
      "date": "2024-01-15",
      "condition": "Hypertension",
      "treatment": "Medication"
    }
  ],
  "medications": [
    {
      "name": "Aspirin",
      "dosage": "100mg",
      "frequency": "Daily",
      "startDate": "2024-05-10"
    }
  ]
}
```

### Create Patient
```http
POST /patients
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "firstName": "Jane",
  "lastName": "Smith",
  "age": 38,
  "email": "jane.smith@email.com",
  "phone": "555-0102",
  "department": "Neurology",
  "bloodType": "A+",
  "address": "456 Oak Ave",
  "emergencyContact": "555-0101",
  "insurance": "XYZ Insurance"
}

Response (201):
{
  "id": "P004",
  "firstName": "Jane",
  "lastName": "Smith",
  "createdAt": "2024-05-18T10:30:00Z"
}
```

### Update Patient
```http
PUT /patients/:id
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "status": "Discharged",
  "condition": "Recovered"
}

Response (200):
{
  "id": "P001",
  "status": "Discharged",
  "lastUpdated": "2024-05-18T10:30:00Z"
}
```

### Delete Patient
```http
DELETE /patients/:id
Authorization: Bearer <TOKEN>

Response (204): No Content
```

---

## Appointments Endpoints

### Get All Appointments
```http
GET /appointments?date=2024-05-18&doctorId=D001&status=confirmed
Authorization: Bearer <TOKEN>

Response (200):
{
  "data": [
    {
      "id": "A001",
      "patientId": "P001",
      "patientName": "John Doe",
      "doctorId": "D001",
      "doctorName": "Dr. Smith",
      "department": "Cardiology",
      "date": "2024-05-18",
      "time": "10:30",
      "duration": 30,
      "status": "confirmed",
      "notes": "Regular checkup",
      "createdAt": "2024-05-10T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 23,
    "page": 1
  }
}
```

### Get Appointment Details
```http
GET /appointments/:id
Authorization: Bearer <TOKEN>

Response (200):
{
  "id": "A001",
  "patientId": "P001",
  "patientDetails": {
    "name": "John Doe",
    "phone": "555-0101",
    "email": "john.doe@email.com"
  },
  "doctorId": "D001",
  "doctorDetails": {
    "name": "Dr. Smith",
    "specialization": "Cardiology"
  },
  "date": "2024-05-18",
  "time": "10:30",
  "duration": 30,
  "status": "confirmed",
  "notes": "Regular checkup",
  "room": "Room 101",
  "createdAt": "2024-05-10T10:00:00Z",
  "updatedAt": "2024-05-18T10:00:00Z"
}
```

### Create Appointment
```http
POST /appointments
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "patientId": "P002",
  "doctorId": "D002",
  "date": "2024-05-20",
  "time": "14:00",
  "duration": 30,
  "notes": "Follow-up consultation"
}

Response (201):
{
  "id": "A003",
  "status": "scheduled",
  "createdAt": "2024-05-18T10:30:00Z"
}
```

### Update Appointment
```http
PUT /appointments/:id
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "date": "2024-05-20",
  "time": "15:00",
  "status": "confirmed"
}

Response (200):
{
  "id": "A001",
  "status": "confirmed",
  "updatedAt": "2024-05-18T10:30:00Z"
}
```

### Cancel Appointment
```http
DELETE /appointments/:id
Authorization: Bearer <TOKEN>

Response (200):
{
  "id": "A001",
  "status": "cancelled",
  "cancelledAt": "2024-05-18T10:30:00Z"
}
```

---

## Doctors Endpoints

### Get All Doctors
```http
GET /doctors?department=Cardiology&page=1&limit=10
Authorization: Bearer <TOKEN>

Response (200):
{
  "data": [
    {
      "id": "D001",
      "firstName": "Smith",
      "title": "Dr.",
      "email": "smith@hospital.com",
      "phone": "555-1001",
      "department": "Cardiology",
      "license": "#LIC12345",
      "experience": 12,
      "rating": 4.8,
      "status": "active",
      "specialization": "Heart Diseases",
      "bio": "Board certified cardiologist with 12 years of experience"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1
  }
}
```

### Get Doctor Details
```http
GET /doctors/:id
Authorization: Bearer <TOKEN>

Response (200):
{
  "id": "D001",
  "firstName": "Smith",
  "title": "Dr.",
  "email": "smith@hospital.com",
  "phone": "555-1001",
  "department": "Cardiology",
  "license": "#LIC12345",
  "experience": 12,
  "rating": 4.8,
  "status": "active",
  "specialization": "Heart Diseases",
  "qualifications": ["MD", "Board Certification"],
  "schedule": {
    "monday": ["09:00-17:00"],
    "tuesday": ["09:00-17:00"],
    "wednesday": ["OFF"],
    "thursday": ["09:00-17:00"],
    "friday": ["09:00-17:00"],
    "saturday": ["10:00-14:00"],
    "sunday": ["OFF"]
  },
  "patientCount": 125,
  "averageWaitTime": 15,
  "reviews": [
    {
      "patientName": "John Doe",
      "rating": 5,
      "comment": "Excellent care"
    }
  ]
}
```

### Create Doctor
```http
POST /doctors
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "firstName": "Johnson",
  "title": "Dr.",
  "email": "johnson@hospital.com",
  "phone": "555-1002",
  "department": "Neurology",
  "license": "#LIC12346",
  "experience": 8,
  "specialization": "Neurodegenerative Diseases"
}

Response (201):
{
  "id": "D004",
  "createdAt": "2024-05-18T10:30:00Z"
}
```

---

## Billing Endpoints

### Get All Invoices
```http
GET /invoices?status=pending&patientId=P001&page=1
Authorization: Bearer <TOKEN>

Response (200):
{
  "data": [
    {
      "id": "INV001",
      "patientId": "P001",
      "patientName": "John Doe",
      "amount": 2500.00,
      "date": "2024-05-10",
      "dueDate": "2024-05-25",
      "status": "pending",
      "items": [
        {
          "description": "Consultation",
          "amount": 500.00
        }
      ]
    }
  ],
  "pagination": {
    "total": 150,
    "paid": 98500.00,
    "pending": 26500.00,
    "overdue": 8000.00
  }
}
```

### Get Invoice Details
```http
GET /invoices/:id
Authorization: Bearer <TOKEN>

Response (200):
{
  "id": "INV001",
  "patientId": "P001",
  "patientDetails": {
    "name": "John Doe",
    "email": "john.doe@email.com"
  },
  "amount": 2500.00,
  "date": "2024-05-10",
  "dueDate": "2024-05-25",
  "status": "pending",
  "items": [
    {
      "description": "Consultation",
      "amount": 500.00
    },
    {
      "description": "ECG Test",
      "amount": 800.00
    }
  ],
  "notes": "Payment pending"
}
```

### Create Invoice
```http
POST /invoices
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "patientId": "P002",
  "amount": 3800.00,
  "items": [
    {
      "description": "Consultation",
      "amount": 500.00
    },
    {
      "description": "MRI Scan",
      "amount": 2800.00
    }
  ],
  "notes": "For recent admission"
}

Response (201):
{
  "id": "INV003",
  "createdAt": "2024-05-18T10:30:00Z"
}
```

### Update Payment Status
```http
PUT /invoices/:id/payment
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "status": "paid",
  "paymentMethod": "credit_card",
  "paidAmount": 2500.00
}

Response (200):
{
  "id": "INV001",
  "status": "paid",
  "paidDate": "2024-05-18T10:30:00Z"
}
```

---

## Reports Endpoints

### Get Statistics
```http
GET /reports/statistics?startDate=2024-05-01&endDate=2024-05-18
Authorization: Bearer <TOKEN>

Response (200):
{
  "patients": {
    "total": 1248,
    "newThisMonth": 156,
    "active": 234,
    "discharged": 389
  },
  "appointments": {
    "total": 892,
    "completed": 856,
    "cancelled": 36,
    "noShow": 10,
    "pending": 23
  },
  "revenue": {
    "total": 125000.00,
    "paid": 98500.00,
    "pending": 26500.00,
    "overdue": 8000.00
  },
  "staff": {
    "doctors": 45,
    "nurses": 120,
    "average_rating": 4.7
  }
}
```

### Generate Custom Report
```http
POST /reports/generate
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "type": "patient_demographics",
  "startDate": "2024-05-01",
  "endDate": "2024-05-18",
  "format": "pdf"
}

Response (200):
{
  "reportId": "R001",
  "url": "https://api.hospitalcare.com/reports/R001.pdf",
  "createdAt": "2024-05-18T10:30:00Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Email is required",
  "code": "INVALID_INPUT"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource",
  "code": "PERMISSION_DENIED"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Patient with ID P999 not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "code": "SERVER_ERROR"
}
```

---

## Rate Limiting

API endpoints are rate-limited:
- **Standard**: 1000 requests per hour
- **Premium**: 10000 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

## Data Types

### Patient Status
- `Active` - Currently admitted
- `Discharged` - Released from hospital
- `Admitted` - Recently admitted
- `Transferred` - Transferred to another facility

### Appointment Status
- `scheduled` - Appointment created
- `confirmed` - Patient confirmed
- `completed` - Appointment completed
- `cancelled` - Appointment cancelled
- `no_show` - Patient didn't show up

### Invoice Status
- `pending` - Awaiting payment
- `paid` - Payment received
- `overdue` - Payment past due date
- `cancelled` - Invoice cancelled

### User Roles
- `admin` - Full system access
- `doctor` - Doctor specific access
- `nurse` - Limited access for nursing
- `receptionist` - Appointment and patient info access
- `patient` - Self-service patient access

---

## Implementation Notes

1. **Timestamps**: Use ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
2. **Currency**: Use two decimal places (e.g., 1234.56)
3. **Pagination**: Default 10 items per page, max 100
4. **Validation**: All inputs should be validated server-side
5. **Security**: Use HTTPS, implement CORS properly
6. **Logging**: Log all API requests and errors

---

**API Version**: 1.0.0  
**Last Updated**: May 2024
