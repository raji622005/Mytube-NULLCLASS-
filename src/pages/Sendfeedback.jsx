import React from 'react';
import './Sendfeedback.css'; // 

const Sendfeedback = () => {
  return (
    <div className="feedback-container">
      <h1 className="feedback-heading">Send Feedback to YouTube</h1>
      <hr className="divider" />

      <h3 className="feedback-subheading">Describe your feedback <span className="required">(required)</span></h3>
      <textarea
        className="feedback-textarea"
        cols="30"
        rows="10"
        placeholder="Tell us what prompted this feedback..."
      ></textarea>
      <p className="info-text">Please don’t include any sensitive information.</p>
      
      <footer className="feedback-footer">
        <label className="checkbox-label">
          <input type="checkbox" className="feedback-checkbox" />
          We may email you for more information or updates.
        </label>
        <p className="disclaimer">
          Some account and system information may be sent to Google. We’ll use it to fix problems and improve our services,
          subject to our Privacy Policy and Terms of Service. We may email you for more information or updates.
          Go to Legal Help to ask for content changes for legal reasons.
        </p>
        <button className='btn'>submit</button>
      </footer>
    </div>
  );
};

export default Sendfeedback;

