<h1 align='center'>Feed Player - For Images, Video&nbsp;and&nbsp;Text</h1>

<!-- Image and link icon to https://video-player-sahilatahar.netlify.app

[![video-player](https://github.com/sahilatahar/Video-Player/assets/100127570/8315e5d3-9b16-4b37-a50c-141a96f2e72e)](https://video-player-sahilatahar.netlify.app/)
-->

Welcome to our Feed-Player React Project! This project provides a modern and user-friendly interface for viewing a series of images and video pulled from RSS, JSON, CSV and YAML. The UI is built using Vite, ReactJS, HTML, CSS, and JavaScript. The Feed-Player is designed to be fully responsive and packed with a range of features to enhance your viewing experience.

<!-- https://video-player-sahilatahar.netlify.app -->
[Check out the Live Preview](https://model.earth/feed/intro.html) of the Feed-Player project on model.earth.

## Feed Samples

[View Feeds](view) - The Feed Player is being designed to convert APIs, JSON and .CSV into video-like presentations.
[Bluesky RSS Feeds](view/#feed=bsky) - Click "Turn on CORS passthrough". &nbsp;[About Bluesky RSS](https://bsky.app/profile/todex.bsky.social/post/3kj2xcufu5q2q).

[JSON for video, image and feed links](src/Data/data.js) - We will also load from this [Google Sheet](https://docs.google.com/spreadsheets/d/1jQTlXWom-pXvyP9zuTcbdluyvpb43hu2h7anxhF5qlQ/edit?usp=sharing)

## Team Projects

Place your name here if your working on an update.

1.) Marco: Update Yarn Build to save feedplayer.js and feedplayer.css in dist/assets.  
1a.) Replace vite.config.js with vite.config-upcoming.js while testing Yarn Build locally.  
1b.) Debug vite-plugin-copy.js to save copies of the index-[code].js and index-[code].css as feedplayer.js and feedplayer.css.  
1c.) Edit the "WIDGET EMBED SAMPLE" in feed/intro.html to use feedplayer.js and feedplayer.css.  

2.) Fanyi: Update the code to display images within the video sequence.

3.) TO DO: To prevent the video height from jumping short briefly: When setCurrentVideoSrc is called to advance the video, insert the current height until the next video loads. Remove the inserted height once the new slide video/image loads into the DOM. (The last video is an example with a different aspect ratio.)

4.) Gary: Pulling image and video links from a Google Sheet by implementing the Content/ContextGoogle.jsx page which pulls from this [Google Sheet](https://docs.google.com/spreadsheets/d/1jQTlXWom-pXvyP9zuTcbdluyvpb43hu2h7anxhF5qlQ/edit?usp=sharing).

5.) Copy the feed paths from our [feed/view index.html page](view) into our Google Sheet. Include all of each feed's properties, Path, Title, Description, etc. as columns.

6.) Use Vite to add [Swiper Element](https://swiperjs.com/element) in our "feed" repo and provide a filmstrip based on the images in incoming feeds. Place in a "swiper" folder. See [Swiper Element Setup](https://www.freecodecamp.org/news/how-to-set-up-swiper-element-in-a-react-application/)  
[Film-strip sample](https://www.sliderrevolution.com/templates/wordpress-media-gallery) - We'll avoid showing multiple heros at the same time  

7.) Load images into the Feed Player from our [requests repo](/requests) .CSV prompt file.

8.) Pull in multiple Bluesky RSS feed links by passing in a comma separated list.

9.) Update javascript in this Building Transparency [template page](/io/template/feed) to allow an API token to be pasted into the "Your API Key" field.

10.) Create a Python process using Github Actions that automatically pulls a new Building Transparency token every 24 hours. See our existing Python for sample of refreshing the API using their username (email) and password.

11.) Supabase integration - Add a process for saving related edits in Supabase. Save the id of the RSS feed from BlueSky. Integrate with https://holocron.so.




## Features

