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

const generateFakeMembers = (num) => {
  const names = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Hannah"];
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    username: `${names[i % names.length]} ${i + 1}`,
    avatar: `https://via.placeholder.com/150?text=${names[i % names.length]}`,
    email: i % 2 === 0 ? `${names[i % names.length].toLowerCase()}${i + 1}@example.com` : null,
    role: 'Member'
  }));
};

function App() {
  const [isPopup, setIsPopup] = useState(false);
  const [currentView, setCurrentView] = useState('FeedPlayer');
  const [members, setMembers] = useState([]);
  const { setVideoList, setCurrentVideoSrc } = useContext(Context);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const appRef = useRef(null);

  useEffect(() => {
    const fakeMembers = generateFakeMembers(100);
    setMembers(fakeMembers);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleViewChange = (view) => {
    setError('');
    setIsTransitioning(true);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
      setTimeout(() => setIsLoading(false), 500);
    }, 300);
  };

  const handleValidToken = (validToken) => {
    setToken(validToken);
    setError('');
  };
  const handleLogout = () => {
    setIsTransitioning(true);
    setIsLoading(true);
    setTimeout(() => {
      setToken('');
      setCurrentView('MemberSense');
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
        return <MemberSense onValidToken={handleValidToken} initialToken={token} {...commonProps} />;
      case 'Showcase':
        return <MemberShowcase token={token} members={members} {...commonProps} />;
      case 'DiscordViewer':
        return <DiscordChannelViewer token={token} {...commonProps} />;
      default:
        return <div>Select a view</div>;
    }
  };

  const renderNavItems = () => {
    const items = [
      { id: 'FeedPlayer', icon: Video, label: 'Feed Player' },
      { id: 'MemberSense', icon: Users, label: 'MemberSense' },
      ...(token ? memberSenseDropdownItems : [])
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
                {token && (
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <header className="app-header">
            <h2>Choose a view</h2>
            <nav className="app-nav">
  {renderNavItems()}
  <button onClick={handleFullScreen} className="fullscreen-toggle">
    {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
  </button>
  {token && (
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