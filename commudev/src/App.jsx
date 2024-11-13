import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Newsfeed from './JoelComponents/Newsfeed';
import Resourcehub from './JoelComponents/Resourcehub';
import Rewards from './GarveyComponents/Rewards';
import Feedbacks from './GarveyComponents/Feedbacks';
import ProfileUser from './KenjiComponents/ProfileUser';
import TaskManager from './KenjiComponents/TaskManager';


function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Links */}
        <nav>
          <Link to="/newsfeed">News Feed</Link>
          <Link to="/resources">Resource Hub</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/feedbacks">Feedbacks</Link>
          <Link to="/profileuser">Profile User</Link>
          <Link to="/taskmanager">Tasks</Link>
    
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/newsfeed" element={<Newsfeed />} />
          <Route path="/resources" element={<Resourcehub />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/profileuser" element={<ProfileUser />} />
          <Route path="/taskmanager" element={<TaskManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
