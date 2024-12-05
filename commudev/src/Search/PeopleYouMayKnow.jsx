import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PeopleYouMayKnow = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState(5);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/all');
        // Filter out the current user
        const otherUsers = response.data
          .filter(user => user.userId.toString() !== currentUserId);
        setUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  const handleUserClick = (userId) => {
    navigate(`/view-profile/${userId}`);
  };

  const handleViewMore = () => {
    setDisplayedUsers(prev => prev + 5);
  };

  if (loading) {
    return (
      <div className="friends-section">
        <h3>PEOPLE YOU MAY KNOW</h3>
        <div 
          className="scrollable-friends-list" 
          style={{ 
            height: '250px', 
            overflowY: 'auto',
            padding: '10px'
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="friends-section">
      <h3>PEOPLE YOU MAY KNOW</h3>
      <div 
        className="scrollable-friends-list" 
        style={{ 
          height: '250px', 
          overflowY: 'auto',
          padding: '10px'
        }}
      >
        {users.slice(0, displayedUsers).map((user) => (
          <div
            key={user.userId}
            className="friend-item"
            onClick={() => handleUserClick(user.userId)}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '10px',
              padding: '5px',
              borderRadius: '5px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div className="avatar" style={{ marginRight: '10px' }}>
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
            </div>
            <span>{`${user.firstname} ${user.lastname}`}</span>
          </div>
        ))}
        
        {displayedUsers < users.length && (
          <button 
            onClick={handleViewMore}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            View More
          </button>
        )}
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;