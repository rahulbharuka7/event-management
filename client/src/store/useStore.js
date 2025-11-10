import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set, get) => ({
  // state
  profiles: [],
  events: [],
  selectedProfile: null,
  loading: false,
  error: null,

  // profile actions
  fetchProfiles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/profiles');
      set({ profiles: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createProfile: async (name, timezone) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/profiles', { name, timezone });
      set(state => ({ 
        profiles: [...state.profiles, response.data], 
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateProfileTimezone: async (profileId, timezone) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/api/profiles/${profileId}/timezone`, { timezone });
      set(state => ({
        profiles: state.profiles.map(p => 
          p._id === profileId ? response.data : p
        ),
        selectedProfile: state.selectedProfile?._id === profileId ? response.data : state.selectedProfile,
        loading: false
      }));
      // refresh events to show updated timezone
      if (get().selectedProfile?._id === profileId) {
        get().fetchEventsForProfile(profileId);
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedProfile: (profile) => {
    set({ selectedProfile: profile });
    if (profile) {
      get().fetchEventsForProfile(profile._id);
    } else {
      set({ events: [] });
    }
  },

  // event actions
  fetchEventsForProfile: async (profileId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`/api/events/profile/${profileId}`);
      set({ events: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('/api/events', eventData);
      set(state => ({ 
        events: [...state.events, response.data], 
        loading: false 
      }));
      // refresh events for current profile
      if (get().selectedProfile) {
        get().fetchEventsForProfile(get().selectedProfile._id);
      }
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  updateEvent: async (eventId, eventData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.patch(`/api/events/${eventId}`, eventData);
      set(state => ({
        events: state.events.map(e => 
          e._id === eventId ? response.data : e
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/events/${eventId}`);
      set(state => ({
        events: state.events.filter(e => e._id !== eventId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useStore;
