import imgA from "../images/a.jpg";
import imgB from "../images/b.jpg";
import imgC from "../images/c.jpg";
import imgD from "../images/d.jpg";
import imgE from "../images/e.jpg";
import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { Building2 } from "lucide-react";
import type { Swiper as SwiperType } from "swiper"; // ✅ Import Swiper type

import "swiper/css";
import "swiper/css/effect-coverflow";

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    <div className="absolute w-full h-full animate-[pulse_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]"></div>
    <div className="absolute w-full h-full animate-[spin_20s_linear_infinite] bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.15)_0%,transparent_70%)]"></div>
  </div>
);

type Guest = {
  name: string;
  designation: string;
  organization: string;
  photo: string;
  about: string;
};

const GuestsCarousel = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });

  const swiperRef = useRef<SwiperType | null>(null); // ✅ Typed swiperRef
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // ✅ typed index
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const guests2024: Guest[] = [
    {
      name: "Rajesh Ganesan",
      designation: "Chief Technology Officer",
      organization: "ManageEngine",
      photo: imgA,
      about:
        "Rajesh has over 20 years of experience in enterprise IT and has been instrumental in building scalable tech products.",
    },
    {
      name: "Dr. TR Reshmi",
      designation: "Professor & Head",
      organization: "Amrita University",
      photo: imgB,
      about:
        "Dr. Reshmi is a leading academician in AI & cybersecurity with multiple research publications and awards.",
    },
    {
      name: "Vinod Senthil T",
      designation: "Senior Security Consultant",
      organization: "Infosys",
      photo: imgC,
      about:
        "Vinod is a cybersecurity consultant specializing in cloud security, penetration testing, and compliance.",
    },
    {
      name: "Aravind Gnanabaskaran",
      designation: "Cybersecurity Expert",
      organization: "TCS",
      photo: imgD,
      about:
        "Aravind is an expert in ethical hacking, with a decade of experience securing enterprise infrastructure.",
    },
    {
      name: "Priya Sharma",
      designation: "CISO",
      organization: "Wipro Technologies",
      photo: imgE,
      about:
        "Priya is a global leader in cybersecurity strategy and governance, working with Fortune 500 clients.",
    },
    {
      name: "Karthik Krishnan",
      designation: "Security Architect",
      organization: "HCL Technologies",
      photo: "/guests/karthik.jpg",
      about:
        "Karthik designs enterprise-level security architectures for mission-critical infrastructure projects.",
    },
  ];

  const handleCardOpen = (index: number) => {
    setActiveIndex(index);
    swiperRef.current?.autoplay?.stop(); // ✅ autoplay typed
  };

  const handleCardClose = () => {
    setActiveIndex(null);
    swiperRef.current?.autoplay?.start(); // ✅ autoplay typed
  };

  return (
    <section
      className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900"
      ref={ref}
    >
      <Particles />

      {/* Heading */}
      <motion.div
        className="relative text-center mb-16 z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-400 drop-shadow-xl mb-4">
          Distinguished Guests 2025
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          An exclusive showcase of visionaries shaping the future of technology.
        </p>
      </motion.div>

      {/* Swiper */}
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView="auto"
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={900}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        coverflowEffect={{
          rotate: 25,
          stretch: 0,
          depth: 250,
          modifier: 1.2,
          slideShadows: true,
        }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
        className="w-[92%] max-w-7xl relative z-10"
      >
        {guests2024.map((guest, index) => (
          <SwiperSlide key={index} className="flex justify-center py-12">
            <motion.div
              onClick={() =>
                activeIndex === index ? handleCardClose() : handleCardOpen(index)
              }
              {...(!isMobile && {
                onMouseEnter: () => handleCardOpen(index),
                onMouseLeave: () => handleCardClose(),
              })}
              whileHover={
                activeIndex === index
                  ? {}
                  : {
                      scale: 1.07,
                      rotateY: 6,
                      rotateX: -3,
                      boxShadow: "0px 0px 45px rgba(99,102,241,0.55)",
                    }
              }
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden w-[380px] md:w-[500px] text-center shadow-[0_0_60px_rgba(255,255,255,0.18)] cursor-pointer will-change-transform"
            >
              {/* Glow Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-indigo-500/40 to-pink-500/40 animate-pulse" />

              {/* Guest Photo */}
              <div className="h-[320px] md:h-[400px] overflow-hidden relative flex items-center justify-center">
                <motion.img
                  src={guest.photo}
                  alt={guest.name}
                  className="w-full h-full object-cover rounded-2xl"
                  animate={{ opacity: activeIndex === index ? 0.4 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Guest Details */}
              <div className="relative p-6">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  {guest.name}
                </h3>
                <p className="text-indigo-300 font-medium mb-3">
                  {guest.designation}
                </p>
                <div className="flex items-center justify-center text-gray-300">
                  <Building2 className="w-4 h-4 mr-2 text-pink-400" />
                  <span className="text-sm">{guest.organization}</span>
                </div>
              </div>

              {/* Expanding About Section */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 right-0 max-h-36 overflow-y-auto bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-sm p-4 rounded-b-3xl z-50"
                  >
                    <p className="text-gray-100 text-sm leading-relaxed text-left">
                      {guest.about}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default GuestsCarousel;
