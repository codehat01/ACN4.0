import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Calendar, Clock, Users } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - College Image and Event Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* College Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="src/images/Welcome.png"
                alt="Amrita Vishwa Vidyapeetham Campus"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-xl font-bold mb-1">Amrita Vishwa Vidyapeetham</h3>
                <p className="text-white/90 text-sm">Chennai Campus</p>
              </div>
            </div>

            {/* Event Location & Details */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Event Venue</h4>
                  <p className="text-accent text-sm">ACN 4rd Edition</p>
                </div>
              </div>

              {/* Google Maps Image & Link */}
              <div className="mb-4">
                <a
                  href="https://maps.app.goo.gl/Jti2HcuEjwC52BYL9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <img
                    src="src/images/maps.png"
                    alt="Google Maps Location"
                    className="w-full h-32 object-cover"
                  />
                </a>
              </div>

              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white">Amrita Vishwa Vidyapeetham</p>
                    <p className="text-sm">Vengal Village, Chennai - 601103</p>
                    <p className="text-sm">Tamil Nadu, India</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="text-sm">16/09/2025 to 20/08/2025</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-sm">9:00 AM - 6:00 PM</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-accent" />
                  <span className="text-sm">Expected 1000+ Participants</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Footer Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Brand Section */}
            <div>
              <motion.div
                className="flex items-center space-x-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Amrita CyberNation</h3>
                  <p className="text-accent font-semibold">3rd Edition</p>
                </div>
              </motion.div>
              
              <motion.p
                className="text-gray-300 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Empowering the next generation of cybersecurity professionals through 
                cutting-edge education, industry partnerships, and hands-on learning experiences.
              </motion.p>
            </div>

            {/* Quick Links & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-lg font-semibold mb-4 text-accent">Quick Links</h4>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <motion.button
                        onClick={() => scrollToSection(link.href)}
                        className="text-gray-300 hover:text-accent transition-colors duration-300 text-sm flex items-center space-x-2 group"
                        whileHover={{ x: 5 }}
                      >
                        <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span>{link.name}</span>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h4 className="text-lg font-semibold mb-4 text-accent">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-gray-300 text-sm">info@amritacybernation.com</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-gray-300 text-sm">+91 44 2747 9999</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Social Media & Newsletter */}
            <div className="space-y-6">
              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h4 className="text-lg font-semibold mb-4 text-accent">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 bg-white/10 hover:bg-accent rounded-xl flex items-center justify-center transition-all duration-300 group"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-white group-hover:text-gray-900 transition-colors duration-300" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h4 className="text-lg font-semibold mb-4 text-accent">Stay Updated</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400 text-sm backdrop-blur-sm"
                  />
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-gray-900 rounded-r-xl font-semibold hover:from-accent/90 hover:to-accent/70 transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 mt-12 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Amrita CyberNation. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <motion.span 
                className="text-gray-400 hover:text-accent transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.span>
              <motion.span 
                className="text-gray-400 hover:text-accent transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.span>
              <motion.span 
                className="text-gray-400 hover:text-accent transition-colors duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Code of Conduct
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;