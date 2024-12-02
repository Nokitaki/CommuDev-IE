import React, { useState } from "react";
import {
  Send,
  Smile,
  Paperclip,
  Image,
  Mic,
  Phone,
  VideoIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/MessageComponent.css";
import LogoIcon from "../assets/prof/logo.png";
import HomeIcon from "../assets/HomeIcon.svg";
import CommuIcon from "../assets/CommuIcon.svg";
import FeedbackIcon from "../assets/FeedbackIcon.svg";
import MessageIcon from "../assets/MessageIcon.svg";
import RewardsIcon from "../assets/RewardsIcon.svg";
import ResourceIcon from "../assets/ResourceIcon.svg";
import TaskIcon from "../assets/TaskIcon.svg";
import Prof1 from "../assets/prof/prof1.jpg";
import Prof2 from "../assets/prof/prof2.jpg";
import Prof3 from "../assets/prof/prof3.jpg";
import Prof4 from "../assets/prof/prof4.jpg";

const MessagePage = () => {
  const navigationItems = [
    { icon: HomeIcon, label: "Home", path: "/" },
    { icon: MessageIcon, label: "Messages" },
    { icon: ResourceIcon, label: "Resources", path: "/resource" },
    { icon: TaskIcon, label: "Task", path: "/task" },
    { icon: RewardsIcon, label: "Rewards" },
    { icon: FeedbackIcon, label: "Feedback" },
  ];

  const users = [
    {
      id: 1,
      name: "John Doe",
      avatar: Prof1,
      lastMessage: "Hey, how are you?",
      online: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: Prof2,
      lastMessage: "See you later!",
      online: false,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: Prof3,
      lastMessage: "Meeting at 2 PM",
      online: true,
    },
    {
      id: 4,
      name: "Emily Brown",
      avatar: Prof4,
      lastMessage: "Let's catch up soon",
      online: true,
    },
  ];

  const initialMessages = [
    {
      id: 1,
      text: "Hey there! How are you?",
      sender: "other",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      text: "I'm doing great, thanks for asking!",
      sender: "me",
      timestamp: "2:31 PM",
    },
    {
      id: 3,
      text: "Want to grab coffee later?",
      sender: "other",
      timestamp: "2:32 PM",
    },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageToSend = {
      id: messages.length + 1,
      text: newMessage,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, messageToSend]);
    setNewMessage("");
  };

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
                selectedUser.id === user.id
                  ? "messagePage__userItem--active"
                  : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="messagePage__userAvatar">
                <img src={user.avatar} alt={user.name} />
                {user.online && (
                  <span className="messagePage__onlineIndicator"></span>
                )}
              </div>
              <div className="messagePage__userInfo">
                <h3 className="messagePage__userName">{user.name}</h3>
                <p className="messagePage__lastMessage">{user.lastMessage}</p>
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

        {/* Chat Area */}
        <div className="messagePage__chatContainer">
          {/* Chat Header */}
          <div className="messagePage__chatHeader">
            <div className="messagePage__chatUserInfo">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="messagePage__chatAvatar"
              />
              <div className="messagePage__chatUserDetails">
                <h2 className="messagePage__chatUserName">
                  {selectedUser.name}
                </h2>
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
                  <span className="messagePage__messageTime">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
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
            />
            <button
              className="messagePage__sendBtn"
              onClick={handleSendMessage}
            >
              &gt;
            </button>
            <button className="messagePage__inputAction">
              <Mic size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - User Info */}
      <div className="messagePage__rightSidebar">
        <div className="messagePage__userProfile">
          <img
            src={selectedUser.avatar}
            alt={selectedUser.name}
            className="messagePage__profileAvatar"
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
              <div className="messagePage__mediaItem">
                <img src={Prof1} alt="Shared Media 1" />
              </div>
              <div className="messagePage__mediaItem">
                <img src={Prof2} alt="Shared Media 2" />
              </div>
              <div className="messagePage__mediaItem">
                <img src={Prof3} alt="Shared Media 3" />
              </div>
              <div className="messagePage__mediaItem">
                <img src={Prof4} alt="Shared Media 4" />
              </div>
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
    </div>
  );
};

export default MessagePage;
