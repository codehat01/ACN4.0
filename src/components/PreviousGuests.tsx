import React, { useState, useEffect, useRef } from "react";

import PG1 from '../images/Previous_Guests/PG1.jpeg';
import PG2 from '../images/Previous_Guests/PG2.jpeg';
import PG3 from '../images/Previous_Guests/PG3.jpeg';
import PG4 from '../images/Previous_Guests/PG4.jpeg';
import PG5 from '../images/Previous_Guests/PG5.jpeg';
import PG6 from '../images/Previous_Guests/PG6.jpeg';
import PG7 from '../images/Previous_Guests/PG7.jpeg';
import PG8 from '../images/Previous_Guests/PG8.jpeg';
import PG10 from '../images/Previous_Guests/PG10.jpeg';
import PG11 from '../images/Previous_Guests/PG11.jpeg';
import PG13 from '../images/Previous_Guests/PG13.jpeg';
import PG15 from '../images/Previous_Guests/PG15.jpeg';
import PG16 from '../images/Previous_Guests/PG16.jpeg';
import PG17 from '../images/Previous_Guests/PG17.jpeg';
import PG18 from '../images/Previous_Guests/PG18.jpeg';
import PG19 from '../images/Previous_Guests/PG19.jpeg';
import PG20 from '../images/Previous_Guests/PG20.jpeg';
import PG21 from '../images/Previous_Guests/PG21.jpeg';
import PG22 from '../images/Previous_Guests/PG22.jpeg';
import PG23 from '../images/Previous_Guests/PG23.jpeg';
import PG24 from '../images/Previous_Guests/PG24.jpeg';
import PG25 from '../images/Previous_Guests/PG25.jpeg';
import PG26 from '../images/Previous_Guests/PG26.jpeg';
import PG27 from '../images/Previous_Guests/PG27.jpeg';

const guestData = [
  { src: PG1, name: "Ishwar Prasad Bhat", designation: "Founder and CEO, Necurity Solutions" },
  { src: PG2, name: "Mr. Natarajan Elangovan", designation: "Head - Security Engineering at Wipro Limited, Chennai" },
  { src: PG3, name: "Mr. T. T. Aditya", designation: "Product Owner - Security and Privacy, Continental Corporation Pvt. Ltd." },
  { src: PG4, name: "Shri. S. Venkat Sairam", designation: "Chief Manager, Computer Systems Dept. CUB" },
  { src: PG5, name: "Dr. Prabaharan Poornachandran", designation: "Director, Internet Studies and Artificial Intelligence, AVV, Amritapuri" },
  { src: PG6, name: "Mr Yesudian Rajkumar J.K", designation: "Founder Amud Solutions, Zero Trust Consultant, Chennai" },
  { src: PG7, name: "Dr. Dittin Andrews", designation: "Joint Director Cyber Security, CDAC, Thiruvanthapuram" },
  { src: PG8, name: "Mr. Melvin John", designation: "Security Specialist at NEC Corporation India Pvt. Ltd, Bangalore" },
  { src: PG10, name: "Dr. Shankar Raman", designation: "CEO, Pravarthak Ecosystems, IIT Madras Research Park, Chennai" },
  { src: PG11, name: "Dr. S.A.V.Satyamurty", designation: "Director, Research, Vinayaga Missions Research Foundation" },
  { src: PG13, name: "Dr. Siraj Rahim DGM", designation: "Operation Technology, MRF Limited, Chennai" },
  { src: PG15, name: "Mr.Sitaram Chamarty", designation: "Principal Consultant at TCS, Hyderabad" },
  { src: PG16, name: "Mr Natarajan Swarninathan", designation: "Senior Consultant, Cyber security practice, Tata Consultancy Services" },
  { src: PG17, name: "Dr. Manikantan Srinivasan", designation: "Assistant General Manager, (NMEC), NEC Corporation india Private Limited" },
  { src: PG18, name: "Mr. Andrew David Bhagyam", designation: "Privacy Program Manager, Zoho Corporation, Chennai" },
  { src: PG19, name: "Ms. panchi S", designation: "Managing Director, YesPanchi Tech Services Pvt Ltd, Chennai" },
  { src: PG20, name: "Mr. Aashish Vivekanand", designation: "Cloud Solution Architect, Trusted Services, Singapore" },
  { src: PG21, name: "Mr. Venkatesh Natarajan", designation: "Ex President-IT & Chief Digital Officer, Ashok Leyland Limited, Chennai" },
  { src: PG22, name: "Dr. N. Subramanian", designation: "Executive Director, SETS, Chennai" },
  { src: PG23, name: "Mrs. Nalini Kannan", designation: "Senior Technical Architect & Zero Trust Solution IBM Security, ISL" },
  { src: PG24, name: "Mr. K. Sibi", designation: "Associate Manager, Ongil.ai" },
  { src: PG25, name: "Dr. N. Gopalakrishnan", designation: "Former director of DRDO" },
  { src: PG26, name: "Mr. Raghuraman R", designation: "Founder - Meynikara XR Technologies" },
  { src: PG27, name: "Mr. Palanikumar Arumugam", designation: "Vice President - Information Security Equitas Small Finance Bank" },
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
          const newOffset = prev - 1.5; // scroll speed (px/frame) - increased for faster scroll
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
  <div className="bg-gradient-to-br from-platinumGray via-pureWhite to-platinumGray flex flex-col items-center py-12 px-4">
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
            className="flex items-center gap-2 md:gap-3 will-change-transform cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {loopedGuests.map((guest, index) => (
              <div key={index} className="flex flex-col items-center w-[240px] md:w-[300px]">
                <img
                  className="image w-[240px] h-[240px] md:w-[300px] md:h-[300px] object-cover rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-[0.4s] select-none pointer-events-auto bg-[#222] hover:scale-[1.08] hover:rotate-[-2deg] hover:shadow-[0_8px_32px_rgba(178,32,73,0.25)] hover:z-[2]"
                  src={guest.src}
                  alt={guest.name}
                  draggable={false}
                  style={{ objectPosition: `center` }}
                />
                <span className="mt-2 text-black text-sm md:text-base font-semibold text-center truncate w-full">
                  {guest.name}
                </span>
                <span className="text-gray-600 text-xs md:text-sm font-medium text-center truncate w-full">
                  {guest.designation}
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