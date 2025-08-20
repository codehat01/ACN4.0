import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './src/components/Navbar';
import Hero from './src/components/Hero';
import GuestsCarousel from './src/components/GuestsCarousel';
import About from './src/components/About';
import PreviousGuests from './src/components/PreviousGuests';
import Editions from './src/components/Editions';
import Sponsors from './src/components/Sponsors';
import Gallery from './src/components/Gallery';
import Footer from './src/components/Footer';

function App() {
  useEffect(() => {
    // Smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <motion.div 
      className="main-container min-h-screen bg-white"
      style={{ position: 'relative' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Hero />
      <GuestsCarousel />
      <About />
      <PreviousGuests />
      <Editions />
      <Sponsors />
      <Gallery />
      <Footer />
    </motion.div>
  );
}

export default App;