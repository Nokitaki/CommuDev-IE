import React, { useState, useEffect } from "react";
import "../styles/RewardsTest.css";
import { Link } from "react-router-dom";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import Prof1 from "../assets/prof/prof1.jpg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import MyCalendar from "../JoelComponents/MyCalendar";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import axios from "axios";

// RewardItem Component
const RewardItem = ({ reward, totalPoints, claimReward }) => {
  const [isClaimingThis, setIsClaimingThis] = useState(false);

  const handleClaim = async () => {
    setIsClaimingThis(true);
    await claimReward(reward.id, reward.value);
    setIsClaimingThis(false);
  };

  return (
    <article className="reward-item">
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
            <span className={`stock-indicator ${reward.quantity > 10 ? "high" : reward.quantity > 5 ? "medium" : "low"}`} />
            <span className="stock-text">{reward.quantity > 0 ? `${reward.quantity} remaining` : "Out of stock"}</span>
          </div>
          <div className="reward-validity">
            <span className="validity-date">Valid until: {reward.expiryDate || "31 Dec 2024"}</span>
          </div>
        </div>
        <footer className="reward-actions">
          <button
            className={`claim-button ${totalPoints >= reward.value ? "ready" : "not-ready"}`}
            onClick={handleClaim}
            disabled={totalPoints < reward.value || reward.quantity <= 0 || isClaimingThis}
          >
            {isClaimingThis ? "Claiming..." : reward.quantity <= 0 ? "Out of Stock" : "Claim Reward"}
          </button>
        </footer>
      </div>
    </article>
  );
};

// Main Rewards Component
const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(() => {
    // Retrieve points from local storage or set default value
    const savedPoints = localStorage.getItem("totalPoints");
    return savedPoints ? parseInt(savedPoints, 10) : 500;
  });
  const [claimingRewardId, setClaimingRewardId] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redemptionCode, setRedemptionCode] = useState("");
  const [redemptionError, setRedemptionError] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/newsfeed" },
    { icon: MessageIcon, label: "Messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resource" },
    { icon: TaskIcon, label: "Task", path: "/task" },
    { icon: RewardsIcon, label: "Rewards" },
    { icon: FeedbackIcon, label: "Feedback" },
  ];

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  useEffect(() => {
    fetchRewards();
    fetchClaimedRewards();
  }, []);

  // Fetch rewards from the server
  const fetchRewards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/rewards/all");
      setRewards(response.data);
    } catch (error) {
      showNotification("Failed to fetch rewards", "error");
    }
  };

  // Fetch claimed rewards from the server
  const fetchClaimedRewards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/rewards/claimed");
      setClaimedRewards(response.data);
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
    }
  };

  // Handle redemption code submission
  const handleRedemptionSubmit = async (e) => {
    e.preventDefault();
    setRedemptionError("");
    setIsRedeeming(true);

    try {
      const response = await axios.post(`http://localhost:8080/api/rewards/redeem/${redemptionCode.toUpperCase()}`);
      const newPoints = totalPoints + response.data.points;
      setTotalPoints(newPoints);
      localStorage.setItem("totalPoints", newPoints);
      setIsModalOpen(false);
      setRedemptionCode("");
      showNotification(`Successfully redeemed ${response.data.points} points!`);
      fetchRewards();
    } catch (error) {
      setRedemptionError(error.response?.data?.error || "Failed to redeem code");
    } finally {
      setIsRedeeming(false);
    }
  };

  // Claim a reward
  const claimReward = async (rewardId, rewardValue) => {
    if (totalPoints >= rewardValue) {
      setClaimingRewardId(rewardId);
      try {
        const response = await axios.post(`http://localhost:8080/api/rewards/claim/${rewardId}`);
        setRewards(currentRewards =>
          currentRewards.map(reward =>
            reward.id === rewardId
              ? { ...reward, quantity: reward.quantity - 1 }
              : reward
          )
        );
        const newPoints = totalPoints - rewardValue;
        setTotalPoints(newPoints);
        localStorage.setItem("totalPoints", newPoints);
        setClaimedRewards(current => [
          ...current,
          { rewardId, claimedAt: new Date() },
        ]);
        showNotification("Reward claimed successfully!");
      } catch (error) {
        showNotification("Failed to claim reward", "error");
      } finally {
        setClaimingRewardId(null);
      }
    } else {
      showNotification("Not enough points to claim this reward", "error");
    }
  };

  // Render redemption modal
  const renderRedemptionModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Redeem Points</h3>
        <form onSubmit={handleRedemptionSubmit}>
          <input
            type="text"
            value={redemptionCode}
            onChange={(e) => setRedemptionCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-letter code"
            className="modal-input"
            maxLength={6}
            pattern="[A-Za-z]{6}"
            required
          />
          {redemptionError && (
            <div className="error-message">{redemptionError}</div>
          )}
          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isRedeeming || redemptionCode.length !== 6}
            >
              {isRedeeming ? "Processing..." : "Redeem Code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setRedemptionCode("");
                setRedemptionError("");
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const indexOfLastReward = page * itemsPerPage;
  const indexOfFirstReward = indexOfLastReward - itemsPerPage;
  const currentRewards = rewards.slice(indexOfFirstReward, indexOfLastReward);

  return (
    <div className="community-platform-resource">
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      {/* Left Sidebar */}
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
            {/* Example friends list */}
            {/* Replace with actual users data */}
            {["Harry", "Keanu"].map((user, index) => (
              <div key={index} className="friend-item">
                <div className="avatar">
                  <div className={`status-indicator ${index === 1 ? "online" : ""}`} />
                </div>
                <span>{user}</span>
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
              <h2 className="feed-title-resource">Rewards Center</h2>
              <div className="points-display">
                <CardGiftcardIcon className="points-icon" />
                <span className="points-text">{totalPoints} pts</span>
                <button
                  className="category-button active"
                  onClick={() => {
                    setRedemptionCode("");
                    setRedemptionError("");
                    setIsModalOpen(true);
                  }}
                  style={{ marginLeft: '10px', outline: '1px solid #BFF4BE',boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                  + Redeem Points
                </button>
              </div>
            </div>
            <div className="categories-container">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`category-button ${selectedCategory === "all" ? "active" : ""}`}
              >
                All Rewards
              </button>
              <button
                onClick={() => setSelectedCategory("voucher")}
                className={`category-button ${selectedCategory === "voucher" ? "active" : ""}`}
              >
                Vouchers
              </button>
              <button
                onClick={() => setSelectedCategory("item")}
                className={`category-button ${selectedCategory === "item" ? "active" : ""}`}
              >
                Items
              </button>
            </div>
          </div>

          <div className="resources-container grid">
        {currentRewards
          .filter(reward =>
            selectedCategory === "all" ||
            reward.type.toLowerCase() === selectedCategory
          )
          .map((reward) => (
            <RewardItem 
              key={reward.id} 
              reward={reward} 
              totalPoints={totalPoints} 
              claimReward={claimReward}
              isClaimLoading={claimingRewardId === reward.id}
            />
          ))
        }
      </div>

          {rewards.length > itemsPerPage && (
            <div className="pagination">
              {Array.from({ length: Math.ceil(rewards.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-button ${page === index + 1 ? "active" : ""}`}
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
          {/* Example notifications list */}
          {/* Replace with actual notifications data */}
          {["Keanu claimed a reward", "Harry sent you a message"].map((notification, index) => (
            <div key={index} className="notification-item">
              <span>{notification}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Redemption Modal */}
      {isModalOpen && renderRedemptionModal()}
    </div>
  );
};

export default Rewards;
