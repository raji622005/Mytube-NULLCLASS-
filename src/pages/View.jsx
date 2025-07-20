import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from '../components/Historycontext.jsx';
import { useLikedVideos } from '../components/Likedvideoscontext';
import { useWatchLater } from '../components/WatchLaterContext.jsx';
import Videos from '../components/VideoData.jsx';
import Text from '../components/text.jsx';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import './View.css';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db, auth } from '../firebase';
import { format } from 'date-fns';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { updateUserScore, UserScore } from '../components/userscore.jsx';

// ✅ PLAN WATCH LIMITS (in seconds)
const planLimits = {
  Free: 300,     // 5 minutes
  Bronze: 420,   // 7 minutes
  Silver: 600,   // 10 minutes
  Gold: Infinity
};

const View = () => {
  const { id } = useParams();
  const video = Videos.find((v) => v.id === id);
  const videoRef = useRef(null);

  const [likeColor, setLikeColor] = useState('grey');
  const [dislikeColor, setDislikeColor] = useState('grey');
  const [watchColor, setWatchColor] = useState('grey');
  const [comment, setComment] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [watchLimitExceeded, setWatchLimitExceeded] = useState(false);

  const { addToHistory } = useHistory();
  const { addToLikedVideos, removeFromLikedVideos } = useLikedVideos();
  const { addToWatchLater, removeFromWatchLater } = useWatchLater();
  const user = useSelector((state) => state.auth.user);

  const trackWatchTime = async (duration) => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    let userData = snap.data();
    const prevDate = userData?.watchDate;
    const prevTime = userData?.watchTimeUsedToday || 0;
    const plan = userData?.subscription?.plan || 'Free';
    const maxLimit = planLimits[plan];

    const newTime = prevDate === today ? prevTime + duration : duration;

    if (newTime >= maxLimit) {
      setWatchLimitExceeded(true);
    }

    await updateDoc(userRef, {
      watchTimeUsedToday: newTime,
      watchDate: today,
    });
  };

  useEffect(() => {
    let interval;
    let secondsWatched = 0;

    const initTracking = async () => {
      if (!user || !video || !videoRef.current) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      const plan = userData?.subscription?.plan || 'Free';
      const limit = planLimits[plan];
      const today = format(new Date(), 'yyyy-MM-dd');
      let watchTimeUsed = userData?.watchTimeUsedToday || 0;
      const lastDate = userData?.watchDate;

      if (lastDate !== today) {
        watchTimeUsed = 0;
        await updateDoc(userRef, {
          watchTimeUsedToday: 0,
          watchDate: today,
        });
      }

      if (watchTimeUsed >= limit) {
        setWatchLimitExceeded(true);
        return;
      }
      interval = setInterval(async () => {
  const videoEl = videoRef.current;
  if (videoEl && !videoEl.paused && !videoEl.ended) {
    secondsWatched++;
    if (secondsWatched % 5 === 0) {
      await trackWatchTime(5);
    }
  }
}, 1000);

      
    };

    initTracking();

    return () => {
      clearInterval(interval);
      if (secondsWatched > 0) {
        trackWatchTime(secondsWatched);
      }
    };
  }, [video, user]);

  useEffect(() => {
    if (video && user) {
      const timeout = setTimeout(() => {
        addToHistory({
          id: video.id,
          title: video.title || 'Untitled Video',
          channel: typeof video.channel === 'string' ? video.channel : video.channel?.name || 'Unknown Channel',
          videoSrc: video.videoSrc || '',
        }, user);
        handleWatched();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [video, user]);

  const handleWatched = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const existingPoints = await UserScore(user.uid);
    await updateUserScore(user.uid, existingPoints + 5);
  };

  const addComment = async () => {
    if (!user || !comment.trim()) return;
    await addDoc(collection(db, 'videos', video.id, 'comments'), {
      text: comment,
      userName: user.name,
      userPhoto: user.photoURL || '',
      createdAt: serverTimestamp()
    });
    setComment('');
  };

  useEffect(() => {
    if (!video?.id) return;
    const q = query(collection(db, 'videos', video.id, 'comments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const comments = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllComments(comments);
    });
    return () => unsub();
  }, [video?.id]);

  const handleLikeClick = () => {
    if (likeColor === 'black') {
      setLikeColor('grey');
      removeFromLikedVideos(video.id);
    } else {
      setLikeColor('black');
      setDislikeColor('grey');
      addToLikedVideos(video);
    }
  };

  const handleDislikeClick = () => {
    if (dislikeColor === 'black') {
      setDislikeColor('grey');
    } else {
      setDislikeColor('black');
      setLikeColor('grey');
      removeFromLikedVideos(video.id);
    }
  };

  const handleWatchLater = () => {
    if (watchColor === 'black') {
      setWatchColor('grey');
      removeFromWatchLater(video.id);
    } else {
      setWatchColor('black');
      addToWatchLater(video);
    }
  };

  return (
    <div className="watch-container">
      <div className="main-player">
        {watchLimitExceeded ? (
          <div style={{ color: 'red', fontWeight: 'bold', padding: '20px' }}>
            🚫 You’ve reached your daily watch time limit based on your plan.
          </div>
        ) : (
          <video
            src={video?.videoSrc}
            muted
            autoPlay
            loop
            controls
            className="full-video"
            ref={videoRef}
          />
        )}

        <div className="actions">
          <Text title={video?.title} channel={video?.channel} />
          <div className="video-actions">
            <button onClick={handleLikeClick} style={{ color: likeColor }}>
              <ThumbUpIcon fontSize="small" />
            </button>
            <button onClick={handleDislikeClick} style={{ color: dislikeColor }}>
              <ThumbDownIcon fontSize="small" />
            </button>
            <button onClick={handleWatchLater} style={{ color: watchColor }}>
              <TurnedInNotIcon fontSize="small" />
            </button>
          </div>
          <div>
            <h4>{user?.name || 'Guest'}</h4>
            <textarea
              value={comment}
              placeholder="Add a comment"
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={addComment}>Comment</button>
            <hr />
            <div>
              {allComments.map((c) => (
                <div key={c.id} style={{ marginBottom: '10px' }}>
                  <strong>{c.userName}</strong>: {c.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sugestions">
        <h3>My Mix</h3>
        {Videos.filter((v) => v.id !== id).map((v) => (
          <div key={v.id} className="suggested-video">
            <video width="120" muted autoPlay loop poster={v.thumbnail}>
              <source src={v.videoSrc} type="video/mp4" />
            </video>
            <div className="suggested-info">
              <p>{v.title}</p>
              <span>{v.channel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default View;

