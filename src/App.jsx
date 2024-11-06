import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Popup from "./components/Popup/Popup";
import './App.scss';
import { Context } from './Context/Context';
import ContextProvider from "./Context/ContextGoogle";
import reactToWebComponent from 'react-to-webcomponent';
import MemberSense from './components/MemberSenseComponents/MemberSenseLogin/MemberSense';
import MemberShowcase from './components/MemberSenseComponents/MemberShowcase/MemberShowcase';
import DiscordChannelViewer from './components/MemberSenseComponents/DiscordChannelViewer/DiscordChannelViewer';
import FullScreenLoader from './components/FullScreenLoader';
import { Video, Users, MessageCircle, AlertCircle, Menu, Maximize, Minimize } from 'lucide-react';

const VideoPlayerComponent = reactToWebComponent(VideoPlayer, React, ReactDOM);
customElements.define('video-player-widget', VideoPlayerComponent);

// Replace the existing API_BASE_URL declaration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL // Fallback for local development

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
  const [serverInfo, setServerInfo] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const appRef = useRef(null);

  useEffect(() => {
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
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inputToken })
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      setToken(inputToken);
      setSessionId(data.sessionId);
      setServerInfo({
        serverName: data.serverName,
        memberCount: data.memberCount,
        iconURL: data.iconURL
      });
      return true; // Indicate successful login
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your token and try again.');
      setToken('');
      setSessionId('');
      setServerInfo(null);
      return false; // Indicate failed login
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': sessionId }
      });
      if (!response.ok) throw new Error('Logout failed');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setTimeout(() => {
        setToken('');
        setSessionId('');
        setServerInfo(null);
        setCurrentView('MemberSense');
        setIsLoggingOut(false);
      }, 300); // Match this with your CSS transition duration
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

  const handleFullScreen = () => {
    if (!isFullScreen) {
      if (appRef.current.requestFullscreen) {
        appRef.current.requestFullscreen();
      } else if (appRef.current.webkitRequestFullscreen) {
        appRef.current.webkitRequestFullscreen();
      } else if (appRef.current.msRequestFullscreen) {
        appRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      if(!isFullScreen) setIsMenuOpen(false);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const memberSenseDropdownItems = [
    { id: 'Showcase', icon: Users, label: 'Member Showcase' },
    { id: 'DiscordViewer', icon: MessageCircle, label: 'Discord Viewer' },
  ];

  const renderContent = () => {
    const commonProps = { isFullScreen };
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
            <VideoPlayer 
              autoplay={true} 
              isFullScreen={isFullScreen} 
              handleFullScreen={handleFullScreen} 
            />
          </div>
        );
      case 'MemberSense':
        return <MemberSense  onValidToken={handleLogin} 
        initialToken={token} 
        isLoading={isLoading}
        error={error}
        isLoggingOut={isLoggingOut}
        serverInfo={serverInfo} {...commonProps} />;
      case 'Showcase':
        return <MemberShowcase members={members} isLoading={isLoading} {...commonProps} />;
      case 'DiscordViewer':
        return (
          <DiscordChannelViewer 
            channels={channels} 
            messages={messages} 
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
            isLoading={isLoading}
            {...commonProps}
          />
        );
      default:
        return <div>Select a view</div>;
    }
  };

  const renderNavItems = () => {
    const items = [
      { id: 'FeedPlayer', icon: Video, label: 'Feed Player' },
      { id: 'MemberSense', icon: Users, label: 'MemberSense' },
      ...(sessionId ? memberSenseDropdownItems : [])
    ];

    return items.map((item) => (
      <button 
        key={item.id}
        onClick={() => {
          handleViewChange(item.id);
          if (isFullScreen) setIsMenuOpen(false);
        }}
        className={currentView === item.id ? 'active' : ''}
        title={item.label}
      >
        <item.icon size={24} />
        <span>{item.label}</span>
      </button>
    ));
  };

  return (
    <ContextProvider>
      <div className={`App ${isFullScreen ? 'fullscreen' : ''}`} ref={appRef}>
        <FullScreenLoader isLoading={isLoading} />
        
        {isFullScreen ? (
          <div className="fullscreen-nav">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-btn">
              <Menu size={24} />
            </button>
            {isMenuOpen && (
              <div className="fullscreen-menu">
                {renderNavItems()}
                <button onClick={handleFullScreen} className="fullscreen-toggle">
                  <Minimize size={24} />
                  <span>Exit Fullscreen</span>
                </button>
                {sessionId && (
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <header className="app-header">
            <nav className="app-nav">
              {renderNavItems()}
              <button onClick={handleFullScreen} className="fullscreen-toggle">
                {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
              {sessionId && (
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              )}
            </nav>
          </header>
        )}

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