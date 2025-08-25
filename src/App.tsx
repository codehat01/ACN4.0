import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import GuestsCarousel from "./components/GuestsCarousel";
import About from "./components/About";
import PreviousGuests from "./components/PreviousGuests";
import Editions from "./components/Editions";
import Sponsors from "./components/Sponsors";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import Loader from "./components/Preloader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />;
  }

  return (
    <motion.div
      className="min-h-screen bg-white"
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
