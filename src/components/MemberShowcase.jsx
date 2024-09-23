import React, { useEffect, useState } from 'react';
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
    });
  }
  return fakeMembers;
};

const MemberShowcase = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const membersPerPage = 9;
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const fakeMembers = generateFakeMembers(100);
    setMembers(fakeMembers);
  }, []);

  const currentMembers = members.slice(currentPage * membersPerPage, (currentPage + 1) * membersPerPage);
  const totalPages = Math.ceil(members.length / membersPerPage);

  const changePage = (newPage) => {
    setLoading(true); // Start loading
    setTimeout(() => {
      setCurrentPage(newPage);
      setLoading(false); // End loading after the delay
    }, 1000); // Simulating a delay for loading (1 second)
  };

  const handleNext = () => {
    const nextPage = (currentPage + 1) % totalPages; // Loop back to the first page
    changePage(nextPage);
  };

  const handlePrevious = () => {
    const prevPage = (currentPage - 1 + totalPages) % totalPages; // Loop back to the last page
    changePage(prevPage);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNext();
    }, 5000); // Change page every 5 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [totalPages, currentPage]);

  return (
    <div className="member-showcase">
      <header>
        <h2>Member Showcase</h2>
      </header>
      <div className="members-grid">
        {currentMembers.map((member) => (
          <div key={member.id} className="member-card">
            <img src={member.avatar} alt={member.username} className="member-avatar" />
            <h3>{member.username}</h3>
            {member.email && <p>{member.email}</p>}
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
        <button onClick={handleNext} disabled={loading } className="next-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default MemberShowcase;
