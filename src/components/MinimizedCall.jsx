// src/components/MinimizedCall.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoCall } from './VideoCallContext';

const MinimizedCall = () => {
  const { isSharingScreen, localStream } = useVideoCall();
  const miniVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSharingScreen && miniVideoRef.current && localStream) {
      miniVideoRef.current.srcObject = localStream;
    }
  }, [isSharingScreen, localStream]);

  if (!isSharingScreen) return null;

  const handleClick = () => {
    const callId = localStorage.getItem('receiverPeerId');
    if (callId) {
      navigate(`/video-call?peerId=${callId}`);
    } else {
      alert('No active call found.');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        width: '180px',
        height: '120px',
        background: 'black',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
      }}
    >
      <video
        ref={miniVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      ></video>
    </div>
  );
};

export default MinimizedCall;