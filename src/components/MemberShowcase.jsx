import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MemberShowcase.scss';

const MemberShowcase = ({ members }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const intervalDuration = 5000; // 5 seconds per page
  const membersPerPage = 9;

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  useEffect(() => {
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
  }, [totalPages, intervalDuration]);

  const handlePrevious = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    setProgress(0);
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    setProgress(0);
  }, [totalPages]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
    setProgress(0);
  };

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
      <input
        type="text"
        className="search-input"
        placeholder="Search members..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="members-grid">
        {displayedMembers.map((member) => (
          <div key={member.id} className="member-card" onClick={() => openProfile(member)}>
            <img src={member.avatar} alt={member.username} className="member-avatar" />
            <h3>{member.username}</h3>
            <span className="badge">{member.role}</span>
            {member.email && <p>{member.email}</p>}
            <button className="view-profile-button">View Profile</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevious} className="prev-button" disabled={currentPage === 0}>
          Previous
        </button>
        <div className="page-info">
          <span>Page {currentPage + 1} of {totalPages}</span>
        </div>
        <button onClick={handleNext} className="next-button" disabled={currentPage === totalPages - 1}>
          Next
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