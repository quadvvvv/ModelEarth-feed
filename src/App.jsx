import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Popup from "./components/Popup/Popup";
import './App.scss';
import { Context } from './Context/Context';
import ContextProvider from "./Context/ContextGoogle";
import reactToWebComponent from 'react-to-webcomponent';
import MemberShowcase from './components/MemberShowcase';
import DiscordChannelViewer from './components/DiscordChannelViewer';
import FullScreenLoader from './components/FullScreenLoader';
import { Video, Users, MessageCircle, AlertCircle } from 'lucide-react';
import MemberSense from './components/MembersSense';

const VideoPlayerComponent = reactToWebComponent(VideoPlayer, React, ReactDOM);
customElements.define('video-player-widget', VideoPlayerComponent);

const API_BASE_URL = 'http://localhost:3000/api'; // Update this for production

function App() {
  const [isPopup, setIsPopup] = useState(false);
  const [currentView, setCurrentView] = useState('FeedPlayer');
  const [members, setMembers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const { setVideoList, setCurrentVideoSrc } = useContext(Context);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  
  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchMembers();
      fetchChannels();
    } else {
      setMembers([]);
      setChannels([]);
      setMessages([]);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId && selectedChannel) {
      fetchMessages(selectedChannel);
    }
  }, [sessionId, selectedChannel]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        headers: { 'Authorization': sessionId }
      });
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to fetch members. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/channels`, {
        headers: { 'Authorization': sessionId }
      });
      if (!response.ok) throw new Error('Failed to fetch channels');
      const data = await response.json();
      setChannels(data);
      if (data.length > 0 && !selectedChannel) {
        setSelectedChannel(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
      setError('Failed to fetch channels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (channelId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/messages?channelId=${channelId}`, {
        headers: { 'Authorization': sessionId }
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (inputToken) => {
    setToken(inputToken);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inputToken })
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      setSessionId(data.sessionId);
      setError('');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your token and try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': sessionId }
      });
      if (!response.ok) throw new Error('Logout failed');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken('');
      setSessionId('');
      setCurrentView('MemberSense');
    }
  };

  const handleViewChange = (view) => {
    if ((view === 'Showcase' || view === 'DiscordViewer') && !sessionId) {
      setError('Please log in with a Discord Bot Token in MemberSense first.');
      return;
    }
    setError('');
    setIsTransitioning(true);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
      setTimeout(() => setIsLoading(false), 500);
    }, 300);
  };

  const navItems = [
    { id: 'FeedPlayer', icon: Video, label: 'Feed Player' },
    { id: 'MemberSense', icon: Users, label: 'MemberSense' }
  ];

  const memberSenseDropdownItems = [
    { id: 'Showcase', icon: Users, label: 'Member Showcase' },
    { id: 'DiscordViewer', icon: MessageCircle, label: 'Discord Viewer' },
  ];

  const renderContent = () => {
    switch(currentView) {
      case 'FeedPlayer':
        return (
          <div className="feed-player-container">
            {!isPopup && (
              <button className="popup-btn" onClick={() => setIsPopup(true)}>
                <i className="ri-links-line"></i>
              </button>
            )}
            {isPopup && <Popup {...{ setVideoList, setCurrentVideoSrc, setIsPopup }} />}
            <VideoPlayer autoplay={true} />
          </div>
        );
      case 'MemberSense':
        return <MemberSense onValidToken={handleLogin} initialToken={token} isLoading={isLoading} />;
      case 'Showcase':
        return <MemberShowcase members={members} isLoading={isLoading} />;
      case 'DiscordViewer':
        return (
          <DiscordChannelViewer 
            channels={channels} 
            messages={messages} 
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
            isLoading={isLoading}
          />
        );
      default:
        return <div>Select a view</div>;
    }
  };


  return (
    <ContextProvider>
      <div className="App">
        <FullScreenLoader isLoading={isLoading} />
        <div className="app-header">
          <h2>Choose a view</h2>
        </div>
        <nav className="app-nav">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleViewChange(item.id)}
              className={currentView === item.id ? 'active' : ''}
              title={item.label}
            >
              <item.icon size={24} />
              <span>{item.label}</span>
            </button>
          ))}
          
          {token && (
            <>
              <div className="dropdown">
                <button 
                  className={currentView === 'Showcase' || currentView === 'DiscordViewer' ? 'active' : ''}
                  title="MemberSense Features"
                >
                  <Users size={24} />
                  <span>MemberSense Features</span>
                </button>
                <div className="dropdown-content">
                  {memberSenseDropdownItems.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => handleViewChange(item.id)}
                      className={currentView === item.id ? 'active' : ''}
                      title={item.label}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </nav>
        {error && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            <p>{error}</p>
          </div>
        )}
        <main className={`app-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          {renderContent()}
        </main>
      </div>
    </ContextProvider>
  );
}

export default App;