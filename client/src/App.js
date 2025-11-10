import React from 'react';
import { Calendar } from 'lucide-react';
import './styles/App.css';
import ProfileSelector from './components/ProfileSelector';
import CreateEvent from './components/CreateEvent';
import EventsList from './components/EventsList';

function App() {
  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>
            <Calendar size={32} />
            Event Management
          </h1>
          <p>Create and manage events across multiple timezones</p>
        </div>
        <ProfileSelector />
      </div>

      <div className="main-content">
        <CreateEvent />
        <EventsList />
      </div>
    </div>
  );
}

export default App;
