import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/ContextGoogle'; // Ensure this imports the new context
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';

function VideoPlayer() {
    const { videoList, currentVideoSrc, setCurrentVideoSrc } = useContext(Context);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [isMute, setIsMute] = useState(false);
    const [imageTimer, setImageTimer] = useState(null);
    const [imageElapsed, setImageElapsed] = useState(0); // Elapsed time for image playback
    const videoRef = useRef(null);
    const videoRangeRef = useRef(null);
    const volumeRangeRef = useRef(null);
    let currentVideoIndex = useRef(0);

    const [duration, setDuration] = useState([0, 0]);
    const [currentTime, setCurrentTime] = useState([0, 0]);
    const [durationSec, setDurationSec] = useState(0);
    const [currentSec, setCurrentTimeSec] = useState(0);

    const imageDuration = 4; // Image display duration in seconds

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
        if (!isImageFile(currentVideoSrc)) {
            setIsPlaying(true);
            try {
                await videoRef.current.play();
            } catch (error) {
                console.log("Can't play video");
                setIsPlaying(false);
            }
        }
    };

    const pause = () => {
        if (!isImageFile(currentVideoSrc)) {
            setIsPlaying(false);
            videoRef.current.pause();
        }
    };

    const stop = () => {
        if (isImageFile(currentVideoSrc)) {
            clearInterval(imageTimer);
            setImageElapsed(0);
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        setCurrentTimeSec(0);
        setIsPlaying(false);
    };

    const playImage = () => {
        setIsPlaying(true);
        const timer = setInterval(() => {
            setImageElapsed((prev) => {
                if (prev >= imageDuration) {
                    clearInterval(timer);
                    handleNext();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);
        setImageTimer(timer);
    };

    const pauseImage = () => {
        setIsPlaying(false);
        clearInterval(imageTimer);
    };

    const handleNext = useCallback(() => {
        currentVideoIndex.current++;
        if (currentVideoIndex.current >= videoList.length) {
            currentVideoIndex.current = 0;
        }
        setCurrentVideoSrc(videoList[currentVideoIndex.current]);
        setCurrentTimeSec(0);
        setImageElapsed(0);
        setIsPlaying(false); // Reset isPlaying to false so the next useEffect can handle play
    }, [videoList, setCurrentVideoSrc]);

    const handlePrev = () => {
        currentVideoIndex.current--;
        if (currentVideoIndex.current < 0) {
            currentVideoIndex.current = videoList.length - 1;
        }
        setCurrentTimeSec(0);
        setImageElapsed(0);
        setCurrentVideoSrc(videoList[currentVideoIndex.current]);
        setIsPlaying(false); // Reset isPlaying to false so the next useEffect can handle play
    };

    const handleVideoRange = () => {
        if (isImageFile(currentVideoSrc)) {
            const newTime = videoRangeRef.current.value;
            setImageElapsed(newTime);
            clearInterval(imageTimer);
            const remainingTime = imageDuration - newTime;
            setImageTimer(setTimeout(() => {
                handleNext();
            }, remainingTime * 2000));
        } else {
            videoRef.current.currentTime = videoRangeRef.current.value;
            setCurrentTimeSec(videoRangeRef.current.value);
        }
    };

    const handleFullScreen = () => {
        const elem = videoRef.current;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    };

    const handleVolumeRange = () => {
        let volume = volumeRangeRef.current.value;
        videoRef.current.volume = volume;
        setCurrentVolume(volume);
        if (volume === 0) {
            setIsMute(true);
        } else {
            setIsMute(false);
        }
    };

    const handleMute = () => {
        if (isMute) {
            videoRef.current.volume = currentVolume;
            setIsMute(false);
        } else {
            videoRef.current.volume = 0;
            setIsMute(true);
        }
    };

    useEffect(() => {
        let interval;

        if (isPlaying && !isImageFile(currentVideoSrc)) {
            interval = setInterval(() => {
                const { min, sec } = formatTime(videoRef.current.currentTime);
                setCurrentTimeSec(videoRef.current.currentTime);
                setCurrentTime([min, sec]);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentVideoSrc]);

    useEffect(() => {
        const handleLoadedData = () => {
            setDurationSec(videoRef.current.duration);
            const { min, sec } = formatTime(videoRef.current.duration);
            setDuration([min, sec]);
            play();
        };

        const handleEnded = handleNext;

        if (isImageFile(currentVideoSrc)) {
            playImage();
            return () => clearInterval(imageTimer);
        } else if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', handleLoadedData, false);
            videoRef.current.addEventListener('ended', handleEnded);

            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('loadeddata', handleLoadedData);
                    videoRef.current.removeEventListener('ended', handleEnded);
                }
            };
        }
    }, [currentVideoSrc, handleNext]);

    useEffect(() => {
        if (videoList.length > 0) {
            setCurrentVideoSrc(videoList[0]);
            currentVideoIndex.current = 0;
        }
    }, [videoList, setCurrentVideoSrc]);

    return (
        <div className="VideoPlayerWrapper">
            <div className="VideoPlayer">
                <div className="VideoPlayer__video-container">
                    {isImageFile(currentVideoSrc) ? (
                        <img className="video-image" src={currentVideoSrc} alt="Current media" />
                    ) : (
                        <video ref={videoRef} src={currentVideoSrc} onClick={handlePlayPause} poster='src/assets/videos/intro.jpg'></video>
                    )}
                </div>
                <div className="VideoPlayer__controls">
                    <div className="control-group control-group-btn">
                        <button className="control-button prev" onClick={handlePrev}>
                            <i className="ri-skip-back-fill icon"></i>
                        </button>
                        <button className="control-button play-pause" onClick={handlePlayPause}>
                            <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill icon`}></i>
                        </button>
                        <button className="control-button next" onClick={handleNext}>
                            <i className="ri-skip-forward-fill icon"></i>
                        </button>
                        <button className="control-button stop" onClick={stop}>
                            <i className="ri-stop-fill icon"></i>
                        </button>
                        
                    </div>
                    <div className="control-group control-group-slider">
                        {isImageFile(currentVideoSrc) ? (
                            <>
                                <input
                                    type="range"
                                    className="range-input"
                                    ref={videoRangeRef}
                                    onChange={handleVideoRange}
                                    max={imageDuration}
                                    value={imageElapsed}
                                    min={0}
                                />
                                <span className="time">{imageElapsed} / {imageDuration}</span>
                            </>
                        ) : (
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
        </div>
    );
}

export default VideoPlayer;
