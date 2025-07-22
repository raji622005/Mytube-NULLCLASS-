// src/components/VideoCallContext.jsx
import React, { createContext, useContext, useState } from 'react';

const VideoCallContext = createContext();

export const VideoCallProvider = ({ children }) => {
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [localStream, setLocalStream] = useState(null);
    const [currentCall, setCurrentCall] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
  return (
    <VideoCallContext.Provider
      value={{
        isSharingScreen,
        setIsSharingScreen,
        screenStream,
        setScreenStream,
        localStream,
        setLocalStream,
        currentCall,
        setCurrentCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => useContext(VideoCallContext);
