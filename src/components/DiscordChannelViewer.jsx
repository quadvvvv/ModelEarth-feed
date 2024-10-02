import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './DiscordChannelViewer.scss';

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength - 3) + '...';
};

const ChannelName = ({ name, maxLength }) => (
  <span title={name}>{truncateText(name, maxLength)}</span>
);

const DiscordChannelViewer = ({ channels, messages, selectedChannel, onChannelSelect, isLoading, sessionId }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef(null);
  const messagesPerPage = 50;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset to first page when changing channels
    setCurrentPage(1);
  }, [selectedChannel]);

  const handleChannelSelect = (channelId) => {
    onChannelSelect(channelId);
    setIsDropdownOpen(false);
  };

  const handlePrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => {
    if (messages.length === messagesPerPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const startIndex = (currentPage - 1) * messagesPerPage;
  const endIndex = startIndex + messagesPerPage;
  const displayedMessages = messages.slice(startIndex, endIndex);

  return (
    <div className="discord-channel-viewer">
      <nav className="app-nav">
        <div className="dropdown-container">
          <div className="dropdown" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="dropdown-toggle"
              title={channels.find(c => c.id === selectedChannel)?.name || 'Select Channel'}
              disabled={isLoading}
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
              {displayedMessages.length > 0 ? (
                displayedMessages.map((message) => (
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
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1 || isLoading}>
          <ChevronLeft size={16} />
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNext} disabled={displayedMessages.length < messagesPerPage || isLoading}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default DiscordChannelViewer;