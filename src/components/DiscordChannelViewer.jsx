import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './DiscordChannelViewer.scss';

// Utility function to generate a random date within the last 30 days
const getRandomDate = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
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
    { id: 'user1', name: 'Alice', avatar: 'https://via.placeholder.com/40?text=A' },
    { id: 'user2', name: 'Bob', avatar: 'https://via.placeholder.com/40?text=B' },
    { id: 'user3', name: 'Charlie', avatar: 'https://via.placeholder.com/40?text=C' },
    { id: 'user4', name: 'David', avatar: 'https://via.placeholder.com/40?text=D' },
  ];

  return Array.from({ length: num }, (_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    return {
      id: `msg-${channelId}-${i + 1}`,
      content: `This is a fake message ${i + 1} in channel ${channelId}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      author: user,
      timestamp: getRandomDate(),
    };
  }).sort((a, b) => b.timestamp - a.timestamp); // Sort messages by timestamp, newest first
};

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

const ChannelName = ({ name, maxLength }) => (
  <span title={name}>{truncateText(name, maxLength)}</span>
);

const DiscordChannelViewer = ({ isFullScreen }) => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const messagesPerPage = 50;

  const fetchChannels = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const fakeChannels = generateFakeChannels(100);
    setChannels(fakeChannels);
    if (fakeChannels.length > 0) setSelectedChannel(fakeChannels[0].id);
    setIsLoading(false);
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedChannel) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const fakeMessages = generateFakeMessages(messagesPerPage, selectedChannel);
    setMessages(fakeMessages);
    setIsLoading(false);
  }, [selectedChannel]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, selectedChannel, currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(channelId);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => prev + 1);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = isFullScreen ? '100vh' : '80vh';
      containerRef.current.style.width = isFullScreen ? '100vw' : '100vh';
      containerRef.current.style.maxWidth = isFullScreen ? 'none' : '800px';
      containerRef.current.style.margin = isFullScreen ? '0' : '20px auto';
      containerRef.current.style.borderRadius = isFullScreen ? '0' : '12px';
    }
  }, [isFullScreen]);

  const fullScreenVariants = {
    normal: {
      scale: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    fullScreen: {
      scale: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <motion.div 
      className={`discord-channel-viewer ${isFullScreen ? 'fullscreen' : ''}`}
      ref={containerRef}
      variants={fullScreenVariants}
      animate={isFullScreen ? 'fullScreen' : 'normal'}
    >
      <nav className="app-nav">
        <div className="dropdown-container">
          <div className="dropdown" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="dropdown-toggle"
              title={channels.find(c => c.id === selectedChannel)?.name || 'Select Channel'}
            >
              <MessageCircle size={20} />
              <ChannelName 
                name={channels.find(c => c.id === selectedChannel)?.name || 'Select Channel'} 
                maxLength={20}
              />
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                {channels.map((channel) => (
                  <button 
                    key={channel.id}
                    onClick={() => handleChannelSelect(channel.id)}
                    className={selectedChannel === channel.id ? 'active' : ''}
                    title={channel.name}
                  >
                    <MessageCircle size={16} />
                    <ChannelName name={channel.name} maxLength={25} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="app-content">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-spinner"
            >
              <div className="spinner"></div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="message-container"
            >
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div key={message.id} className="message">
                    <img src={message.author.avatar} alt={message.author.name} className="avatar" />
                    <div className="message-content">
                      <h4>{message.author.name}</h4>
                      <p>{message.content}</p>
                      <span className="timestamp">{message.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages to display.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1 || isLoading}>
          <ChevronLeft size={16} />
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNext} disabled={messages.length < messagesPerPage || isLoading}>
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default DiscordChannelViewer;