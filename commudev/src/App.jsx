import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Newsfeed from './JoelComponents/Newsfeed';
import Resourcehub from './JoelComponents/Resourcehub';


function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Links */}
        <nav>
          <Link to="/newsfeed">News Feed</Link>
          <Link to="/resources">Resource Hub</Link>
    
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/newsfeed" element={<Newsfeed />} />
          <Route path="/resources" element={<Resourcehub />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
