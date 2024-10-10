import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Server } from 'lucide-react';
import './MemberSense.scss';
import Spinner from '../../Spinner/Spinner'

const MemberSense = ({ onValidToken, initialToken, isLoading: parentLoading, isFullScreen }) => {
  const [showToken, setShowToken] = useState(false);
  const [inputToken, setInputToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (initialToken) {
      setIsTransitioning(true);
      setTimeout(() => {
        setServerInfo({ name: "Someone's Discord Server" });
        setIsTransitioning(false);
      }, 300);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setServerInfo(null);
        setInputToken('');
        setValidationMessage(null);
        setIsTransitioning(false);
      }, 300);
    }
  }, [initialToken]);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setValidationMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      const data = { success: true, serverName: "Someone's Discord Server" };

      setIsTransitioning(true);
      setTimeout(() => {
        if (data.success) {
          setValidationMessage({ type: 'success', text: 'Token validated successfully!' });
          setServerInfo({ name: data.serverName });
          onValidToken(inputToken);
        } else {
          setValidationMessage({ type: 'error', text: 'Invalid token. Please try again.' });
        }
        setIsValidating(false);
        setIsTransitioning(false);
      }, 300);
    } catch (error) {
      setValidationMessage({ type: 'error', text: 'An error occurred. Please try again.' });
      setIsValidating(false);
    }
  };

  return (
    <div className={`member-sense-wrapper ${isFullScreen ? 'fullscreen' : ''}`}>
      <div className={`member-sense-container ${isTransitioning ? 'transitioning' : ''}`}>
      <h2 className="member-sense-title">MemberSense</h2>
      {parentLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : !serverInfo ? (
        <form onSubmit={handleTokenSubmit} className="token-form">
          <div className="token-input-wrapper">
            <input
              type={showToken ? "text" : "password"}
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Enter Discord Bot Token"
              className="token-input"
              disabled={isValidating}
            />
            <button
              type="button"
              className="toggle-visibility-btn"
              onClick={() => setShowToken(!showToken)}
              disabled={isValidating}
            >
              {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button 
            type="submit" 
            className={`submit-btn ${isValidating ? 'loading' : ''}`}
            disabled={isValidating}
          >
            {isValidating ? 'Validating...' : 'Submit'}
          </button>
        </form>
      ) : (
        <div className="server-info">
          <Server size={48} className="server-icon" />
          <h3 className="server-name">Welcome to {serverInfo.name}!</h3>
          <p className="server-message">
            You're all set to explore MemberSense features. 
            Use the navigation menu to access Member Showcase and Discord Viewer.
          </p>
        </div>
      )}
      
      {validationMessage && (
        <div className={`validation-message ${validationMessage.type}`}>
          {validationMessage.type === 'success' ? 
            <CheckCircle className="message-icon" size={20} /> : 
            <AlertCircle className="message-icon" size={20} />
          }
          {validationMessage.text}
        </div>
      )}

      <div className="permissions-info">
        <h4>Required Bot Permissions:</h4>
        <ul>
          <li>Read Messages/View Channels</li>
          <li>Send Messages</li>
          <li>Read Message History</li>
          <li>View Server Insights</li>
        </ul>
      </div>

      {isValidating && (
        <div className="overlay">
          <Spinner />
          <p>Validating token...</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default MemberSense;