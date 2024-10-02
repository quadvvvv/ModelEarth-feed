import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Server, Users, Image } from 'lucide-react';
import './MemberSense.scss';
import Spinner from './Spinner';

const MemberSense = ({ onValidToken, initialToken, isLoading: parentLoading, error, isLoggingOut, serverInfo: initialServerInfo }) => {
  const [showToken, setShowToken] = useState(false);
  const [inputToken, setInputToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);
  const [serverInfo, setServerInfo] = useState(initialServerInfo);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (initialToken) {
      setInputToken(initialToken);
      setServerInfo(initialServerInfo);
    } else {
      setServerInfo(null);
      setInputToken('');
      setValidationMessage(null);
    }
  }, [initialToken, initialServerInfo]);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setIsValidating(true);
    setValidationMessage(null);

    const minValidationTime = 2000;
    const validationStartTime = Date.now();

    try {
      const success = await onValidToken(inputToken);

      const elapsedTime = Date.now() - validationStartTime;
      const remainingTime = Math.max(0, minValidationTime - elapsedTime);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (success) {
        setIsTransitioning(true);
        setTimeout(() => {
          setValidationMessage({ type: 'success', text: 'Token validated successfully!' });
          setIsTransitioning(false);
        }, 300);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setValidationMessage({ type: 'error', text: 'Authentication failed. Please try again.' });
      setServerInfo(null);
    } finally {
      setIsValidating(false);
    }
  };

  const renderTokenForm = () => (
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
  );

  const renderServerInfo = () => (
    <div className="server-info">
      {serverInfo.iconURL ? (
        <img src={serverInfo.iconURL} alt="Server Icon" className="server-icon" />
      ) : (
        <Server size={48} className="server-icon" />
      )}
      <h3 className="server-name">{serverInfo.serverName}</h3>
      <div className="server-details">
        <p className="member-count">
          <Users size={20} />
          {serverInfo.memberCount} members
        </p>
      </div>
      <p className="server-message">
        You're all set to explore MemberSense features. 
        Use the navigation menu to access Member Showcase and Discord Viewer.
      </p>
    </div>
  );

  return (
    <div className={`member-sense-container ${isTransitioning || isLoggingOut ? 'transitioning' : ''}`}>
      <h2 className="member-sense-title">MemberSense</h2>
      {parentLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <>
          {serverInfo ? renderServerInfo() : renderTokenForm()}
          
          {(validationMessage || error) && (
            <div className={`validation-message ${validationMessage?.type || 'error'}`}>
              {validationMessage?.type === 'success' ? 
                <CheckCircle className="message-icon" size={20} /> : 
                <AlertCircle className="message-icon" size={20} />
              }
              {validationMessage?.text || error}
            </div>
          )}

          {!serverInfo && (
            <div className="permissions-info">
              <h4>Required Bot Permissions:</h4>
              <ul>
                <li>Read Messages/View Channels</li>
                <li>Send Messages</li>
                <li>Read Message History</li>
                <li>View Server Insights</li>
              </ul>
            </div>
          )}
        </>
      )}

      {(isValidating || isLoggingOut) && (
        <div className="overlay">
          <Spinner />
          <p>{isLoggingOut ? 'Logging out...' : 'Validating token...'}</p>
        </div>
      )}
    </div>
  );
};

export default MemberSense;