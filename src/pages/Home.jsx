import React, { useState } from 'react';
import './Home.css';

import VideoMaking from './VideoMaking';
const Home = () => {
  const navlist = [
    "All", "Programming", "Movie", "Science", "Animation",
    "Gaming", "Comedy", "Music"
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  
  const handleNavClick = (category) => {
    setActiveCategory(category);
  };
  

  return (
    <div className="container_page">
      <div className="navigation_home">
        {navlist.map((category, index) => (
          <button
            key={index}
            className={`btn_nav ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleNavClick(category)}
          >
            {category}
          </button>
        ))}
        </div>
        <div>
          <h2 className='headin'>{activeCategory} Videos</h2>
          <VideoMaking />
        </div>  
      
    </div>
  );
};

export default Home;



