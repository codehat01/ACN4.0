import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useAnimation, AnimatePresence } from 'framer-motion';


import img1 from '../images/1st.jpg';
import img2 from '../images/2nd.jpg';
import img3 from '../images/3rd.jpg';
import img4 from '../images/conclave.jpg';

const localImages = [img1, img2, img3, img4];



const Gallery = () => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dragX = useMotionValue(0);
  const controls = useAnimation();
  const timeoutRef = useRef<number | null>(null);
  const imageCount = localImages.length;

  // 3D carousel positions
  const getPosition = (idx: number) => {
    // Calculate offset so that center image is always at 0, side images at +/-1, wrap around
    let offset = idx - centerIndex;
    if (offset < -Math.floor(imageCount / 2)) offset += imageCount;
    if (offset > Math.floor(imageCount / 2)) offset -= imageCount;
    if (offset === 0) return { z: 0, x: 0, scale: 1, rotateY: 0, opacity: 1, pointerEvents: 'auto' };
    if (offset === 1) return { z: -100, x: 120, scale: 0.8, rotateY: -35, opacity: 0.6, pointerEvents: 'none' };
    if (offset === -1) return { z: -100, x: -120, scale: 0.8, rotateY: 35, opacity: 0.6, pointerEvents: 'none' };
    return { z: -200, x: 0, scale: 0.6, rotateY: 0, opacity: 0, pointerEvents: 'none' };
  };

  // Auto-slide effect
  useEffect(() => {
    if (lightboxOpen) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCenterIndex((prev) => (prev + 1) % imageCount);
    }, 3500);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [centerIndex, imageCount, lightboxOpen]);

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen]);

  // Drag/swipe handlers
  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    if (info.offset.x < -60) {
      setCenterIndex((prev) => (prev + 1) % imageCount);
    } else if (info.offset.x > 60) {
      setCenterIndex((prev) => (prev - 1 + imageCount) % imageCount);
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            3D Memories in Motion
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our event moments in a dynamic 3D carousel—swipe or drag to explore!
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 relative">
          <div
            className="relative flex items-center justify-center w-full h-[320px] sm:h-[400px] px-0 sm:px-0"
            style={{ perspective: 1200 }}
          >
            {/* 3D Carousel Images */}
            {localImages.map((img, idx) => {
              const pos = getPosition(idx);
              const isCenter = pos.x === 0 && pos.scale === 1;
              // Make side images more visible
              let isMobile = window.innerWidth < 640;
              let imgWidth = isMobile ? '70vw' : 'min(95vw, 700px)';
              let imgScale = pos.scale;
              let imgOpacity = pos.opacity;
              let imgX = pos.x;
              if (!isCenter && Math.abs(pos.x) > 0) {
                imgWidth = isMobile ? '40vw' : 'min(60vw, 320px)';
                imgScale = 0.8;
                imgOpacity = 0.7;
                // Smaller offset on mobile to prevent overflow
                imgX = pos.x > 0
                  ? pos.x + (isMobile ? 60 : 180)
                  : pos.x - (isMobile ? 60 : 180);
              }
              return (
                <motion.img
                  key={idx}
                  src={img}
                  alt={`Gallery image ${idx + 1}`}
                  className="absolute rounded-2xl object-contain shadow-xl bg-white select-none cursor-pointer"
                  style={{
                    width: imgWidth,
                    height: 'auto',
                    maxHeight: '80vh',
                    zIndex: 10 - Math.abs((idx - centerIndex + imageCount) % imageCount),
                    pointerEvents: pos.pointerEvents as React.CSSProperties['pointerEvents'],
                    margin: '0 8px',
                    touchAction: 'pan-x',
                  }}
                  animate={{
                    x: imgX,
                    scale: imgScale,
                    opacity: imgOpacity,
                    rotateY: pos.rotateY,
                    z: pos.z,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  drag={!lightboxOpen && pos.z === 0 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (isCenter && !lightboxOpen) setLightboxOpen(true);
                  }}
                />
              );
            })}
        {/* Lightbox Modal */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxOpen(false)}
              style={{ cursor: 'zoom-out', background: 'rgba(0,0,0,0.01)' }}
            >
              <motion.img
                src={localImages[centerIndex]}
                alt={`Gallery image ${centerIndex + 1}`}
                className="rounded-2xl shadow-2xl bg-white object-contain"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 30 } }}
                exit={{ scale: 0.7, opacity: 0, transition: { duration: 0.2 } }}
                style={{
                  width: 'min(99vw, 1200px)',
                  height: 'auto',
                  maxHeight: '90vh',
                  boxShadow: '0 8px 40px 0 rgba(0,0,0,0.15)',
                  cursor: 'auto',
                }}
                onClick={e => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500">
          {centerIndex + 1} / {localImages.length}
        </div>
      </div>
    </section>
  );
};

export default Gallery;