import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Briefcase, User } from 'lucide-react';
import '../styles/Profile.css';
import { useForm } from 'react-hook-form';

const ProfileUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
              });
    
          if (response.ok) {
            // Refresh user data after successful update
            const updatedUser = await response.json();
            setUser(updatedUser);
            setIsEditModalOpen(false);
          } else {
            console.error('Error updating user:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating user:', error);
        }
      };

    

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    if (loading) {
        return <div className="profilePage__loader">Loading...</div>;
    }

    if (error) {
        return <div className="profilePage__error">{error}</div>;
    }

    return (
        <div className="profilePage">
            {/* Profile Header */}
            <div className="profilePage__header">
                <div className="profilePage__coverPhoto" />
                <div className="profilePage__photoContainer">
                    <img 
                        src={user?.profilePicture || '/default-avatar.png'} 
                        alt="Profile" 
                        className="profilePage__photo"
                    />
                    <button className="profilePage__editPhotoBtn">
                        <Camera size={20} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="profilePage__content">
                {/* Left Column - Profile Info */}
                <div className="profilePage__info">
                    <div className="profilePage__basicInfo">
                        <h1 className="profilePage__name">{user?.firstname} {user?.lastname}</h1>
                        <p className="profilePage__username">@{user?.username}</p>
                    </div>

                    <div className="profilePage__details">
                        <div className="profilePage__detailItem">
                            <MapPin className="profilePage__detailIcon" />
                            <span>{user?.state || 'Location not set'}</span>
                        </div>
                        <div className="profilePage__detailItem">
                            <Briefcase className="profilePage__detailIcon" />
                            <span>{user?.employmentStatus || 'Employment not set'}</span>
                        </div>
                        <div className="profilePage__detailItem">
                            <User className="profilePage__detailIcon" />
                            <span>Age: {user?.age || 'Not set'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Stats and Activity */}
                <div className="profilePage__statsActivity">
                    <div className="profilePage__stats">
                        <div className="profilePage__statItem">
                            <span className="profilePage__statNumber">0</span>
                            <span className="profilePage__statLabel">Posts</span>
                        </div>
                        <div className="profilePage__statItem">
                            <span className="profilePage__statNumber">0</span>
                            <span className="profilePage__statLabel">Following</span>
                        </div>
                        <div className="profilePage__statItem">
                            <span className="profilePage__statNumber">0</span>
                            <span className="profilePage__statLabel">Followers</span>
                        </div>
                    </div>

                    <div className="profilePage__activity">
                        <h2 className="profilePage__activityTitle">Recent Activity</h2>
                        <div className="profilePage__activityContent">
                            No recent activity
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="profilePage__actions">
                <button 
                    className="profilePage__editButton"
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Edit Profile
                </button>
                <button 
                    className="profilePage__logoutButton"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
        <div className="profilePage__modalOverlay">
          <div className="profilePage__modalContent">
            <div className="profilePage__modalHeader">
              <h2 className="profilePage__modalTitle">Edit Profile</h2>
              <button 
                className="profilePage__closeButton"
                onClick={() => setIsEditModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="profilePage__modalBody">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="profilePage__formGroup">
                  <label htmlFor="firstname">First Name</label>
                  <input 
                    type="text"
                    id="firstname"
                    defaultValue={user.firstname}
                    {...register('firstname')}
                  />
                </div>
                <div className="profilePage__formGroup">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    type="text"
                    id="lastname" 
                    defaultValue={user.lastname}
                    {...register('lastname')}
                  />
                </div>
                <div className="profilePage__formGroup">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    defaultValue={user.state}
                    {...register('state')}
                  />
                </div>
                <div className="profilePage__formGroup">
                  <label htmlFor="employment">Employment</label>
                  <input
                    type="text"
                    id="employment"
                    defaultValue={user.employmentStatus}
                    {...register('employmentStatus')}
                  />
                </div>
                <div className="profilePage__formGroup">
                  <label htmlFor="age">Age</label>
                  <input 
                    type="number"
                    id="age"
                    defaultValue={user.age}
                    {...register('age')}
                  />
                </div>
                <button type="submit" className="profilePage__submitButton">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUser;