import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/ContextGoogle';
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';

function VideoPlayer() {
    const { mediaList, currentMedia, setCurrentMedia } = useContext(Context);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [isMute, setIsMute] = useState(false);
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

    const imageDuration = 4;

    const isImageFile = (src) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return src && imageExtensions.some(extension => src.toLowerCase().endsWith(extension));
    };

    const isVideoFile = (src) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg'];
        return src && videoExtensions.some(extension => src.toLowerCase().endsWith(extension));
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
        setIsPlaying(!isPlaying);
    };

    const play = async () => {
        if (currentMedia) {
            if (isImageFile(currentMedia.url)) {
                playImage();
            } else if (isVideoFile(currentMedia.url) && videoRef.current) {
                try {
                    await videoRef.current.play();
                    console.log("Video started playing:", currentMedia.url);
                } catch (error) {
                    console.log("Can't play video", error);
                    handleNext();
                }
            }
        }
    };

    const pause = () => {
        if (currentMedia) {
            if (isImageFile(currentMedia.url)) {
                pauseImage();
            } else if (isVideoFile(currentMedia.url) && videoRef.current) {
                videoRef.current.pause();
            }
        }
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
            }
            setCurrentVolume(volume);
            setIsMute(volume === '0');
        }
    };

    const handleMute = () => {
        if (videoRef.current) {
            if (isMute) {
                videoRef.current.volume = currentVolume;
                setIsMute(false);
            } else {
                videoRef.current.volume = 0;
                setIsMute(true);
            }
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
            }
        };

        const handleEnded = () => {
            console.log("Video ended. Moving to next media.");
            handleNext();
        };

        if (currentMedia) {
            if (isImageFile(currentMedia.url)) {
                if (isPlaying) {
                    playImage();
                }
            } else if (isVideoFile(currentMedia.url) && videoRef.current) {
                videoRef.current.addEventListener('loadeddata', handleLoadedData);
                videoRef.current.addEventListener('ended', handleEnded);
                if (isPlaying) {
                    play();
                }
            }
        }

        return () => {
            clearTimeout(imageTimerRef.current);
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadeddata', handleLoadedData);
                videoRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, [currentMedia, isPlaying, handleNext]);

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
        setImageElapsed(0);
        
        if (currentMedia) {
            if (isPlaying) {
                play();
            } else {
                pause();
            }
        }
    }, [currentMedia, currentMediaIndex, isPlaying]);

    if (!currentMedia) {
        return <div>Loading...</div>;
    }

    return (
        <div className="VideoPlayer">
            <div className="VideoPlayer__video-container">
                {isImageFile(currentMedia.url) ? (
                    <img className="video-image" src={currentMedia.url} alt={currentMedia.title || 'Media'} />
                ) : (
                    <video ref={videoRef} src={currentMedia.url} poster='src/assets/videos/intro.jpg'></video>
                )}
                <div className="VideoPlayer__overlay">
                    <div className="VideoPlayer__info">
                        <h2>{currentMedia.title || 'Untitled'}</h2>
                        <p>{currentMedia.text || 'No description available'}</p>
                    </div>
                </div>
            </div>
            <div className="VideoPlayer__controls">
                <div className="control-group control-group-btn">
                    <button className="control-button prev" onClick={handlePrev}>
                        <i className="ri-skip-back-fill icon"></i>
                    </button>
                    <button className="control-button play-pause" onClick={handlePlayPause}>
                        <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill icon`}></i>
                    </button>
                    <button className="control-button stop" onClick={stop}>
                        <i className="ri-stop-fill icon"></i>
                    </button>
                    <button className="control-button next" onClick={handleNext}>
                        <i className="ri-skip-forward-fill icon"></i>
                    </button>
                </div>
                <div className="control-group control-group-slider">
                    {isVideoFile(currentMedia.url) && (
                        <>
                            <input
                                type="range"
                                className="range-input"
                                ref={videoRangeRef}
                                onChange={handleVideoRange}
                                max={durationSec}
                                value={currentSec}
                                min={0}
                            />
                            <span className="time">{currentTime[0]}:{currentTime[1]} / {duration[0]}:{duration[1]}</span>
                        </>
                    )}
                </div>
                <div className="control-group control-group-volume">
                    <button className="control-button volume" onClick={handleMute}>
                        <i className={`ri-volume-${isMute ? 'mute' : 'up'}-fill`}></i>
                    </button>
                    <input type="range" className='range-input' ref={volumeRangeRef} max={1} min={0} value={currentVolume} onChange={handleVolumeRange} step={0.1} />
                    <button className="control-button full-screen" onClick={handleFullScreen}>
                        <i className="ri-fullscreen-line"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;