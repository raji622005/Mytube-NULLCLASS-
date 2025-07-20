import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import './DropdownMenu.css';


const DropdownContext = createContext();

export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="dropdown-container" ref={ref}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ asChild, children }) => {
  const { setOpen } = useContext(DropdownContext);
  return (
    <div
      onClick={() => setOpen(prev => !prev)}
      className="dropdown-trigger"
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ children }) => {
  const { open } = useContext(DropdownContext);
  return open ? (
    <div className="dropdown-content">
      {children}
    </div>
  ) : null;
};

export const DropdownMenuItem = ({ children, onClick, style }) => {
  if (typeof children === 'object' && !React.isValidElement(children)) {
    console.warn("Invalid child passed to DropdownMenuItem:", children);
  }

  return (
    <div onClick={onClick} className="dropdown-item" style={style}>
      {children}
    </div>
  );
};
