'use client';
import { useRef, useEffect, useState } from 'react';
import styles from '../styles/Video.module.css';
import Image from 'next/image';
import Footer from './Footer';

export default function Video() {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const mainVideo = videoRef.current;
    
    if (mainVideo) {
      mainVideo.playbackRate = 1.0;
      const handleCanPlay = () => {
        setVideoLoaded(true);
      };
      const handleError = () => {
        console.error('Error loading video, displaying fallback image.');
        setVideoLoaded(false);
      };
      
      mainVideo.addEventListener('canplaythrough', handleCanPlay);
      mainVideo.addEventListener('error', handleError);
      
      return () => {
        mainVideo.removeEventListener('canplaythrough', handleCanPlay);
        mainVideo.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <div className={styles.videoWrapper}>
      {/* Main video background - first 100vh */}
      <div className={styles.videoContainer}>
        {!videoLoaded && (
          <Image
            src="/Zytnax_knight_duomodimilano3.png"
            alt="Zyntax Knight"
            fill
            className={styles.fallbackImage}
            priority
          />
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`${styles.backgroundVideo} ${videoLoaded ? styles.videoLoaded : ''}`}
        >
          <source src="/Zytnax_knight_duomodimilano FINAL0000.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Footer section - black footer */}
      <div className={styles.videoFooter}>
        <Footer />
      </div>
    </div>
  );
}


