// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, useTheme } from '@mui/material';
import {
  Menu as MenuIcon,
  Newspaper as NewspaperIcon,
  Book as ResourceIcon,
  EmojiEvents as RewardsIcon,
  Feedback as FeedbackIcon,
  Person as ProfileIcon,
  Assignment as TaskIcon,
  Message as MessageIcon,
  Login as LoginIcon,
} from '@mui/icons-material';

// Import your components
import Newsfeed from './JoelComponents/Newsfeed';
import Resourcehub from './JoelComponents/Resourcehub';
import Rewards from './GarveyComponents/Rewards';
import Feedbacks from './GarveyComponents/Feedbacks';
import ProfileUser from './KenjiComponents/ProfileUser';
import TaskManager from './KenjiComponents/TaskManager';
import AuthPage from './RenzComponents/AuthPage';
import MessageComponent from './KyleComponents/MessageComponent';

// Sidebar width
const drawerWidth = 240;

const NavItem = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <ListItem
      component={Link}
      to={to}
      sx={{
        mb: 1,
        borderRadius: 2,
        backgroundColor: isActive ? 'rgba(76, 175, 80, 0.1)' : 'transparent',
        color: isActive ? '#4CAF50' : '#666',
        '&:hover': {
          backgroundColor: 'rgba(76, 175, 80, 0.05)',
        },
      }}
    >
      <ListItemIcon sx={{ color: isActive ? '#4CAF50' : '#666' }}>
        {icon}
      </ListItemIcon>
      <ListItemText 
        primary={text} 
        primaryTypographyProps={{
          fontSize: '0.9rem',
          fontWeight: isActive ? 600 : 400
        }}
      />
    </ListItem>
  );
};

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ p: 2, height: '100%', backgroundColor: '#fff' }}>
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, pl: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            color: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <svg width="24" height="24" viewBox="0 0 100 100">
            <circle cx="50" cy="30" r="15" fill="#4CAF50" />
            <circle cx="30" cy="60" r="15" fill="#4CAF50" />
            <circle cx="70" cy="60" r="15" fill="#4CAF50" />
            <path d="M50 45C65 45 70 60 70 60" stroke="#4CAF50" strokeWidth="3" />
            <path d="M50 45C35 45 30 60 30 60" stroke="#4CAF50" strokeWidth="3" />
          </svg>
          CommuDev
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List sx={{ px: 2 }}>
        <NavItem to="/authentication" icon={<LoginIcon />} text="Login/Signup" />
        <NavItem to="/newsfeed" icon={<NewspaperIcon />} text="News Feed" />
        <NavItem to="/resources" icon={<ResourceIcon />} text="Resource Hub" />
        <NavItem to="/rewards" icon={<RewardsIcon />} text="Rewards" />
        <NavItem to="/feedbacks" icon={<FeedbackIcon />} text="Feedbacks" />
        <NavItem to="/profileuser" icon={<ProfileIcon />} text="Profile" />
        <NavItem to="/taskmanager" icon={<TaskIcon />} text="Tasks" />
        <NavItem to="/messages" icon={<MessageIcon />} text="Messages" />
      </List>
    </Box>
  );

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Mobile Hamburger Menu */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ 
            mr: 2, 
            display: { sm: 'none' }, 
            position: 'fixed', 
            top: 16, 
            left: 16,
            zIndex: 1200,
            backgroundColor: 'white',
            boxShadow: 1,
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: 3
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: 3
            },
          }}
          open
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: '#f5f7fa'
          }}
        >
          {/* Add some top spacing for mobile view */}
          <Box sx={{ height: { xs: '48px', sm: '0' } }} />
          
          <Routes>
            <Route path="/newsfeed" element={<Newsfeed />} />
            <Route path="/resources" element={<Resourcehub />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/profileuser" element={<ProfileUser />} />
            <Route path="/taskmanager" element={<TaskManager />} />
            <Route path="/authentication" element={<AuthPage />} />
            <Route path="/messages" element={<MessageComponent />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;