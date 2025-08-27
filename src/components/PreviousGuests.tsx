import React, { useState, useEffect, useRef } from "react";
import imgA from '../images/a.jpg';
import imgB from '../images/b.jpg';
import imgC from '../images/c.jpg';
import imgD from '../images/d.jpg';
import imgE from '../images/e.jpg';
import imgF from '../images/f.jpg';

const guestData = [
  { src: imgA, name: "Guest A" },
  { src: imgB, name: "Guest B" },
  { src: imgC, name: "Guest C" },
  { src: imgD, name: "Guest D" },
  { src: imgE, name: "Guest E" },
  { src: imgF, name: "Guest F" },
];
const loopedGuests = [...guestData, ...guestData];

const GalleryAnimation = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const [offset, setOffset] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Animate
  useEffect(() => {
    const animate = () => {
      if (!isMouseDown && !isPaused) {
        setOffset((prev) => {
          const newOffset = prev - 0.5; // scroll speed (px/frame)
          const totalWidth = trackRef.current?.scrollWidth ? trackRef.current.scrollWidth / 2 : 0;
          return newOffset <= -totalWidth ? 0 : newOffset;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMouseDown, isPaused]);

  // Apply transform
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${offset}px)`;
      trackRef.current.style.transition = isMouseDown
        ? "none"
        : "transform 0.15s ease-out";
    }
  }, [offset, isMouseDown]);

  // Drag handling
  const handleDrag = (clientX: number) => {
    const diff = clientX - startX;
    setOffset((prev) => prev + diff);
    setStartX(clientX);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartX(e.clientX);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsMouseDown(true);
    setStartX(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown) handleDrag(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isMouseDown) handleDrag(e.touches[0].clientX);
    };
    const handleEnd = () => {
      if (isMouseDown) setIsMouseDown(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isMouseDown, startX]);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-gray-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider mb-4 bg-gradient-to-r from-[#b22049] to-[#e63965] bg-clip-text text-transparent">
            GALLERY
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Distinguished Chief Guests & Speakers from Previous Years
          </p>
        </div>

        {/* Gallery */}
        <div className="relative w-full overflow-hidden mb-6 flex justify-center">
          <div
            ref={trackRef}
            className="flex items-center gap-4 md:gap-8 will-change-transform cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {loopedGuests.map((guest, index) => (
              <div key={index} className="flex flex-col items-center w-[260px] md:w-[340px]">
                <img
                  className="image w-[260px] h-[260px] md:w-[320px] md:h-[320px] object-cover rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-[0.4s] select-none pointer-events-auto bg-[#222] hover:scale-[1.08] hover:rotate-[-2deg] hover:shadow-[0_8px_32px_rgba(178,32,73,0.25)] hover:z-[2]"
                  src={guest.src}
                  alt={guest.name}
                  draggable={false}
                  style={{ objectPosition: `center` }}
                />
                <span className="mt-3 text-white text-base md:text-lg font-semibold text-center drop-shadow-lg">
                  {guest.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-6 md:mt-10">
          <a
            href="/gallery/gallery.html"
            className="px-6 py-3 bg-gradient-to-r from-[#b22049] to-[#e63965] text-white rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-transform"
          >
            View Full Gallery
          </a>
        </div>
      </div>
    </div>
  );
};

export default GalleryAnimation;