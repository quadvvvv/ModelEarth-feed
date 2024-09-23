import React, { useEffect, useState, useRef } from 'react';
import './MemberShowcase.scss';

const generateFakeMembers = (num) => {
  const names = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Hannah"];
  const fakeMembers = [];

  for (let i = 1; i <= num; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)];
    const avatarUrl = `https://via.placeholder.com/150?text=${randomName}`;
    fakeMembers.push({
      id: i,
      username: `${randomName} ${i}`,
      avatar: avatarUrl,
      email: i % 2 === 0 ? `${randomName.toLowerCase()}${i}@example.com` : null,
      role: 'Unspecified' // Default role
    });
  }
  return fakeMembers;
};

const MemberShowcase = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const membersPerPage = 9;
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null); // State for selected member

  useEffect(() => {
    const fakeMembers = generateFakeMembers(100);
    setMembers(fakeMembers);
  }, []);

  const currentMembers = members.slice(currentPage * membersPerPage, (currentPage + 1) * membersPerPage);
  const totalPages = Math.ceil(members.length / membersPerPage);

  const changePage = (newPage) => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    const nextPage = (currentPage + 1) % totalPages;
    changePage(nextPage);
  };

  const handlePrevious = () => {
    const prevPage = (currentPage - 1 + totalPages) % totalPages;
    changePage(prevPage);
  };

  const openProfile = (member) => {
    setSelectedMember(member);
    // Stop auto-pagination
    clearInterval(autoPageChange.current);
  };

  const closeProfile = () => {
    setSelectedMember(null);
    // Reset pagination countdown
    autoPageChange.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  const autoPageChange = useRef(null);

  useEffect(() => {
    autoPageChange.current = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(autoPageChange.current);
  }, [totalPages]);

  return (
    <div className="member-showcase">

      <div className="members-grid">
        {currentMembers.map((member) => (
          <div key={member.id} className="member-card">
            <img src={member.avatar} alt={member.username} className="member-avatar" />
            <h3>{member.username} <span className="badge">{member.role}</span></h3>
            {member.email && <p>{member.email}</p>}
            <button onClick={() => openProfile(member)} className="view-profile-button">View Profile</button>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevious} disabled={loading} className="prev-button">
          Previous
        </button>
        <div className="page-info">
          <span>Page {currentPage + 1} of {totalPages}</span>
          {loading && <div className="loading-spinner"></div>}
        </div>
        <button onClick={handleNext} disabled={loading} className="next-button">
          Next
        </button>
      </div>

      {selectedMember && (
        <div className="profile-overlay">
          <div className="profile-card">
            <button className="close-button" onClick={closeProfile}>×</button>
            <img src={selectedMember.avatar} alt={selectedMember.username} className="profile-avatar" />
            <h3>{selectedMember.username}</h3>
            {selectedMember.email && <p>{selectedMember.email}</p>}
            <p>Role: {selectedMember.role}</p>
            <p>Description: {/* Placeholder for description */}This is a placeholder for the user's description.</p>
            <p>Links: {/* Placeholder for links */}<a href="#">Link 1</a>, <a href="#">Link 2</a></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberShowcase;
