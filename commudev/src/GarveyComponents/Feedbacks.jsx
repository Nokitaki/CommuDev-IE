import React, { useState, useEffect } from "react";
import "../styles/FeedbackTest.css";
import { Link } from "react-router-dom";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import Prof1 from "../assets/prof/prof1.png";
import MyCalendar from "../JoelComponents/MyCalendar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import UserSearch from '../Search/UserSearch';
import PeopleYouMayKnow from '../Search/PeopleYouMayKnow.jsx';
const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    feedbackType: "",
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");

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

  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/newsfeed" },
    { icon: MessageIcon, label: "Messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resource" },
    { icon: TaskIcon, label: "Task", path: "/task" },
    { icon: RewardsIcon, label: "Rewards", path: "/rewards" },
    { icon: FeedbackIcon, label: "Feedback", path: "/feedback" },
  ];

  const users = [
    { name: "Harry", isOnline: false, image: "prof1.jpg" },
    { name: "Keanu", isOnline: true, image: "prof2.jpg" },
  ];

  const notifications = [
    {
      user: "Keanu",
      image: "prof1.png",
      message: "submitted new feedback",
      time: "2 minutes ago",
    },
  ];

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/feedback/user/${userId}`
      );
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = localStorage.getItem("userId");
    const feedbackData = {
      userId: userId,
      feedbackType: form.feedbackType,
      subject: form.subject,
      description: form.description,
      dateSubmitted: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/feedback/add",
        feedbackData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
       
        setFeedbacks((prev) => [response.data, ...prev]);

       
        setForm({
          feedbackType: "",
          subject: "",
          description: "",
        });
        setIsModalOpen(false);

      
        await fetchFeedbacks();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFeedback = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/feedback/${editId}`,
        {
          feedbackType: form.feedbackType,
          subject: form.subject,
          description: form.description,
          dateSubmitted: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setFeedbacks((prev) =>
          prev.map((feedback) =>
            feedback.feedback_id === editId ? response.data : feedback
          )
        );
        setEditId(null);
        setForm({
          feedbackType: "",
          subject: "",
          description: "",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:8080/api/feedback/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        setFeedbacks((prev) =>
          prev.filter((feedback) => feedback.feedback_id !== id)
        );
      } catch (error) {
        console.error("Error deleting feedback:", error);
      }
    }
  };

  return (
    <div className="community-platform-resource">
     
      <div className="sidebar">
        <div className="header">
          <Link to="/newsfeed">
            <div className="logo">
              <img src={LogoIcon} alt="Logo" className="logo-icon" />
            </div>
          </Link>



          <div className="search-bar">
                <UserSearch />
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
          <h3><PeopleYouMayKnow /></h3>
          <div className="scrollable-friends-list">
            {users.map((user, index) => (
              <div key={index} className="friend-item">
                <div className="avatar">
                  <div
                    className={`status-indicator ${
                      user.isOnline ? "online" : ""
                    }`}
                  />
                </div>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

     
      <div className="main-content-resource">
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

        <div className="storiesAndfeedResource">
          <div className="create-post-section-resource">
            <div className="resource-header-container">
              <h2 className="feed-title-resource">Feedback Center</h2>
              <button
                className="category-button active"
                onClick={() => setIsModalOpen(true)}
              >
                Submit Feedback
              </button>
            </div>
            <div className="categories-container">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`category-button ${
                  selectedCategory === "all" ? "active" : ""
                }`}
              >
                All Feedback
              </button>
              <button
                onClick={() => setSelectedCategory("Bug Report")}
                className={`category-button ${
                  selectedCategory === "Bug Report" ? "active" : ""
                }`}
              >
                Bug Reports
              </button>
              <button
                onClick={() => setSelectedCategory("Feature Request")}
                className={`category-button ${
                  selectedCategory === "Feature Request" ? "active" : ""
                }`}
              >
                Feature Requests
              </button>
              <button
                onClick={() => setSelectedCategory("General Feedback")}
                className={`category-button ${
                  selectedCategory === "General Feedback" ? "active" : ""
                }`}
              >
                General
              </button>
            </div>
          </div>

          <div className="feedback-container">
            {feedbacks
              .filter(
                (feedback) =>
                  selectedCategory === "all" ||
                  (feedback.feedbackType || "").toLowerCase() ===
                    selectedCategory.toLowerCase()
              )
              .map((feedback) => (
                <article key={feedback.feedback_id} className="resource-itemZ">
                  <header className="post-header">
                    <div className="profile-avatar">
                      <img
                        src={profilePicture || Prof1}
                        alt="Profile"
                        className="profile-image"
                      />
                    </div>
                    <div className="user-info">
                      <div className="user-meta">
                        <h3 style={{marginBottom: "0"}}>
                          {userData
                            ? `${userData.firstname} ${userData.lastname}`
                            : "Loading..."}
                        </h3>
                        <span className="post-meta" style={{marginTop: "1.5em"}}>•</span>
                        <span className="post-meta" style={{marginTop: "1.5em"}}>
                          {feedback.dateSubmitted}
                        </span>
                      </div>
                      <div className="status-badges">
                        <span
                          className={`feedback-type-badge ${(
                            feedback.feedbackType || ""
                          )
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {feedback.feedbackType || "Unknown Type"}
                        </span>
                      </div>
                    </div>
                  </header>

                  <div className="resource-content">
                    <h3 className="resource-titleX">{feedback.subject}</h3>
                    <p className="resource-descriptionX">
                      {feedback.description}
                    </p>
                  </div>

                  <footer className="resource-actions">
                    <button
                      className="download-button"
                      onClick={() => {
                        setEditId(feedback.feedback_id);
                        setForm({
                          feedbackType: feedback.feedbackType,
                          subject: feedback.subject,
                          description: feedback.description,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="download-button"
                      onClick={() => handleDeleteFeedback(feedback.feedback_id)}
                    >
                      Delete
                    </button>
                  </footer>
                </article>
              ))}
          </div>
        </div>
      </div>

      
      <div className="left-sidebar">
        <div className="feedback-calendar">
          <h2>Calendar</h2>
          <MyCalendar />
        </div>

        <div className="feedback-notifications-container">
          <h2>Notifications</h2>
          <div className="notifications">
            {notifications.map((notification, index) => (
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
                <p className="notification-message">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {editId ? "Edit Feedback" : "Submit Feedback"}
            </h3>
            <form onSubmit={editId ? handleUpdateFeedback : handleSubmit}>
              <select
                value={form.feedbackType}
                onChange={(e) =>
                  setForm({ ...form, feedbackType: e.target.value })
                }
                className="modal-select"
                required
              >
                <option value="">Select Feedback Type</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Feedback">General Feedback</option>
              </select>

              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Subject"
                className="modal-input"
                required
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className="modal-textarea"
                required
              />

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : editId
                    ? "Update Feedback"
                    : "Submit Feedback"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditId(null);
                    setForm({
                      feedbackType: "",
                      subject: "",
                      description: "",
                    });
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
    </div>
  );
};

export default Feedbacks;
