import React, { useContext, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Popup from "./components/Popup/Popup";
import "./App.scss";
import { Context } from "./Context/Context";
import ContextProvider from "./Context/ContextGoogle";
import reactToWebComponent from "react-to-webcomponent";
import MemberSense from "./components/MemberSenseComponents/MemberSenseLogin/MemberSense";
import MemberShowcase from "./components/MemberSenseComponents/MemberShowcase/MemberShowcase";
import DiscordChannelViewer from "./components/MemberSenseComponents/DiscordChannelViewer/DiscordChannelViewer";
import {
  Video,
  Users,
  MessageCircle,
  AlertCircle,
  Menu,
  Maximize,
  Minimize,
} from "lucide-react";

const VideoPlayerComponent = reactToWebComponent(VideoPlayer, React, ReactDOM);
customElements.define("video-player-widget", VideoPlayerComponent);

// Utility functions for fake data
const generateFakeMembers = (num) => {
  const names = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eva",
    "Frank",
    "Grace",
    "Hannah",
  ];
  return Array.from({ length: num }, (_, i) => ({
    id: i + 1,
    username: `${names[i % names.length]} ${i + 1}`,
    avatar: `https://via.placeholder.com/150?text=${names[i % names.length]}`,
    email:
      i % 2 === 0
        ? `${names[i % names.length].toLowerCase()}${i + 1}@example.com`
        : null,
    role: "Member",
  }));
};

// A random date within the last 30 days
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
  );
};

