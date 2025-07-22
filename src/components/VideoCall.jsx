// src/components/VideoCall.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useVideoCall } from './VideoCallContext';
import MinimizedCall from './MinimizedCall';
import { Navigate, useNavigate } from 'react-router-dom';
import Peer from './peer.jsx';
const VideoCall = () => {
  const [callToId, setCallToId] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerId, setPeerId] = useState('');
  const { isSharingScreen,localStream, setLocalStream, screenStream, setScreenStream, currentCall, setCurrentCall, setIsSharingScreen } = useVideoCall();
  const navigate=useNavigate();
  const [remoteStream, setRemoteStream] = useState(null);
  const peerInstance = useRef(null);
   const [screenRecording, setScreenRecording] = useState(false);
  const screenRecorderRef = useRef(null);
  const [screenChunks, setScreenChunks] = useState([]);
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
      call.answer(localStream);
      call.on('stream', (remote) => {
        setRemoteStream(remote);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
      });
      currentCall.current = call;
    });
  }, []);
  const callUser = () => {
    if (!callToId || !localStream || !peerInstance.current) return;
    const call = peerInstance.current.call(callToId, localStream);
    call.on('stream', (remote) => {
      setRemoteStream(remote);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote;
    });
    currentCall.current = call;
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
const stopScreenRecording = () => {
  if (screenRecorderRef.current) {
    screenRecorderRef.current.stop();
    setScreenRecording(false);
  }
};

  return (
    <div>
      <h2>Video Call</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div>
          <input
    type="text"
    placeholder="Enter peer ID to call"
    value={callToId}
    onChange={(e) => setCallToId(e.target.value)}
    style={{
      padding: '8px',
      marginTop: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '250px',
      marginRight: '10px',
    }}
  />
          <h4>Local Video</h4>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '300px', borderRadius: '10px' }} />
        </div>
        <div>
          <h4>Remote Video</h4>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', borderRadius: '10px' }} />
        </div>
      </div>
      <button onClick={startScreenShare} style={{ marginTop: '20px' }}>
        {isSharingScreen ? 'Sharing...' : 'Share Screen'}
      </button>
      <button onClick={callUser}>Call</button>
      <button onClick={startScreenRecording} style={{ margin: '10px', padding: '10px', backgroundColor: '#2196F3', color: '#fff', borderRadius: '5px', border: 'none' }}>Start Screen Recording</button>
      <button onClick={stopScreenRecording} style={{ margin: '10px', padding: '10px', backgroundColor: '#f44336', color: '#fff', borderRadius: '5px', border: 'none' }}>Stop Screen Recording</button>
      <button
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
  );
};

export default VideoCall;
