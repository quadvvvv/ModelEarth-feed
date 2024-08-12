import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from "./VideoPlayer/VideoPlayer";
import Popup from "./components/Popup/Popup";
import './App.scss';
import { useContext, useState } from "react";
import { Context } from './Context/Context'; // Ensure Context is coming from ContextGoogle
import ContextProvider from "./Context/ContextGoogle";
import reactToWebComponent from 'react-to-webcomponent';
// Define custom elements
const VideoPlayerComponent = reactToWebComponent(VideoPlayer, React, ReactDOM);
customElements.define('video-player-widget', VideoPlayerComponent);

function App() {
  const [isPopup, setIsPopup] = useState(false);
  const { setVideoList, setCurrentVideoSrc } = useContext(Context); // Ensure Context is coming from ContextGoogle

  return (
    <ContextProvider>
      <div className="App">
        {!isPopup && <button className="popup-btn" onClick={() => setIsPopup(true)}><i className="ri-links-line"></i></button>}
        {isPopup && <Popup {...{ setVideoList, setCurrentVideoSrc, setIsPopup }} />}
        <VideoPlayer autoplay={true}/>
      </div>
    </ContextProvider>
  );
}

export default App;