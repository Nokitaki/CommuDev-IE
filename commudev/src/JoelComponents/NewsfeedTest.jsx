//Newsfeed.jsx
import "../styles/NewsfeedTest.css";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import CommuIcon from "../assets/CommuIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import LeaderboardsIcon from "../assets/LeaderboardsIcon.svg";
import React, { useState, useEffect } from "react";
import MyCalendar from "./MyCalendar.jsx";
import Prof1 from "../assets/prof/prof1.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CommunityPlatform = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  //prof-pic
  const [profilePicture, setProfilePicture] = useState(null);
  //
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    creator: userName,
    post_description: "",
    post_type: "",
    post_date: new Date().toISOString().split("T")[0],
    community: "",
    creator: "",
  });

  const users = [
    { name: "Harry", isOnline: false, image: "prof1.jpg" },
    { name: "Keanu", isOnline: true, image: "prof2.jpg" },
    { name: "Ariana", isOnline: true, image: "prof3.jpg" },
    { name: "Justin", isOnline: true, image: "prof4.jpg" },
    { name: "Carl", isOnline: false, image: "prof2.jpg" },
    { name: "James", isOnline: true, image: "prof6.jpg" },
    { name: "Harry", isOnline: false, image: "prof1.jpg" },
    { name: "Keanu", isOnline: true, image: "prof2.jpg" },
    { name: "Ariana", isOnline: true, image: "prof3.jpg" },
    { name: "Justin", isOnline: true, image: "prof4.jpg" },
    { name: "Carl", isOnline: false, image: "prof4.jpg" },
    { name: "Harry", isOnline: false, image: "prof1.jpg" },
    { name: "Keanu", isOnline: true, image: "prof2.jpg" },
    { name: "Ariana", isOnline: true, image: "prof3.jpg" },
    { name: "Justin", isOnline: true, image: "prof4.jpg" },
    { name: "Carl", isOnline: false, image: "prof4.jpg" },
  ];

  const notifications = [
    {
      user: "Keanu",
      image: "prof1.jpg",
      message: "liked your post",
      time: "2 minutes ago",
    },
    {
      user: "Ariana",
      image: "prof2.jpg",
      message: "commented on your picture",
      time: "5 minutes ago",
    },
    {
      user: "Harry",
      image: "prof3.jpg",
      message: "sent you a friend request",
      time: "10 minutes ago",
    },
    {
      user: "James",
      image: "prof4.jpg",
      message: "shared your post",
      time: "20 minutes ago",
    },
    {
      user: "Carl",
      image: "prof5.jpg",
      message: "started following you",
      time: "1 hour ago",
    },
  ];

  // Navigations
  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/newsfeed" },
    { icon: MessageIcon, label: "Messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resource" },
    { icon: TaskIcon, label: "Task", path: "/task" },
    { icon: RewardsIcon, label: "Rewards" },
    { icon: FeedbackIcon, label: "Feedback" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/${userId}`
        );
        const data = response.data;

        setUserData(data);
        // Set the profile picture URL
        if (data.profilePicture) {
          setProfilePicture(`http://localhost:8080${data.profilePicture}`);
        }

        const fullName = String(
          `${data.firstname || ""} ${data.lastname || ""}`
        ).trim();
        setUserName(fullName);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("userId");
          navigate("/");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/newsfeed/getAllFeedDetails"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Fetch profile pictures for each post's creator
      const postsWithProfilePictures = await Promise.all(
        data.map(async (post) => {
          try {
            const userResponse = await axios.get(
              `http://localhost:8080/api/user/${post.creator_id}`
            );
            const userData = userResponse.data;
            return {
              ...post,
              type: post.post_type,
              creator_profile_picture: userData.profilePicture
                ? `http://localhost:8080${userData.profilePicture}`
                : null,
            };
          } catch (error) {
            console.error(
              `Error fetching profile picture for post ${post.newsfeed_id}:`,
              error
            );
            return {
              ...post,
              type: post.post_type,
              creator_profile_picture: null,
            };
          }
        })
      );

      setPosts(postsWithProfilePictures);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      creator: userName,
      post_description: formData.post_description,
      post_type: formData.post_type,
      post_date: new Date(formData.post_date).toISOString(),
      like_count: editingPost ? editingPost.like_count : 0,
      post_status: "Active",
      creator_id: userId, // Add creator's ID
      creator_profile_picture: profilePicture,
    };

    try {
      let response;
      if (editingPost) {
        response = await fetch(
          `http://localhost:8080/api/newsfeed/updateFeedDetails?newsfeed_id=${editingPost.newsfeed_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...postData,
              newsfeed_id: editingPost.newsfeed_id,
            }),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:8080/api/newsfeed/addFeedDetails",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (editingPost) {
        setPosts(
          posts.map((post) =>
            post.newsfeed_id === editingPost.newsfeed_id ? data : post
          )
        );
      } else {
        setPosts([data, ...posts]);
      }

      setFormData({
        creator: userName,
        post_description: "",
        post_type: "",
        post_date: new Date().toISOString().split("T")[0],
        community: "",
      });
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      post_description: post.post_description,
      post_type: post.post_type,
      post_date: new Date(post.post_date).toISOString().split("T")[0],
      community: post.community || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/newsfeed/deleteFeed/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        setPosts(posts.filter((post) => post.newsfeed_id !== id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleLike = async (post) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/newsfeed/like/${post.newsfeed_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ like_count: (post.like_count || 0) + 1 }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      const updatedPost = await response.json();
      setPosts(
        posts.map((p) => (p.newsfeed_id === post.newsfeed_id ? updatedPost : p))
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Time ago function
  const getDaysAgo = (dateString) => {
    if (!dateString) return "No date available";

    const postDate = new Date(dateString);
    if (isNaN(postDate.getTime())) return "Invalid date";

    const nowDate = new Date();
    const diffInMilliseconds = nowDate.getTime() - postDate.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays <= 2) return `${diffInDays} days ago`;

    return postDate.toLocaleDateString();
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const avatarsPerPage = 8;

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

  return (
    <>
      <div className="community-platform">
        <div className="sidebar">
          <div className="header">
            <Link to="/newsfeed">
              <div className="logo">
                <img src={LogoIcon} alt="Logo" className="logo-icon" />
              </div>
            </Link>
            <div className="search-bar">
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <Link to="/profileuser" className="profile-sidebar-link">
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <img
                  src={profilePicture || Prof1}
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div className="profile-info">
                <h4>
                  {userData
                    ? `${userData.firstname} ${userData.lastname}`
                    : "Loading..."}
                </h4>
              </div>
            </div>
          </Link>

          <div className="community-section">
            <h3>YOUR COMMUNITY</h3>
            <div className="community-item">
              <span className="community-icon">🏛️ </span>
              <span> Municipal Community</span>
            </div>
            <div className="community-item">
              <span className="community-icon">🎨 </span>
              <span> Barangay Community</span>
            </div>
          </div>

          <div className="friends-section">
            <h3>FRIENDS</h3>
            <div className="scrollable-friends-list">
              {users.map((user, index) => (
                <div key={index} className="friend-item">
                  <div className="avatar">
                    <div
                      className={`status-indicator ${
                        user.isOnline ? "online" : ""
                      }`}
                    ></div>
                  </div>
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="navigation-bar">
            <div className="nav-icons">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={
                    item.path || `/${item.label.toLowerCase().replace(" ", "")}`
                  }
                  className="nav-item"
                >
                  <img
                    src={item.icon}
                    alt={`${item.label} icon`}
                    className="nav-icon"
                  />
                </Link>
              ))}
            </div>
          </div>
          <div className="storiesAndfeed">
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
                  .map((user, index) => (
                    <div key={index} className="user-avatar">
                      <div className="avatar-wrapper">
                        <img
                          src={`src/assets/prof/${user.image}`}
                          alt={user.name}
                          className="avatar-image"
                        />
                      </div>
                      <span className="avatar-name">{user.name}</span>
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

            <div className="feed-container">
              <div className="create-post-section">
                <h2 className="feed-title">Community News Feed</h2>
                <div
                  className="post-input-container"
                  onClick={() => {
                    setEditingPost(null);
                    setFormData({
                      post_description: "",
                      post_type: "",
                      post_date: new Date().toISOString().split("T")[0],
                      community: "",
                    });
                    setIsModalOpen(true);
                  }}
                >
                  <input
                    type="text"
                    placeholder="What's on your mind?"
                    className="post-input"
                    readOnly
                  />
                </div>
              </div>

              {/* Modal */}
              {isModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3 className="modal-title">
                      {editingPost ? "Edit Post" : "Create a Post"}
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <textarea
                        value={formData.post_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            post_description: e.target.value,
                          })
                        }
                        placeholder="Write your post here..."
                        className="modal-textarea"
                      />

                      <select
                        value={formData.community}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            community: e.target.value,
                          })
                        }
                        className="modal-select"
                      >
                        <option value="">Select Community</option>
                        <option value="Barangay Community">
                          Barangay Community
                        </option>
                        <option value="Municipality Community">
                          Municipality Community
                        </option>
                      </select>

                      <select
                        value={formData.post_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            post_type: e.target.value,
                          })
                        }
                        className="modal-select"
                      >
                        <option value="">Select Post Type</option>
                        <option value="Announcement">Announcement</option>
                        <option value="Event">Event</option>
                        <option value="Reminder">Reminder</option>
                      </select>

                      <input
                        type="date"
                        value={formData.post_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            post_date: e.target.value,
                          })
                        }
                        className="modal-date-input"
                      />

                      <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">
                          {editingPost ? "Save Changes" : "Create Post"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsModalOpen(false);
                            setEditingPost(null);
                          }}
                          className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {posts.map((post) => (
                <article key={post.newsfeed_id} className="feed-item">
                  <header className="post-header">
                    <div className="profile-circlecover">
                      <img
                        className="profile-image"
                        src={post.creator_profile_picture || Prof1}
                        alt="Profile"
                      />
                    </div>
                    <div className="user-info">
                      <div className="user-meta">
                        <h3 className="username">
                          {post.creator || formData.creator}
                        </h3>
                        <span className="post-meta">•</span>
                        <span className="post-meta">
                          {getDaysAgo(post.post_date)}
                        </span>
                      </div>
                      <div className="status-badges">
                        <span
                          className={`status-badge ${
                            post.post_status === "Active"
                              ? "status-badge-active"
                              : "status-badge-inactive"
                          }`}
                        >
                          {post.post_status}
                        </span>
                        <span className="post-meta">
                          <span
                            className={`post-type-value post-type-${post.post_type.toLowerCase()}`}
                          >
                            {post.post_type}
                          </span>
                        </span>
                      </div>
                    </div>
                  </header>

                  <div className="post-content">
                    <p>{post.post_description}</p>
                    {post.image && (
                      <div className="post-image">
                        <img src={post.image} alt="Post content" />
                      </div>
                    )}
                  </div>

                  <footer className="post-actions">
                    <button
                      className="like-button"
                      onClick={() => handleLike(post)}
                    >
                      <svg className="heart-icon" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {post.like_count || 0} Likes
                    </button>

                    <div className="action-buttons">
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEdit(post)}
                      >
                        <svg className="edit-icon" viewBox="0 0 24 24">
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 23c-6.055 0-11-4.945-11-11s4.945-11 11-11 11 4.945 11 11-4.945 11-11 11zm-.707-16.293l-1.414 1.414 3.414 3.414h-2.414v2h4.414l-4.414-4.414zm-1.293 6.293v-1.586h2v1.586h-2z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(post.newsfeed_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="left-sidebar">
          <div className="calendar">
            <h2>Calendar</h2>
            <MyCalendar />
          </div>

          <div className="notifications-container">
            <h2>Notifications</h2>
            <div className="notifications">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <div className="notification-header">
                      <img
                        src={`src/assets/prof/${notification.image}`}
                        alt={`${notification.user}'s profile`}
                        className="notification-image"
                      />
                      <div>
                        <span className="notification-username">
                          {notification.user}
                        </span>
                        <span className="notification-time">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                  </div>
                ))
              ) : (
                <p>No notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPlatform;
