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
import { Video, Users, MessageCircle } from 'lucide-react';

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

  useEffect(() => {
    const fakeMembers = generateFakeMembers(100);
    setMembers(fakeMembers);
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleViewChange = (view) => {
    setIsTransitioning(true);
    setIsLoading(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
      setTimeout(() => setIsLoading(false), 500);
    }, 300);
  };

  const navItems = [
    { id: 'FeedPlayer', icon: Video, label: 'Feed Player' }
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
      case 'Showcase':
        return <MemberShowcase members={members} />;
      case 'DiscordViewer':
        return <DiscordChannelViewer />;
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
          {/* Feed Player Button with icon and label */}
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
          
          {/* MemberSense Dropdown with Showcase and DiscordViewer */}
          <div className="dropdown">
            <button 
              className={currentView === 'Showcase' || currentView === 'DiscordViewer' ? 'active' : ''}
              title="MemberSense"
            >
              <Users size={24} />
              <span>MemberSense</span>
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
        </nav>
        <main className={`app-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          {renderContent()}
        </main>
      </div>
    </ContextProvider>
  );
}

export default App;
