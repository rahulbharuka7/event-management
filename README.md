# Event Management System

A full-stack MERN application for managing events across multiple users and timezones. Built with React, Express.js, MongoDB, and Zustand for state management.

## Features

- **Multi-Profile Management**: Create and manage multiple user profiles
- **Event Creation**: Create events for one or multiple profiles simultaneously
- **Timezone Support**: Full timezone handling with automatic conversion using dayjs
- **Event Updates**: Update events with complete change tracking
- **Update History**: View detailed logs of all event modifications
- **Dynamic Timezone Switching**: Change user timezone and see all events/logs update automatically

## Tech Stack

### Frontend
- React 19.2.0
- Zustand (State Management)
- dayjs (Timezone handling)
- Axios (API calls)

### Backend
- Express.js
- MongoDB with Mongoose
- dayjs (Server-side timezone operations)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd event-management-system
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/event-management
PORT=5000
```

5. Start MongoDB (if running locally):
```bash
mongod
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

Backend only:
```bash
npm run server
```

Frontend only:
```bash
npm run client
```

### Production Mode

Build the frontend:
```bash
cd client
npm run build
cd ..
```

Start the server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Profiles
- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create a new profile
- `PATCH /api/profiles/:id/timezone` - Update profile timezone

### Events
- `GET /api/events/profile/:profileId` - Get all events for a profile
- `GET /api/events/:id` - Get a single event
- `POST /api/events` - Create a new event
- `PATCH /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

## Usage Guide

### Creating Profiles
1. Click on "Select current profile..." in the header
2. Enter a name in the input field at the bottom
3. Click "Add" to create the profile

### Creating Events
1. Select one or more profiles from the checkbox list
2. Choose a timezone for the event
3. Set start date and time
4. Set end date and time (must be after start time)
5. Click "Create Event"

### Viewing Events
1. Select a profile from the dropdown
2. Events will be displayed in the selected profile's timezone
3. Change the "View in Timezone" dropdown to see events in different timezones

### Updating Events
1. Click on any event card
2. Modify the desired fields
3. Click "Update Event" to save changes
4. All changes are logged in the update history

### Viewing Update History
1. Click "View Logs" button on any event card
2. See all previous changes with timestamps
3. Timestamps automatically adjust when you change the viewing timezone

## Project Structure

```
event-management-system/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       ├── store/         # Zustand store
│       ├── styles/        # CSS files
│       └── utils/         # Utility functions
├── server/                # Express backend
│   ├── models/           # Mongoose models
│   └── routes/           # API routes
├── package.json
└── README.md
```

## Key Features Explained

### Timezone Handling
- Events are stored in UTC in the database
- Display times are converted to the user's selected timezone
- When a user changes their timezone, all times update automatically
- Update logs also respect the current viewing timezone

### Event Update Logs
- Every event modification is tracked
- Logs show what changed (from → to)
- Timestamps are stored and displayed in the user's timezone
- Logs persist even when timezone is changed

### Validation
- End time must be after start time
- At least one profile must be selected
- All date/time fields are required
- Timezone-aware validation prevents past events

## Future Enhancements

- User authentication and authorization
- Event notifications and reminders
- Recurring events support
- Calendar view
- Export events to iCal format
- Email invitations

## Documentation

- **[Architecture](ARCHITECTURE.md)** - Detailed system architecture and design decisions
- **[Deployment Guide](DEPLOYMENT.md)** - Instructions for deploying to various platforms
- **[Testing Guide](TESTING.md)** - Manual and automated testing procedures
- **[Video Recording Guide](VIDEO_GUIDE.md)** - Script and tips for creating demo video

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
