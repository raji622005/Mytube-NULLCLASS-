import React from 'react'
import VideoCard from '../components/VideoCard.jsx';
import './VideoMaking.css';
import Videos from '../components/VideoData.jsx';
const VideoMaking = () => {
    
  return (
   
      <div className='video-grid'>
            {Videos.map((vid) => (
            <VideoCard
                key={vid.id}
                id={vid.id}
                title={vid.title}
                videoSrc={vid.videoSrc}
                
                thumbnail={vid.thumbnail}
                channel={vid.channel}
            />
            
            ))}
        </div>
        
    
  )
}

export default VideoMaking;
