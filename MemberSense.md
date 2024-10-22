# MemberSense Discord Integration

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

MemberSense Discord Integration is a modern, responsive web application that combines a video player with Discord-inspired member management and channel viewing capabilities. This frontend-focused project showcases smooth transitions, fullscreen support, and interactive user interfaces.

Also see [Backend Setup](https://github.com/ModelEarth/members)

## Features

- 🎥 Video Player with popup support
- 👥 Member Showcase with dynamic grid layout
- 💬 Discord-style Channel Viewer
- 🔐 Token-based authentication
- 🖥️ Fullscreen mode with adaptive layout
- 🌓 Smooth transitions between views
- 🔍 Member search functionality
- 📱 Responsive design for various screen sizes

## Prerequisites for Users

To use the MemberSense Discord Integration, you need to set up your own Discord bot. Follow the steps below to create and configure your bot.

### Discord Bot Setup Guide

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click on "New Application" and give your application a name.
3. Navigate to the "Bot" tab in the left sidebar and click "Add Bot".
4. Under the bot's username, click "Copy" to copy your bot token. Keep this token secret and secure.
5. Scroll down to the "Privileged Gateway Intents" section and enable "Server Members Intent".
6. To invite the bot to your server, go to the "OAuth2" tab in the left sidebar.
7. In the "Scopes" section, select "bot".
8. In the "Bot Permissions" section, select the following permissions:
   - View Channels
   - Send Messages
   - Read Message History
   - View Server Insights
9. Copy the generated URL at the bottom of the page.
10. Open a new browser tab, paste the URL, and select the server where you want to add the bot.

Note: The OAuth2 URL generation is primarily for inviting the bot to a server. If you're adding the bot to your own server or have other means of adding it, you may skip steps 6-10.

For more detailed instructions, you can refer to the [official Discord.js guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html).

### Required Bot Permissions

Ensure your bot has the following permissions:

- Read Messages/View Channels
- Send Messages
- Read Message History
- View Server Insights

Additional base permissions might be needed depending on your specific use case.

## Installation for Developers

To get started with the MemberSense Discord Integration frontend, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/ModelEarth/feed.git
   ```

2. Navigate to the project directory:
   ```
   cd feed
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
