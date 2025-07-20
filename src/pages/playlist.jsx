import React from 'react'
import './Home.css';
import VideoMaking from './VideoMaking';
const Playlist = () => {
  return(
  <div className="container_page">
        <div>
          <h4 className='play'>Playlist Videos</h4>
          <VideoMaking />
        </div>  
      
    </div>
); 
}

export default Playlist
