import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const ProfileUser = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        return <div className="loader"></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="cover-photo"></div>
                <div className="profile-photo-container">
                    <img 
                        src={user?.profilePicture || '/default-avatar.png'} 
                        alt="Profile" 
                        className="profile-photo"
                    />
                    <button className="edit-photo-btn">
                        <i className="camera-icon"></i>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="profile-content">
                {/* Left Column */}
                <div className="profile-info">
                    <div className="user-basic-info">
                        <h1>{user?.firstname} {user?.lastname}</h1>
                        <p className="username">@{user?.username}</p>
                    </div>

                    <div className="user-details">
                        <div className="detail-item">
                            <i className="location-icon"></i>
                            <span>{user?.state || 'Location not set'}</span>
                        </div>
                        <div className="detail-item">
                            <i className="work-icon"></i>
                            <span>{user?.employmentStatus || 'Employment not set'}</span>
                        </div>
                        <div className="detail-item">
                            <i className="age-icon"></i>
                            <span>Age: {user?.age || 'Not set'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="profile-stats-activity">
                    <div className="stats-container">
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Posts</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Following</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">0</span>
                            <span className="stat-label">Followers</span>
                        </div>
                    </div>

                    <div className="activity-section">
                        <h2>Recent Activity</h2>
                        <div className="activity-content">
                            No recent activity
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
                <button 
                    className="edit-button"
                    onClick={() => setIsEditModalOpen(true)}
                >
                    Edit Profile
                </button>
                <button 
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button 
                                className="close-button"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Add your edit form here */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileUser;