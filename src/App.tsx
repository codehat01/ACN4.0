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
    const root = document.documentElement;
    root.style.scrollBehavior = "smooth";
    root.classList.add("home-no-xoverflow");
    return () => {
      root.style.scrollBehavior = "auto";
      root.classList.remove("home-no-xoverflow");
    };
  }, []);

  if (loading) {
    return <Loader onFinish={() => setLoading(false)} />;
  }

  return (
    <motion.div
      className="min-h-screen bg-deepNavy"
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
