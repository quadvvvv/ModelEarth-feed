import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/ContextGoogle';
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';
import axios from 'axios'; //Tp fetch the urls of the API
import PropTypes from 'prop-types';

function VideoPlayer({ autoplay = false }) {
    const { mediaList, currentMedia, setCurrentMedia, feedlist } = useContext(Context);

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

    const [isDropdownActive, setIsDropdownActive] = useState(false);  // Dropdown state
    const [index, setIndex] = useState(0);//Setting the current drop down title

    const imageDuration = 4;

    // To fetch the urls and then fetch the image urls from the API

    const [processedMediaList, setProcessedMediaList] = useState([]);

    useEffect(() => {
        processMediaList(mediaList);
    }, [mediaList]);

    const processMediaList = (list) => {
        const processedListPromises = list.map((media) => {
            if (isAPIURL(media)) {
                return fetchMediaFromAPI(media.url).then((mediaItems) => {
                    if (Array.isArray(mediaItems)) {
                        return mediaItems.map(item => ({ ...media, ...item }));
                    }
                    return [{ ...media, ...mediaItems }];
                });
            } else {
                return Promise.resolve([media]);
            }
        });

        Promise.all(processedListPromises).then((results) => {
            // Flatten the array if there are nested arrays
            const flattenedResults = results.flat();
            console.log("Processed Media List ", flattenedResults);
            setProcessedMediaList(flattenedResults);
        });
    };


    const isImageFile = (src) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return src && imageExtensions.some(extension => src.toLowerCase().endsWith(extension));
    };

    // Check if the src is API Url
    const isAPIURL = (src) => {
        const apiPatterns = ['API URL'];
        return apiPatterns.some(pattern => src.text.includes(pattern));
    };

    // Fetch the image/video url from API url

    const fetchMediaFromAPI = async (apiUrl) => {
        try {
            const response = await axios.get(apiUrl);
            
            console.log("Response from API URL ", response);
            return response.data.map(item => ({
                url: item.hdurl || item.url,
                text: item.explanation || 'No description available',
                title:item.title
            }));
        } catch (error) {
            console.error('Error fetching from API:', error);
            return [];
        }
    };

    const isVideoFile = (src) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg'];
        return src && videoExtensions.some(extension => src.toLowerCase().endsWith(extension));
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
    }, [currentMediaIndex, processedMediaList, setCurrentMedia]);

    useEffect(() => {
        if (processedMediaList.length > 0 && !currentMedia) {
            setCurrentMediaIndex(0);

            setCurrentMedia(mediaList[0]);
            console.log('Initial media set:', mediaList[0], 'Index: 0');
        }
    }, [processedMediaList, currentMedia, setCurrentMedia]);

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
        <div className="VideoPlayer">
            <div className="VideoPlayer__video-container">
                {isImageFile(currentMedia.url) ? (
                    <img className="video-image" src={currentMedia.url} alt={currentMedia.title || 'Media'} />
                ) : (
                    <video ref={videoRef} src={currentMedia.url} poster='src/assets/videos/intro.jpg' muted={isMute}></video>
                )}
                <div className="VideoPlayer__overlay">
                    <div className="VideoPlayer__info">
                        <h2>{currentMedia.title || 'Untitled'}</h2>
                        <p>{currentMedia.text || 'No description available'}</p>
                    </div>
                </div>
                <div className='VideoPlayer__dropdown'>
                    <div className='VideoPlayer__select'
                    onClick={() => setIsDropdownActive(!isDropdownActive)}
                    >
                         <span>{feedlist ? feedlist[index].feed : 'Select Media'}</span>
                        <div className='VideoPlayer__caret'></div>
                    </div>
                    <ul className={`VideoPlayer__menu ${isDropdownActive ? 'active' : ''}`}>
                    
                    {feedlist.map((media, index) => (

                        <li
                            key={index}
                            className={currentMediaIndex === index ? 'active' : ''}
                            onClick={(e) => {
                                //console.log("current index is: ",index);
                                setIndex(index);
                                setIsDropdownActive(false);
                            }}
                        >
                            {media.feed || media.url}
                        </li>
                    ))}
                </ul>
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
                    <button className="control-button next" onClick={handleNext}>
                        <i className="ri-skip-forward-fill icon"></i>
                    </button>
                    <button className="control-button stop" onClick={stop}>
                        <i className="ri-stop-fill icon"></i>
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

VideoPlayer.propTypes = {
    autoplay: PropTypes.bool,
};

VideoPlayer.defaultProps = {
    autoplay: false, // Define default props
};

export default VideoPlayer;