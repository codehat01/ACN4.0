import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Calendar,
  Clock,
  Users,
  ArrowUp,
  ExternalLink,
  Copy,
} from "lucide-react";


import COVERURL from '../images/Welcome.png';

// --- NOTES -------------------------------------------------------------
// • Updated with proper Google Maps Embed
// • maps.png acts as a fallback image while iframe loads
// • Fully responsive, works on mobile and desktop
// ----------------------------------------------------------------------

const FOOTER_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Gallery", href: "#gallery" },
  { name: "Contact", href: "#contact" },
];

const SOCIALS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const VENUE = {
  title: "Amrita Vishwa Vidyapeetham",
  subtitle: "Chennai Campus",
  address: [
    "Amrita Vishwa Vidyapeetham",
    "Vengal Village, Chennai - 601103",
    "Tamil Nadu, India",
  ],
  mapUrl: "https://maps.app.goo.gl/Jti2HcuEjwC52BYL9",
  coverSrc: COVERURL, // banner image
  mapImgSrc: "/src/images/maps.png",   // static fallback map
  event: {
    name: "ACN 4th Edition",
    dateRange: "16–20 Sep 2025",
    time: "9:00 AM – 6:00 PM",
    expected: "1000+ Participants",
  },
};

// Proper Google Maps Embed URL (lat/long of venue)
const embedSrc =
  "https://maps.google.com/maps?&q=13.2629694,80.0274183&z=17&output=embed";

function scrollToHash(href) {
  if (!href?.startsWith("#")) return;
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative text-white selection:bg-white/20"
      aria-labelledby="site-footer-heading"
    >
      <h2 id="site-footer-heading" className="sr-only">
        Site Footer
      </h2>

      {/* Decorative gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-900 via-gray-900 to-black" />

      {/* Soft grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Top border wave */}
      <div aria-hidden="true" className="absolute -top-6 left-0 right-0 -z-10">
        <svg
          viewBox="0 0 1440 80"
          className="h-8 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,64 480,0 720,16 C960,32 1200,96 1440,64 L1440,0 L0,0 Z"
            className="fill-gray-900"
          />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile: flex-col-reverse (Contact on top, Venue below)
            Desktop: grid 2 cols (Venue left, Contact right) */}
        <div className="flex flex-col-reverse gap-10 lg:grid lg:grid-cols-2">
          {/* Left: Venue Card (Map on top, then collage image) */}
          <motion.section
            {...fadeUp}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl"
          >
            {/* MAP FIRST */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 m-6 mt-6">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm">Campus Map</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={VENUE.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium font-roboto text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                  >
                    Open in Maps <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const text = [...VENUE.address].join(", ");
                      if (navigator?.clipboard?.writeText) {
                        navigator.clipboard.writeText(text);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium font-roboto text-gray-200 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                    aria-label="Copy venue address"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </button>
                </div>
              </div>
              <div className="relative h-40 sm:h-48 md:h-56">
                {/* Fallback image */}
                <img
                  src={VENUE.mapImgSrc}
                  alt="Static map preview"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                {/* Google Maps Embed */}
                <iframe
                  title="Amrita Vishwa Vidyapeetham, Chennai — Google Maps"
                  src={embedSrc}
                  className="relative h-full w-full border-0 filter grayscale-[20%] contrast-105"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="pointer-events-none absolute inset-0 rounded-b-xl ring-1 ring-inset ring-white/10" />
              </div>
            </div>

            {/* COLLAGE / BANNER IMAGE BELOW MAP */}
            <div className="relative overflow-hidden rounded-2xl mx-6 mb-6">
              <img
                src={VENUE.coverSrc}
                alt={`${VENUE.title} campus`}
                className="h-56 w-full object-cover sm:h-64"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
               
              </div>
            </div>

            {/* Venue Details */}
            <div className="p-6">
              <ul className="grid gap-3 text-gray-200/90">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-emerald-300 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-white">{VENUE.address[0]}</p>
                    <p>{VENUE.address[1]}</p>
                    <p>{VENUE.address[2]}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                  <span className="text-sm">{VENUE.event.dateRange}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                  <span className="text-sm">{VENUE.event.time}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                  <span className="text-sm">Expected {VENUE.event.expected}</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Right: Brand + Contact */}
          <motion.section
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="mb-6 flex items-center gap-3">

              <div>
                <h3 className="text-2xl font-bold font-roboto leading-tight">
                  Amrita CyberNation
                </h3>
                <p className="text-sm text-emerald-300/95">4th Edition</p>
              </div>
            </div>

            <p className="mb-8 max-w-prose text-gray-300/95">
              Empowering the next generation of cybersecurity professionals
              through cutting-edge education, industry partnerships, and hands-on
              learning experiences.
            </p>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold font-roboto mb-4 tracking-wide text-emerald-300">
                Contact
              </h4>
              <div className="grid gap-3 text-sm text-gray-300">
                <a
                  href="mailto:info@amritacybernation.com"
                  className="inline-flex items-center gap-3 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  <Mail className="h-4 w-4 text-emerald-300" />
                  info@amritacybernation.com
                </a>
                <a
                  href="tel:+914427479999"
                  className="inline-flex items-center gap-3 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  <Phone className="h-4 w-4 text-emerald-300" />
                  +91 44 2747 9999
                </a>
                <div className="mt-4 flex items-center gap-4">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 transition hover:translate-y-[-2px] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                    >
                      <s.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Bottom bar */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 border-t border-white/10 pt-6"
        >
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-gray-400 md:flex-row">
            <p>© {year} Amrita CyberNation. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-5">
              <a href="#privacy" className="transition hover:text-white">
                Privacy Policy
              </a>
              <a href="#terms" className="transition hover:text-white">
                Terms of Service
              </a>
              <a href="#conduct" className="transition hover:text-white">
                Code of Conduct
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to top */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/10 backdrop-blur text-white shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      </div>
    </footer>
  );
}