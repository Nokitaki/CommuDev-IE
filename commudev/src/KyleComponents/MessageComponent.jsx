import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Smile,
  Paperclip,
  Image,
  Mic,
  Phone,
  VideoIcon,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/MessageComponent.css";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import CommuIcon from "../assets/CommuIcon.svg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import ProfPic from "../assets/prof/Kyle.jpg";
import ProfPic2 from "../assets/prof/Joel.jpg";

const MessagePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: MessageIcon, label: "Messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resource" },
    { icon: TaskIcon, label: "Task", path: "/task" },
    { icon: RewardsIcon, label: "Rewards" },
    { icon: FeedbackIcon, label: "Feedback" },
  ];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize user data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        // Get current user ID from localStorage (set during login)
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User not authenticated');
        }
        setCurrentUserId(userId);

        // Fetch all users
        const response = await axios.get('http://localhost:8080/api/user/all');
        const usersData = response.data.filter(user => user.userId.toString() !== userId);
        
        // Transform user data
        const transformedUsers = usersData.map(user => ({
          id: user.userId,
          name: `${user.firstname} ${user.lastname}`,
          avatar: user.profilePicture,
          online: true, // You could implement real online status
          lastMessage: "", // Will be updated when fetching messages
        }));

        setUsers(transformedUsers);
        if (transformedUsers.length > 0) {
          setSelectedUser(transformedUsers[0]);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch messages for selected user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !currentUserId) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/messages/conversation/${currentUserId}/${selectedUser.id}`
        );

        const formattedMessages = response.data.map(msg => ({
          id: msg.messageId,
          text: msg.messageContent,
          sender: msg.senderId.toString() === currentUserId ? 'me' : 'other',
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }),
          isRead: msg.read
        }));

        setMessages(formattedMessages);

        // Update last message for user in users list
        if (formattedMessages.length > 0) {
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === selectedUser.id 
                ? { ...user, lastMessage: lastMessage.text }
                : user
            )
          );
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to load messages');
      }
    };

    fetchMessages();
    const pollInterval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(pollInterval);
  }, [selectedUser, currentUserId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedUser || !currentUserId || isSending) return;

    try {
      setIsSending(true);
      const messageDTO = {
        messageContent: newMessage,
        senderId: currentUserId,
        receiverId: selectedUser.id,
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(
        'http://localhost:8080/api/messages/send',
        messageDTO
      );

      const sentMessage = {
        id: response.data.messageId,
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");

      // Update last message in users list
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id
            ? { ...user, lastMessage: newMessage }
            : user
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="messagePage__loading">
        <Loader className="animate-spin" size={48} />
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messagePage__error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="messagePage">
      {/* Left Sidebar - Users List */}
      <div className="messagePage__leftSidebar">
        <div className="messagePage__leftSidebar__header">
          <Link to="/" className="messagePage__logo">
            <img src={LogoIcon} alt="Logo" className="messagePage__logoIcon" />
          </Link>
          <div className="messagePage__searchContainer">
            <input
              type="text"
              placeholder="Search conversations"
              className="messagePage__searchInput"
            />
          </div>
        </div>

        <div className="messagePage__usersList">
          {users.map((user) => (
            <div
              key={user.id}
              className={`messagePage__userItem ${
                selectedUser?.id === user.id ? "messagePage__userItem--active" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="messagePage__userAvatar">
                <img 
                  src={user.avatar || ProfPic} 
                  alt={user.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultAvatar;
                  }}
                />
                {user.online && <span className="messagePage__onlineIndicator"></span>}
              </div>
              <div className="messagePage__userInfo">
                <h3 className="messagePage__userName">{user.name}</h3>
                <p className="messagePage__lastMessage">{user.lastMessage || "No messages yet"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="messagePage__main">
        {/* Navigation Bar */}
        <div className="messagePage__navbar">
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

        {/* Chat Area */}
        {selectedUser ? (
          <div className="messagePage__chatContainer">
            {/* Chat Header */}
            <div className="messagePage__chatHeader">
              <div className="messagePage__chatUserInfo">
                <img
                  src={selectedUser.avatar || ProfPic}
                  alt={selectedUser.name}
                  className="messagePage__chatAvatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DefaultAvatar;
                  }}
                />
                <div className="messagePage__chatUserDetails">
                  <h2 className="messagePage__chatUserName">{selectedUser.name}</h2>
                  <p className="messagePage__chatUserStatus">
                    {selectedUser.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="messagePage__chatActions">
                <button className="messagePage__actionBtn">
                  <Phone size={20} />
                </button>
                <button className="messagePage__actionBtn">
                  <VideoIcon size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="messagePage__messagesArea">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`messagePage__message ${
                    msg.sender === "me"
                      ? "messagePage__message--sent"
                      : "messagePage__message--received"
                  }`}
                >
                  <div className="messagePage__messageContent">
                    <div className="messagePage__messageBubble">{msg.text}</div>
                    <span className="messagePage__messageTime">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="messagePage__inputArea">
              <button className="messagePage__inputAction">
                <Smile size={20} />
              </button>
              <button className="messagePage__inputAction">
                <Paperclip size={20} />
              </button>
              <button className="messagePage__inputAction">
                <Image size={20} />
              </button>
              <input
                type="text"
                placeholder="Type a message"
                className="messagePage__input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isSending}
              />
              <button
                className="messagePage__sendBtn"
                onClick={handleSendMessage}
                disabled={isSending}
              >
                {isSending ? <Loader size={20} className="animate-spin" /> : ">"}
              </button>
              <button className="messagePage__inputAction">
                <Mic size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="messagePage__noChat">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - User Info */}
      {selectedUser && (
        <div className="messagePage__rightSidebar">
          <div className="messagePage__userProfile">
            <img
              src={ProfPic}
              alt={selectedUser.name}
              className="messagePage__profileAvatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DefaultAvatar;
              }}
            />
            <h2 className="messagePage__profileName">{selectedUser.name}</h2>
            <p className="messagePage__profileStatus">
              {selectedUser.online ? "Active Now" : "Offline"}
            </p>
          </div>

          <div className="messagePage__userDetails">
            <section className="messagePage__detailsSection">
              <h3 className="messagePage__sectionTitle">About</h3>
              <p className="messagePage__detailText">Software Developer</p>
              <p className="messagePage__detailText">Joined January 2024</p>
            </section>

            <section className="messagePage__detailsSection">
              <h3 className="messagePage__sectionTitle">Shared Media</h3>
              <div className="messagePage__mediaGrid">
                {/* Add shared media functionality if needed */}
                <p>No shared media yet</p>
              </div>
            </section>

            <section className="messagePage__detailsSection">
              <h3 className="messagePage__sectionTitle">Settings</h3>
              <div className="messagePage__settingOption">
                <span>Mute Notifications</span>
                <div className="messagePage__toggleSwitch"></div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePage;