import imgA from "../images/DSCI_Vinayak_Godse.jpg";
import imgLogo from "../images/DSCI_icon.jpg";
import imgB from "../images/b.jpg";
import imgC from "../images/c.jpg";
import imgD from "../images/d.jpg";
import imgE from "../images/e.jpg";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { Building2 } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden z-0" aria-hidden>
    <div className="absolute w-full h-full animate-[pulse_8s_ease-in-out_infinite] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
    <div className="absolute w-full h-full animate-[spin_20s_linear_infinite] bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.15)_0%,transparent_70%)]" />
  </div>
);

type Guest = {
  name: string;
  designation: string;
  organization: string;
  photo: string;
  about: string;
  logo?: string;
};

const GuestsCarousel = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });

  const swiperRef = useRef<SwiperType | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [centerIndex, setCenterIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const guests2024: Guest[] = [
    {
      name: "Vinayak Godse",
      designation: "Chief Executive Officer",
      organization: "Data Security Council of India",
      photo: imgA,
  logo: imgLogo,
      about:
        "Vinayak has over 20 years of experience in enterprise IT and has been instrumental in building scalable tech products.",
    },
    {
      name: "Dr. TR Reshmi",
      designation: "Professor & Head",
      organization: "Amrita University",
      photo: imgB,
  logo: imgLogo,
      about:
        "Dr. Reshmi is a leading academician in AI & cybersecurity with multiple research publications and awards.",
    },
    {
      name: "Vinod Senthil T",
      designation: "Senior Security Consultant",
      organization: "Infosys",
      photo: imgC,
  logo: imgLogo,
      about:
        "Vinod is a cybersecurity consultant specializing in cloud security, penetration testing, and compliance.",
    },
    {
      name: "Aravind Gnanabaskaran",
      designation: "Cybersecurity Expert",
      organization: "TCS",
      photo: imgD,
  logo: imgLogo,
      about:
        "Aravind is an expert in ethical hacking, with a decade of experience securing enterprise infrastructure.",
    },
    {
      name: "Priya Sharma",
      designation: "CISO",
      organization: "Wipro Technologies",
      photo: imgE,
  logo: imgLogo,
      about:
        "Priya is a global leader in cybersecurity strategy and governance, working with Fortune 500 clients.",
    },
    {
      name: "Karthik Krishnan",
      designation: "Security Architect",
      organization: "HCL Technologies",
      photo: "/guests/karthik.jpg",
  logo: imgLogo,
      about:
        "Karthik designs enterprise-level security architectures for mission-critical infrastructure projects.",
    },
  ];

  const handleCardOpen = (index: number) => {
    setExpandedIndex(index);
    swiperRef.current?.autoplay?.stop();
  };

  const handleCardClose = () => {
    setExpandedIndex(null);
    swiperRef.current?.autoplay?.start();
  };

  return (
    <section
      className="relative py-24 overflow-hidden bg-white"
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
  <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black font-roboto text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-500 to-purple-400 drop-shadow-xl mb-4">
          Distinguished Guests 2025
        </h2>
        <p className="body-text text-gray-300 max-w-2xl mx-auto">
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
        onSlideChange={(swiper) => {
          setCenterIndex(swiper.realIndex);
          if (expandedIndex !== null && expandedIndex !== swiper.realIndex) {
            setExpandedIndex(null);
          }
        }}
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
        {guests2024.map((guest, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <SwiperSlide key={index} className="flex justify-center py-12">
              <motion.div
                className={[
                  "group relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden",
                  "w-[380px] md:w-[500px] text-center cursor-pointer will-change-transform shadow-[0_0_60px_rgba(255,255,255,0.12)]",
                ].join(" ")}
                whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                onMouseEnter={() => handleCardOpen(index)}
                onMouseLeave={() => handleCardClose()}
                onClick={() => (isExpanded ? handleCardClose() : handleCardOpen(index))}
              >
                {/* Photo */}
                <div className="h-[320px] md:h-[400px] relative">
                  <img
                    src={guest.photo}
                    alt={guest.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Bottom Info (Name + Profession + Company/Logo) */}
                <AnimatePresence>
                  {!isExpanded && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 24 }}
                      transition={{ duration: 0.35 }}
                      className="absolute bottom-0 left-0 right-0 px-4 pb-4"
                    >
                      <div
                        className="
                          mx-auto w-full rounded-2xl border border-white/15
                          bg-white/10 backdrop-blur-md
                          px-4 py-3
                          text-center
                        "
                      >
                        {/* Name (single line, centered) */}
                        <h3 className="truncate font-semibold font-roboto text-[15px] md:text-base text-white leading-tight">
                          {guest.name}
                        </h3>

                        {/* Profession (single line, centered) */}
                        <p className="truncate text-xs md:text-sm text-gray-200/90 leading-snug mt-0.5">
                          {guest.designation}
                        </p>

                        {/* Company + logo (one line, centered) */}
                        <div className="mt-1.5 flex items-center justify-center gap-2 min-w-0">
                          {guest.logo ? (
                            <img
                              src={guest.logo}
                              alt={`${guest.organization} logo`}
                              className="h-8 w-8 object-contain rounded-sm bg-white/70"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-4 w-4 rounded-sm bg-white/60" aria-hidden />
                          )}
                          <span className="truncate text-xs md:text-sm text-gray-100/90">
                            {guest.organization}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expanded About Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.4 }}
                      className="
                        absolute bottom-0 left-0 right-0 max-h-44 overflow-y-auto
                        px-5 py-4
                        bg-black/60 backdrop-blur-md border-t border-white/20
                        text-center
                      "
                    >
                      <p className="text-[13px] leading-relaxed text-gray-100">
                        {guest.about}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default GuestsCarousel;
