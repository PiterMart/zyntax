'use client';

import { useState, useEffect } from 'react';

const angelicaFiles = [
  { type: 'video', src: '/3DWORKS/angelica/ANGELICA-ZYNTAX.mp4', alt: 'Angelica video' },
  { type: 'image', src: '/3DWORKS/angelica/angelica 3d.png', alt: 'Angelica 3D' },
  { type: 'image', src: '/3DWORKS/angelica/angelica altar night 5 high res 2 .png', alt: 'Angelica altar night' },
  { type: 'image', src: '/3DWORKS/angelica/angelica dia0101.jpg', alt: 'Angelica dia' },
  { type: 'image', src: '/3DWORKS/angelica/angelica dia0338.jpg', alt: 'Angelica dia' },
  { type: 'image', src: '/3DWORKS/angelica/angelica noche0004.jpg', alt: 'Angelica noche' },
  { type: 'image', src: '/3DWORKS/angelica/angelica noche0159.jpg', alt: 'Angelica noche' },
  { type: 'image', src: '/3DWORKS/angelica/angelica noche0319.jpg', alt: 'Angelica noche' },
  { type: 'image', src: '/3DWORKS/angelica/angelica noche0372.jpg', alt: 'Angelica noche' },
  { type: 'image', src: '/3DWORKS/angelica/angelica noche0478.jpg', alt: 'Angelica noche' },
  { type: 'image', src: '/3DWORKS/angelica/shibari demo2 black 4 night 2.png', alt: 'Shibari' },
  { type: 'image', src: '/3DWORKS/angelica/shibari demo2 black 4 night.png', alt: 'Shibari' },
  { type: 'image', src: '/3DWORKS/angelica/shibari demo2 black 4.png', alt: 'Shibari' }
];

export default function AngelicaCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % angelicaFiles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? angelicaFiles.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % angelicaFiles.length);
    setIsAutoPlaying(false);
  };

  const files = angelicaFiles;

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
      <div style={{
        display: 'flex',
        width: `${files.length * 100}%`,
        height: '100%',
        transform: `translateX(-${currentIndex * (100 / files.length)}%)`,
        transition: 'transform 0.5s ease-in-out'
      }}>
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              width: `${100 / files.length}%`,
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
                src={encodeURI(file.src)}
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
                src={encodeURI(file.src)}
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

      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '90%'
      }}>
        {files.map((_, index) => (
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
