import React from "react";

const VideoCard1 = ({ video }) => {
  return (
    <div className="video-card">
      <video src={video.src} width="200" controls />
      <p>{video.title}</p>
    </div>
  );
};

export default VideoCard1;
