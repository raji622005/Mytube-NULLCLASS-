import React from 'react'

import './avatar.css';
export const Avatar = ({ children, className }) => {
  return <div className={`avatar ${className || ''}`}>{children}</div>;
};

export const AvatarImage = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt || "avatar"}
      className="avatar-image"
    />
  );
};



export const AvatarFallback = ({ children, className }) => {
  return <div className={`avatar-fallback ${className || ''}`}>{children}</div>;
};
export const Avatar1 = ({ children, src }) => {
  return (
    <div className="avatar">
      {src ? <img src={src} alt="avatar" /> : children}
    </div>
  );
};
 export const AvatarFallback1 = ({ children }) => {
  return <div className="avatar-fallback">{children}</div>;
};