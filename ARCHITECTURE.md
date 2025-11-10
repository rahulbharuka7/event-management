# Architecture Documentation

## System Overview

The Event Management System is a full-stack web application that enables multi-user event management with sophisticated timezone handling. The system follows a client-server architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React)                       │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Components │  │ Zustand Store│  │ Utils/Helpers   │ │
│  └────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                    HTTP/REST API
                          │
┌─────────────────────────────────────────────────────────┐
│                   Server (Express.js)                    │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   Routes   │  │  Middleware  │  │   Controllers   │ │
│  └────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                      Mongoose ODM
                          │
┌─────────────────────────────────────────────────────────┐
│                   Database (MongoDB)                     │
│         ┌──────────────┐  ┌──────────────┐             │
│         │   Profiles   │  │    Events    │             │
│         └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ProfileSelector.js      # Dropdown for profile selection
│   ├── CreateEvent.js          # Form for event creation
│   ├── EventsList.js           # Display events for selected profile
│   ├── EditEventModal.js       # Modal for editing events
│   └── UpdateLogsModal.js      # Modal for viewing update history
├── store/
│   └── useStore.js             # Zustand state management
├── utils/
│   └── timezones.js            # Timezone constants and helpers
└── styles/
    └── App.css                 # Global styles
```

### State Management (Zustand)

The application uses Zustand for centralized state management:

```javascript
State:
- profiles: Array of all user profiles
- events: Array of events for selected profile
- selectedProfile: Currently active profile
- loading: Loading state for async operations
- error: Error messages

Actions:
- fetchProfiles()
- createProfile(name, timezone)
- updateProfileTimezone(profileId, timezone)
- setSelectedProfile(profile)
- fetchEventsForProfile(profileId)
- createEvent(eventData)
- updateEvent(eventId, eventData)
- deleteEvent(eventId)
```

### Data Flow

1. User interacts with component
2. Component calls Zustand action
3. Action makes API call via Axios
4. Response updates Zustand state
5. Components re-render with new state

## Backend Architecture

### API Structure

```
server/
├── models/
│   ├── Profile.js              # Profile schema and model
│   └── Event.js                # Event schema with update logs
├── routes/
│   ├── profiles.js             # Profile CRUD endpoints
│   └── events.js               # Event CRUD endpoints
└── server.js                   # Express app configuration
```

### Database Schema

#### Profile Model
```javascript
{
  name: String (required),
  timezone: String (default: 'America/New_York'),
  createdAt: Date
}
```

#### Event Model
```javascript
{
  profiles: [ObjectId] (ref: 'Profile'),
  timezone: String (required),
  startDateTime: Date (required),
  endDateTime: Date (required),
  createdAt: Date,
  updatedAt: Date,
  updateLogs: [{
    updatedBy: String,
    changes: Map,
    timestamp: Date
  }]
}
```

### API Endpoints

#### Profiles
- `GET /api/profiles` - Retrieve all profiles
- `POST /api/profiles` - Create new profile
- `PATCH /api/profiles/:id/timezone` - Update profile timezone

#### Events
- `GET /api/events/profile/:profileId` - Get events for a profile
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event (with change tracking)
- `DELETE /api/events/:id` - Delete event

## Timezone Handling

### Strategy

1. **Storage**: All dates stored in UTC in MongoDB
2. **Transmission**: ISO 8601 format in API responses
3. **Display**: Converted to user's selected timezone using dayjs
4. **Input**: User inputs in their timezone, converted to UTC before saving

### Implementation

```javascript
// Creating event
const startDateTime = dayjs.tz(`${date} ${time}`, userTimezone).toISOString();

// Displaying event
const displayTime = dayjs(event.startDateTime).tz(viewTimezone).format('MMM D, YYYY hh:mm A');

// Updating timezone
// All existing times automatically convert when timezone changes
```

### Timezone Flow

```
User Input (Local TZ) → dayjs.tz() → UTC → MongoDB
                                              ↓
                                          Retrieve
                                              ↓
MongoDB → UTC → dayjs.tz(viewTZ) → Display (View TZ)
```

## Update Tracking System

### How It Works

1. When event is updated, compare old and new values
2. Store changes in `updateLogs` array
3. Each log entry contains:
   - Field name
   - Old value
   - New value
   - Timestamp

### Change Detection

```javascript
if (newValue !== oldValue) {
  changes[field] = {
    from: oldValue,
    to: newValue
  };
}

event.updateLogs.push({
  changes: changes,
  timestamp: new Date()
});
```

## Security Considerations

### Current Implementation
- CORS enabled for development
- Input validation on required fields
- Date validation (end after start)
- MongoDB injection prevention via Mongoose

### Production Recommendations
- Add authentication (JWT)
- Implement rate limiting
- Add input sanitization
- Use HTTPS
- Restrict CORS to specific domains
- Add request validation middleware
- Implement proper error handling
- Add logging and monitoring

## Performance Optimizations

### Current
- Efficient queries with Mongoose
- Populate only necessary fields
- Client-side state caching

### Future Improvements
- Implement pagination for large datasets
- Add database indexing on frequently queried fields
- Use Redis for caching
- Implement lazy loading for events
- Add debouncing for search inputs
- Optimize bundle size with code splitting

## Scalability Considerations

### Horizontal Scaling
- Stateless API design allows multiple server instances
- MongoDB can be sharded for large datasets
- Load balancer can distribute traffic

### Vertical Scaling
- Optimize database queries
- Add caching layer
- Implement CDN for static assets

## Error Handling

### Frontend
- Try-catch blocks in async operations
- Error state in Zustand store
- User-friendly error messages
- Form validation before submission

### Backend
- Mongoose validation
- Custom error messages
- HTTP status codes
- Error logging

## Testing Strategy

### Unit Tests (Recommended)
- Test timezone conversion functions
- Test Zustand actions
- Test API endpoints
- Test validation logic

### Integration Tests
- Test full event creation flow
- Test timezone switching
- Test update tracking

### E2E Tests
- Test complete user workflows
- Test cross-timezone scenarios
- Test edge cases

## Deployment Architecture

### Development
```
localhost:3000 (React Dev Server)
      ↓
localhost:5000 (Express API)
      ↓
localhost:27017 (MongoDB)
```

### Production
```
CDN/Static Host (React Build)
      ↓
API Server (Express)
      ↓
MongoDB Atlas (Cloud Database)
```

## Future Enhancements

### Features
- User authentication and authorization
- Event notifications
- Recurring events
- Calendar view
- Event categories/tags
- File attachments
- Email invitations

### Technical
- WebSocket for real-time updates
- GraphQL API option
- Microservices architecture
- Event sourcing pattern
- CQRS implementation

## Dependencies

### Frontend
- react: UI library
- zustand: State management
- axios: HTTP client
- dayjs: Date/time manipulation

### Backend
- express: Web framework
- mongoose: MongoDB ODM
- cors: Cross-origin resource sharing
- dotenv: Environment variables
- dayjs: Server-side date handling

## Development Workflow

1. Start MongoDB
2. Run `npm run dev` from root
3. Backend starts on port 5000
4. Frontend starts on port 3000
5. Make changes
6. Hot reload applies changes
7. Test functionality
8. Commit changes

## Code Style Guidelines

- Use functional components in React
- Use async/await for asynchronous operations
- Follow RESTful API conventions
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use ES6+ features
