import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h2 className="help-title">Help</h2>
      <textarea
        className="help-textarea"
        placeholder="Ask the help required..."
        rows="6"
      />
      <h6 className='soln'>The Solution will be provided to you through your email</h6>
      <button className="help-submit">Submit</button>
    </div>
  );
};

export default Help;




