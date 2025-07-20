import  { useState } from 'react';

import UploadBox from "../components/Uploadbox.jsx";
import VideoCard from '../components/VideoCard.jsx';
import './Settings.css';
import image from '../components/downloaded.png';
import { Avatar, AvatarFallback } from '../components/avatar.jsx';

const Channel = () => {
  const User = {
    id: "6",
    name: "raju",
    email: "rajalakshmiaruna2005@gmail.com",
    image: image,
    channel: "Learner"
  };

 
  const [videos, setVideos] = useState([]);

  const handleUpload = (video) => {
    setVideos((prev) => [...prev, video]);
  };

  return (
    <div className='channel-container'>
      <div className='banner'>
        <div>
         <Avatar>
            <AvatarFallback>{User.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <span className="icco1">{User.channel}</span><br/>
          <span className='icco2'>@{User.channel}</span>
        </div>
      </div>

      <p className='welcomes'>Welcome to our Channel Learner! We interact and update about the latest technology.</p>

      <div className='spans'>
        <span className='spans1'>Home</span>
        <span className='spans1'>Videos</span>
        <span className='spans1'>Shorts</span>
        <span className='spans1'>Community</span>
        <span className='spans1'>About</span>
      </div>

      <hr />

      <h4>Upload a Video</h4>
      <div className='upload-box'>
        <UploadBox onUpload={handleUpload} />
      </div>

      <div className='content'>
        <div className="video-list">
          {videos.length === 0 ? (
            <p>No videos uploaded yet.</p>
          ) : (
            videos.map((vid, idx) => <VideoCard key={idx} video={vid} />)
          )}
        </div>
       <div>
        
       </div>
      </div>
    </div>
  );
};

export default Channel;



