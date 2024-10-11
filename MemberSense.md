# MemberSense Discord Integration

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

MemberSense Discord Integration is a modern, responsive web application that combines a video player with Discord-inspired member management and channel viewing capabilities. This frontend-focused project showcases smooth transitions, fullscreen support, and interactive user interfaces.

## Features

- 🎥 Video Player with popup support
- 👥 Member Showcase with dynamic grid layout
- 💬 Discord-style Channel Viewer
- 🔐 Token-based authentication
- 🖥️ Fullscreen mode with adaptive layout
- 🌓 Smooth transitions between views
- 🔍 Member search functionality
- 📱 Responsive design for various screen sizes

## Installation

To get started with the MemberSense Discord Integration frontend, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/membersense-discord-integration.git
   ```

2. Navigate to the project directory:
   ```
   cd membersense-discord-integration
   ```

3. Install dependencies:
   ```
   yarn install
   ```

## Usage

To run the development server:

```
yarn dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

To build the project for production:

```
yarn build
```

To preview the production build:

```
yarn preview
```

## Project Structure

The main components of the project are:

- `App.jsx`: The main application component that handles routing and view management.
- `VideoPlayer`: A custom video player component with fullscreen support.
- `MemberSense`: Handles authentication and provides access to member-related features.
- `MemberShowcase`: Displays member information in a grid layout with search functionality.
- `DiscordChannelViewer`: Simulates a Discord-like channel viewing experience.
