import React from 'react';
import './Subscribevideo.css'; 


const Subscribevideo = ({ title, channel }) => {
  return (
    <div className="subscribe-video-card">
      <h4>{title}</h4>
      <p><strong>Channel:</strong> {channel}</p>
    </div>
  );
};

export default Subscribevideo;
