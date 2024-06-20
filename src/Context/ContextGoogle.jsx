import { createContext, useState, useEffect} from "react";
import PropTypes from 'prop-types';
import axios from 'axios';
import Papa from 'papaparse';  

const Context = createContext();

export default function ContextProvider({ children }) {

    //const [videoList, setVideoList] = useState(videosURLs);
    //const [currentVideoSrc, setCurrentVideoSrc] = useState(videoList[0]);
    const [videoList, setVideoList] = useState([]);
    const [currentVideoSrc, setCurrentVideoSrc] = useState('');


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                // Pulls from this Google Sheet: https://docs.google.com/spreadsheets/d/1jQTlXWom-pXvyP9zuTcbdluyvpb43hu2h7anxhF5qlQ/edit?usp=sharing
                // Add comments in the sheet above to request additions.
                const response = await axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vSxfv7lxikjrmro3EJYGE_134vm5HdDszZKt4uKswHhsNJ_-afSaG9RoA4oeNV656r4mTuG3wTu38pM/pub?output=csv');
                Papa.parse(response.data, {
                    header: true,  // Assuming your CSV has headers
                    complete: (results) => {
                        const videos = results.data.map(row => row.URL);  // Adjust based on your CSV header for the URL column
                        setVideoList(videos);
                        if (videos.length > 0) {
                            setCurrentVideoSrc(videos[0]); // Set the first video as the current video source
                        }
                    }
                });
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, []);
   
    return (
        <Context.Provider value={{ videoList, setVideoList, currentVideoSrc, setCurrentVideoSrc }}>
            {children}
        </Context.Provider>
    );
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { Context }
