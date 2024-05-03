<h1 align='center'>Feed Player - For Images, Video and Text</h1>

[![video-player](https://github.com/sahilatahar/Video-Player/assets/100127570/8315e5d3-9b16-4b37-a50c-141a96f2e72e)](https://video-player-sahilatahar.netlify.app/)

Welcome to our Feed-Player React Project! This project provides a modern and user-friendly interface for viewing a series of images and video pulled from RSS, JSON, CSV and YAML. The UI is built using Vite, ReactJS, HTML, CSS, and JavaScript. The Feed-Player is designed to be fully responsive and packed with a range of features to enhance your viewing experience.

## Feed Samples

View and [add your feeds](view)

TO DO: Update the code to pull from these.

[Video .MP4 Links](src/Data/data.js) - Existing list of videos (will include paths for images, json, csv and yaml)
[Bluesky RSS Feed Reader](https://bsky.app/profile/todex.bsky.social/post/3kj2xcufu5q2q) - Find sample Bluesky RSS link 
[Recycling Locations .CSV](https://docs.google.com/spreadsheets/d/e/2PACX-1vRBRXb005Plt3mmmJunBMk6IejMu-VAJOPdlHWXUpyecTAF-SK4OpfSjPHNMN_KAePShbNsiOo2hZzt/pub?gid=1924677788&single=true&output=csv) - Text-only (for image prompts)  
 
Swiper.js could be used for the film-strip portion as navigation.

**Also see:**  
[Swiper Element](https://swiperjs.com/element) - [Swiper Setup](https://www.freecodecamp.org/news/how-to-set-up-swiper-element-in-a-react-application/)  
[Film-strip below hero area](https://www.sliderrevolution.com/templates/wordpress-media-gallery) - We'll avoid showing multiple heros at the same time  



## Features

&#9658; &nbsp; Play/Pause: Easily start and pause the video playback with a single click.  
&#9632; &nbsp; Stop: Stop the video playback and reset it to the beginning.  
🔊 &nbsp; Volume Control: Adjust the volume level to your preference by increasing or decreasing the volume.  
🔇 &nbsp; Mute: Quickly mute or unmute the video's audio with the mute button.  
&#9970; &nbsp; Full-Screen: Enjoy your videos in full-screen mode for an immersive viewing experience.  
&#9202; &nbsp; Remaining Time: The video player displays the remaining time of the current video.  
&#9654;&#9664; &nbsp;Navigation: Seamlessly navigate to the next or previous video in the playlist.  
&#128250; &nbsp; Play by URL: Paste a valid video URL to play a video directly from the web.

## New UI and Controls

The Feed-Player project boasts a brand-new user interface that is both visually appealing and intuitive to use. The controls have been thoughtfully designed to provide easy access to the various functionalities while keeping the user experience smooth and engaging.

## Live Preview

Check out the live preview of the Feed-Player project on Netlify: [Live Preview](https://video-player-sahilatahar.netlify.app/)

## Getting Started

To run the Feed-Player project locally, follow these steps:

1. Clone this repository to your local machine using:

   ```
   git clone https://github.com/modelearth/feed.git
   ```

2. Navigate to the project directory:

   ```
   cd feed
   ```

3. Install the required dependencies using your preferred package manager. For example, with yarn:

   ```
   yarn
   ```

4. Start the development server:

   ```
   yarn dev
   ```

5. Open your web browser and go to `http://localhost:5173` to access the Feed-Player application.

## Technologies Used

- ReactJS: Building the user interface and managing component-based architecture.
- Vite: Fast and lightweight frontend tooling for development.
- HTML: Structuring the content and layout of the video player.
- CSS and SCSS: Styling the UI components and ensuring responsiveness.
- JavaScript: Adding interactivity and logic to the video player functionality.

Vite is preferable to Create React App (CRA) because Vite does not rebuild the whole app whenever changes are made. It splits the app into two categories: dependencies and source code. Dependencies do not change often during the development process, so they are not rebuilt each time thanks to Vite.

## Contributions

Contributions to the Feed-Player React Project are welcome! If you have any improvements, bug fixes, or additional features in mind, feel free to fork this repository, make your changes, and submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/ModelEarth/feed/blob/main/LICENSE),  
which means you are free to use, modify, and distribute the code as you see fit.

---

We hope you enjoy using the Feed-Player!
If you have any questions or feedback, please reach out by posting a [discussion item](https://github.com/orgs/ModelEarthTeam/discussions).

Happy feed watching! 🎥🍿
