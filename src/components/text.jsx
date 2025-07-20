import { Avatar1, AvatarFallback1 } from '../components/avatar';
import './text.css';
import { useState, useEffect } from 'react';
import { useSubscribe } from '../components/SubscribeContext';

const Text = ({ title, channel }) => {
  const { subscribedVideos, subscribeToVideo, unsubscribeFromVideo } = useSubscribe();

  const channelData = {
    channelId: channel, 
    name: channel,     
  };

  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const isSubscribed = subscribedVideos.some(
      (sub) => sub.channelId === channelData.channelId
    );
    setSubscribed(isSubscribed);
  }, [subscribedVideos, channelData.channelId]);

  const handleSubscribe = () => {
    const subscription = {
      title,
      channelId: channelData.channelId,
      name: channelData.name,
    };

    if (subscribed) {
      unsubscribeFromVideo(subscription);
    } else {
      subscribeToVideo(subscription);
    }

    setSubscribed(!subscribed);
  };

  return (
    <div className="video-text">
      <h3 className="video-title">{title}</h3>

      <div className="channel-info-wrapper">
        <div className="channel-avatar">
          <Avatar1>
            <AvatarFallback1>
              {channelData.name.charAt(0).toUpperCase()}
            </AvatarFallback1>
          </Avatar1>
        </div>

        <div className="channel-details">
          <div className="channel-name-line">
            <span className="channel-name">{channelData.name}</span>
            <span className="verified-icon">✔️</span>
          </div>
          <div className="video-stats">1M views • 20 hours ago</div>
          <button className="subscribe-btn" onClick={handleSubscribe}>
            {subscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Text;


