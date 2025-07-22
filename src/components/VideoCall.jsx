import React, { useRef, useState, useEffect } from 'react';
import Peer from 'peerjs';
import './VideoCall.css';

const VideoCall = () => {
  const [peer, setPeer] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [peerId, setPeerId] = useState('');
  const recordedChunksRef = useRef([]);
  const senderRef = useRef(null);
  useEffect(() => {
    const newPeer = new Peer();
    setPeer(newPeer);
      
    newPeer.on('open', (id) => {
      setPeerId(id); // ✅ Save peer ID for display
      console.log('My peer ID is: ' + id);
    });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        newPeer.on('call', (call) => {
          call.answer(stream);
          setCurrentCall(call);

          call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });
      });

    return () => newPeer.destroy();
  }, []);

  const callPeer = (remoteId) => {
    if (!peer || !localStreamRef.current) return;

    const call = peer.call(remoteId, localStreamRef.current);
    setCurrentCall(call);

    call.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      senderRef.current = currentCall.peerConnection.getSenders().find(s => s.track.kind === 'video');

      if (senderRef.current && screenTrack) {
        await senderRef.current.replaceTrack(screenTrack);
        localVideoRef.current.srcObject = screenStream;
        setIsSharingScreen(true);

        screenTrack.onended = async () => {
          try {
            const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = cameraStream;
            const cameraTrack = cameraStream.getVideoTracks()[0];
            const audioTrack = cameraStream.getAudioTracks()[0];

            if (senderRef.current && cameraTrack) {
              await senderRef.current.replaceTrack(cameraTrack);
            }

            const audioSender = currentCall.peerConnection.getSenders().find(s => s.track.kind === 'audio');
            if (audioSender && audioTrack) {
              await audioSender.replaceTrack(audioTrack);
            }

            localVideoRef.current.srcObject = cameraStream;
            setIsSharingScreen(false);
          } catch (err) {
            console.error('Error resuming camera:', err);
          }
        };
      }
    } catch (err) {
      console.error('Screen sharing error:', err);
    }
  };

  const startRecording = () => {
    recordedChunksRef.current = [];
    const localTracks = localVideoRef.current?.srcObject?.getTracks() || [];
    const remoteTracks = remoteVideoRef.current?.srcObject?.getTracks() || [];
    const stream = new MediaStream([...localTracks, ...remoteTracks]);

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recorded-call.webm';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
  };

  const endCall = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (currentCall) {
      currentCall.close();
      setCurrentCall(null);
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="video-call-container">
      <h2>Video Call</h2>
       <p>Your Peer ID: <strong>{peerId || 'Loading...'}</strong></p>
      <div className="video-grid">
        <video ref={localVideoRef} autoPlay muted playsInline className="video" />
        <video ref={remoteVideoRef} autoPlay playsInline className="video" />
      </div>
      <div className="controls">
        <input type="text" placeholder="Enter Peer ID" id="peerIdInput" />
        <button onClick={() => callPeer(document.getElementById('peerIdInput').value)}>Call</button>
        <button onClick={startScreenShare} disabled={isSharingScreen}>Share Screen</button>
        <button onClick={startRecording}>Record</button>
        <button onClick={endCall}>End Call</button>
      </div>
    </div>
  );
};

export default VideoCall;
