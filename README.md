<h1 align='center'>Feed Player - For Images, Video and Text</h1>

<!-- Image and link icon to https://video-player-sahilatahar.netlify.app

[![video-player](https://github.com/sahilatahar/Video-Player/assets/100127570/8315e5d3-9b16-4b37-a50c-141a96f2e72e)](https://video-player-sahilatahar.netlify.app/)
-->

Welcome to our Feed-Player React Project! This project provides a modern and user-friendly interface for viewing a series of images and video pulled from RSS, JSON, CSV and YAML. The UI is built using Vite, ReactJS, HTML, CSS, and JavaScript. The Feed-Player is designed to be fully responsive and packed with a range of features to enhance your viewing experience.

<!-- https://video-player-sahilatahar.netlify.app -->
[Check out the Live Preview](https://model.earth/feed/dist/) of the Feed-Player project on model.earth.

## Feed Samples

[View Feeds](view) - The Feed Player is being designed to convert APIs, JSON and .CSV into video-like presentations.
[Bluesky RSS Feeds](view/#feed=bsky) - Click "Turn on CORS passthrough". &nbsp;[About Bluesky RSS](https://bsky.app/profile/todex.bsky.social/post/3kj2xcufu5q2q).

TO DO: Prevent .js and .css from being renamed whenever building. Even better, save two additional files (called feedplayer.js and feedplayer.css) without the number appended and use those names in the root index.html page.

TO DO: Update the code to display images within the video sequence.

TO DO: To prevent the video height from jumping short briefly: When setCurrentVideoSrc is called to advance the video, insert the current height until the next vidwo loads, then removed the inserted height. (The last video is an example with a different aspect ratio.)

Gary: Implementing the Content/ContextGoogle.jsx page which pulls from this [Google Sheet](https://docs.google.com/spreadsheets/d/1jQTlXWom-pXvyP9zuTcbdluyvpb43hu2h7anxhF5qlQ/edit?usp=sharing).

[JSON for video, image and feed links](src/Data/data.js) - We will also load from CSV files.
[Swiper Element](https://swiperjs.com/element) will be used for film-strip-style navigation.

**Also see:**  
[Swiper Element Setup](https://www.freecodecamp.org/news/how-to-set-up-swiper-element-in-a-react-application/)  
[Film-strip sample](https://www.sliderrevolution.com/templates/wordpress-media-gallery) - We'll avoid showing multiple heros at the same time  



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

The Feed-Player project boasts a brand-new user interface that is both visually appealing and intuitive to use. The controls have been thoughtfully designed to provide easy access to the various functionalities while keeping the user experience smooth and engaging.

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

5. Build the app to the dist folder

   ```
   yarn build
   ```

Avoid `http://localhost:5173/dist` since localsite nav is not available there and we've set the base path for the following instead:

6. Start a webserver at port 8887 and view locally at [localhost:8887/feed/dist/](http://localhost:8887/feed/dist/)  
Your webroot should be the parent of feed.

   ```
   python3 -m venv env
   source env/bin/activate
   python -m http.server 8887
   ```


## Technologies Used

- ReactJS: Building the user interface and managing component-based architecture.
- Vite: Fast and lightweight frontend tooling for development.
- HTML: Structuring the content and layout of the video player.
- CSS and SCSS: Styling the UI components and ensuring responsiveness.
- JavaScript: Adding interactivity and logic to the video player functionality.

Vite is preferable to Create React App (CRA) because Vite does not rebuild the whole app whenever changes are made. It splits the app into two categories: dependencies and source code. Dependencies do not change often during the development process, so they are not rebuilt each time thanks to Vite.

## Contributions

Contributions to the [Feed-Player Github Repo](https://github.com/modelearth/feed/) are welcome! If you have any improvements, bug fixes, or additional features in mind, feel free to fork this repository, make your changes, and submit a pull request.

## Team Projects

Place your name here if your working on an update.

Gary - Pulling image and video links from a Google Sheet

Fanyi - Adding images to player flow.

Add a process for saving related notes in Supabase. Save the id of the RSS feed from BlueSky. Place process within Earthscape.

Copy the 7 feed paths from our new feed/view index.html page into our Google Sheet. Include all of each feed's properties, Path, Title, Description, etc. as columns.

Loren - Update the formatRow() function in localsite/js/locasite.js to show images when the value contains .jpg and all other image extensions. Use ChatGPT to get full list. Put loading="lazy" in the img tag so only the visible images load.

Starting from Gary's Google Sheet pull React, modify the feed view to pull from a csv file and point it at our "requests" repo prompt file. CSV pull using D3 sample in our localhost/js/map.js 

Update to pull multiple Bluesky RSS feed links by passing in a comma separated list.

Allow the text field on the feed/view page to be submitted to refresh the feed pull.

Update the javascript in this Building Transparency page to allow an API token to be pasted in the "Your API Key" field: https://model.earth/io/template/feed

Create a Python process using Github Actions that automatically pulls a new Building Transparency token every 24 hours.

Use Vite to add a Swiper Element into our "feed" repo and provide a filmstrip based on the images in incoming feeds. Place in a "swiper" folder.


## License

This project is licensed under the [MIT License](https://github.com/ModelEarth/feed/blob/main/LICENSE),  
which means you are free to use, modify, and distribute the code as you see fit.

---

We hope you enjoy using the Feed-Player!
If you have any questions or feedback, please reach out by posting a [discussion item](https://github.com/orgs/ModelEarthTeam/discussions).

Happy feed watching! 🎥🍿
