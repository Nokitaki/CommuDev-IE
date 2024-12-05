import { ThemeProvider } from '@mui/material/styles';
import theme from './KenjiComponents/theme'
import Newsfeed from './JoelComponents/NewsfeedTest'
import Profile from './KenjiComponents/ProfileUser'
import AuthPage from './RenzComponents/AuthPage'
import Resourcehub from './JoelComponents/Resourcehub'
import Message from './KyleComponents/MessageComponent'
import TaskManager from './KenjiComponents/TaskManager'
import Rewards from './GarveyComponents/Rewards'
import Feedback from './GarveyComponents/Feedbacks'
import ResourcehubTest from './JoelComponents/ResourcehubTest'
import React from 'react';
import { Routes, Route } from 'react-router-dom';



import ViewProfile from './Search/ViewProfile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/newsfeed" element={<Newsfeed />} />
        <Route path="/profileuser" element={<Profile />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="/resource" element={<ResourcehubTest />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/task" element={<TaskManager />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/feedback" element={<Feedback />} />


        <Route path="/view-profile/:userId" element={<ViewProfile />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App