
import React from 'react';
import { useLikedVideos } from '../components/Likedvideoscontext.jsx';
import { Link } from 'react-router-dom';
import Text from '../components/text';
import './Likedvideos.css';

const LikedVideos = () => {
  const { likedVideos, removeFromLikedVideos } = useLikedVideos();
  
  return (
    <div className="liked-container">
      <h2>Liked Videos</h2>
      {likedVideos.length === 0 ? (
        <p>No liked videos.</p>
      ) : (
        likedVideos.map((video) => (
          <div key={video.id}>
            
              <video className="liked-card" src={video.videoSrc} width="100%" controls />
            
            <h4>{video.title}</h4>
            <Text title={video?.title} channel={video?.channel} />
            <button onClick={() => removeFromLikedVideos(video.id)} className="rem">Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default LikedVideos;

