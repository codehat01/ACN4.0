import React, { useState, useEffect, useRef } from 'react';
import { SlideshowProps } from '../types';

const Slideshow: React.FC<SlideshowProps> = ({ containerId, images, autoPlayInterval = 2000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsPlaying(false);
    }

    // Intersection observer to pause when off-screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }, { threshold: 0.25 });
    
    if (containerRef.current) {
      io.observe(containerRef.current);
    }

    if (isPlaying && !prefersReduced) {
      startAutoPlay();
    }

    return () => {
      if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
      if (progressTimer.current) clearTimeout(progressTimer.current);
      io.disconnect();
    };
  }, [currentSlide, isPlaying, autoPlayInterval]);

  const startAutoPlay = () => {
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    autoPlayTimer.current = setTimeout(() => {
      nextSlide();
    }, autoPlayInterval);
    startProgressBar();
  };

  const startProgressBar = () => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
      progressBarRef.current.style.transition = `width ${autoPlayInterval}ms linear`;
      setTimeout(() => {
        if (progressBarRef.current) {
          progressBarRef.current.style.width = '100%';
        }
      }, 50);
    }
  };

  const pauseAutoPlay = () => {
    setIsPlaying(false);
    if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
    if (progressBarRef.current) {
      progressBarRef.current.style.transition = 'none';
    }
  };

  const resumeAutoPlay = () => {
    setIsPlaying(true);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
    pauseAutoPlay();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
    setIsDragging(false);
    handleSwipe();
    resumeAutoPlay();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStartX(e.clientX);
    setIsDragging(true);
    pauseAutoPlay();
    e.preventDefault();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setTouchEndX(e.clientX);
      setIsDragging(false);
      handleSwipe();
      resumeAutoPlay();
    }
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const translateX = -currentSlide * (100 / images.length);

  return (
    <div 
      ref={containerRef}
      className={`slideshow-container ${isDragging ? 'touching' : ''}`}
      role="region" 
      aria-roledescription="carousel" 
      aria-label="Panel Slideshow"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevSlide();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextSlide();
        }
        if (e.key === ' ') {
          e.preventDefault();
          setIsPlaying(!isPlaying);
        }
      }}
      tabIndex={0}
    >
      <div className="slideshow-counter" aria-live="polite">
        <span className="current">{currentSlide + 1}</span>/<span className="total">{images.length}</span>
      </div>
      
      <div 
        className="slideshow-wrapper" 
        style={{ 
          transform: `translateX(${translateX}%)`, 
          transition: isDragging ? 'none' : 'transform 0.5s ease-in-out',
          width: `${images.length * 100}%`
        }}
        aria-live="off"
      >
        {images.map((img, idx) => (
          <div 
            key={idx}
            className="slide" 
            style={{ width: `${100 / images.length}%` }}
            role="group" 
            aria-roledescription="slide" 
            aria-label={`Slide ${idx + 1} of ${images.length}`}
          >
            <img src={img} alt={`Panel slideshow image ${idx + 1}`} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>

      <button 
        className="slideshow-arrow prev" 
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button 
        className="slideshow-arrow next" 
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="slideshow-dots" role="tablist" aria-label="Choose slide">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            role="button"
            tabIndex={0}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
              }
            }}
          />
        ))}
      </div>

      <div ref={progressBarRef} className="slideshow-progress" aria-hidden="true"></div>
    </div>
  );
};

export default Slideshow;