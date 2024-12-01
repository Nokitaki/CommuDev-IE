<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Chip,
    CircularProgress,
    Pagination
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
 
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));
 
const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [claimedRewards, setClaimedRewards] = useState([]);
    const [totalPoints, setTotalPoints] = useState(500); // Example starting points
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(6); // Number of rewards displayed per page
 
    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/rewards/all");
                setRewards(response.data); // Make sure this returns the expected rewards structure
            } catch (error) {
                console.error("Error fetching rewards:", error);
            }
        };
 
        const fetchClaimedRewards = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/rewards/claimed");
                setClaimedRewards(response.data); // Ensure this returns the claimed rewards correctly
            } catch (error) {
                console.error("Error fetching claimed rewards:", error);
            }
        };
 
        fetchRewards();
        fetchClaimedRewards();
    }, []);
 
    const claimReward = async (rewardId, rewardValue) => {
        if (totalPoints >= rewardValue) {
            setIsLoading(true);
            try {
                await axios.post(`http://localhost:8080/api/rewards/claim/${rewardId}`);
                setTotalPoints(totalPoints - rewardValue);
                alert("Reward claimed successfully!");
                fetchClaimedRewards(); // Refresh the claimed rewards after claiming a reward
            } catch (error) {
                alert("Failed to claim reward");
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Not enough points to claim this reward");
        }
    };
 
    // Handle pagination
    const handleChangePage = (event, value) => {
        setPage(value);
    };
 
    // Get rewards for the current page
    const indexOfLastReward = page * itemsPerPage;
    const indexOfFirstReward = indexOfLastReward - itemsPerPage;
    const currentRewards = rewards.slice(indexOfFirstReward, indexOfLastReward);
 
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CardGiftcardIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h4" component="h1">
                    Rewards Center
                </Typography>
            </Box>
 
            {/* Reward Section for Points */}
            <StyledPaper elevation={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">
                        Your Total Reward Points
                    </Typography>
                    <Typography variant="h4" color="primary">
                        {totalPoints} pts
                    </Typography>
                </Box>
            </StyledPaper>
 
            {/* Reward List */}
            <Grid container spacing={3}>
                {currentRewards.length > 0 ? (
                    currentRewards.map((reward) => (
                        <Grid item xs={12} sm={6} md={4} key={reward.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {reward.name}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        {reward.type}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                        <Typography variant="h6" color="primary">
                                            {reward.value} pts
                                        </Typography>
                                        <Chip
                                            label={`${reward.quantity} left`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                        disabled={totalPoints < reward.value || isLoading}
                                        onClick={() => claimReward(reward.id, reward.value)}
                                    >
                                        {isLoading ? <CircularProgress size={24} /> : 'Claim Reward'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography>No rewards available.</Typography>
                    </Grid>
                )}
            </Grid>
 
            {/* Pagination */}
            {rewards.length > itemsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={Math.ceil(rewards.length / itemsPerPage)}
                        page={page}
                        onChange={handleChangePage}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
=======
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

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redemptionCode, setRedemptionCode] = useState("");
  const [redemptionError, setRedemptionError] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

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
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/rewards/all");
      setRewards(response.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setIsLoading(false);
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
      const response = await axios.post(
        `http://localhost:8080/api/rewards/redeem/${redemptionCode.toUpperCase()}`
      );

      if (response.data) {
        setTotalPoints((prev) => prev + response.data.points);
        setIsModalOpen(false);
        setRedemptionCode("");
        alert(`Successfully redeemed ${response.data.points} points!`);
        fetchRewards(); // Refresh rewards list
      }
    } catch (error) {
      setRedemptionError(error.response?.data?.error || "Failed to redeem code");
    } finally {
      setIsRedeeming(false);
    }
  };

  const claimReward = async (rewardId, rewardValue) => {
    if (totalPoints >= rewardValue) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:8080/api/rewards/claim/${rewardId}`
        );

        if (response.data) {
          setRewards(currentRewards =>
            currentRewards.map(reward =>
              reward.id === rewardId
                ? { ...reward, quantity: reward.quantity - 1 }
                : reward
            )
          );
          setTotalPoints(currentPoints => currentPoints - rewardValue);
          setClaimedRewards(current => [
            ...current,
            { rewardId, claimedAt: new Date() },
          ]);
          alert("Reward claimed successfully!");
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
                  <div className={`status-indicator ${user.isOnline ? "online" : ""}`} />
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
                  style={{ marginLeft: '10px' }}
                >
                  Redeem Code
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
            {isLoading ? (
              <div>Loading rewards...</div>
            ) : currentRewards.length > 0 ? (
              currentRewards
                .filter(
                  reward =>
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
              <div>No rewards found</div>
            )}
          </div>

          {rewards.length > itemsPerPage && (
            <div className="pagination">
              {Array.from({
                length: Math.ceil(rewards.length / itemsPerPage),
              }).map((_, index) => (
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

      {/* Redemption Modal */}
      {isModalOpen && renderRedemptionModal()}
    </div>
  );
>>>>>>> Stashed changes
};
 
export default Rewards;