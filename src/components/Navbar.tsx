import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { 
      name: 'Events 3.0', 
      href: '#events',
      dropdown: [
        'Keynote Sessions',
        'Technical Workshops',
        'Panel Discussions',
        'Networking Events',
        'Certification Programs'
      ]
    },
    { 
      name: 'Editions', 
      href: '#editions',
      dropdown: ['2022', '2023']
    },
    { name: 'Sponsors', href: '#sponsors' },
    { 
      name: 'Gallery', 
      href: '#gallery',
      dropdown: ['2022 Gallery', '2023 Gallery', '2024 Gallery']
    },
    { name: 'Team', href: '#team' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveMobileDropdown(null);
  };

  const toggleMobileDropdown = (itemName: string) => {
    setActiveMobileDropdown(prev => prev === itemName ? null : itemName);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 z-50 origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1 }}
      />

      <motion.nav
        className={`fixed z-40 transition-all duration-1000 ease-in-out ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-md shadow-2xl rounded-[70px] mx-auto mt-5'
            : 'bg-transparent'
        }`}
        style={{
          top: 0,
          left: isScrolled ? '5%' : '0%',
          right: isScrolled ? '5%' : '0%',
          width: isScrolled ? '90%' : '100%',
          height: isScrolled ? '72px' : '80px'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <motion.div
                  className={`text-3xl font-bold transition-colors duration-300 ${
                    isScrolled ? 'text-blue-400' : 'text-white'
                  }`}
                  style={{ height: '75px', display: 'flex', alignItems: 'center' }}
                >
                  ACN
                </motion.div>
              </div>
            </motion.div>

            {/* Moving Text Ticker - Center */}
            <div className="hidden lg:flex flex-1 justify-center mx-8">
              <div className="relative overflow-hidden max-w-md">
                <motion.div
                  className="flex items-center space-x-8 text-white font-semibold whitespace-nowrap"
                  animate={{
                    x: [300, -300]
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: 'loop',
                      duration: 10,
                      ease: 'linear'
                    }
                  }}
                >
                  <span>ACN 4TH EDITION</span>
                  <span>|</span>
                  <motion.button
                    className="bg-[#b22049] text-white px-4 py-1 rounded-full text-sm font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register Now
                  </motion.button>
                  <span>|</span>
                  <span>ACN 4TH EDITION</span>
                  <span>|</span>
                  <motion.button
                    className="bg-[#b22049] text-white px-4 py-1 rounded-full text-sm font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register Now
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.button
                    onClick={() => scrollToSection(item.href)}
                    className={`relative font-medium transition-all duration-300 px-4 py-2 rounded-full flex items-center space-x-1 ${
                      isScrolled
                        ? 'text-white hover:text-white hover:bg-blue-600'
                        : 'text-white hover:text-white hover:bg-blue-600'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown className="w-4 h-4" />}
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.dropdown && activeDropdown === item.name && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.dropdown.map((subItem, subIndex) => (
                          <motion.button
                            key={subItem}
                            className="w-full text-left px-4 py-3 text-gray-300 hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            {subItem}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? 'text-white hover:bg-gray-800'
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md shadow-lg border-t border-gray-700 rounded-b-3xl mx-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between">
                      <motion.button
                        onClick={() => scrollToSection(item.href)}
                        className="flex-1 text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-blue-600 rounded-lg transition-colors duration-300 font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item.name}
                      </motion.button>
                      
                      {/* Mobile Dropdown Toggle */}
                      {item.dropdown && (
                        <motion.button
                          onClick={() => toggleMobileDropdown(item.name)}
                          className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-300"
                          whileTap={{ scale: 0.95 }}
                        >
                          <AnimatePresence mode="wait">
                            {activeMobileDropdown === item.name ? (
                              <motion.div
                                key="up"
                                initial={{ rotate: -180 }}
                                animate={{ rotate: 0 }}
                                exit={{ rotate: 180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="down"
                                initial={{ rotate: 180 }}
                                animate={{ rotate: 0 }}
                                exit={{ rotate: -180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      )}
                    </div>
                    
                    {/* Mobile Dropdown Content */}
                    <AnimatePresence>
                      {item.dropdown && activeMobileDropdown === item.name && (
                        <motion.div
                          className="ml-4 mt-2 space-y-1 overflow-hidden"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.dropdown.map((subItem, subIndex) => (
                            <motion.button
                              key={subItem}
                              className="block w-full text-left py-2 px-4 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIndex * 0.05 }}
                            >
                              {subItem}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;