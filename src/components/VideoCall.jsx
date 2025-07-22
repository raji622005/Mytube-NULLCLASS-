// src/components/VideoCall.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useVideoCall } from './VideoCallContext';
import MinimizedCall from './MinimizedCall';
import { Navigate, useNavigate } from 'react-router-dom';
import Peer from './peer.jsx';
import './VideoCall.css';
const VideoCall = () => {
  const [callToId, setCallToId] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [screenChunks, setScreenChunks] = useState([]);
  const [peerId, setPeerId] = useState('');
  const { isSharingScreen,localStream, setLocalStream, screenStream, setScreenStream, currentCall, setCurrentCall, setIsSharingScreen } = useVideoCall();
  const navigate=useNavigate();
  const [remoteStream, setRemoteStream] = useState(null);
  const peerInstance = useRef(null);
   const [screenRecording, setScreenRecording] = useState(false);
  const screenRecorderRef = useRef(null);
  
  useEffect(() => {
    const getMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    };

    getMedia();

    const peer = Peer;
    peerInstance.current = peer;

    peer.on('open', (id) => {
      setPeerId(id);
      console.log('My peer ID is:', id);
    });

    peer.on('call', async (call) => {
      localStorage.setItem('activePeerId', call.peer);
      call.answer(localStream);
      call.on('stream', (remote) => {
        setRemoteStream(remote);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
      });
      currentCall.current = call;
    });
  }, []);
  const callUser = async () => {
  if (!callToId || !peerInstance.current) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream); 
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const call = peerInstance.current.call(callToId, stream);
    localStorage.setItem('activePeerId', callToId);

    call.on('stream', (remote) => {
      setRemoteStream(remote);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
    });

    call.on('close', () => {
      // Stop all media on call close
      stream.getTracks().forEach((track) => track.stop());
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    });

    currentCall.current = call;
  } catch (err) {
    console.error('Error accessing media devices:', err);
  }
};


 
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsSharingScreen(true);
      setLocalStream(screenStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      screenStream.getVideoTracks()[0].onended = () => {
        setIsSharingScreen(false);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((camStream) => {
          setLocalStream(camStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = camStream;
          }
        });
      };
    } catch (err) {
      console.error('Error sharing screen:', err);
    }
  };
   const handleEndCall = () => {
    localStorage.removeItem('activePeerId');
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    if (currentCall) {
      currentCall.close();
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }

    setCurrentCall(null);
    setIsSharingScreen(false);
    setLocalStream(null);
    setScreenStream(null);
    navigate('/');
  };
  const startScreenRecording = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

    const recorder = new MediaRecorder(screenStream, { mimeType: 'video/webm' });
    screenRecorderRef.current = recorder;
    setScreenChunks([]);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setScreenChunks((prev) => [...prev, event.data]);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(screenChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-recording.webm';

      // ✅ Inline CSS for the download link
      a.style.display = 'inline-block';
      a.style.padding = '10px 16px';
      a.style.backgroundColor = '#4CAF50';
      a.style.color = 'white';
      a.style.textDecoration = 'none';
      a.style.borderRadius = '6px';
      a.style.fontSize = '16px';
      a.style.marginTop = '20px';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    recorder.start();
    setScreenRecording(true);

    // Automatically stop recording when screen sharing is manually stopped
    screenStream.getVideoTracks()[0].onended = () => stopScreenRecording();
  } catch (err) {
    console.error('Screen recording failed:', err);
  }
};
let mediaStream = null;

const startMedia = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = mediaStream;
    }
  } catch (err) {
    console.error('Error starting media:', err);
  }
};
const stopMedia = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }

  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }
};
const stopScreenRecording = () => {
  stopMedia();
  if (screenRecorderRef.current) {
    screenRecorderRef.current.stop();
    setScreenRecording(false);
  }
};

  return (
    <div className="video-call-container">
      <h2 className='video-call-title'>Video Call</h2>
      <h4 className="peer-id" style={{ color: 'lightsalmon' }}>
        Peer Id: {peerId || 'Re-Load page'}
      </h4>

      <input
        type="text"
        placeholder="Enter peer ID to call"
        value={callToId}
        className="input-call-id"
        onChange={(e) => setCallToId(e.target.value)}
        style={{
          padding: '8px',
          marginTop: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '250px',
          marginBottom: '20px',
        }}
      />

      <div className="video-container">
        <div className="video-block">
          <h4 className="video-label">Local Video</h4>
          <video  ref={localVideoRef} autoPlay muted playsInline />
        </div>

        <div className="video-block">
          <h4 className="video-label">Remote Video</h4>
          <video className="video-element" ref={remoteVideoRef} autoPlay playsInline />
        </div>
      </div>

      <div className="controls">
        <button className="share-btn" onClick={startScreenShare}>
          {isSharingScreen ? 'Sharing...' : 'Share Screen'}
        </button>
        <button className="call-btn" onClick={callUser}>
          Call
        </button>
        <button
          onClick={startScreenRecording}
          className="button"
          style={{
            backgroundColor: '#2196F3',
            color: '#fff',
            borderRadius: '5px',
            marginLeft: '10px',
          }}
        >
          Start Screen Recording
        </button>
        <button
          onClick={stopScreenRecording}
          className="stop-recording-btn"
          style={{
            backgroundColor: '#f44336',
            color: '#fff',
            borderRadius: '5px',
            marginLeft: '10px',
          }}
        >
          Stop Screen Recording
        </button>
      </div>

      <button
        className="end-call-btn"
        onClick={handleEndCall}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'red',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          zIndex: 10000,
        }}
      >
        End Call
      </button>

      <MinimizedCall />
    </div>
)
};
export default VideoCall;
