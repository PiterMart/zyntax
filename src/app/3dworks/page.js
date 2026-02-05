'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import TerminalWindow from '../../components/TerminalWindow';
import CatTerminalButton from '../../components/CatTerminalButton';
import ImageGallery from '../../components/imagegallery/ImageGallery';
import styles from '../../styles/FolderPopup.module.css';

const works3DContent = {
  en: {
    title: 'Zyntax | 3D ',
    content: `My journey began with raw experimentation in Blender—throwing objects into physics simulations and exploring digital collisions. This curiosity evolved into "Eternal Glory," my own clothing brand, where I directed 3D trailers for every release. These projects blended photogrammetry backgrounds with low-poly PS1-style characters to build a unique narrative world across three chapters.

This foundation led me to work with top-tier agencies, creating high-impact visuals for brands like Carolina Herrera, Heineken, and Red Bull. I have mastered everything from anamorphic illusions for public screens to mixed media and motion tracking for social media. 

Today, I handle the full 3D pipeline: architectural renders, asset retopology, and complex animations. I pride myself on delivering "practical renders" in record time, always leaving room for personal works where I let my imagination and dark fantasies run wild.`
  },
  es: {
    title: 'Zyntax | 3D',
    content: `Mi camino comenzó con la experimentación pura en Blender: probando físicas, arrojando objetos y explorando colisiones. Esa curiosidad se transformó en "Eternal Glory", mi propia marca de ropa, donde creé trailers animados para cada lanzamiento. En ellos, mezclé fondos de fotogrametría con personajes low-poly estilo PS1 para construir una narrativa de tres capítulos.

Esta base me llevó a trabajar con agencias de primer nivel, generando visuales para marcas como Carolina Herrera, Heineken y Red Bull. He dominado desde ilusiones anamórficas para pantallas de vía pública hasta trabajos de mixed media y tracking para redes sociales.

Hoy en día, abarco el pipeline completo de 3D: renders arquitectónicos, retopología de assets y animaciones complejas. Me especializo en lograr renders prácticos en tiempos récord, sin dejar de lado mis obras personales donde despliego mi imaginación y mis propias fantasías.`
  }
};

const DESKTOP_HEIGHT = '70vh';

const FOLDER_DISPLAY_NAMES = {
  GDMS: 'Guardian de mis sueños',
  angelica: 'Angelica',
  eternalglory: 'Eternal Glory'
};

