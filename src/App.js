import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import View from './pages/View.jsx';
import { useNavigate } from 'react-router-dom';
import Side from './components/side.jsx';
import Navigation from './components/topbottom.jsx';
import Home from './pages/Home.jsx';
import Shorts from './pages/shorts.jsx';
import Subscription from './pages/Subscription.jsx';
import History from './pages/History.jsx';
import Playlist from './pages/playlist.jsx';
import MinimizedCall from './components/MinimizedCall.jsx';
import WatchLater from './pages/WatchLater.jsx';
import LikedVideos from './pages/LikedVideos.jsx';
import Settings from './pages/Settings.jsx';
import Help from './pages/Help.jsx';
import Loginscreen from './pages/Loginscreen.jsx';
import Sendfeedback from './pages/Sendfeedback.jsx';
import Channel from './pages/Channel.jsx';
import Createchannel from './components/Createchannel.jsx';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile.jsx';
import Plans from './pages/Plans.jsx';
import VideoCall from './components/VideoCall';
const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <>
      <Navigation toggleSidebar={toggleSidebar} />
      <MinimizedCall/>
      <div className="layout">
        {showSidebar && <Side showSidebar={showSidebar} />}
        <div className={`MainContent ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
          {children}
        </div>
      </div>
    </>
  );
};

const App = () => {
  const { accessToken, loading } = useSelector(state => state.auth);
  const navigate = useNavigate();

  
  return (
    
     <Routes>
        
        <Route path="/auth" element={<Loginscreen />} />

        
        <Route
          path="/*" 
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/view/:id" element={<View />} />
                <Route path="/video-call" element={<VideoCall />} />
                <Route path="/channel" element={<Channel />} />
                <Route path="/home" element={<Home />} />
                <Route path="/shorts" element={<Shorts />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/history" element={<History />} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/watchlater" element={<WatchLater />} />
                <Route path="/likedvideos" element={<LikedVideos />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/createchannel" element={<Createchannel />} />
                <Route path="/sendfeedback" element={<Sendfeedback />} />
                <Route path="/Profile" element={<Profile/>}/>
                <Route path="*" element={<Navigate to="/" replace />} />
                
              </Routes>
            </Layout>
          }
        />
      </Routes>
    
   
  );
};

export default App;

