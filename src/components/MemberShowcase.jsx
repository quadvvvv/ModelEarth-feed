import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import './MemberShowcase.scss';

const MemberShowcase = ({ members, isLoading, sessionId }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [membersPerPage, setMembersPerPage] = useState(9);
  const [selectedMember, setSelectedMember] = useState(null);
  const containerRef = useRef(null);
  const intervalDuration = 5000; // 5 seconds per page

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
            return 0;
          }
          return prevProgress + (100 / (intervalDuration / 100));
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [totalPages, intervalDuration, isLoading]);

  useEffect(() => {
    const updateMembersPerPage = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const cardWidth = 200; // Approximate width of a card
        const cardHeight = 250; // Approximate height of a card
        const columns = Math.floor(width / cardWidth);
        const rows = Math.floor(height / cardHeight);
        setMembersPerPage(columns * rows);
      }
    };

    updateMembersPerPage();
    window.addEventListener('resize', updateMembersPerPage);
    return () => window.removeEventListener('resize', updateMembersPerPage);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
    setProgress(0);
  };

  const handlePrevious = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    setProgress(0);
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    setProgress(0);
  }, [totalPages]);

  const openProfile = (member) => {
    setSelectedMember(member);
  };

  const closeProfile = () => {
    setSelectedMember(null);
  };

  const startIndex = currentPage * membersPerPage;
  const displayedMembers = filteredMembers.slice(startIndex, startIndex + membersPerPage);

  return (
    <div className="member-showcase">
      <nav className="app-nav">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </nav>
      <main className="app-content" ref={containerRef}>
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
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="members-grid"
            >
              {displayedMembers.map((member) => (
                <div key={member.id} className="member-card" onClick={() => openProfile(member)}>
                  <img src={member.avatar} alt={member.username} className="member-avatar" />
                  <h3>{member.username}</h3>
                  <span className="badge">{member.role}</span>
                  {member.email && <p>{member.email}</p>}
                  <button className="view-profile-button">View Profile</button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 0 || isLoading}>
          <ChevronLeft size={16} />
        </button>
        <span>Page {currentPage + 1} of {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages - 1 || isLoading}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            className="profile-overlay"
            onClick={closeProfile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="profile-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button className="close-button" onClick={closeProfile}>×</button>
              <img src={selectedMember.avatar} alt={selectedMember.username} className="profile-avatar" />
              <h3>{selectedMember.username}</h3>
              {selectedMember.email && <p>{selectedMember.email}</p>}
              <p>Role: {selectedMember.role || 'N/A'}</p>
              <p className="role-description">Role Description: {selectedMember.roleDescription || 'N/A'}</p>
              <a href={selectedMember.link || 'https://model.earth'} target="_blank" rel="noopener noreferrer" className="profile-link">
                Profile Link
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberShowcase;