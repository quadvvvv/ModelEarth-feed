import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './DiscordChannelViewer.scss';

// Render channel name with a character limit and ellipsis
const ChannelName = ({ name, maxLength }) => (
  <span title={name}>{name.length <= maxLength ? name : `${name.substr(0, maxLength - 3)}...`}</span>
);

const DiscordChannelViewer = ({ channels, messages, selectedChannel, onChannelSelect, isLoading, isFullScreen }) => {
  // State to manage the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // State to toggle the visibility of the dropdown for channel selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Refs for handling dropdown and container responsiveness
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Constants for pagination
  const messagesPerPage = 10;

  // Adjust container styles when toggling full screen
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = isFullScreen ? '100vh' : '80vh';
      containerRef.current.style.width = isFullScreen ? '100vw' : '100vh';
      containerRef.current.style.maxWidth = isFullScreen ? 'none' : '800px';
      containerRef.current.style.margin = isFullScreen ? '0' : '20px auto';
      containerRef.current.style.borderRadius = isFullScreen ? '0' : '12px';
    }
  }, [isFullScreen]);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler to select a channel and reset pagination
  const handleChannelSelect = (channelId) => {
    onChannelSelect(channelId);
    setCurrentPage(1);
    setIsDropdownOpen(false);
  };

  // Handlers to navigate between pages
  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => prev + 1);

  // Logic to get the current page's messages for display
  const paginatedMessages = messages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  // Animation settings for the container based on fullscreen state
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
      {/* Navigation Bar for Channel Selection */}
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
      
      {/* Main Content Area for Displaying Messages */}
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
              {/* Display paginated messages */}
              {paginatedMessages.length > 0 ? (
                paginatedMessages.map((message) => (
                  <div key={message.id} className="message">
                    <img src={message.author.avatar} alt={message.author.name} className="avatar" />
                    <div className="message-content">
                      <h4>{message.author.name}</h4>
                      <p>{message.content}</p>
                      <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
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

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1 || isLoading}>
          <ChevronLeft size={16} />
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={handleNext} 
          disabled={currentPage * messagesPerPage >= messages.length || isLoading}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default DiscordChannelViewer;
