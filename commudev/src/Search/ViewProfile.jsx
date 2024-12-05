import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Prof1 from '../assets/prof/prof1.png';

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
        setUser({
          ...response.data,
          profilePicture: response.data.profilePicture ? 
            `http://localhost:8080${response.data.profilePicture}` : 
            Prof1
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        Loading...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ color: '#dc2626' }}>{error || 'User not found'}</div>
          <button
            onClick={() => navigate('/newsfeed')}
            style={{
              marginTop: '16px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '24px'
      }}>
        <button
          onClick={() => navigate('/newsfeed')}
          style={{
            marginBottom: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ← Back to Homepage
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src={user.profilePicture}
            alt={`${user.firstname} ${user.lastname}`}
            style={{
              width: '128px',
              height: '128px',
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 16px',
              border: '4px solid #e5e7eb'
            }}
          />
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '4px'
          }}>
            {user.firstname} {user.lastname}
          </h1>
          <p style={{ color: '#6b7280' }}>{user.state || 'No location set'}</p>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={{ 
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px'
          }}>
            <h2 style={{ 
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>About</h2>
            <p style={{ color: '#4b5563' }}>{user.biography || 'No biography available'}</p>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {[
              { label: 'Employment', value: user.employmentStatus },
              { label: 'Email', value: user.email },
              { label: 'Age', value: user.age },
              { label: 'Goals', value: user.goals },
              { label: 'Hobbies', value: user.hobbies }
            ].map((item, index) => (
              item.value && (
                <div key={index} style={{
                  backgroundColor: '#f9fafb',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <h3 style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>{item.label}</h3>
                  <p style={{ color: '#4b5563' }}>{item.value}</p>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;