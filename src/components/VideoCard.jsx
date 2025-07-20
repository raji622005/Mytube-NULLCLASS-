import './VideoCard.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Text from '../components/text';
import Profile from '../pages/Profile';
const VideoCard = ({ title, videoSrc, thumbnail, channel, id }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    const currentPoints = parseInt(sessionStorage.getItem("userPoints") || "0");
    sessionStorage.setItem("userPoints", currentPoints + 5);
    navigate(`/view/${id}`);
 
  };
  const [using,setusing]=useState()
  
  return (
    <div className="video-card" onClick={handleClick}>
      <div className="thumbnail-container">
        <video
          width="300px"
          height="200px"
          controls
          autoPlay
          loop
          muted
          poster={thumbnail}
          className="video-player"
        >
          <source src={videoSrc} type="video/mp4"  />
        </video>
      </div>
      
      <Text
        
        title={title}
        id={id}
        channel={channel}
        
        />
        
        
    </div>
    
  );
}


export default VideoCard;