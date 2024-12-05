import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Prof1 from '../assets/prof/prof1.png';

const UserCarousel = () => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');
  const avatarsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/all');
        // Filter out the current user
        const otherUsers = response.data.filter(user => user.userId.toString() !== currentUserId);
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

  const nextPage = () => {
    if (currentIndex + avatarsPerPage < users.length) {
      setCurrentIndex(currentIndex + avatarsPerPage);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - avatarsPerPage);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-avatars-container">
      <button
        onClick={prevPage}
        disabled={currentIndex === 0}
        className="nav-button"
      >
        ❮
      </button>
      <div className="user-avatars">
        {users
          .slice(currentIndex, currentIndex + avatarsPerPage)
          .map((user) => (
            <div 
              key={user.userId} 
              className="user-avatar"
              onClick={() => handleUserClick(user.userId)}
              style={{ cursor: 'pointer' }}
            >
              <div className="avatar-wrapper">
                <img
                  src={user.profilePicture ? 
                    `http://localhost:8080${user.profilePicture}` : 
                    Prof1}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="avatar-image"
                />
              </div>
              <span className="avatar-name">{`${user.firstname} ${user.lastname}`}</span>
            </div>
          ))}
      </div>
      <button
        onClick={nextPage}
        disabled={currentIndex + avatarsPerPage >= users.length}
        className="nav-button"
      >
        ❯
      </button>
    </div>
  );
};

export default UserCarousel;