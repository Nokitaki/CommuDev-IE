import React, { useState, useEffect } from "react";
import "../styles/RewardsTest.css";
import { Link } from "react-router-dom";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import Prof1 from "../assets/prof/prof1.jpg";
import MyCalendar from "../JoelComponents/MyCalendar";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
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
      image: "prof1.jpg",
      message: "claimed a reward",
      time: "2 minutes ago",
    },
  ];

  useEffect(() => {
    fetchRewards();
    fetchClaimedRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/rewards/all");
      const data = await response.json();
      setRewards(data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const fetchClaimedRewards = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/rewards/claimed");
      const data = await response.json();
      setClaimedRewards(data);
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
    }
  };

  const claimReward = async (rewardId, rewardValue) => {
    if (totalPoints >= rewardValue) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/api/rewards/claim/${rewardId}`,
          {
            method: "POST",
          }
        );

        if (response.ok) {
          setRewards((currentRewards) =>
            currentRewards.map((reward) =>
              reward.id === rewardId
                ? { ...reward, quantity: reward.quantity - 1 }
                : reward
            )
          );
          setTotalPoints((currentPoints) => currentPoints - rewardValue);
          setClaimedRewards((current) => [
            ...current,
            { rewardId, claimedAt: new Date() },
          ]);
          alert("Reward claimed successfully!");
        } else {
          alert("Failed to claim reward");
        }
      } catch (error) {
        console.error("Error claiming reward:", error);
        alert("Failed to claim reward");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Not enough points to claim this reward");
    }
  };

  // Calculate pagination
  const indexOfLastReward = page * itemsPerPage;
  const indexOfFirstReward = indexOfLastReward - itemsPerPage;
  const currentRewards = rewards.slice(indexOfFirstReward, indexOfLastReward);

  return (
    <div className="community-platform-resource">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="header">
          <Link to="/">
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
              <img src={Prof1} alt="Profile" className="profile-image" />
            </div>
            <div className="profile-info">
              <h4>Joel Chandler</h4>
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
                  />
                </div>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
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
              <h2 className="feed-title-resource">Rewards Center</h2>
              <div className="points-display">
                <CardGiftcardIcon className="points-icon" />
                <span className="points-text">{totalPoints} pts</span>
              </div>
            </div>
            <div className="categories-container">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`category-button ${
                  selectedCategory === "all" ? "active" : ""
                }`}
              >
                All Rewards
              </button>
              <button
                onClick={() => setSelectedCategory("voucher")}
                className={`category-button ${
                  selectedCategory === "voucher" ? "active" : ""
                }`}
              >
                Vouchers
              </button>
              <button
                onClick={() => setSelectedCategory("item")}
                className={`category-button ${
                  selectedCategory === "item" ? "active" : ""
                }`}
              >
                Items
              </button>
            </div>
          </div>

          <div className="resources-container grid">
            {isLoading ? (
              <div>Loading rewards...</div>
            ) : currentRewards.length > 0 ? (
              currentRewards
                .filter(
                  (reward) =>
                    selectedCategory === "all" ||
                    reward.type.toLowerCase() === selectedCategory
                )
                .map((reward) => (
                  <article key={reward.id} className="reward-item">
                    <div className="reward-banner">
                      <CardGiftcardIcon className="reward-banner-icon" />
                      <span className="reward-type">{reward.type}</span>
                    </div>

                    <div className="reward-content">
                      <div className="reward-header">
                        <h3 className="reward-title">{reward.name}</h3>
                        <div className="reward-points">
                          <span className="points-value">{reward.value}</span>
                          <span className="points-label">pts</span>
                        </div>
                      </div>

                      <p className="reward-description">{reward.description}</p>

                      <div className="reward-details">
                        <div className="reward-stock">
                          <span
                            className={`stock-indicator ${
                              reward.quantity > 10
                                ? "high"
                                : reward.quantity > 5
                                ? "medium"
                                : "low"
                            }`}
                          />
                          <span className="stock-text">
                            {reward.quantity > 0
                              ? `${reward.quantity} remaining`
                              : "Out of stock"}
                          </span>
                        </div>

                        <div className="reward-validity">
                          <span className="validity-date">
                            Valid until: {reward.expiryDate || "31 Dec 2024"}
                          </span>
                        </div>
                      </div>

                      <div className="reward-conditions">
                        <span className="condition-tag">Limited time</span>
                        {reward.isExclusive && (
                          <span className="condition-tag exclusive">
                            Exclusive
                          </span>
                        )}
                        {reward.isFeatured && (
                          <span className="condition-tag featured">
                            Featured
                          </span>
                        )}
                      </div>

                      <footer className="reward-actions">
                        <button
                          className={`claim-button ${
                            totalPoints >= reward.value ? "ready" : "not-ready"
                          }`}
                          onClick={() => claimReward(reward.id, reward.value)}
                          disabled={
                            totalPoints < reward.value ||
                            isLoading ||
                            reward.quantity <= 0
                          }
                        >
                          {isLoading ? (
                            <span className="loading-dots">Processing...</span>
                          ) : reward.quantity <= 0 ? (
                            <>
                              <span className="button-text">Out of Stock</span>
                              <span className="button-icon">⚠️</span>
                            </>
                          ) : (
                            <>
                              <span className="button-text">Claim Reward</span>
                              <span className="button-icon">🎁</span>
                            </>
                          )}
                        </button>
                      </footer>
                    </div>
                  </article>
                ))
            ) : (
              <div>No rewards available</div>
            )}
          </div>

          {rewards.length > itemsPerPage && (
            <div className="pagination">
              {Array.from({
                length: Math.ceil(rewards.length / itemsPerPage),
              }).map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-button ${
                    page === index + 1 ? "active" : ""
                  }`}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="left-sidebar">
        <div className="calendar">
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
    </div>
  );
};

export default Rewards;