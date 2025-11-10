import React, { useState, useEffect, useRef } from 'react';
import useStore from '../store/useStore';

const ProfileSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  const { profiles, selectedProfile, setSelectedProfile, createProfile, fetchProfiles } = useStore();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (!newProfileName.trim()) {
      setError('Profile name is required');
      return;
    }

    // check if profile with same name already exists (case-insensitive)
    const duplicateProfile = profiles.find(
      p => p.name.toLowerCase() === newProfileName.trim().toLowerCase()
    );

    if (duplicateProfile) {
      setError(`Profile "${newProfileName.trim()}" already exists`);
      return;
    }

    try {
      await createProfile(newProfileName.trim(), 'America/New_York');
      setNewProfileName('');
      setSearchTerm('');
      setError('');
    } catch (error) {
      // backend validation will also catch duplicates
      setError(error.message || 'Failed to create profile');
    }
  };

  return (
    <div className="profile-selector" ref={dropdownRef}>
      <button 
        className="profile-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedProfile ? selectedProfile.name : 'Select current profile...'}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-search">
            <input
              type="text"
              placeholder="Search current profile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="profile-list">
            {filteredProfiles.map(profile => (
              <div
                key={profile._id}
                className={`profile-item ${selectedProfile?._id === profile._id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedProfile(profile);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <span>{profile.name}</span>
              </div>
            ))}
          </div>

          <div className="add-profile-section">
            {error && <div className="profile-error">{error}</div>}
            <form onSubmit={handleAddProfile} className="add-profile-form">
              <input
                type="text"
                placeholder="alpha"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
              <button type="submit" className="btn-add">Add</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
