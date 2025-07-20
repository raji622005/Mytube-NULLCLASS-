import React, { useEffect, useRef, useState } from 'react';
import { createPeer } from './peer.jsx';
import './VideoCall.css';
const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [peerId, setPeerId] = useState('');
  const [myPeer, setMyPeer] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const peerConnectionRef = useRef(null); // <-- for peerConnection
  const localStreamRef = useRef(null);    // <-- for localStream
  const senderRef = useRef(null);   
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  useEffect(() => {
    const peer = createPeer();
    setMyPeer(peer);

    peer.on('open', (id) => {
      setPeerId(id);
      console.log("My Peer ID:", id);
    });

    peer.on('call', (call) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support video call features.");
        return;
      }

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
          call.answer(stream);
          setCurrentCall(call);

          call.on('stream', (remoteStream) => {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });

          call.on('close', () => {
            console.log("Call ended");
            remoteVideoRef.current.srcObject = null;
          });
        })
        .catch((err) => {
          console.error("Failed to access webcam:", err);
        });
    });
  }, []);

  const callPeer = (idToCall) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support video call features.");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();

        const call = myPeer.call(idToCall, stream);
        setCurrentCall(call);

        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });

        call.on('close', () => {
          console.log("Call ended");
          remoteVideoRef.current.srcObject = null;
        });
      })
      .catch((err) => {
        console.error("Failed to start call:", err);
      });
      window.dispatchEvent(new CustomEvent("videoCallStarted", {
    detail: { timestamp: Date.now() }
}));
  };
const endCall = () => {
  if (currentCall) {
    currentCall.close(); // End the peer connection
    setCurrentCall(null);

    // Stop all local tracks (video + audio)
    const localStream = localVideoRef.current?.srcObject;
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop(); // This stops the camera/mic
      });
      localVideoRef.current.srcObject = null;
    }

    // Stop all remote tracks
    const remoteStream = remoteVideoRef.current?.srcObject;
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => {
        track.stop(); // This helps release remote media too
      });
      remoteVideoRef.current.srcObject = null;
    }

    console.log("✅ Call ended & all media tracks stopped");
  }
};
const shareScreen = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const screenTrack = screenStream.getVideoTracks()[0];

    if (!screenTrack) {
      console.error("No screen video track found.");
      return;
    }

    // Replace video track in PeerConnection sender
    if (currentCall?.peerConnection) {
      const sender = currentCall.peerConnection
        .getSenders()
        .find((s) => s.track && s.track.kind === 'video');

      if (sender) {
        senderRef.current = sender;
        await sender.replaceTrack(screenTrack); // use await to ensure replacement happens
      }
    }

    // Show screen stream locally
    localVideoRef.current.srcObject = screenStream;

    // When user stops screen sharing
    screenTrack.onended = async () => {
      const originalStream = localStreamRef.current;
      const originalVideoTrack = originalStream?.getVideoTracks()[0];

      if (senderRef.current && originalVideoTrack) {
        await senderRef.current.replaceTrack(originalVideoTrack);
        localVideoRef.current.srcObject = originalStream;
      }
    };
  } catch (err) {
    console.error("Error sharing screen:", err);
  }
};

  const startRecording = () => {
    const stream = localVideoRef.current?.srcObject;
    if (!stream) {
      alert("No stream available to record.");
      return;
    }

    recordedChunksRef.current = [];

    const options = { mimeType: 'video/webm; codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, options);

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
      a.download = 'recorded-session.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    console.log("🎥 Recording started");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      console.log("🛑 Recording stopped and saved");
    }
  };
  return (
  <div className="video-call-container">
    <h2 className="video-call-header">Your Peer ID: {peerId}</h2>

    <div className="control-bar">
      <input type="text" placeholder="Enter Peer ID to call" id="peerIdInput" />
      <button onClick={() => callPeer(document.getElementById("peerIdInput").value)}>
        Call
      </button>
      <button onClick={endCall} className="end-call">
        End Call
      </button>
      <button onClick={shareScreen}>Share Screen</button>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>

    <div className="video-preview">
      <video ref={localVideoRef} muted autoPlay playsInline></video>
      <video ref={remoteVideoRef} autoPlay playsInline></video>
    </div>
  </div>
);

};

export default VideoCall;
