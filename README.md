# Hospital Management System - Full Stack

A modern, responsive web-based hospital management system built with vanilla HTML, CSS, JavaScript, and a Node/Express backend. This system provides a comprehensive solution for managing patients, appointments, doctors, billing, and generating reports.

## Features

### 📊 Dashboard
- Real-time statistics (Total Patients, Appointments Today, Active Doctors, Monthly Revenue)
- Recent appointments list
- Bed availability overview

### 👥 Patient Management
- View and manage patient records
- Add new patients
- Search and filter patients by department and status
- Patient information and history

### 📅 Appointments
- Schedule new appointments
- View upcoming appointments
- Appointment status tracking (Confirmed, Pending, Scheduled, Cancelled)
- Reschedule or cancel appointments
- Filter by doctor and status

### 👨‍⚕️ Doctor & Staff Management
- View all registered doctors and staff
- Doctor profiles with specializations
- Experience level and ratings
- Online/offline status indicators
- Add new doctors

### 💰 Billing & Payments
- Invoice management
- Track payment status
- View patient billing history
- Export invoices
- Filter by payment status (Paid, Pending, Overdue)

### 📈 Reports & Analytics
- Patient statistics
- Revenue overview
- Appointment metrics
- Staff performance analytics
- Export reports

## Project Structure

```
hospital-management/
├── index.html              # Main HTML file
├── server.js               # Backend Express server entrypoint
├── server/                 # Backend server utilities and data store
│   ├── database.js         # JSON database helpers
│   └── data/
│       └── db.json         # Persistent mock data store
├── css/
│   ├── styles.css         # Main styling
│   └── responsive.css     # Mobile responsive styles
├── js/
│   ├── app.js            # Main application logic
│   └── chart-utils.js    # Chart utilities
├── pages/                # Additional pages (optional)
├── assets/               # Images and icons
└── README.md            # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 14+ and npm

### Installation

1. **Clone or Download the Project**
   ```bash
   cd hospital-management
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Backend Server**
   ```bash
   npm start
   ```

4. **Access the Application**
   - Open `http://localhost:3000` in your browser

5. **Alternative Frontend-only Launch**
   - If you only want the static frontend preview:
     ```bash
     npm run frontend
     ```
   - Then open `http://localhost:8000` in your browser

## Usage Guide

### Navigation
- Use the sidebar to navigate between different sections
- Click on navigation items to switch between pages
- Use the search bar to find specific records

### Adding Patients
1. Go to **Patients** section
2. Click **+ Add New Patient** button
3. Fill in the patient details form
4. Click **Add Patient** to save

### Managing Appointments
1. Navigate to **Appointments** section
2. Click **+ Schedule Appointment** button
3. Select doctor, patient, and time
4. Confirm the appointment
5. Use filters to find specific appointments

### Viewing Reports
1. Go to **Reports & Analytics** section
2. View various statistical metrics
3. Click **📥 Export Report** to download as CSV

### Searching and Filtering
- Use the search box in the header for global search
- Use section-specific filters for refined searches
- Filter by department, status, date, etc.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Focus search box |
| `Esc` | Close modals/dialogs |

## API Integration

To connect this frontend with a backend API:

### Example: Fetching Patient Data
```javascript
// In app.js
async function fetchPatients() {
    try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        updatePatientTable(data);
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}
```

### Backend Endpoint Examples
```
GET    /api/patients              - Get all patients
POST   /api/patients              - Create new patient
GET    /api/patients/:id          - Get patient details
PUT    /api/patients/:id          - Update patient
DELETE /api/patients/:id          - Delete patient

GET    /api/appointments          - Get all appointments
POST   /api/appointments          - Create appointment
PUT    /api/appointments/:id      - Update appointment

GET    /api/doctors               - Get all doctors
GET    /api/billing/invoices      - Get invoices
GET    /api/reports               - Get analytics data
```

## Customization

### Changing Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    /* ... more colors ... */
}
```

### Modifying Dashboard Stats
Edit the stat cards in `index.html` dashboard section:
```html
<div class="stat-card">
    <div class="stat-icon" style="background: #e3f2fd;">👥</div>
    <div class="stat-content">
        <h3>Total Patients</h3>
        <p class="stat-number">1,248</p>
    </div>
</div>
```

### Adding New Pages
1. Create a new section in `index.html`:
   ```html
   <section id="new-page" class="page">
       <!-- Your content here -->
   </section>
   ```

2. Add navigation item:
   ```html
   <a href="#" class="nav-item" data-page="new-page">
       <span class="icon">🆕</span>
       <span>New Page</span>
   </a>
   ```

3. Initialize in `js/app.js`:
   ```javascript
   case 'new-page':
       this.initNewPage();
       break;
   ```

## Features Not Yet Implemented

The following features are marked for future development:
- Real-time notifications
- Advanced data visualization
- User authentication
- Database integration
- Email notifications
- SMS alerts
- Mobile app
- PDF report generation

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimization

The application is optimized for:
- **Fast loading**: Minimal dependencies
- **Responsive design**: Works on all screen sizes
- **Smooth animations**: Hardware-accelerated CSS
- **Accessibility**: WCAG compliant markup

## Accessibility Features

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast color scheme
- Screen reader friendly

## Security Considerations

When deploying to production:
1. **Input Validation**: Validate all user inputs
2. **Authentication**: Implement user login system
3. **Authorization**: Control access to sensitive data
4. **HTTPS**: Use SSL/TLS encryption
5. **CORS**: Configure Cross-Origin Resource Sharing properly
6. **Rate Limiting**: Implement API rate limiting
7. **Data Encryption**: Encrypt sensitive patient data

## Troubleshooting

### Modal not opening
- Check browser console for JavaScript errors
- Ensure `app.js` is loaded correctly

### Charts not rendering
- If using Chart.js, ensure the library is included
- Check browser console for errors

### Sidebar not responsive
- Check if you're viewing on mobile device
- Clear browser cache and reload

### Styles not applying
- Verify CSS files are in correct path
- Check for browser cache issues
- Use F12 developer tools to inspect elements

## Contributing

To improve this project:
1. Test the application thoroughly
2. Report bugs with detailed information
3. Suggest new features
4. Optimize code performance
5. Improve documentation

## License

This project is open source and available for educational and commercial use.

## Support

For issues, questions, or suggestions:
- Check the troubleshooting section
- Review JavaScript console for error messages
- Verify all files are in correct locations
- Test in different browsers

## Future Enhancements

Planned features for upcoming versions:
- Advanced scheduling with calendar view
- Patient portal for self-service
- Insurance integration
- Prescription management
- Laboratory results management
- Real-time bed availability system
- Staff attendance tracking
- Mobile app (iOS/Android)
- Telemedicine capabilities
- AI-powered diagnostics assistance

## Version History

### v1.0.0 (Current)
- Initial release
- Dashboard with analytics
- Patient management
- Appointment scheduling
- Staff management
- Billing system
- Reports and analytics

---

**Last Updated**: May 2026

For more information and updates, visit the project repository.
