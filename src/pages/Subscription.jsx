
import React from 'react';
import { useSubscribe } from '../components/SubscribeContext.jsx';
import './Subscription.css';

const Subscription = () => {
  const { subscribedVideos, unsubscribeFromVideo } = useSubscribe();

  return (
    <div className="subscription-container">
      <h2 className="subscription-heading">Subscribed Videos</h2>

      {subscribedVideos.length === 0 ? (
        <p className="txt">You haven't subscribed to any channels yet.</p>
      ) : (
        <div className="subscription-grid">
          {subscribedVideos.map((channel, index) => (
            <div key={index} className="subscribed-card">
              <h3>{channel.title}</h3> 
              <p>Uploaded by: {channel.name}</p>
              <button
                className="unsubscribe-btn"
                onClick={() => unsubscribeFromVideo(channel)}
              >
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscription;