// Function to generate fake channels
const generateFakeChannels = (num) => {
  return Array.from({ length: num }, (_, i) => ({
    id: `channel-${i + 1}`,
    name: `Channel ${i + 1} ${Math.random().toString(36).substring(7)}`,
  }));
};
// Function to generate fake messages
const generateFakeMessages = (num, channelId) => {
  const users = [
    {
      id: "user1",
      name: "Alice",
      avatar: "https://via.placeholder.com/40?text=A",
    },
    {
      id: "user2",
      name: "Bob",
      avatar: "https://via.placeholder.com/40?text=B",
    },
    {
      id: "user3",
      name: "Charlie",
      avatar: "https://via.placeholder.com/40?text=C",
    },
    {
      id: "user4",
      name: "David",
      avatar: "https://via.placeholder.com/40?text=D",
    },
  ];

  return Array.from({ length: num }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    return {
      id: `msg-${channelId}-${i + 1}`,
      content: `This is a fake message ${
        i + 1
      } in channel ${channelId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      author: user,
      timestamp: getRandomDate(),
    };
  }).sort((a, b) => b.timestamp - a.timestamp); // Sort messages by timestamp, newest first
};

function App() {
  const [currentView, setCurrentView] = useState("FeedPlayer");

  // Feed player states
  const [isPopup, setIsPopup] = useState(false);
  const { setVideoList, setCurrentVideoSrc } = useContext(Context);

  // MemberSense states
  const [members, setMembers] = useState([]);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [serverInfo, setServerInfo] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const appRef = useRef(null);

  const fetchFakeMembers = () => {
    const fakeMembers = generateFakeMembers(100);
    setMembers(fakeMembers);
    setTimeout(() => setIsLoading(false), 300); // 300ms forced loading for smooth transition
  };

  const fetchFakeMessages = (selectedChannel) => {
    setIsLoading(true);
    const data = generateFakeMessages(100, selectedChannel);
    setMessages(data);
    setIsLoading(false);
  };

  const fetchFakeChannels = () => {
    setIsLoading(true);
    const data = generateFakeChannels(10);
    setChannels(data);
    if (data.length > 0 && !selectedChannel) {
      setSelectedChannel(data[0].id);
    }
    setIsLoading(false);
  };

  // Need test for real data
  useEffect(() => {
    if (sessionId) {
      if (useMockData) {
        fetchFakeMembers();
        fetchFakeChannels();
      } else {
        // fetchMembers();
        // fetchChannels();
      }
    } else {
      setMembers([]);
      setChannels([]);
      setMessages([]);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId && selectedChannel) {
      if(useMockData){
        console.log("LEEEETSS GOOO GENERAGE SPAM MESSAGES");
        fetchFakeMessages(selectedChannel);
      }else{
        // fetchMessages(selectedChannel);
      }
    }
  }, [sessionId, selectedChannel]);

  // // MemberSense handlers:

  // const fetchMembers = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/members`, {
  //       headers: { 'Authorization': sessionId }
  //     });
  //     if (!response.ok) throw new Error('Failed to fetch members');
  //     const data = await response.json();
  //     setMembers(data);
  //   } catch (error) {
  //     console.error('Error fetching members:', error);
  //     setError('Failed to fetch members. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchChannels = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/channels`, {
  //       headers: { 'Authorization': sessionId }
  //     });
  //     if (!response.ok) throw new Error('Failed to fetch channels');
  //     const data = await response.json();
  //     setChannels(data);
  //     if (data.length > 0 && !selectedChannel) {
  //       setSelectedChannel(data[0].id);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching channels:', error);
  //     setError('Failed to fetch channels. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const fetchMessages = async (channelId) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/messages?channelId=${channelId}`, {
  //       headers: { 'Authorization': sessionId }
  //     });
  //     if (!response.ok) throw new Error('Failed to fetch messages');
  //     const data = await response.json();
  //     setMessages(data);
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //     setError('Failed to fetch messages. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleLogin = async (inputToken) => {
    setIsLoading(true);
    setError("");
    if (useMockData) {
      setIsLoading(true);
      setToken("MockTokenPlaceHolder");
      setError("");
      setSessionId("12345-abcdef-67890");
      setIsLoggedIn(true);
      setServerInfo({
        serverName: "Mocking Discord Server",
        memberCount: 1500,
        iconURL: "https://via.placeholder.com/48", // A placeholder image URL
      });
      setIsLoading(false);
      return true;
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: inputToken }),
        });
        if (!response.ok) throw new Error("Login failed");
        const data = await response.json();
        setToken(inputToken);
        setSessionId(data.sessionId);
        setServerInfo({
          serverName: data.serverName,
          memberCount: data.memberCount,
          iconURL: data.iconURL,
        });
        return true; // Indicate successful login
      } catch (error) {
        console.error("Login error:", error);
        setError("Login failed. Please check your token and try again.");
        setToken("");
        setSessionId("");
        setServerInfo(null);
        return false; // Indicate failed login
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    if(useMockData){
      setIsLoggingOut(true);
      setIsTransitioning(true);
      setIsLoading(true);
      setTimeout(() => {
        setToken("");
        setSessionId("");
        setServerInfo(null);
        setCurrentView("MemberSense");
        setIsLoggedIn(false);
        setIsLoggingOut(false);
        setIsLoading(false);
        setIsTransitioning(false);
      }, 300);
    }else{
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
        }, 300);
      }
    }   
  };

  const handleViewChange = (view) => {
    setError("");
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
      if (!isFullScreen) setIsMenuOpen(false);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const memberSenseDropdownItems = [
    { id: "Showcase", icon: Users, label: "Member Showcase" },
    { id: "DiscordViewer", icon: MessageCircle, label: "Discord Viewer" },
  ];

  const renderContent = () => {
    const commonProps = { isFullScreen };
    switch (currentView) {
      case "FeedPlayer":
        return (
          <div className="feed-player-container">
            {!isPopup && (
              <button className="popup-btn" onClick={() => setIsPopup(true)}>
                <i className="ri-links-line"></i>
              </button>
            )}
            {isPopup && (
              <Popup {...{ setVideoList, setCurrentVideoSrc, setIsPopup }} />
            )}
            <VideoPlayer
              autoplay={true}
              isFullScreen={isFullScreen}
              handleFullScreen={handleFullScreen}
            />
          </div>
        );
      case "MemberSense":
        return (
          <MemberSense
            onValidToken={handleLogin}
            initialToken={token}
            isLoading={isLoading}
            error={error}
            isLoggedIn={isLoggedIn}
            isLoggingOut={isLoggingOut}
            serverInfo={serverInfo}
            isFullScreen={isFullScreen}
            useMockData={useMockData}
            onToggleMockData={() => setUseMockData(!useMockData)}
            {...commonProps}
          />
        );
      case "Showcase":
        return (
          <MemberShowcase
            token={token}
            members={members}
            isLoading={isLoading}
            {...commonProps}
          />
        );
      case "DiscordViewer":
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
      { id: "FeedPlayer", icon: Video, label: "Feed Player" },
      { id: "MemberSense", icon: Users, label: "MemberSense" },
      ...(token ? memberSenseDropdownItems : []),
    ];

    return items.map((item) => (
      <button
        key={item.id}
        onClick={() => {
          handleViewChange(item.id);
          if (isFullScreen) setIsMenuOpen(false);
        }}
        className={currentView === item.id ? "active" : ""}
        title={item.label}
      >
        <item.icon size={24} />
        <span>{item.label}</span>
      </button>
    ));
  };

  return (
    <ContextProvider>
      <div className={`App ${isFullScreen ? "fullscreen" : ""}`} ref={appRef}>
        {isFullScreen ? (
          <div className="fullscreen-nav">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-btn"
            >
              <Menu size={24} />
            </button>
            {isMenuOpen && (
              <div className="fullscreen-menu">
                {renderNavItems()}
                <button
                  onClick={handleFullScreen}
                  className="fullscreen-toggle"
                >
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

        <main
          className={`app-content ${isTransitioning ? "fade-out" : "fade-in"}`}
        >
          {renderContent()}
        </main>
      </div>
    </ContextProvider>
  );
}

export default App;
