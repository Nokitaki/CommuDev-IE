import React, { useState, useEffect } from "react";
import "../styles/TaskManagerTest.css";
import { Link } from "react-router-dom";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import Prof1 from "../assets/prof/prof1.png";
import Kyle from "../assets/prof/Kyle.jpg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import MyCalendar from '../JoelComponents/MyCalendar';
import axios from "axios";
import { useNavigate } from "react-router-dom";

import UserSearch from '../Search/UserSearch';
import PeopleYouMayKnow from '../Search/PeopleYouMayKnow.jsx';
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    taskDescription: "",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: "",
    taskType: "GENERAL",
    reward: "",
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
      message: "completed a task",
      time: "2 minutes ago",
    },
    
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/tasks/all");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (selectedTask?.taskId) {
        response = await axios.put(
          `http://localhost:8080/tasks/${selectedTask.taskId}`,
          formData
        );
      } else {
        response = await axios.post("http://localhost:8080/tasks/add", formData);
      }
      
      if (selectedTask) {
        setTasks(tasks.map((task) =>
          task.taskId === response.data.taskId ? response.data : task
        ));
      } else {
        setTasks([...tasks, response.data]);
      }
      
      setOpenDialog(false);
      setSelectedTask(null);
      setFormData({
        taskDescription: "",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: "",
        taskType: "GENERAL",
        reward: "",
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`http://localhost:8080/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.taskId !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "HIGH":
        return "priority-high";
      case "MEDIUM":
        return "priority-medium";
      case "LOW":
        return "priority-low";
      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "status-completed";
      case "IN_PROGRESS":
        return "status-in-progress";
      case "PENDING":
        return "status-pending";
      default:
        return "";
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
                  <div className={`status-indicator ${user.isOnline ? "online" : ""}`} />
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
                to={item.path || `/${item.label.toLowerCase().replace(" ", "")}`}
                className="nav-item"
              >
                <img src={item.icon} alt={`${item.label} icon`} className="nav-icon" />
              </Link>
            ))}
          </div>
        </div>

        <div className="storiesAndfeedResource">
          <div className="create-post-section-resource">
            <div className="resource-header-container">
              <h2 className="feed-title-resource">Task Manager</h2>
              <button
                className="category-button active"
                onClick={() => {
                  setSelectedTask(null);
                  setFormData({
                    taskDescription: "",
                    status: "PENDING",
                    priority: "MEDIUM",
                    dueDate: "",
                    taskType: "GENERAL",
                    reward: "",
                  });
                  setOpenDialog(true);
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
                Create Task
              </button>
            </div>
            <div className="categories-container">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`category-button ${selectedCategory === "all" ? "active" : ""}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setSelectedCategory("PENDING")}
                className={`category-button ${selectedCategory === "PENDING" ? "active" : ""}`}
              >
                Pending
              </button>
              <button
                onClick={() => setSelectedCategory("IN_PROGRESS")}
                className={`category-button ${selectedCategory === "IN_PROGRESS" ? "active" : ""}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setSelectedCategory("COMPLETED")}
                className={`category-button ${selectedCategory === "COMPLETED" ? "active" : ""}`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="resources-container grid">
            {loading ? (
              <div>Loading tasks...</div>
            ) : tasks.length > 0 ? (
              tasks
                .filter(
                  task =>
                    selectedCategory === "all" || task.status === selectedCategory
                )
                .map((task) => (
                  <article key={task.taskId} className="resource-item">
                    <header className="post-header">
                      <div className="profile-circlecover">
                        <img className="profile-image" src={Kyle} alt="Profile" />
                      </div>
                      <div className="user-info">
                        <div className="user-meta">
                          <h3 className="username">Admin</h3>
                          <span className="post-meta">•</span>
                          <span className="post-meta">{task.dueDate}</span>
                        </div>
                        <div className="status-badges">
                          <span className={`status-badge ${getStatusClass(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </header>

                    <div className="resource-content">
                      <h3 className="resource-title">{task.taskType}</h3>
                      <p className="resource-description">{task.taskDescription}</p>
                      {task.reward && (
                        <div className="reward-info">
                          <span className="reward-label">Reward:</span>
                          <span className="reward-value">{task.reward}</span>
                        </div>
                      )}
                    </div>

                    <footer className="resource-actions">
                      <button
                        className="download-button"
                        onClick={() => {
                          setSelectedTask(task);
                          setFormData(task);
                          setOpenDialog(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="download-button"
                        onClick={() => handleDelete(task.taskId)}
                      >
                        Delete
                      </button>
                    </footer>
                  </article>
                ))
            ) : (
              <div>No tasks found</div>
            )}
          </div>
        </div>
      </div>

     
      <div className="left-sidebar">
        <div className="task-calendar">
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
                    <span className="notification-username">{notification.user}</span>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

     
      {openDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {selectedTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <form onSubmit={handleSave}>
              <textarea
                value={formData.taskDescription}
                onChange={(e) => setFormData({...formData, taskDescription: e.target.value})}
                placeholder="Task Description"
                className="modal-textarea"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="modal-select"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="modal-select"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
              <select
                value={formData.taskType}
                onChange={(e) => setFormData({...formData, taskType: e.target.value})}
                className="modal-select"
              >
                <option value="GENERAL">General</option>
                <option value="COMMUNITY_SERVICE">Community Service</option>
                <option value="EDUCATION">Education</option>
                <option value="ENVIRONMENT">Environment</option>
                <option value="HEALTHCARE">Healthcare</option>
              </select>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="modal-input"
              />
              <input
                type="text"
                value={formData.reward}
                onChange={(e) => setFormData({...formData, reward: e.target.value})}
                placeholder="Reward"
                className="modal-input"
              />
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {selectedTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenDialog(false);
                    setSelectedTask(null);
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

export default TaskManager;