function folderDisplayName(path) {
  if (FOLDER_DISPLAY_NAMES[path]) return FOLDER_DISPLAY_NAMES[path];
  const last = path.split('/').pop() || path;
  return last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Works3DPage() {
  const { language } = useLanguage();
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [desktopFolders, setDesktopFolders] = useState([]);
  const [folderPositions, setFolderPositions] = useState({});
  const [openFolderPath, setOpenFolderPath] = useState(null);
  const [popup, setPopup] = useState(null); // { path, folders, anchor }
  const [dragging, setDragging] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const didDragRef = useRef(false);
  const desktopRef = useRef(null);

  useEffect(() => {
    fetch('/api/3dworks/list?path=')
      .then((r) => r.json())
      .then((data) => {
        const folders = data.folders || [];
        setDesktopFolders(folders);
        setFolderPositions((prev) => {
          const next = { ...prev };
          const isNarrow = typeof window !== 'undefined' && window.innerWidth < 768;
          const cols = isNarrow ? 2 : 4;
          const stepX = isNarrow ? 100 : 160;
          const stepY = isNarrow ? 100 : 120;
          const startX = isNarrow ? 16 : 40;
          const startY = isNarrow ? 16 : 80;
          folders.forEach((f, i) => {
            if (next[f.path] == null) {
              next[f.path] = {
                x: startX + (i % cols) * stepX,
                y: startY + Math.floor(i / cols) * stepY
              };
            }
          });
          return next;
        });
      })
      .catch(console.error);
  }, []);

  const handleClose = () => {
    setIsTerminalVisible(false);
  };

  const handleOpen = () => {
    setIsTerminalVisible(true);
  };

  const getClientXY = (e) => {
    if (e.touches?.[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const handleFolderPointerDown = (e, path) => {
    if (e.type === 'mousedown' && e.button !== 0) return;
    const pos = folderPositions[path];
    if (!pos) return;
    didDragRef.current = false;
    setDragging(path);
    const { x, y } = getClientXY(e);
    dragOffset.current = {
      x: x - pos.x,
      y: y - pos.y
    };
  };

  useEffect(() => {
    if (dragging === null) return;

    const handleMove = (e) => {
      didDragRef.current = true;
      const { x, y } = e.touches?.[0] ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
      setFolderPositions((prev) => ({
        ...prev,
        [dragging]: {
          x: x - dragOffset.current.x,
          y: y - dragOffset.current.y
        }
      }));
    };

    const handleTouchMove = (e) => {
      handleMove(e);
      e.preventDefault();
    };

    const handleEnd = () => setDragging(null);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [dragging]);

  const handleFolderClick = async (path) => {
    if (didDragRef.current) return;
    const res = await fetch(`/api/3dworks/list?path=${encodeURIComponent(path)}`);
    const data = await res.json().catch(() => ({}));
    const subfolders = data.folders || [];
    if (subfolders.length > 0) {
      setPopup({
        path,
        folders: subfolders,
        anchor: folderPositions[path] ? { x: folderPositions[path].x + 60, y: folderPositions[path].y + 40 } : { x: 200, y: 200 }
      });
    } else {
      setOpenFolderPath(path);
    }
  };

  const openGallery = (path) => {
    setPopup(null);
    setOpenFolderPath(path);
  };

  const openSubfolderPopup = async (subfolderPath) => {
    const res = await fetch(`/api/3dworks/list?path=${encodeURIComponent(subfolderPath)}`);
    const data = await res.json().catch(() => ({}));
    const subfolders = data.folders || [];
    if (subfolders.length > 0) {
      setPopup({
        path: subfolderPath,
        folders: subfolders,
        anchor: { x: (popup?.anchor?.x ?? 200) + 20, y: (popup?.anchor?.y ?? 200) }
      });
    } else {
      openGallery(subfolderPath);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      background: '#000000',
      position: 'relative'
    }}>
      {/* Terminal Window */}
      {isTerminalVisible && (
        <TerminalWindow 
          content={works3DContent}
          onClose={handleClose}
          showCloseButton={true}
          prompt="C:\\3dworks>"
        />
      )}

      {/* Cat Button - Only show when terminal is closed */}
      {!isTerminalVisible && (
        <CatTerminalButton onClick={handleOpen} />
      )}

      {/* Desktop background with draggable folders */}
      <div
        ref={desktopRef}
        className={styles.desktopFolderContainer}
        style={{
          width: '100%',
          minHeight: DESKTOP_HEIGHT,
          marginTop: '8rem',
          zIndex: 5
        }}
      >
        {openFolderPath === null &&
          desktopFolders.map((folder) => {
            const pos = folderPositions[folder.path];
            if (!pos) return null;
            return (
              <button
                key={folder.path}
                type="button"
                className={styles.desktopFolder}
                onMouseDown={(e) => handleFolderPointerDown(e, folder.path)}
                onTouchStart={(e) => handleFolderPointerDown(e, folder.path)}
                onClick={() => handleFolderClick(folder.path)}
                style={{
                  left: pos.x,
                  top: pos.y,
                  cursor: dragging === folder.path ? 'grabbing' : 'grab'
                }}
              >
                <img
                  src="/blackfolder.png"
                  alt={folderDisplayName(folder.path)}
                  draggable={false}
                  className={styles.desktopFolderIcon}
                />
                <span className={styles.desktopFolderLabel}>
                  {folderDisplayName(folder.path)}
                </span>
              </button>
            );
          })}
      </div>

      {/* Subfolder popup (OS-style, matches ImageGallery) */}
      {popup && (
        <>
          <div
            role="presentation"
            className={styles.popupOverlay}
            onClick={() => setPopup(null)}
          />
          <div
            role="dialog"
            aria-label="Folder contents"
            className={styles.popup}
            style={{
              '--popup-x': `${popup.anchor.x}px`,
              '--popup-y': `${popup.anchor.y}px`
            }}
          >
            <div className={styles.popupTitleBar}>
              <span className={styles.popupTitleText}>{folderDisplayName(popup.path)}</span>
            </div>
            <div className={styles.popupBody}>
              {popup.folders.map((sub) => (
                <button
                  key={sub.path}
                  type="button"
                  className={styles.popupItem}
                  onClick={() => openSubfolderPopup(sub.path)}
                >
                  <img src="/blackfolder.png" alt="" className={styles.popupItemIcon} />
                  {folderDisplayName(sub.name)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Image gallery opens when user selects a folder (or subfolder) */}
      <ImageGallery
        isOpen={openFolderPath != null && openFolderPath !== ''}
        onClose={() => setOpenFolderPath(null)}
        folderPath={openFolderPath}
      />

      {/* YouTube Video Grid Section */}
      <div style={{
        position: 'relative',
        padding: '2rem',
        marginTop: '2rem',
        zIndex: 10,
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: "'Hornet Display', sans-serif"
      }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '3rem',
          marginBottom: '3rem',
          textAlign: 'left',
          fontFamily: "'Hornet Display', sans-serif",
          fontWeight: 'bold'
        }}>
          LINKS
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Guardian de mis sueños
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/zVD20azgzpA?si=QxvGkWgOK5LPsWtz" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Angelica
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/6-Pu3QYV7gs?si=zlHxhwjahuQAzq1K" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              AEXLAB INTRO - ZYNTAX 360
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/xw52A0XgkHY?si=_mmn4tcUXn4Vz6mv" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              ETERNAL GLORY
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/4K5pY-R3j6Q?si=QvjJXFsKr1eIoAsX" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
            <a 
              href="https://www.youtube.com/watch?v=vDScr0YT4eU&list=PLlqZz43qAMJ65sQS1sA-34NZJakJMTlju"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#ffffff',
                fontSize: '1rem',
                textDecoration: 'underline',
                fontFamily: "'Hornet Display', sans-serif",
                display: 'inline-block'
              }}
            >
              {language === 'es' ? 'serie completa' : 'full series'}
            </a>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Crash ft.O.L.I.V.I.A.
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/gqdyW7I5PJ0?si=c06z7yFw1Niysilm" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Agency - HALLOWEEN HEINEKEN
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/HtX7HDm0iE0?si=K54eNwIe6VG5HeCF" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Agency - Carolina Herrera
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/lyVUNTQX4ZM?si=CWujXiem-efoHdmn" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Agency - Paulaner anamorfic illusion
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/AIpWs10KkiI?si=mrGq9vmrrzzIXQYg" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Agency - BNN Airport
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/yLVG4zjehfs?si=apckbldKN8_fF0D_" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.5rem',
              textAlign: 'left',
              fontFamily: "'Hornet Display', sans-serif",
              fontWeight: 'normal'
            }}>
              Agency - TANQUERADE
            </h2>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe 
                src="https://www.youtube.com/embed/Fs7GyTiTCck?si=Fs8Nm__LVx-hq-eA" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
                }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
