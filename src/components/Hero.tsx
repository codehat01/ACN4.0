import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const slides = [
    {
      id: 1,
      title: "ACN 1st Edition",
      subtitle: "The Beginning of Excellence",
      description: "Where it all started - 500+ participants, 12 sessions of cybersecurity awareness",
      image: "/src/images/1st.JPG",
      duration: 5000,
      year: "2022"
    },
    {
      id: 2,
      title: "ACN 2nd Edition", 
      subtitle: "Building Momentum",
      description: "Expanded horizons - 750+ participants, international speakers, advanced workshops",
      image: "/src/images/2nd.jpg",
      duration: 5000,
      year: "2023"
    },
    {
      id: 3,
      title: "ACN 3rd Edition",
      subtitle: "Current Excellence",
      description: "The present milestone - 1000+ participants, cutting-edge cybersecurity insights",
      image: "/src/images/conclave.jpg",
      duration: 20000,
      year: "2024",
    },
    {
      id: 4,
      title: "ACN 4th Edition",
      subtitle: "The Future Unfolds",
      description: "Join us for the most anticipated cybersecurity event of 2025",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      duration: 20000,
      year: "2025",
      hasCountdown: true
    },
    {
      id: 5,
      title: "2025 Distinguished Guests",
      subtitle: "Industry Leaders",
      description: "Meet the cybersecurity experts shaping our future",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
      duration: 10000,
      hasGuests: true
    }
  ];

  const guests2024 = [
    { 
      name: 'Rajesh Ganesan', 
      designation: 'Chief Technology Officer', 
      organization: 'ManageEngine',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    },
    { 
      name: 'Dr. TR Reshmi', 
      designation: 'Professor & Head', 
      organization: 'Department of CSE, Amrita',
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg'
    },
    { 
      name: 'Vinod Senthil T', 
      designation: 'Senior Security Consultant', 
      organization: 'Infosys',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg'
    },
    { 
      name: 'Aravind Gnanabaskaran', 
      designation: 'Cybersecurity Expert', 
      organization: 'TCS',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slides[currentSlide].duration);

    return () => clearInterval(timer);
  }, [currentSlide, slides]);

  // Countdown timer for slides with hasCountdown
  useEffect(() => {
    if (slides[currentSlide].hasCountdown) {
      const targetYear = slides[currentSlide].year === '2025' ? '2025-12-31T23:59:59' : '2024-12-31T23:59:59';
      const targetDate = new Date(targetYear).getTime();
      
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
          const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
          const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ months, days, hours, minutes, seconds });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Animation variants for sliding effect
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0"
        >
          {/* Background Image with Dark Overlay for Text Readability */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <motion.img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center center'
              }}
            />
          </div>

          {/* 3D Animated Background Elements */}
          <div className="absolute inset-0 z-20">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-blue-400/50 rounded-full"
                animate={{
                  x: [0, 150, -80, 0],
                  y: [0, -100, 80, 0],
                  z: [0, 100, -50, 0],
                  opacity: [0, 1, 0.7, 0],
                  scale: [0.5, 1.3, 0.8, 0.5]
                }}
                transition={{
                  duration: 6 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${10 + i * 8}%`,
                  top: `${20 + (i % 3) * 20}%`,
                  transformStyle: 'preserve-3d',
                  filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.7))',
                  zIndex: 20
                }}
              />
            ))}
          </div>

          {/* Floating geometric shapes */}
          <div className="absolute inset-0 z-10">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`shape-${i}`}
                className={`absolute ${i % 2 === 0 ? 'w-16 h-16 bg-blue-400/20' : 'w-12 h-12 bg-white/20'} ${
                  i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-lg rotate-45' : 'rounded-none'
                }`}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 20, -10, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${30 + i * 10}%`
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-20 flex items-center justify-center h-full w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-0">
            <div className="text-center w-full max-w-6xl mx-auto px-2 py-4">
              
              {/* Year Badge */}
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-2 sm:mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-sm sm:text-base text-white font-semibold">{slides[currentSlide].year}</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 leading-tight px-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {slides[currentSlide].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-400 font-semibold mb-3 sm:mb-4 px-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {slides[currentSlide].subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {slides[currentSlide].description}
              </motion.p>

              {/* Countdown Timer for countdown slides */}
              {slides[currentSlide].hasCountdown && (
                <motion.div
                  className="mb-6 sm:mb-8 w-full px-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 w-full max-w-2xl mx-auto">
                    <h3 className="text-blue-400 text-base sm:text-lg font-semibold mb-3 sm:mb-4">Event Countdown</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
                      {[
                        { label: 'Months', value: timeLeft.months },
                        { label: 'Days', value: timeLeft.days },
                        { label: 'Hours', value: timeLeft.hours },
                        { label: 'Mins', value: timeLeft.minutes },
                        { label: 'Secs', value: timeLeft.seconds }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          className="text-center"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: index * 0.1 }}
                        >
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                            {item.value.toString().padStart(2, '0')}
                          </div>
                          <div className="text-blue-400 text-xs sm:text-sm">{item.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Guest Cards for guest slides */}
              {slides[currentSlide].hasGuests && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
                    {guests2024.map((guest, index) => (
                      <motion.div
                        key={guest.name}
                        className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center hover:bg-white/20 transition-all duration-300 flex flex-col items-center"
                        initial={{ opacity: 0, y: 30, rotateY: -15 }}
                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                        whileHover={{ 
                          scale: 1.05, 
                          rotateY: 5,
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        <motion.div 
                          className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-3 sm:border-4 border-blue-400/50"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <img 
                            src={guest.image} 
                            alt={guest.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <h4 className="text-white font-bold text-sm sm:text-base mb-1">{guest.name}</h4>
                        <p className="text-blue-400 text-xs sm:text-sm font-semibold mb-1">{guest.designation}</p>
                        <p className="text-white/80 text-xs line-clamp-2">{guest.organization}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full px-2 mt-4 sm:mt-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-white text-gray-900 text-sm sm:text-base font-bold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-xl"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Events
                </motion.button>
                <motion.button
                  className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-transparent text-white text-sm sm:text-base font-bold rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Register Now
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-4 sm:inset-y-0 sm:left-4 flex items-center z-30">
        <motion.button
          onClick={prevSlide}
          className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </div>

      <div className="absolute bottom-4 right-4 sm:inset-y-0 sm:right-4 flex items-center z-30">
        <motion.button
          onClick={nextSlide}
          className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-blue-400 scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Slide Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <motion.div
          className="h-full bg-blue-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: slides[currentSlide].duration / 1000,
            ease: 'linear'
          }}
          key={currentSlide}
        />
      </div>
    </section>
  );
};

export default Hero;