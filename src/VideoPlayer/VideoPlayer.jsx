import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/ContextGoogle'; // Ensure this imports the new context
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';

function VideoPlayer() {
  const { videoList, currentVideoSrc, setCurrentVideoSrc } = useContext(Context);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [isMute, setIsMute] = useState(false);
  const [imageElapsed, setImageElapsed] = useState(0); // Elapsed time for image playback
  const videoRef = useRef(null);
  const videoRangeRef = useRef(null);
  const volumeRangeRef = useRef(null);
  const currentVideoIndex = useRef(0);
  const imageTimerRef = useRef(null); // Timer ref for image playback

  const [duration, setDuration] = useState([0, 0]);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState(0);
  const [currentSec, setCurrentTimeSec] = useState(0);

  const imageDuration = 4; // Image display duration in seconds

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const isImageFile = (src) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(extension => src.toLowerCase().endsWith(extension));
  };

  const handlePlayPause = () => {
    if (isImageFile(currentVideoSrc)) {
      isPlaying ? pauseImage() : playImage();
    } else {
      isPlaying ? pause() : play();
    }
  };

  const play = async () => {
    if (videoRef.current && !isImageFile(currentVideoSrc)) {
      setIsPlaying(true);
      try {
        await videoRef.current.play();
      } catch (error) {
        console.log("Can't play video:", error);
        setIsPlaying(false);
      }
    }
  };

  const pause = () => {
    if (videoRef.current && !isImageFile(currentVideoSrc)) {
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };

  const playImage = () => {
    setIsPlaying(true);
    imageTimerRef.current = setInterval(() => {
      setImageElapsed(prev => {
        const nextElapsed = prev + 1;
        if (nextElapsed >= imageDuration) {
          clearInterval(imageTimerRef.current);
          setIsPlaying(false);
        }
        return nextElapsed;
      });
    }, 1000);
  };

  const pauseImage = () => {
    clearInterval(imageTimerRef.current);
    setIsPlaying(false);
  };

  const handleMute = () => {
    setIsMute(!isMute);
    if (videoRef.current) {
      videoRef.current.muted = !isMute;
    }
  };

  const handleVolumeRange = (e) => {
    const volume = parseFloat(e.target.value);
    setCurrentVolume(volume);
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) { /* Firefox */
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) { /* Chrome, Safari, and Opera */
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { /* IE/Edge */
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="video-player">
      <video ref={videoRef} src={currentVideoSrc} controls />
      <div className="controls">
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <input type="range" ref={videoRangeRef} max={durationSec} value={currentSec} onChange={(e) => setCurrentTimeSec(parseFloat(e.target.value))} />
        <button onClick={handleMute}>{isMute ? 'Unmute' : 'Mute'}</button>
        <input type="range" ref={volumeRangeRef} max={1} min={0} value={currentVolume} onChange={handleVolumeRange} step={0.1} />
        <button onClick={handleFullScreen}>Full Screen</button>
      </div>
    </div>
  );
}

export default VideoPlayer;