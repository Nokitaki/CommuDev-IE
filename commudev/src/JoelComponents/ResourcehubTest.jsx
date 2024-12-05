//ResourcehubTest.jsx
import React, { useState, useEffect } from "react";
import "../styles/ResourcehubTest.css";
import { Link } from "react-router-dom";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import CommuIcon from "../assets/CommuIcon.svg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import Prof1 from "../assets/prof/prof1.png";
import MyCalendar from "./MyCalendar.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import UserSearch from '../search/UserSearch';

const ResourceHub = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

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

  const [formData, setFormData] = useState({
    creator: userName,
    creator_id: userId,
    creator_profile_picture: profilePicture,
    resource_title: "",
    resource_description: "",
    resource_category: "",
    heart_count: 0,
    upload_date: new Date().toISOString(),
  });

 
  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/newsfeed" },
    { icon: MessageIcon, label: "Messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resource" },
    { icon: TaskIcon, label: "Task", path: "/task" },
    { icon: RewardsIcon, label: "Rewards" },
    { icon: FeedbackIcon, label: "Feedback" },
  ];

  const users = [
    { name: "Harry", isOnline: false, image: "prof1.jpg" },
    { name: "Keanu", isOnline: true, image: "prof2.jpg" },
  
  ];

  const notifications = [
    {
      user: "Keanu",
      image: "prof1.png",
      message: "downloaded your resource",
      time: "2 minutes ago",
    },
    {
      user: "Keanu",
      image: "prof1.png",
      message: "downloaded your resource",
      time: "2 minutes ago",
    },
    {
      user: "Keanu",
      image: "prof1.png",
      message: "downloaded your resource",
      time: "2 minutes ago",
    },
    
  ];

  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Community Guidelines",
      description:
        "Essential guidelines and rules for community participation and engagement. Includes best practices and code of conduct.",
      type: "documents",
      date: "2024-11-20",
      downloads: 45,
      status: "Active",
      fileSize: "2.5 MB",
    },
    {
      id: 2,
      title: "Community Guidelines",
      description:
        "Essential guidelines and rules for community participation and engagement. Includes best practices and code of conduct.",
      type: "documents",
      date: "2024-11-20",
      downloads: 45,
      status: "Active",
      fileSize: "2.5 MB",
    },
    {
      id: 3,
      title: "Community Guidelines",
      description:
        "Essential guidelines and rules for community participation and engagement. Includes best practices and code of conduct.",
      type: "documents",
      date: "2024-11-20",
      downloads: 45,
      status: "Active",
      fileSize: "2.5 MB",
    },
    
  ]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/resource/getAllResourceDetails"
      );
      if (!response.ok) throw new Error("Failed to fetch resources");
      const data = await response.json();

     
      const resourcesWithProfilePictures = await Promise.all(
        data.map(async (item) => {
          try {
            const userResponse = await axios.get(
              `http://localhost:8080/api/user/${item.creator_id}`
            );
            const userData = userResponse.data;
            return {
              creator: userData.firstname + " " + userData.lastname,
              resource_id: item.resource_id,
              resource_title: item.resource_title,
              resource_description: item.resource_description,
              resource_category: item.resource_category,
              heart_count: item.heart_count || 0,
              upload_date: new Date(item.upload_date).toLocaleDateString(),
              fileSize: "2.5 MB",
              creator_profile_picture: userData.profilePicture
                ? `http://localhost:8080${userData.profilePicture}`
                : null,
            };
          } catch (error) {
            console.error(
              `Error fetching profile picture for resource ${item.resource_id}:`,
              error
            );
            return {
              resource_id: item.resource_id,
              resource_title: item.resource_title,
              resource_description: item.resource_description,
              resource_category: item.resource_category,
              heart_count: item.heart_count || 0,
              upload_date: new Date(item.upload_date).toLocaleDateString(),
              fileSize: "2.5 MB",
              creator_profile_picture: null,
            };
          }
        })
      );

      setResources(resourcesWithProfilePictures);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();

    
    const updatedFormData = {
      ...formData,
      creator: userName,
      creator_id: userId,
      creator_profile_picture: profilePicture,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/resource/addResourceDetails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFormData),
        }
      );

      if (!response.ok) throw new Error("Failed to add resource");

      fetchResources();
      setIsModalOpen(false);
      setFormData({
        creator: userName,
        creator_id: userId,
        creator_profile_picture: profilePicture,
        resource_title: "",
        resource_description: "",
        resource_category: "",
        heart_count: 0,
        upload_date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const handleUpdateResource = async (resource_id) => {
    try {
      const updatedResource = {
        resource_title: formData.resource_title?.trim(),
        resource_description: formData.resource_description?.trim(),
        resource_category: formData.resource_category || "Document",
        creator_id: parseInt(userId),
        upload_date: new Date().toISOString()
      };
  
      
      const response = await fetch(
        `http://localhost:8080/api/resource/updateResourceDetails?resource_id=${resource_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedResource)
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      fetchResources();
      setIsModalOpen(false);
      setEditingResource(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDeleteResource = async (resource_id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/resource/deleteResource/${resource_id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete resource");

        fetchResources();
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const handleLike = async (resource_id) => {
    try {
      console.log("Liking resource:", resource_id);

      const response = await fetch(
        `http://localhost:8080/api/resource/likeResource/${resource_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update download count: ${response.status}`);
      }

      const updatedResource = await response.json();
      console.log("Updated resource:", updatedResource);

     
      setResources((currentResources) =>
        currentResources.map((resource) =>
          resource.resource_id === resource_id
            ? {
                ...resource,
                heart_count: updatedResource.heart_count,
              }
            : resource
        )
      );

      
    } catch (error) {
      console.error("Error updating download count:", error);
    }
  };

 
  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = resources.filter((resource) => {
    if (selectedCategory === "all") {
      return true; 
    } else if (selectedCategory === "documents") {
      return resource.resource_category === "Document"; 
    } else if (selectedCategory === "media") {
      return resource.resource_category === "Media"; 
    }
    return true;
  });

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
              <h2 className="feed-title-resource">Resource Hub</h2>
              <button
                className="category-button active"
                onClick={() => {
                  setEditingResource(null);
                  setFormData({
                    resource_title: "",
                    resource_description: "",
                    resource_category: "",
                    heart_count: 0,
                    upload_date: new Date().toISOString(),
                  });
                  setIsModalOpen(true);
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Create Resource
              </button>
            </div>
            <div className="categories-container">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`category-button ${
                  selectedCategory === "all" ? "active" : ""
                }`}
              >
                All Resources
              </button>
              <button
                onClick={() => setSelectedCategory("documents")}
                className={`category-button ${
                  selectedCategory === "documents" ? "active" : ""
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setSelectedCategory("media")}
                className={`category-button ${
                  selectedCategory === "media" ? "active" : ""
                }`}
              >
                Media
              </button>
            </div>
          </div>

          <div className="resources-containerZ">
            {isLoading ? (
              <div>Loading resources...</div>
            ) : filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <article
                  key={resource.id || resource.resource_id}
                  className="resource-item"
                >
                  <header className="post-header">
                    <div className="profile-circlecover">
                      <img
                        className="profile-image"
                        src={resource.creator_profile_picture || Prof1}
                        alt="Profile"
                      />
                    </div>
                    <div className="user-info">
                      <div className="user-meta">
                        <h3 className="username">
                          {resource.creator || "Unknown User"}
                        </h3>
                        <span className="post-meta">•</span>
                        <span className="post-meta">
                          {resource.date ||
                            new Date(resource.upload_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="status-badges">
                        <span className="status-badge status-badge-active">
                          {resource.status || "Active"}
                        </span>
                        <span className="post-type-value post-type-documents">
                          {resource.type || resource.resource_category}
                        </span>
                      </div>
                    </div>
                  </header>

                  <div className="resource-content">
                    <h3 className="resource-title">
                      {resource.resource_title}
                    </h3>
                    <p className="resource-description">
                      {resource.resource_description}
                    </p>
                    <div className="resource-stats">
                      <span className="download-count">
                        <svg
                          className="download-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                            fill="currentColor"
                          />
                        </svg>
                        {resource.heart_count || 0} downloads
                      </span>
                      <span className="file-size">
                        {resource.fileSize || "2.5 MB"}
                      </span>
                    </div>
                  </div>

                  <footer className="resource-actions">
                    <button
                      className="download-button"
                      onClick={() => handleLike(resource.resource_id)}
                      title="Download and like this resource"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        className="download-icon"
                      >
                        <path
                          d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                          fill="currentColor"
                        />
                      </svg>
                      Download
                    </button>
                    <button
                      className="download-button"
                      onClick={() => {
                        setEditingResource(resource);
                        setFormData({
                          resource_title: resource.resource_title,
                          resource_description: resource.resource_description,
                          resource_category: resource.resource_category,
                          heart_count: resource.heart_count || 0,
                          upload_date: resource.upload_date,
                          creator: userName,
                          creator_id: userId,
                          creator_profile_picture: profilePicture,
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="download-button"
                      onClick={() => handleDeleteResource(resource.resource_id)}
                    >
                      Delete
                    </button>
                  </footer>
                </article>
              ))
            ) : (
              <div>No resources found</div>
            )}
          </div>
        </div>
      </div>

     
      <div className="left-sidebar">
        <div className="resource-calendar">
          <h2>Calendar</h2>
          <MyCalendar />
        </div>

        <div className="notifications-container">
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
              {editingResource ? "Edit Resource" : "Create New Resource"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingResource
                  ? handleUpdateResource(editingResource.resource_id)
                  : handleAddResource(e);
              }}
            >
              <input
                type="text"
                value={formData.resource_title}
                onChange={(e) =>
                  setFormData({ ...formData, resource_title: e.target.value })
                }
                placeholder="Resource Title"
                className="modal-input"
              />
              <textarea
                value={formData.resource_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resource_description: e.target.value,
                  })
                }
                placeholder="Resource Description"
                className="modal-textarea"
              />
              <select
                value={formData.resource_category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resource_category: e.target.value,
                  })
                }
                className="modal-select"
              >
                <option value="">Select Category</option>
                <option value="Document">Document</option>
                <option value="Media">Media</option>
                <option value="Other">Other</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingResource ? "Save Changes" : "Create Resource"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingResource(null);
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

export default ResourceHub;
