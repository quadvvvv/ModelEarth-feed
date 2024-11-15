const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Base URL for google cloud run deployed backend.

const generateFakeMembers = (num) => {
    const names = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Hannah"];
    return Array.from({ length: num }, (_, i) => ({
        id: i + 1,
        username: `${names[i % names.length]} ${i + 1}`,
        avatar: `https://via.placeholder.com/150?text=${names[i % names.length]}`,
        email: i % 2 === 0 ? `${names[i % names.length].toLowerCase()}${i + 1}@example.com` : null,
        role: 'Member',
    }));
};

const getRandomDate = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
};

const generateFakeChannels = (num) => {
    return Array.from({ length: num }, (_, i) => ({
        id: `channel-${i + 1}`,
        name: `Channel ${i + 1} ${Math.random().toString(36).substring(7)}`,
    }));
};

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
    }).sort((a, b) => b.timestamp - a.timestamp);
};

// Main fetch function that switches between demo and real data
export const fetchData = async (dataType, useDemoData, sessionId) => {
    if (useDemoData) {
        return getDemoData(dataType);
    }
    return fetchRealData(dataType, sessionId);
};

// Fetches fake data based on data type
const getDemoData = (dataType) => {
    switch (dataType) {
        case 'members':
            return generateFakeMembers(100); // Generate 100 fake members
        case 'channels':
            return generateFakeChannels(10); // Generate 5 fake channels
        case 'messages':
            return generateFakeMessages(10, 'channel-1'); // Generate 15 fake messages for a sample channel
        default:
            return [];
    }
};

// Fetches real data from API
const fetchRealData = async (dataType, sessionId) => {
    const urlMap = {
        members: `${API_BASE_URL}/members`,
        channels: `${API_BASE_URL}/channels`,
        messages: `${API_BASE_URL}/messages`,
    };
    const response = await fetch(urlMap[dataType], {
        headers: { Authorization: sessionId },
    });
    if (!response.ok) throw new Error(`Failed to fetch ${dataType}`);
    return response.json();
};
