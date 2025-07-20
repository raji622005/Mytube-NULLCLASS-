import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../components/avatar';
import './Profile.css';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getHistoryOnce } from '../components/Historycontext.jsx';
import { useNavigate } from 'react-router-dom';
import {UserScore} from '../components/userscore.jsx';
const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const point = sessionStorage.getItem('userPoints') || 0;
  const [watchCount, setWatchCount] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
  const fetchData = async () => {
    if (user?.uid) {
      const pts = await UserScore(user.uid);
      setPoints(pts);
    }
  };
  fetchData();
}, [user]);
  const clearPoints = async () => {
  if (!user || !user.uid) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { points: 0 });
    sessionStorage.setItem('userPoints', '0');
    window.location.reload(); // or you can setPoints(0) if you store points in a state
  } catch (error) {
    console.error('Error resetting points:', error);
  }
};
  
  const move1 = () => {
    navigate('/createchannel');
  };
  const move2 = () => {
    navigate('/history');
  };
  const move3 = () => {
    navigate('/watchlater');
  };
  const move4 = () => {
    navigate('/subscription');
  };
  const move5 = () => {
    navigate('/likedvideos');
  };

  return (
    <div className="profiles">
      <div className="avatar1">
        <Avatar className="avatar2">
          {user && user.photoURL ? (
            <AvatarImage
              src={user.photoURL}
              alt={user.name}
              className="avatar3"
            />
          ) : (
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <div className="names">
        <h1>{user?.name || 'Guest'}</h1>
      </div>

      <div>
        {points === 0 ? (
          <p>Point : 0</p>
        ) : (
          <div className="history-list">
            <div>points: {points}</div>
            <button onClick={clearPoints} className="btn-clear">Clear Points</button>
          </div>
        )}
      </div>

      <div>
        <button className="bttnn" onClick={move1}>
          Create channel
        </button>
      </div>

      <div>
        <h2 className="details">Details</h2>
        <div className="bttn">
          <h4>
            ▸ History 
            <button className="btn1" onClick={move2}>
              View
            </button>
          </h4>
          <h4>
            ▸ Watch Later
            <button className="btn2" onClick={move3}>
              View
            </button>
          </h4>
          <h4>
            ▸ Subscription
            <button className="btn3" onClick={move4}>
              View
            </button>
          </h4>
          <h4>
            ▸ Liked Videos
            <button className="btn4" onClick={move5}>
              View
            </button>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Profile;

