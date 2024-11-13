import React, { useState, useEffect } from 'react';
import '../styles/Newsfeeditem.css';
import ProfilePic from '../assets/me.jpg';

const NewsFeedItem = ({ post, handleUpdate, handleDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState(post);
  const [isLiked, setIsLiked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setEditPost(post);
  }, [post]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (editPost.post_description.trim()) {
      handleUpdate(editPost);
      setIsEditing(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/newsfeed/like/${post.newsfeed_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ like_count: post.like_count + 1 }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        handleUpdate(updatedPost);
        setIsLiked(true);
        setTimeout(() => setIsLiked(false), 1000);
      }
    } catch (error) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const getDaysAgo = (dateString) => {
    if (!dateString) {
      console.error('No date provided');
      return 'No date available';
    }
  
    const postDate = new Date(dateString);
    
    if (isNaN(postDate.getTime())) {
      console.error('Invalid date passed to getDaysAgo:', dateString);
      return 'Invalid date';
    }
  
    const nowDate = new Date();
    const diffInMilliseconds = nowDate.getTime() - postDate.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays <= 2) return `${diffInDays} days ago`;
    
    // Format the date if it's more than 2 days ago
    return postDate.toLocaleDateString();
  };
  

  // Change this line to reference the correct property
  const timeAgo = post.post_date ? getDaysAgo(post.post_date) : 'No date available';

  

  return (
    <article className="feed-item">
      {showAlert && <div className="alert">An error occurred while liking the post.</div>}
      <header className="post-header">
        <img src={ProfilePic} alt="Profile" className="profile-image" />
        <div className="user-info">
          <div className="user-meta">
            <h3 className="username">{post.username}</h3>
            <span className="post-meta">•</span>
            <span className="post-meta">{timeAgo}</span>
          </div>
          <div className="status-badges">
            <span
              className={`status-badge ${post.isActive || post.post_status === 'Active' ? 'status-badge-active' : 'status-badge-inactive'}`}
            >
              {post.isActive || post.post_status === 'Active' ? 'Active' : 'Inactive'}
            </span>
            
            <span className="post-meta">
            {post.post_type && (
              <span
                className={`post-type-value post-type-${post.post_type.toLowerCase()}`}
              >
                {post.post_type}
              </span>
            )}
          </span>
          </div>

        </div>
      </header>

      <div className="post-content">
        {isEditing ? (
          <form className="edit-form" onSubmit={handleSave}>
            <textarea
              className="edit-textarea"
              name="post_description"
              value={editPost.post_description}
              onChange={handleChange}
            />
            <div className="edit-actions">
              <button type="button" className="btn btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-save">Save</button>
            </div>
          </form>
        ) : (
          <p>{post.post_description}</p>
        )}
      </div>

      <footer className="post-actions">
        <button className={`like-button ${isLiked ? 'active' : ''}`} onClick={handleLike}>
          <svg className="heart-icon" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {post.like_count} Likes
        </button>

        <div className="action-buttons">
          <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
            <svg className="edit-icon" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 23c-6.055 0-11-4.945-11-11s4.945-11 11-11 11 4.945 11 11-4.945 11-11 11zm-.707-16.293l-1.414 1.414 3.414 3.414h-2.414v2h4.414l-4.414-4.414zm-1.293 6.293v-1.586h2v1.586h-2z" />
            </svg>
            Edit
          </button>
          <button className="btn btn-delete" onClick={() => handleDelete(post.newsfeed_id)}>
            Delete
          </button>
        </div>
      </footer>
    </article>
  );
};

export default NewsFeedItem;
