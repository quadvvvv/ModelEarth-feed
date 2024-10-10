import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context/ContextGoogle';
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.scss';
import axios from 'axios'; //Tp fetch the urls of the API
import PropTypes from 'prop-types';

function VideoPlayer({ autoplay = false }) {
    const { mediaList, currentMedia, setCurrentMedia } = useContext(Context);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [currentVolume, setCurrentVolume] = useState(1);
    const [isMute, setIsMute] = useState(true);  // Start muted
    const [imageElapsed, setImageElapsed] = useState(0);
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const videoRangeRef = useRef(null);
    const volumeRangeRef = useRef(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const imageTimerRef = useRef(null);

    const [duration, setDuration] = useState([0, 0]);
    const [currentTime, setCurrentTime] = useState([0, 0]);
    const [durationSec, setDurationSec] = useState(0);
    const [currentSec, setCurrentTimeSec] = useState(0);

    const [isDropdownActive, setIsDropdownActive] = useState(false);
    const [index, setIndex] = useState(0);
    // To fetch the urls and then fetch the image urls from the API
    const [selectedMediaList, setSelectedMediaList] = useState([]);
    const [listofMedia, setListofMedia] = useState({});

    const [isFullScreen, setIsFullScreen] = useState(false);

    const imageDuration = 4;

    useEffect(() => {
        processMediaList();
    }, [mediaList]);

    // useEffect(() => {
    //     // This will log the updated selectedMediaList after it changes
    //     console.log("selectedMediaList updated: ", selectedMediaList);
    //     console.log("listofMedia 2.0", listofMedia);
    // }, [selectedMediaList]);
    

    const processMediaList = () => {
        const templistofMedia = {};
    
        // Collect all promises from the map operation
        const processedListPromises = mediaList.map((media) => {
            return fetchMediaFromAPI(media).then((mediaItems) => {
                if (Array.isArray(mediaItems)) {
                    console.log(`mediaItems for ${media.title}`, mediaItems);
                    templistofMedia[media.title] = mediaItems;
                } else {
                    console.log(`mediaItems for ${media.title} (single item)`, mediaItems);
                    templistofMedia[media.title] = [mediaItems];
                }
            }).catch((error) => {
                console.error(`Error processing media with title ${media.title}:`, error);
                templistofMedia[media.title] = []; // Handle error by setting an empty array or any default value
            });
        });
    
        // Wait for all fetch operations to complete
        Promise.all(processedListPromises).then(() => {
            if (mediaList && mediaList.length > 0) {
                // console.log("First media title:", mediaList[0].title);
                // console.log("Final listofMedia:", templistofMedia);
                setListofMedia(templistofMedia);
                setSelectedMediaList(templistofMedia[mediaList[0].title]);
                setCurrentMedia(templistofMedia[mediaList[0].title][0]);
            }
        });
    };
    
    const fetchMediaFromAPI = async (media) => {
        try {
            //console.log("Fetching API for:", media.title, "with feed type:", media.feed.trim());
            const response = await axios.get(media.url);
            //console.log("API Response for", media.title, response);
    
            if (media.feed.trim() === "seeclickfix-311") {
                return response.data.issues.map(item => ({
                    url: item.media.image_full || item.media.representative_image_url,
                    text: item.description || 'No description available',
                    title: item.summary
                }));
            } else if (media.feed.trim() === "film-scouting") {
                return response.data.flatMap(item => {
                    const photos = [];
                    for (let i = 1; i <= 10; i++) {
                        const photoKey = `photo${i}`;
                        if (item[photoKey]) {
                            photos.push({
                                url: item[photoKey],
                                text: item.description || 'No description available',
                                title: item[`photoText${i}`] || 'No title available'
                            });
                        }
                    }
                    return photos;
                });
            } else {
                return response.data.map(item => ({
                    url: item.hdurl || item.url,
                    text: item.explanation || 'No description available',
                    title: item.title
                }));
            }
        } catch (error) {
            console.error('Error fetching from API for', media.title, ':', error);
            return [];
        }
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
        setCurrentTime([0, 0]);
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
        const elem = containerRef.current;
        if (!isFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
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
                videoRef.current.muted = isMute;
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
        if (selectedMediaList.length > 0) {
            setCurrentMedia(selectedMediaList[currentMediaIndex]);
            console.log('Current media set:', selectedMediaList[currentMediaIndex], 'Index:', currentMediaIndex);
        }
    }, [currentMediaIndex, mediaList, setCurrentMedia]);

    useEffect(() => {
        if (selectedMediaList.length > 0 && !currentMedia) {
            setCurrentMediaIndex(0);
            setCurrentMedia(selectedMediaList[0]);
            console.log('Initial media set:', selectedMediaList[0], 'Index: 0');
        }
    }, [selectedMediaList, currentMedia, setCurrentMedia]);

    useEffect(() => {
        console.log('Current media changed:', currentMedia, 'Index:', currentMediaIndex);
        setCurrentTimeSec(0);
        setCurrentTime([0, 0]);
        setImageElapsed(0);
        setIsPlaying(false);
        
        if (currentMedia && autoplay) {
            play();
        }
    }, [currentMedia, currentMediaIndex, autoplay, listofMedia, mediaList]);

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
        document.addEventListener('mozfullscreenchange', handleFullScreenChange);
        document.addEventListener('MSFullscreenChange', handleFullScreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
        };
    }, []);

    if (!currentMedia) {
        return <div>Loading...</div>;
    }

 return (
    <div className={`VideoPlayer ${isFullScreen ? 'fullscreen' : ''}`} ref={containerRef}>
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
                     <span>{mediaList ? mediaList[index].title : 'Select Media'}</span>
                    <div className='VideoPlayer__caret'></div>
                </div>
                <ul className={`VideoPlayer__menu ${isDropdownActive ? 'active' : ''}`}>
                {mediaList.map((media, index) => (
                    <li
                        key={index}
                        className={currentMediaIndex === index ? 'active' : ''}
                        onClick={() => {
                            console.log("current index is: ", index);
                            setIndex(index);
                            setIsDropdownActive(false);
                            setCurrentMediaIndex(index);
                            setSelectedMediaList(listofMedia[mediaList[index].title]);
                        }}
                    >
                        {media.title || media.feed}
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
                <input 
                    type="range" 
                    className='range-input' 
                    ref={volumeRangeRef} 
                    max={1} 
                    min={0} 
                    value={currentVolume} 
                    onChange={handleVolumeRange} 
                    step={0.1} 
                />
                <button className="control-button full-screen" onClick={handleFullScreen}>
                    <i className={`ri-${isFullScreen ? 'fullscreen-exit' : 'fullscreen'}-line`}></i>
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
autoplay: false,
};

export default VideoPlayer;