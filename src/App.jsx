import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Popup from "./components/Popup/Popup";
import './App.scss';
import { Context } from './Context/Context';
import ContextProvider from "./Context/ContextGoogle";
import reactToWebComponent from 'react-to-webcomponent';
import MemberShowcase from './components/MemberShowcase';

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

  useEffect(() => {
    const fakeMembers = generateFakeMembers(100);
    setMembers(fakeMembers);
  }, []);

  const handleViewChange = (view) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 300);
  };

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
      case 'TBD':
        return <div>TBD Content</div>;
      default:
        return <div>Select a view</div>;
    }
  };

  return (
    <ContextProvider>
      <div className="App">
        <div className="app-header">
          <h2>Please choose from Showcase and Feed Player</h2>
        </div>
        <nav className="app-nav">
          <button 
            onClick={() => handleViewChange('FeedPlayer')}
            className={currentView === 'FeedPlayer' ? 'active' : ''}
          >
            Feed Player
          </button>
          <div className="dropdown">
            <button className={currentView === 'Showcase' || currentView === 'TBD' ? 'active' : ''}>
              MemberSense
            </button>
            <div className="dropdown-content">
              <button 
                onClick={() => handleViewChange('Showcase')}
                className={currentView === 'Showcase' ? 'active' : ''}
              >
                Showcase
              </button>
              <button 
                onClick={() => handleViewChange('TBD')}
                className={currentView === 'TBD' ? 'active' : ''}
              >
                TBD
              </button>
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