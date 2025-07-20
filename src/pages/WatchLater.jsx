
import React from 'react';
import { useWatchLater } from '../components/WatchLaterContext.jsx';
import Text from '../components/text.jsx';
import { Link } from 'react-router-dom';
import './WatchLater.css';

const WatchLater = () => {
  const { watchLaterList = [], removeFromWatchLater } = useWatchLater();

  return (
    <div className="watch-later-container">
      <h2 className="watch-later-title">Watch Later</h2>

      {watchLaterList.length === 0 ? (
        <p>No videos saved for later.</p>
      ) : (
        <div className="video-grid">
          {watchLaterList.map((video) => (
            <div className="video-card" key={video.id}>
              <Link to={`/view/${video.id}`}>
                <video src={video.videoSrc} width="100%" controls />
              </Link>
              <div className="text-container">
                <h4>{video.title}</h4>
                <Text title={video.title} channel={video.channel} />
                <button onClick={() => removeFromWatchLater(video.id)} className='rem'>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchLater;

