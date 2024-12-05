import React, { useState, useEffect } from "react";
import "../styles/RewardsTest.css";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import Prof1 from "../assets/prof/prof1.png";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import MyCalendar from "../JoelComponents/MyCalendar";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import axios from "axios";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import UserSearch from '../Search/UserSearch';
import PeopleYouMayKnow from '../Search/PeopleYouMayKnow.jsx';


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

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(() => {
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newReward, setNewReward] = useState({
    name: '',
    type: '',
    value: '',
    quantity: '',
    description: '',
    expiryDate: '',
    redemptionCode: '',
    isExclusive: false,
    isFeatured: false,
    isRedeemed: false
  });
  const [isEditPointsModalOpen, setIsEditPointsModalOpen] = useState(false);
  const [editPointsAmount, setEditPointsAmount] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");

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

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
        const data = response.data;
        setUserData(data);
        if (data.profilePicture) {
          setProfilePicture(`http://localhost:8080${data.profilePicture}`);
        }
        const fullName = String(`${data.firstname || ""} ${data.lastname || ""}`).trim();
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

  const fetchRewards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/rewards/all");
      setRewards(response.data);
    } catch (error) {
      showNotification("Failed to fetch rewards", "error");
    }
  };

  const fetchClaimedRewards = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/rewards/claimed");
      setClaimedRewards(response.data);
    } catch (error) {
      console.error("Error fetching claimed rewards:", error);
    }
  };

  const handleRedemptionSubmit = async (e) => {
    e.preventDefault();
    setRedemptionError("");
    setIsRedeeming(true);

    try {
      const response = await axios.post(`http://localhost:8080/api/rewards/redeem/${redemptionCode.toUpperCase()}`);
      const newPoints = totalPoints + response.data.points;
      setTotalPoints(newPoints);
      localStorage.setItem("totalPoints", newPoints.toString());
      setIsModalOpen(false);
      setRedemptionCode("");
      showNotification(`Successfully redeemed ${response.data.points} points!`);
      fetchRewards();
    } catch (error) {
      setRedemptionError(error.response?.data?.error || "Invalid redemption code");
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCreateReward = async (e) => {
    e.preventDefault();
    try {
      const formattedReward = {
        ...newReward,
        value: parseFloat(newReward.value),
        quantity: parseInt(newReward.quantity),
        expiryDate: new Date(newReward.expiryDate).toISOString(),
        isExclusive: false,
        isFeatured: false,
        isRedeemed: false
      };

      const response = await axios.post("http://localhost:8080/api/rewards/add", formattedReward);
      setRewards(prev => [...prev, response.data]);
      setIsCreateModalOpen(false);
      setNewReward({
        name: '',
        type: '',
        value: '',
        quantity: '',
        description: '',
        expiryDate: '',
        redemptionCode: '',
        isExclusive: false,
        isFeatured: false,
        isRedeemed: false
      });
      showNotification("Reward created successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to create reward";
      showNotification(errorMessage, "error");
    }
  };

  const handleUpdatePoints = async (e) => {
    e.preventDefault();
    const points = parseInt(editPointsAmount);
    
    try {
      if (points > 0) {
       
        const response = await axios.post('http://localhost:8080/api/rewards/generate-points-code', {
          points: points
        });
        setIsEditPointsModalOpen(false);
        setRedemptionCode(response.data.code);
        setIsModalOpen(true);
        showNotification(`Use code ${response.data.code} to add ${points} points`, "success");
      } else {
        
        const deductAmount = Math.abs(points);
        if (deductAmount > totalPoints) {
          showNotification("Cannot deduct more points than available", "error");
          return;
        }
        const response = await axios.post(`http://localhost:8080/api/rewards/deduct-points/${userId}`, {
          points: -deductAmount 
        });
        const newTotal = totalPoints - deductAmount;
        setTotalPoints(newTotal);
        localStorage.setItem("totalPoints", newTotal.toString());
        setIsEditPointsModalOpen(false);
        showNotification(`Successfully deducted ${deductAmount} points`);
      }
      setEditPointsAmount('');
    } catch (error) {
      showNotification(error.response?.data?.error || "Failed to process points", "error");
    }
  };

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
        localStorage.setItem("totalPoints", newPoints.toString());
        setClaimedRewards(current => [...current, { rewardId, claimedAt: new Date() }]);
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

  const renderRedemptionModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Redeem Points</h3>
        <form onSubmit={handleRedemptionSubmit}>
          <div className="code-input-container" style={{ display: 'flex', marginBottom: '1rem' }}>
            <input
              type="text"
              value={redemptionCode}
              onChange={(e) => setRedemptionCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-letter code"
              className="modal-input"
              maxLength={6}
              pattern="[A-Za-z]{6}"
              required
              style={{ marginRight: '0.5rem' }}
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(redemptionCode);
                showNotification("Code copied to clipboard", "success");
              }}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              Copy
            </button>
          </div>
          {redemptionError && <div className="error-message">{redemptionError}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={isRedeeming || redemptionCode.length !== 6}>
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
              <img src={profilePicture || Prof1} alt="Profile" className="profile-image" />
            </div>
            <div className="profile-info">
              <h4>{userData ? `${userData.firstname} ${userData.lastname}` : "Loading..."}</h4>
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
                <span className="points-text">{totalPoints.toLocaleString()} pts</span>
                <button
                  className="category-button active"
                  onClick={() => {
                    setRedemptionCode("");
                    setRedemptionError("");
                    setIsModalOpen(true);
                  }}
                  style={{ marginLeft: '10px', outline: '1px solid #BFF4BE', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                >
                  + Redeem Points
                </button>
                <button
                  className="category-button active"
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{ marginLeft: '10px' }}
                >
                  Create Reward
                </button>
                <button
                  className="category-button active"
                  onClick={() => setIsEditPointsModalOpen(true)}
                  style={{ marginLeft: '10px' }}
                >
                  Edit Points
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
              ))}
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

      
      <div className="left-sidebar">
        <div className="calendar">
          <h2>Calendar</h2>
          <MyCalendar />
        </div>

        <div className="notifications-container">
          <h2>Notifications</h2>
          <div className="notifications">
            {[
              {
                user: "Keanu",
                image: "prof1.png",
                message: "submitted new feedback",
                time: "2 minutes ago",
              },
            ].map((notification, index) => (
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

     
      {isModalOpen && renderRedemptionModal()}

     
      <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <DialogTitle>Create New Reward</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCreateReward}>
            <TextField
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={newReward.name}
              onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
              required
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Type</InputLabel>
              <Select
                value={newReward.type}
                onChange={(e) => setNewReward({ ...newReward, type: e.target.value })}
              >
                <MenuItem value="voucher">Voucher</MenuItem>
                <MenuItem value="item">Item</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Value (points)"
              type="number"
              fullWidth
              value={newReward.value}
              onChange={(e) => setNewReward({ ...newReward, value: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Quantity"
              type="number"
              fullWidth
              value={newReward.quantity}
              onChange={(e) => setNewReward({ ...newReward, quantity: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={newReward.description}
              onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Expiry Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={newReward.expiryDate}
              onChange={(e) => setNewReward({ ...newReward, expiryDate: e.target.value })}
              required
            />
            <DialogActions>
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Reward
              </button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

     
      <Dialog open={isEditPointsModalOpen} onClose={() => setIsEditPointsModalOpen(false)}>
        <DialogTitle>Edit User Points</DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdatePoints}>
            <TextField
              margin="dense"
              label="Points to Add/Subtract"
              type="number"
              fullWidth
              value={editPointsAmount}
              onChange={(e) => setEditPointsAmount(e.target.value)}
              required
              helperText="Use positive numbers to add points, negative to subtract"
            />
            <DialogActions>
              <button type="button" onClick={() => setIsEditPointsModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Points
              </button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;