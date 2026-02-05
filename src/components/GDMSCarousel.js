'use client';

import { useState, useEffect } from 'react';

const gdmsFiles = [
  {
    type: 'video',
    src: '/3DWORKS/GDMS/Zytnax_knight_duomodimilano FINAL0000.mp4',
    alt: 'Guardian de mis sueños video'
  },
  {
    type: 'image',
    src: '/3DWORKS/GDMS/zyntax -guardian de mis sueños.png',
    alt: 'Guardian de mis sueños'
  },
  {
    type: 'image',
    src: '/3DWORKS/GDMS/zyntax -guardian de mis sueños WIP blend.png',
    alt: 'Guardian de mis sueños WIP'
  }
];

export default function GDMSCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % gdmsFiles.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? gdmsFiles.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gdmsFiles.length);
    setIsAutoPlaying(false);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '60vh',
      minHeight: '400px',
      marginBottom: '2rem',
      overflow: 'hidden',
      backgroundColor: '#000000'
    }}>
      {/* Carousel Container */}
      <div style={{
        display: 'flex',
        width: `${gdmsFiles.length * 100}%`,
        height: '100%',
        transform: `translateX(-${currentIndex * (100 / gdmsFiles.length)}%)`,
        transition: 'transform 0.5s ease-in-out'
      }}>
        {gdmsFiles.map((file, index) => (
          <div
            key={index}
            style={{
              width: `${100 / gdmsFiles.length}%`,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              boxSizing: 'border-box'
            }}
          >
            {file.type === 'video' ? (
              <video
                src={file.src}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : (
              <img
                src={file.src}
                alt={file.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: '#ffffff',
          fontSize: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s',
          fontFamily: "'Hornet Display', sans-serif"
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          color: '#ffffff',
          fontSize: '2rem',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s',
          fontFamily: "'Hornet Display', sans-serif"
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem'
      }}>
        {gdmsFiles.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: currentIndex === index ? '12px' : '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: currentIndex === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
