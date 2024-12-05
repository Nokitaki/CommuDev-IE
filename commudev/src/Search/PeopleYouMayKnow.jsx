import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PeopleYouMayKnow = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/all');
        // Filter out the current user and limit to 5 users
        const otherUsers = response.data
          .filter(user => user.userId.toString() !== currentUserId)
          .slice(0, 5);
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

  if (loading) {
    return <div className="friends-section">
      <h3>PEOPLE YOU MAY KNOW</h3>
      <div className="scrollable-friends-list">
        Loading...
      </div>
    </div>;
  }

  return (
    <div className="friends-section">
      <h3>PEOPLE YOU MAY KNOW</h3>
      <div className="scrollable-friends-list">
        {users.map((user) => (
          <div
            key={user.userId}
            className="friend-item"
            onClick={() => handleUserClick(user.userId)}
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar">
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
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;