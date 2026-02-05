'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ImageGallery.module.css';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp', '.svg'];

const isVideo = (filename) => {
  const lower = filename.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const isImage = (filename) => {
  const lower = filename.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
};

const ImageGallery = ({ isOpen, onClose, folderPath }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [playingVideos, setPlayingVideos] = useState({});
  const [lightboxItem, setLightboxItem] = useState(null); // { src, filename } or null
  const videoRefs = useRef({});
  const didDragRef = useRef(false);

  useEffect(() => {
    if (!isOpen || folderPath == null || folderPath === '') {
      setMediaItems([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/3dworks/folder-contents?path=${encodeURIComponent(folderPath)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load folder contents');
        return res.json();
      })
      .then(({ basePath, files }) => {
        if (cancelled) return;
        const mediaFiles = files.filter(
          (f) => isVideo(f) || isImage(f)
        );
        const mediaList = mediaFiles.map((filename, index) => {
          const fullPath = basePath + filename;
          return {
            id: `${folderPath}-${index}-${filename}`,
            filename,
            src: encodeURI(fullPath),
            isVideo: isVideo(filename),
            x: Math.random() * Math.max(0, window.innerWidth - 400),
            y: Math.random() * Math.max(0, window.innerHeight - 400),
          };
        });
        setMediaItems(mediaList);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load folder');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, folderPath]);

  const handleClose = () => {
    setLightboxItem(null);
    setMediaItems([]);
    onClose();
  };

  const handleItemClose = (itemId) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleMouseDown = (e, itemId) => {
    // Don't start dragging if clicking on a video element or its controls
    if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
      return;
    }
    didDragRef.current = false;
    e.preventDefault();
    e.stopPropagation();

    const item = mediaItems.find((i) => i.id === itemId);
    if (!item) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggedItem(itemId);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleVideoDoubleClick = (e, itemId) => {
    e.stopPropagation();
    e.preventDefault();
    
    const videoElement = videoRefs.current[itemId];
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement.play();
      setPlayingVideos(prev => ({ ...prev, [itemId]: true }));
    } else {
      videoElement.pause();
      setPlayingVideos(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleMouseMove = (e) => {
    if (!draggedItem) return;
    didDragRef.current = true;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === draggedItem ? { ...item, x: newX, y: newY } : item
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (draggedItem) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedItem, dragOffset]);

  if (!isOpen) return null;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        className={styles.closeAllButton}
        onClick={handleClose}
        title="Close all windows"
      >
        ×
      </button>

      {error && (
        <div className={styles.galleryMessage}>
          {error}
        </div>
      )}
      {loading && !error && (
        <div className={styles.galleryMessage}>Loading…</div>
      )}

      <motion.div className={styles.galleryContainer}>
        <AnimatePresence>
          {/* Render images first (lower z-index), then videos (always on top) */}
          {mediaItems.length > 0 && [...mediaItems]
            .sort((a, b) => (a.isVideo === b.isVideo ? 0 : a.isVideo ? 1 : -1))
            .map((item) => (
              <motion.div
                key={item.id}
                className={styles.imageContainer}
                style={{
                  left: item.x,
                  top: item.y,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  zIndex: item.isVideo ? 20 : 1,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                onMouseDown={(e) => handleMouseDown(e, item.id)}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.titleBar}>
                  <span className={styles.titleText}>{item.filename}</span>
                  <button
                    className={styles.closeButton98}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClose(item.id);
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  className={styles.imageWrapper}
                  onClick={
                    !item.isVideo
                      ? (e) => {
                          e.stopPropagation();
                          if (didDragRef.current) return;
                          setLightboxItem({ src: item.src, filename: item.filename });
                        }
                      : undefined
                  }
                  role={!item.isVideo ? 'button' : undefined}
                  tabIndex={!item.isVideo ? 0 : undefined}
                  onKeyDown={
                    !item.isVideo
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setLightboxItem({ src: item.src, filename: item.filename });
                          }
                        }
                      : undefined
                  }
                  style={!item.isVideo ? { cursor: 'pointer' } : undefined}
                >
                  {item.isVideo ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[item.id] = el;
                      }}
                      src={item.src}
                      className={styles.galleryImage}
                      controls
                      loop
                      muted
                      onDoubleClick={(e) => handleVideoDoubleClick(e, item.id)}
                      onError={(e) => {
                        console.log(`Video ${item.filename} not found:`, e.target.src);
                        handleItemClose(item.id);
                      }}
                      onLoadedData={() => {
                        console.log(`Video ${item.filename} loaded successfully`);
                      }}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={item.filename}
                      className={styles.galleryImage}
                      onError={(e) => {
                        console.log(`Image ${item.filename} not found:`, e.target.src);
                        handleItemClose(item.id);
                      }}
                      onLoad={() => {
                        console.log(`Image ${item.filename} loaded successfully`);
                      }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox for images */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            className={styles.lightboxBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
          >
            <button
              className={styles.lightboxClose}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxItem(null);
              }}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <motion.div
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <img
                src={lightboxItem.src}
                alt={lightboxItem.filename}
                className={styles.lightboxImage}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageGallery;
