import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Server } from 'lucide-react';
import './MemberSense.scss';

const MemberSense = ({ onValidToken, initialToken }) => {
  const [showToken, setShowToken] = useState(false);
  const [inputToken, setInputToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);

  useEffect(() => {
    if (initialToken) {
      setServerInfo({ name: "Cool Discord Server" }); // Replace with actual server info fetch
    }
  }, [initialToken]);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationMessage(null);

    try {
      // Simulating API call to validate token
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/validate-token', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token: inputToken }),
      // });
      // const data = await response.json();
      
      // Simulating successful validation
      const data = { success: true, serverName: "Someone's Discord Server" };

      if (data.success) {
        setValidationMessage({ type: 'success', text: 'Token validated successfully!' });
        setServerInfo({ name: data.serverName });
        onValidToken(inputToken);
      } else {
        setValidationMessage({ type: 'error', text: 'Invalid token. Please try again.' });
      }
    } catch (error) {
      setValidationMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="member-sense-container">
      <h2 className="member-sense-title">MemberSense</h2>
      {!serverInfo ? (
        <form onSubmit={handleTokenSubmit} className="token-form">
          <div className="token-input-wrapper">
            <input
              type={showToken ? "text" : "password"}
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Enter Discord Bot Token"
              className="token-input"
            />
            <button
              type="button"
              className="toggle-visibility-btn"
              onClick={() => setShowToken(!showToken)}
            >
              {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button 
            type="submit" 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Validating...' : 'Submit'}
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
    </div>
  );
};

export default MemberSense;