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
  { src: PG5, name: "Dr. Prabaharan Poornachandran", designation: "Director, Internet Studies and AI, AVV, Amritapuri" },
  { src: PG6, name: "Mr Yesudian Rajkumar J.K", designation: "Founder Amud Solutions, Zero Trust Consultant, Chennai" },
  { src: PG7, name: "Dr. Dittin Andrews", designation: "Joint Director Cyber Security, CDAC, Thiruvanthapuram" },
  { src: PG8, name: "Mr. Melvin John", designation: "Security Specialist at NEC Corporation India Pvt. Ltd, Bangalore" },
  { src: PG10, name: "Dr. Shankar Raman", designation: "CEO, Pravarthak Ecosystems, IIT Madras Research Park, Chennai" },
  { src: PG11, name: "Dr. S.A.V.Satyamurty", designation: "Director, Research, Vinayaga Missions Research Foundation" },
  { src: PG13, name: "Dr. Siraj Rahim DGM", designation: "Operation Technology, MRF Limited, Chennai" },
  { src: PG15, name: "Mr. Sitaram Chamarty", designation: "Principal Consultant at TCS, Hyderabad" },
  { src: PG16, name: "Mr Natarajan Swarninathan", designation: "Senior Consultant, Cyber security practice, Tata Consultancy Services" },
  { src: PG17, name: "Dr. Manikantan Srinivasan", designation: "Assistant General Manager, NEC Corporation India Pvt Limited" },
  { src: PG18, name: "Mr. Andrew David Bhagyam", designation: "Privacy Program Manager, Zoho Corporation, Chennai" },
  { src: PG19, name: "Ms. Panchi S", designation: "Managing Director, YesPanchi Tech Services Pvt Ltd, Chennai" },
  { src: PG20, name: "Mr. Aashish Vivekanand", designation: "Cloud Solution Architect, Trusted Services, Singapore" },
  { src: PG21, name: "Mr. Venkatesh Natarajan", designation: "Ex President-IT & Chief Digital Officer, Ashok Leyland Limited, Chennai" },
  { src: PG22, name: "Dr. N. Subramanian", designation: "Executive Director, SETS, Chennai" },
  { src: PG23, name: "Mrs. Nalini Kannan", designation: "Senior Technical Architect & Zero Trust Solution IBM Security, ISL" },
  { src: PG24, name: "Mr. K. Sibi", designation: "Associate Manager, Ongil.ai" },
  { src: PG25, name: "Dr. N. Gopalakrishnan", designation: "Former director of DRDO" },
  { src: PG26, name: "Mr. Raghuraman R", designation: "Founder - Meynikara XR Technologies" },
  { src: PG27, name: "Mr. Palanikumar Arumugam", designation: "Vice President - Information Security Equitas Small Finance Bank" },
];

interface Guest {
  src: string;
  name: string;
  designation: string;
}

const GalleryAnimation: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const galleryObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          } else {
            (entry.target as HTMLElement).style.opacity = '0';
            (entry.target as HTMLElement).style.transform = 'translateY(50px)';
          }
        });
      },
      { threshold: 0.1 }
    );

    galleryObserver.observe(gallery);

    return () => {
      galleryObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const animate = (): void => {
      if (!isMouseDown) {
        setCurrentPercentage(prev => {
          const newPercentage = prev - 0.05; // Auto-scroll speed
          return newPercentage <= -100 ? 0 : newPercentage; // Reset to 0 after reaching -100%
        });
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate(${currentPercentage}%, -50%)`;
        
        const images = trackRef.current.getElementsByClassName("image") as HTMLCollectionOf<HTMLImageElement>;
        for (const image of images) {
          image.style.objectPosition = `${100 + currentPercentage}% center`;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPercentage, isMouseDown]);

  const handleOnDown = (e: React.MouseEvent | React.TouchEvent): void => {
    setIsMouseDown(true);
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
  };

  const handleOnUp = (): void => {
    setIsMouseDown(false);
  };

  const handleOnMove = (e: React.MouseEvent | React.TouchEvent): void => {
    if (!isMouseDown) return;
    
    const currentX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const diff = startX - currentX;
    const percentage = (diff / window.innerWidth) * 100;
    
    setCurrentPercentage(prev => 
      Math.max(Math.min(prev - percentage, 0), -100)
    );
    setStartX(currentX);
  };

  // Inline styles object
  const styles = {
    galleries: {
      opacity: 0,
      transform: 'translateY(50px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    },
    galleriesVisible: {
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    },
    imageTrack: {
      display: 'flex',
      gap: '4vmin',
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      userSelect: 'none' as const,
    },
    image: {
      width: '40vmin',
      height: '56vmin',
      objectFit: 'cover' as const,
      objectPosition: '100% center',
      borderRadius: '1rem',
      transition: 'object-position 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'grab' as const,
    },
    imageActive: {
      cursor: 'grabbing' as const,
    },
    imageContainer: {
      position: 'relative' as const,
    },
    overlay: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
      color: 'white',
      padding: '20px 15px 15px',
      borderRadius: '0 0 1rem 1rem',
      transform: 'translateY(100%)',
      transition: 'transform 0.3s ease',
    },
    overlayVisible: {
      transform: 'translateY(0)',
    },
    guestName: {
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      marginBottom: '5px',
      lineHeight: '1.2',
    },
    guestDesignation: {
      fontSize: '0.8rem',
      opacity: 0.9,
      lineHeight: '1.3',
    },
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider mb-4 bg-gradient-to-r from-[#b22049] to-[#e63965] bg-clip-text text-transparent">
            GALLERY
          </h1>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Distinguished Chief Guests & Speakers from Previous Years
          </p>
        </div>

        <div className="w-full h-screen overflow-hidden relative">
          <div 
            ref={galleryRef}
            className="w-full h-full"
            style={styles.galleries}
            onMouseDown={handleOnDown}
            onMouseUp={handleOnUp}
            onMouseMove={handleOnMove}
            onTouchStart={handleOnDown}
            onTouchEnd={handleOnUp}
            onTouchMove={handleOnMove}
          >
            <div 
              ref={trackRef}
              style={{
                ...styles.imageTrack,
                transform: `translate(${currentPercentage}%, -50%)`,
              }}
            >
              {guestData.map((guest: Guest, index: number) => (
                  <img
                    src={guest.src}
                    alt={guest.name}
                    draggable={false}
                    style={{
                      ...styles.image,
                      objectPosition: `${110 + currentPercentage}% center`,
                      ...(isMouseDown ? styles.imageActive : {}),
                    }}
                  />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryAnimation;