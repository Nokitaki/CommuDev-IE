import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserActivityTracker = ({ userId }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const [newsfeedResponse, resourceResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/newsfeed/getAllFeedDetails'),
          axios.get('http://localhost:8080/api/resource/getAllResourceDetails')
        ]);

        const userPosts = newsfeedResponse.data.filter(post => 
          post.creator_id && post.creator_id.toString() === userId.toString()
        );
        
        const userResources = resourceResponse.data.filter(resource => 
          resource.creator_id && resource.creator_id.toString() === userId.toString()
        );

        const allActivities = [
          ...userPosts.map(post => ({
            type: 'post',
            action: post.post_type,
            content: post.post_description,
            date: new Date(post.post_date),
            creator: post.creator
          })),
          ...userResources.map(resource => ({
            type: 'resource',
            action: resource.resource_category,
            content: resource.resource_title,
            date: new Date(resource.upload_date),
            creator: resource.creator
          }))
        ].sort((a, b) => b.date - a.date);

        setActivities(allActivities); // Removed the slice
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    if (userId) {
      fetchActivities();
      const interval = setInterval(fetchActivities, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '12px',
      maxHeight: '500px',
      overflowY: 'auto',
      padding: '8px'
    }}>
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '8px',
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '20px' }}>
              {activity.type === 'post' ? '📝' : '📚'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2196F3' }}>
                {activity.type === 'post' ? 'Created a' : 'Shared a'} {activity.action}
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#555', 
                marginTop: '4px',
                whiteSpace: 'pre-wrap'
              }}>
                {activity.content}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#666', 
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                {new Date(activity.date).toLocaleDateString()} {new Date(activity.date).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ 
          color: '#666', 
          padding: '16px', 
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px'
        }}>
          No recent activities
        </div>
      )}
    </div>
  );
};

export default UserActivityTracker;