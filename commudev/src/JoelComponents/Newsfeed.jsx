import React, { useState, useEffect } from 'react';
import Newsfeeditem from './Newsfeeditem';
import "../styles/Newsfeed.css";

const NewsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    post_description: '',
    post_type: '',
    post_date: new Date().toISOString().split('T')[0],
    like_count: 0,
    post_status: 'Active'
  });

  useEffect(() => {
    fetch('http://localhost:8080/api/newsfeed/getAllFeedDetails')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data.map((post) => ({ ...post, type: post.post_type })));
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handleAddPost = () => {
    const isValidDate = (dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString);

    if (!isValidDate(newPost.post_date)) {
      console.error('Invalid date format');
      return;
    }

    const formattedPost = {
      ...newPost,
      post_date: new Date(newPost.post_date).toISOString(),
    };

    fetch('http://localhost:8080/api/newsfeed/addFeedDetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedPost),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      setPosts((prevPosts) => [...prevPosts, data]);
      setNewPost({ 
        post_description: '', 
        post_type: '', 
        post_date: new Date().toISOString().split('T')[0], 
        like_count: 0, 
        post_status: 'Active'
      });
    })
    .catch((error) => console.error('Error adding post:', error));
  };

  const handleUpdatePost = (updatedPost) => {
    fetch(`http://localhost:8080/api/newsfeed/updateFeedDetails?newsfeed_id=${updatedPost.newsfeed_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    })
    .then((response) => response.json())
    .then((data) => {
      setPosts((prevPosts) => prevPosts.map(post => post.newsfeed_id === updatedPost.newsfeed_id ? updatedPost : post));
    })
    .catch((error) => {
      console.error('Error updating post:', error);
    });
  };

  const handleDeletePost = (id) => {
    fetch(`http://localhost:8080/api/newsfeed/deleteFeed/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setPosts((prevPosts) => prevPosts.filter(post => post.newsfeed_id !== id));
    })
    .catch((error) => console.error('Error deleting post:', error));
  };

  return (
    <div className="newsfeed">
      <h2>Community News Feed</h2>
      
      <div className="add-post-form">
        <input
          type="text"
          name="post_description"
          value={newPost.post_description}
          onChange={(e) => setNewPost((prev) => ({ ...prev, post_description: e.target.value }))}
          placeholder="What's on your mind?"
          className="input-description"
        />
        <select
          name="post_type"
          value={newPost.post_type}
          onChange={(e) => setNewPost((prev) => ({ ...prev, post_type: e.target.value }))}
          className="input-type"
        >
          <option value="">Select Post Type</option>
          <option value="Announcement">Announcement</option>
          <option value="Event">Event</option>
          <option value="Reminder">Reminder</option>
        </select>
        <input
          type="date"
          name="post_date"
          value={newPost.post_date}
          onChange={(e) => setNewPost((prev) => ({ ...prev, post_date: e.target.value }))}
          className="input-date"
        />
        <button className="add-post-btn" onClick={handleAddPost}>
          Add Post
        </button>
      </div>

      {posts.length > 0 ? (
        <div className="posts-list">
          {posts.map((post) => (
            <Newsfeeditem 
              key={post.newsfeed_id} 
              post={post} 
              handleUpdate={handleUpdatePost} 
              handleDelete={handleDeletePost} 
            />
          ))}
        </div>
      ) : (
        <p className="no-posts-message">No posts available.</p>
      )}
    </div>
  );
};

export default NewsFeed;