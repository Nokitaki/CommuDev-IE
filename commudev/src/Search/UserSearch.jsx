import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch users based on search term
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/user/all');
        const allUsers = response.data;
        
        // Filter users based on search term
        const filteredUsers = allUsers.filter(user => 
          (user.firstname?.toLowerCase() + ' ' + user.lastname?.toLowerCase())
            .includes(searchTerm.toLowerCase())
        );
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleUserSelect = (userId) => {
    navigate(`/view-profile/${userId}`);
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div 
      ref={searchRef}
      style={{ position: 'relative', width: '100%' }}
    >
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true);
        }}
        onClick={() => setShowResults(true)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px'
        }}
      />

      {showResults && (searchTerm || users.length > 0) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginTop: '4px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {isLoading ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              Loading...
            </div>
          ) : users.length > 0 ? (
            <div>
              {users.map((user) => (
                <div
                  key={user.userId}
                  onClick={() => handleUserSelect(user.userId)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderBottom: '1px solid #eee',
                    ':hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <img
                    src={user.profilePicture ? 
                      `http://localhost:8080${user.profilePicture}` : 
                      '/api/placeholder/32/32'}
                    alt={`${user.firstname} ${user.lastname}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      {user.firstname} {user.lastname}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {user.state || 'No location'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
              No users found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default UserSearch;