&#9658; &nbsp; Play/Pause: Easily start and pause the playback with a single click.  
&#9632; &nbsp; Stop: Stop the feed playback and reset it to the beginning.  
🔊 &nbsp; Volume Control: Adjust the volume level to your preference by increasing or decreasing the volume.  
🔇 &nbsp; Mute: Quickly mute or unmute the feed's audio with the mute button.  
&#9970; &nbsp; Full-Screen: Enjoy your videos in full-screen mode for an immersive viewing experience.  
&#9202; &nbsp; Remaining Time: The feed player will display the remaining time of the current feed.  
&#9654; &nbsp;Navigation: Seamlessly navigate to the next or previous item in the playlist.  
&#128250; &nbsp; Play by URL: Paste a feed URL to play any valid feed format directly from the web. (Coming soon)

## New UI and Controls

The Feed-Player interface that is both visually appealing and intuitive to use. The controls have been thoughtfully designed by to provide easy access to the various functionalities while keeping the user experience smooth and engaging.

## Getting Started

Fork our two repos (localsite and feed) and clone into your webroot

      git clone https://github.com/[your account]/localsite.git
      git clone https://github.com/[your account]/feed.git


### Folders in your website root

```ini
website
├─ localsite
└─ feed
   ├─ README.md
   ├─ dist
   ├─ src
   ├─ view
   ├─ package.json
   ├─ vite.config.js
   └─ .gitignore
```


### Start a web server in your webroot

   ```
   python3 -m venv env
   source env/bin/activate
   python -m http.server 8887
   ```
On Windows, the second line is:

      env\Scripts\activate

### The primary pages will be visible here:

[Feed Player - localhost:8887/feed](http://localhost:8887/feed/)
[Feed View - localhost:8887/feed/view](http://localhost:8887/feed/view/)



## Edit and build the "feed" project locally

### 1. Navigate into the feed directory:

   ```
   cd feed
   ```

### 2. Install the required dependencies:

   ```
   yarn
   ```

### 3. Skip this step. Port 5173 does not currently work because the files are looking for a base path containing "feed".<!--Start the development server:-->

   ```
   yarn dev
   ```

Since we include /feed in the base path, the feed player does not currently work at: [localhost:5173/dist](http://localhost:5173/dist/)  
Code could be updated to add model.earth/js/localsite.js include file in the built output, as used [here](https://model.earth/localsite/start/).

      <link type="text/css" rel="stylesheet" href="https://model.earth/localsite/css/base.css" id="/localsite/css/base.css" />
      <script type="text/javascript" src="https://model.earth/localsite/js/localsite.js?showheader=true"></script>

### 4. Build the app to the dist folder

   ```
   yarn build
   ```

View at: [http://localhost:8887/feed](http://localhost:8887/feed/) and [http://localhost:8887/feed/dist](http://localhost:8887/feed/dist)

Deploy to GitHub and turn on GitHub Pages for localsite and feed.

Your updates can now be reviewed at:

https://[your account].github.io/feed
https://[your account].github.io/feed/dist


## Technologies Used

- ReactJS: Building the user interface and managing component-based architecture.
- Vite: Fast and lightweight frontend tooling for development.
- HTML: Structuring the content and layout of the video player.
- CSS and SCSS: Styling the UI components and ensuring responsiveness.
- JavaScript: Adding interactivity and logic to the video player functionality.

Vite is preferable to Create React App (CRA) because Vite does not rebuild the whole app whenever changes are made. It splits the app into two categories: dependencies and source code. Dependencies do not change often during the development process, so they are not rebuilt each time thanks to Vite.

## Contributions

Contributions to the [Feed-Player Github Repo](https://github.com/modelearth/feed/) are welcome! If you have any improvements, bug fixes, or additional features in mind, feel free to fork this repository, make your changes, and submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/ModelEarth/feed/blob/main/LICENSE),  
which means you are free to use, modify, and distribute the code as you see fit.

---

We hope you enjoy using the Feed-Player!


If you have any questions, requests or feedback, please post an issue in our 
[Feed Player repo](http://github.com/modelearth/feed) or the parent [Video Player repo](https://github.com/sahilatahar/Video-Player).


Happy feed viewing! 🎥🍿
