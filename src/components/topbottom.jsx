
import MenuIcon from '@mui/icons-material/Menu';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar,AvatarImage, AvatarFallback } from './avatar.jsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '../components/DropdownMenu.jsx';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import Search from './Search';
import images from '../components/downloaded.png';
import image from '../pages/image.png';
import './topbottom.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/auth.action.jsx';
import { useSelector } from 'react-redux';
import { auth } from '../firebase.js';
import { useEffect } from 'react'; 
const Navigation = ({ toggleSidebar }) => {
    const [notification, setNotification] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const user = useSelector(state => state.auth.user);
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const moves1=()=>{
      navigate('/Profile')
    }
    const moves2=()=>{
      navigate('/History')
    }
    const moves3=()=>{
      navigate('/Watchlater')
    }
    const moves4=()=>{
      navigate('/Likedvideos')
    }
    const moves5=()=>{
      navigate('/Plans')
    }
    const moving=()=>{
      navigate('/Createchannel')
    }
    const logouthandler=()=>{
      dispatch(logout())
    }
    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);
    const handleVideoCallClick = () => {
    if (currentUser) {
      navigate('/video-call');
    } else {
      navigate('/auth'); // redirect to login/signup
    }
  };
  

  

  return (
    <header className="top-bar">
      <div className="left">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Tooltip title="Menu" arrow>
         <MenuIcon className='btnn' fontSize="inherit"/></Tooltip>
        </button>

        <div className="youtube-brand">
          <img src={image} alt="YouTube Logo" />
          <span className="youtube-name">MyTube</span>
          
        </div>
      </div>

      <div className="center">
        <Search />
      </div>
      <div className='whole'>
        <Tooltip title="Start Video Call" arrow>
        <VideoCallIcon  fontSize="inherit" className='icon1' onClick={handleVideoCallClick} style={{ cursor: 'pointer' }} /></Tooltip>
        <NotificationsIcon fontSize="inherit" className='icon2'  />
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div style={{ cursor: 'pointer' }}>
      {user ? (
        
        <Avatar>
          {user && user.photoURL ? (
            <AvatarImage src={user.photoURL} alt={user.name} className="ava-image" />
          ) : (
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
       
      ) : (
        <button
          onClick={() => navigate('/auth')}
          className="login-avatar-button"
        >
          Login
        </button>
      )}
    </div>
  </DropdownMenuTrigger>

  {user && (
    <DropdownMenuContent>
      <DropdownMenuItem onClick={moving}>Create Channel</DropdownMenuItem>
      <DropdownMenuItem onClick={moves1}>My Profile</DropdownMenuItem>
      <DropdownMenuItem onClick={moves5} >Purchase and Membership</DropdownMenuItem>
      <DropdownMenuItem onClick={moves2}>History</DropdownMenuItem>
      <DropdownMenuItem onClick={moves3}>Watch later</DropdownMenuItem>
      <DropdownMenuItem onClick={moves4}>Liked videos</DropdownMenuItem>
      <DropdownMenuItem onClick={logouthandler}>Log out</DropdownMenuItem>
    </DropdownMenuContent>
  )}
</DropdownMenu>

       </div> 

    </header>
  );
};

export default Navigation;




