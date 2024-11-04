/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./SwiperLoop.module.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function SwiperLoop({ images }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const swiperRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      // Check if the parent document has a 'dark' class on the body
      setIsDarkMode(window.parent.document.body.classList.contains('dark'));
    };
    // Initial check
    checkDarkMode();
    // Set up a MutationObserver to watch for changes in the parent document's body class
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(window.parent.document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    const handleHashChange = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const scene = parseInt(hashParams.get('scene'), 10);
      if (!isNaN(scene) && scene > 0 && scene <= images.length && swiperRef.current) {
        swiperRef.current.swiper.slideToLoop(scene - 1);
      } else {
        swiperRef.current.swiper.slideToLoop(0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [images.length]);


  const handleSlideClick = (swiper) => {
    const index = swiper.realIndex + 1;
    setActiveIndex(index);
    window.history.replaceState(null, null, `#feed=nasa&scene=${index}`);
  };

  useEffect(() => {
    const handleIframeInteraction = () => {
      document.querySelectorAll('.swiperSlide iframe').forEach(iframe => {
        iframe.addEventListener('mouseenter', () => {
          iframe.style.pointerEvents = 'auto';
        });
        iframe.addEventListener('mouseleave', () => {
          iframe.style.pointerEvents = 'none';
        });
      });
    };
    handleIframeInteraction();
  }, [images]);

  return (
    <div className={`${styles.swiperLoopContainer}  ${isDarkMode ? styles.dark : ''}`}>
      <Swiper
        grabCursor={true}
        loop={images.length > 3}
        initialSlide = {0}
        centeredSlides={false}
        slidesPerView={8}
        slidesPerGroup={1}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        spaceBetween={10}
        breakpoints={{
          1200: { slidesPerView: 8 },
          1024: { slidesPerView: 7 },
          800: { slidesPerView: 6 },
          650: { slidesPerView: 5 },
          550: { slidesPerView: 4 },
          425: { slidesPerView: 3 },
          320: { slidesPerView: 2 }
        }}
        modules={[Autoplay, Navigation, Pagination]}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        className={styles.swiperLoop}
        ref={swiperRef}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide} onClick={() => handleSlideClick()}>
              <a href="#" onClick={(e) => e.preventDefault()}>
                {image.media_type === 'video' ? (
                  <iframe src={image.url} title={image.title} allowFullScreen />
                ) : (
                  <img src={image.url} alt={image.title || "Slide Image"} />
                )}
                <p>{image.title}</p>
              </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}