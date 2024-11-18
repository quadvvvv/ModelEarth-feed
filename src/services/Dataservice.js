const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Base URL for google cloud run deployed backend.

// Utility functions for Demo Data
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

// DemoData hanlders:
export const fetchFakeMembers = () => generateFakeMembers(100);

export const fetchFakeChannels = () => generateFakeChannels(10);

export const fetchFakeMessages = (selectedChannel) =>
  generateFakeMessages(100, selectedChannel);

// MemberSense handlers:
export const fetchMembers = async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/members`, {
      headers: { Authorization: sessionId },
    });
    if (!response.ok) throw new Error("Failed to fetch members");
    return response.json();
  };
  
  export const fetchChannels = async (sessionId) => {
    const response = await fetch(`${API_BASE_URL}/channels`, {
      headers: { Authorization: sessionId },
    });
    if (!response.ok) throw new Error("Failed to fetch channels");
    return response.json();
  };
  
  export const fetchMessages = async (sessionId, channelId) => {
    const response = await fetch(`${API_BASE_URL}/messages?channelId=${channelId}`, {
      headers: { Authorization: sessionId },
    });
    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json();
  };
