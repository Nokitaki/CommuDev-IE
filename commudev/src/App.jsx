import Newsfeed from './JoelComponents/NewsfeedTest'
import Profile from './KenjiComponents/ProfileUser'
import AuthPage from './RenzComponents/AuthPage'
import Resourcehub from './JoelComponents/Resourcehub'
import Message from './KyleComponents/MessageComponent'
import TaskManager from './KenjiComponents/TaskManager'
import Rewards from './GarveyComponents/Rewards'
import Feedback from './GarveyComponents/Feedbacks'
import ResourcehubTest from './JoelComponents/ResourcehubTest'
import Login from './RenzComponents/Login'
import Register from './RenzComponents/Register'


import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Newsfeed />} />
      <Route path="/profileuser" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resource" element={<ResourcehubTest />} />
      <Route path="/messages" element={<Message />} />
      <Route path="/task" element={<TaskManager />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/feedback" element={<Feedback />} />

    </Routes>
  )
}

export default App