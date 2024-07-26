import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/ContextGoogle';
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';

function VideoPlayer() {
    const { mediaList, currentMedia, setCurrentMedia } = useContext(Context);

    console.log('Media List from Context:', mediaList);
    console.log('Current Media from Context:', currentMedia);

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

    // Ensure each media item has a unique identifier
    useEffect(() => {
        if (mediaList.length > 0 && !mediaList[0].id) {
            const updatedMediaList = mediaList.map((media, index) => ({
                ...media,
                id: `media-${index}`
            }));
            // Assuming you have a way to update the mediaList in the context
            // If not, you might need to modify your context to allow this
            // setMediaList(updatedMediaList);
            console.log('Updated media list with IDs:', updatedMediaList);
        }
    }, [mediaList]);

    const isImageFile = (src) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return src && imageExtensions.some(extension => src.toLowerCase().endsWith(extension));
    };

    const handlePlayPause = () => {
        if (currentMedia && isImageFile(currentMedia.url)) {
            isPlaying ? pauseImage() : playImage();
        } else {
            isPlaying ? pause() : play();
        }
    };

    const play = async () => {
        if (currentMedia && !isImageFile(currentMedia.url) && videoRef.current) {
            setIsPlaying(true);
            try {
                await videoRef.current.play();
            } catch (error) {
                console.log("Can't play video", error);
                setIsPlaying(false);
            }
        }
    };

    const pause = () => {
        if (currentMedia && !isImageFile(currentMedia.url) && videoRef.current) {
            setIsPlaying(false);
            videoRef.current.pause();
        }
    };

    const stop = () => {
        if (currentMedia && isImageFile(currentMedia.url)) {
            clearInterval(imageTimerRef.current);
            setImageElapsed(0);
        } else if (videoRef.current) {
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
        imageTimerRef.current = timer;
    };

    const pauseImage = () => {
        setIsPlaying(false);
        clearInterval(imageTimerRef.current);
    };

    const handleNext = useCallback(() => {
        setCurrentMediaIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % mediaList.length;
            console.log('Next media index:', nextIndex);
            return nextIndex;
        });
    }, [mediaList.length]);

    const handlePrev = useCallback(() => {
        setCurrentMediaIndex((prevIndex) => {
            const nextIndex = (prevIndex - 1 + mediaList.length) % mediaList.length;
            console.log('Previous media index:', nextIndex);
            return nextIndex;
        });
    }, [mediaList.length]);

    const handleVideoRange = () => {
        if (currentMedia && isImageFile(currentMedia.url)) {
            const newTime = videoRangeRef.current.value;
            setImageElapsed(newTime);
            clearInterval(imageTimerRef.current);
            const remainingTime = imageDuration - newTime;
            imageTimerRef.current = setTimeout(() => {
                handleNext();
            }, remainingTime * 1000);
        } else if (videoRef.current) {
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

        if (isPlaying && currentMedia && !isImageFile(currentMedia.url)) {
            interval = setInterval(() => {
                if (videoRef.current) {
                    const { min, sec } = formatTime(videoRef.current.currentTime);
                    setCurrentTimeSec(videoRef.current.currentTime);
                    setCurrentTime([min, sec]);
                }
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
                play();
            }
        };

        const handleEnded = handleNext;

        if (currentMedia) {
            if (isImageFile(currentMedia.url)) {
                playImage();
                return () => clearInterval(imageTimerRef.current);
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
        }
    }, [currentMedia, handleNext]);

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
        setIsPlaying(false);
        
        if (currentMedia) {
            if (isImageFile(currentMedia.url)) {
                playImage();
            } else {
                play();
            }
        }
    }, [currentMedia]);

    if (!currentMedia) {
        return <div>Loading...</div>;
    }

    return (
        <div className="VideoPlayer">
            <div className="VideoPlayer__video-container">
                {isImageFile(currentMedia.url) ? (
                    <img className="video-image" src={currentMedia.url} alt={currentMedia.title || 'Media'} />
                ) : (
                    <video ref={videoRef} src={currentMedia.url} onClick={handlePlayPause} poster='src/assets/videos/intro.jpg'></video>
                )}
                <div className="VideoPlayer__overlay">
                    <div className="VideoPlayer__info">
                        <h2>{currentMedia.title || 'Untitled'}</h2>
                        <p>{currentMedia.text || 'No description available'}</p>
                    </div>
                </div>
                <button className="control-button prev" onClick={handlePrev}>
                    <i className="ri-skip-back-fill icon"></i>
                </button>
                <button className="control-button next" onClick={handleNext}>
                    <i className="ri-skip-forward-fill icon"></i>
                </button>
            </div>
            <div className="VideoPlayer__controls">
                <div className="control-group control-group-btn">
                    <button className="control-button play-pause" onClick={handlePlayPause}>
                        <i className={`ri-${isPlaying ? 'pause' : 'play'}-fill icon`}></i>
                    </button>
                    <button className="control-button stop" onClick={stop}>
                        <i className="ri-stop-fill icon"></i>
                    </button>
                </div>
                <div className="control-group control-group-slider">
                    {isImageFile(currentMedia.url) ? (
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
    );
}

export default VideoPlayer;