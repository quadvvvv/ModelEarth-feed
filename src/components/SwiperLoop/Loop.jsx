/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import SwiperLoop from './SwiperLoop';

export default function Loop() {

    const [images, setImages] = useState([]);

    useEffect(() => {
        // api_key = 7BdaDaLN7EHQyb8Db3NDkE1dPSniiIG2oE0wvt64
        const fetchImages = async () => {
            try {
                const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&hd=True&count=11');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error('Failed to fetch images: ' + error);
            }
        };
        fetchImages();
    }, []);

    return (
        <div>
            <SwiperLoop images={images}/>
        </div>
    )
}