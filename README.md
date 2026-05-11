# CRM Admin Panel

A complete Customer Relationship Management (CRM) system built with React.js frontend and Node.js backend with MongoDB database.

## Features

### 🔐 Authentication System
- Secure admin login with JWT authentication
- Protected routes with session persistence
- Automatic logout on token expiration

### 📊 Dashboard Overview
- Real-time statistics cards
- Today's follow-ups section
- Recent activities timeline
- Client status distribution
- Upcoming appointments tracking

### 👥 Client Management
- Complete CRUD operations for clients
- Advanced search and filtering
- Client detail pages with activity timeline
- Status management system

### 📅 Follow-Up Management
- Today's follow-ups with time-based sorting
- Upcoming follow-ups tracking
- Missed follow-ups alerts
- Completed follow-ups history

### 🔍 Search & Filter System
- Search by name or phone number
- Filter by client status
- Filter by lead source
- Filter by follow-up date
- Real-time search results

### 📱 Responsive Design
- Modern UI with Tailwind CSS
- Mobile-friendly layout
- Sidebar navigation
- Dark/light theme support

### ⏰ Activity Timeline
- Track all client interactions
- Status change history
- Follow-up updates
- Automatic activity logging

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory with:
```
MONGODB_URI=mongodb://localhost:27017/crm_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

### Initial Admin Setup

1. Once both servers are running, register the first admin account:
   - Send a POST request to `http://localhost:5000/api/auth/register`
   - Body: `{"email": "admin@example.com", "password": "password123"}`

2. Use these credentials to login to the admin panel at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Clients
- `GET /api/clients` - Get all clients (with search/filter)
- `POST /api/clients` - Add new client
- `GET /api/clients/:id` - Get single client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/:id/activities` - Get client activities

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/today-followups` - Get today's follow-ups
- `GET /api/dashboard/upcoming-followups` - Get upcoming follow-ups
- `GET /api/dashboard/missed-followups` - Get missed follow-ups
- `GET /api/dashboard/completed-followups` - Get completed follow-ups

## Client Status System

The CRM includes the following client statuses:
- **New Lead** - Initial contact
- **Interested** - Shows interest in services
- **Call Later** - Requested callback
- **Meeting Scheduled** - Meeting arranged
- **Follow-Up Pending** - Awaiting follow-up
- **Converted** - Successfully converted
- **Not Interested** - Not interested in services

## Lead Sources

Track where clients come from:
- Website
- Referral
- Social Media
- Cold Call
- Email
- Other

## Database Schema

### Client Model
```javascript
{
  fullName: String,
  phoneNumber: String,
  alternateNumber: String,
  address: String,
  city: String,
  notes: String,
  status: String,
  followUpDateTime: Date,
  leadSource: String,
  createdDate: Date,
  lastUpdated: Date
}
```

### Activity Model
```javascript
{
  clientId: ObjectId,
  type: String,
  description: String,
  timestamp: Date,
  previousStatus: String,
  newStatus: String
}
```

## Production Deployment

### Environment Variables
Make sure to set these in production:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure random string for JWT
- `PORT` - Server port (default: 5000)

### Security Considerations
- Change the JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Use environment variables for sensitive data

## Features Usage

### Adding Clients
1. Navigate to Clients page
2. Click "Add Client" button
3. Fill in client information
4. Set follow-up date if needed
5. Click "Add Client"

### Managing Follow-ups
1. View today's follow-ups on dashboard
2. Access detailed follow-up management in Follow-ups section
3. Update client status and follow-up dates
4. Track missed and completed follow-ups

### Search and Filter
1. Use search bar for quick name/phone search
2. Click "Filters" for advanced filtering
3. Filter by status, lead source, or date
4. Clear filters to reset view

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Ensure MongoDB is running
2. **Authentication Error**: Check JWT_SECRET configuration
3. **CORS Issues**: Backend should be running on port 5000

### Development Tips
- Use `npm run dev` for backend with auto-restart
- Frontend hot-reloads automatically
- Check browser console for errors
- Verify API responses in Network tab

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the documentation or create an issue.
