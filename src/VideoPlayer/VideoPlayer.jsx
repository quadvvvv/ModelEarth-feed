import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/ContextGoogle';
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';

function VideoPlayer() {
  const { videoList, currentVideoSrc, setCurrentVideoSrc } = useContext(Context);
function VideoPlayer({ autoplay = false }) {
    const { mediaList, currentMedia, setCurrentMedia } = useContext(Context);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [isMute, setIsMute] = useState(false);
  const [imageElapsed, setImageElapsed] = useState(0); // Elapsed time for image playback
  const videoRef = useRef(null);
  const videoRangeRef = useRef(null);
  const volumeRangeRef = useRef(null);
  const currentVideoIndex = useRef(0);
  const imageTimerRef = useRef(null); // Timer ref for image playback
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [isMute, setIsMute] = useState(true);  // Start muted
    const [imageElapsed, setImageElapsed] = useState(0);
    const videoRef = useRef(null);
    const videoRangeRef = useRef(null);
    const volumeRangeRef = useRef(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const imageTimerRef = useRef(null);

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
    const imageDuration = 4;

  const isImageFile = (src) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(extension => src.toLowerCase().endsWith(extension));
  };
    const isImageFile = (src) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return src && imageExtensions.some(extension => src.toLowerCase().endsWith(extension));
    };

    const isVideoFile = (src) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg'];
        return src && videoExtensions.some(extension => src.toLowerCase().endsWith(extension));
    };

  const handlePlayPause = () => {
    if (isImageFile(currentVideoSrc)) {
      isPlaying ? pauseImage() : playImage();
    } else {
      isPlaying ? pause() : play();
    }
  };
    const handlePlayPause = () => {
        console.log("Play/Pause clicked. Current isPlaying:", isPlaying);
        if (isPlaying) {
            pause();
        } else {
            play();
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
    const play = async () => {
        console.log("Play function called");
        if (currentMedia) {
            if (isImageFile(currentMedia.url)) {
                playImage();
                setIsPlaying(true);
            } else if (isVideoFile(currentMedia.url) && videoRef.current) {
                try {
                    videoRef.current.muted = isMute;  // Ensure video is muted if isMute is true
                    await videoRef.current.play();
                    setIsPlaying(true);
                    console.log("Video started playing:", currentMedia.url);
                } catch (error) {
                    console.error("Can't play video", error);
                    handleNext();
                    return;
                }
            }
        }
    };

  const pause = () => {
    if (videoRef.current && !isImageFile(currentVideoSrc)) {
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };
    const pause = () => {
        console.log("Pause function called");
        if (currentMedia) {
            if (isImageFile(currentMedia.url)) {
                pauseImage();
            } else if (isVideoFile(currentMedia.url) && videoRef.current) {
                videoRef.current.pause();
                console.log("Video paused:", currentMedia.url);
            }
        }
        setIsPlaying(false);
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
    const stop = () => {
        if (currentMedia && isImageFile(currentMedia.url)) {
            clearTimeout(imageTimerRef.current);
            setImageElapsed(0);
        } else if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        setCurrentTimeSec(0);
        setCurrentTime([0, 0]);  // Reset currentTime to [0, 0]
        setIsPlaying(false);
    };

    const playImage = () => {
        clearTimeout(imageTimerRef.current);
        const timer = setTimeout(() => {
            handleNext();
        }, (imageDuration - imageElapsed) * 1000);
        imageTimerRef.current = timer;
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
    const pauseImage = () => {
        clearTimeout(imageTimerRef.current);
    };

    const handleNext = useCallback(() => {
        setCurrentMediaIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % mediaList.length;
            console.log("Moving to next media. New index:", nextIndex);
            return nextIndex;
        });
    }, [mediaList.length]);

    const handlePrev = useCallback(() => {
        setCurrentMediaIndex((prevIndex) => {
            const nextIndex = (prevIndex - 1 + mediaList.length) % mediaList.length;
            console.log("Moving to previous media. New index:", nextIndex);
            return nextIndex;
        });
    }, [mediaList.length]);

    const handleVideoRange = () => {
        if (currentMedia && isVideoFile(currentMedia.url) && videoRef.current) {
            videoRef.current.currentTime = videoRangeRef.current.value;
            setCurrentTimeSec(videoRangeRef.current.value);
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
    const handleFullScreen = () => {
        const elem = videoRef.current;
        if (elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }
    };

    const handleVolumeRange = () => {
        if (volumeRangeRef.current) {
            let volume = volumeRangeRef.current.value;
            if (videoRef.current) {
                videoRef.current.volume = volume;
                videoRef.current.muted = volume === '0';
            }
            setCurrentVolume(volume);
            setIsMute(volume === '0');
        }
    };

    const handleMute = () => {
        setIsMute(!isMute);
        if (videoRef.current) {
            videoRef.current.muted = !isMute;
        }
    };

    useEffect(() => {
        let interval;
        if (isPlaying && currentMedia && isVideoFile(currentMedia.url) && videoRef.current) {
            interval = setInterval(() => {
                const { min, sec } = formatTime(videoRef.current.currentTime);
                setCurrentTimeSec(videoRef.current.currentTime);
                setCurrentTime([min, sec]);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentMedia]);

    useEffect(() => {
        const handleLoadedData = () => {
            if (videoRef.current) {
                setDurationSec(videoRef.current.duration);
                const { min, sec } = formatTime(videoRef.current.duration);
                setDuration([min, sec]);
                console.log("Video loaded:", currentMedia.url);
            }
        };

        const handleEnded = () => {
            console.log("Media ended. Moving to next media.");
            setIsPlaying(false);
            handleNext();
        };

        if (currentMedia) {
            if (isVideoFile(currentMedia.url) && videoRef.current) {
                videoRef.current.addEventListener('loadeddata', handleLoadedData);
                videoRef.current.addEventListener('ended', handleEnded);
                videoRef.current.muted = isMute;  // Ensure video is muted if isMute is true
            }
        }

        return () => {
            clearTimeout(imageTimerRef.current);
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadeddata', handleLoadedData);
                videoRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, [currentMedia, handleNext, isMute]);

    useEffect(() => {
        if (mediaList.length > 0) {
            setCurrentMedia(mediaList[currentMediaIndex]);
            console.log('Current media set:', mediaList[currentMediaIndex], 'Index:', currentMediaIndex);
        }
    }, [currentMediaIndex, mediaList, setCurrentMedia]);

    useEffect(() => {
        if (mediaList.length > 0 && !currentMedia) {
            setCurrentMediaIndex(0);
            setCurrentMedia(mediaList[0]);
            console.log('Initial media set:', mediaList[0], 'Index: 0');
        }
    }, [mediaList, currentMedia, setCurrentMedia]);

    useEffect(() => {
        console.log('Current media changed:', currentMedia, 'Index:', currentMediaIndex);
        setCurrentTimeSec(0);
        setCurrentTime([0, 0]);  // Reset currentTime when media changes
        setImageElapsed(0);
        setIsPlaying(false);  // Reset playing state when media changes
        
        if (currentMedia && autoplay) {
            play();
        }
    }, [currentMedia, currentMediaIndex, autoplay]);

    if (!currentMedia) {
        return <div>Loading...</div>;
    }

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