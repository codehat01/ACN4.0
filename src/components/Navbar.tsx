import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  onClick: () => void;
  dropdown?: Array<{ name: string; path: string }>;
}

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

  const navigate = useNavigate();
  const isEditionsPage = window.location.pathname.includes('/editions');

  const navItems: NavItem[] = [
    { 
      name: 'Home', 
      path: '/',
      onClick: () => navigate('/')
    },
    { 
      name: 'Events 4.0', 
      path: '#events',
      onClick: () => {
        if (!isEditionsPage) {
          const element = document.querySelector('#events');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/#events');
        }
      },
      dropdown: [
        { name: 'Keynote Sessions', path: '/events#keynote' },
        { name: 'Technical Workshops', path: '/events#workshops' },
        { name: 'Panel Discussions', path: '/events#panels' },
        { name: 'Networking Events', path: '/events#networking' },
        { name: 'Certification Programs', path: '/events#certification' }
      ]
    },
    { 
      name: 'Editions', 
      path: '/editions',
      onClick: () => navigate('/editions'),
      dropdown: [
        { name: '2024', path: '/editions/2024' },
        { name: '2023', path: '/editions/2023' },
        { name: '2022', path: '/editions/2022' }
      ]
    },
    { 
      name: 'Sponsors', 
      path: '#sponsors',
      onClick: () => {
        if (!isEditionsPage) {
          const element = document.querySelector('#sponsors');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/#sponsors');
        }
      }
    },
    { 
      name: 'Gallery', 
      path: '#gallery',
      onClick: () => {
        if (!isEditionsPage) {
          const element = document.querySelector('#gallery');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/#gallery');
        }
      },
      dropdown: [
        { name: '2024 Gallery', path: '/gallery/2024' },
        { name: '2023 Gallery', path: '/gallery/2023' },
        { name: '2022 Gallery', path: '/gallery/2022' }
      ]
    },
    { 
      name: 'Team', 
      path: '#team',
      onClick: () => {
        if (!isEditionsPage) {
          const element = document.querySelector('#team');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/#team');
        }
      }
    }
  ];

  const handleNavigation = (item: NavItem | { name: string; path: string; onClick?: () => void }, isDropdownItem = false) => {
    if ('onClick' in item && item.onClick) {
      item.onClick();
    } else if (item.path) {
      if (item.path.startsWith('http')) {
        window.open(item.path, '_blank');
      } else {
        navigate(item.path);
      }
    }
    
    if (!isDropdownItem) {
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
      setActiveMobileDropdown(null);
    }
  };

  const toggleMobileDropdown = (itemName: string) => {
    setActiveMobileDropdown(prev => prev === itemName ? null : itemName);
  };

  // Type guard to check if an item has dropdown
  const hasDropdown = (item: NavItem): item is NavItem & { dropdown: Array<{ name: string; path: string }> } => {
    return Array.isArray(item.dropdown) && item.dropdown.length > 0;
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-custom-burgundy to-purple-600 z-50 origin-left"
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
                    isScrolled ? 'text-custom-burgundy' : 'text-white'
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
                    className="bg-gradient-to-r bg-custom-burgundy text-white px-4 py-1 rounded-full text-sm font-bold hover:from-purple-600 hover:to-custom-burgundy transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Register Now
                  </motion.button>
                  <span>|</span>
                  <span>ACN 4TH EDITION</span>
                  <span>|</span>
                  <motion.button
                    className="bg-gradient-to-r bg-custom-burgundy text-white px-4 py-1 rounded-full text-sm font-bold hover:from-purple-600 hover:to-custom-burgundy transition-all duration-300"
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
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.button
                    onClick={() => handleNavigation(item)}
                    className={`relative font-medium transition-all duration-300 px-4 py-2 rounded-full flex items-center space-x-1 ${
                      isScrolled
                        ? 'text-white hover:text-white hover:bg-custom-burgundy'
                        : 'text-white hover:text-white hover:bg-custom-burgundy'
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="whitespace-nowrap">{item.name}</span>
                    {hasDropdown(item) && (activeDropdown === item.name ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {hasDropdown(item) && activeDropdown === item.name && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.dropdown.map((subItem) => (
                          <motion.button
                            key={subItem.name}
                            onClick={() => handleNavigation(subItem, true)}
                            className="w-full text-left px-4 py-3 text-gray-300 hover:bg-custom-burgundy hover:text-white transition-colors duration-200 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 }}
                            whileHover={{ x: 5 }}
                          >
                            {subItem.name}
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
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => toggleMobileDropdown(item.name)}
                          className="w-full flex items-center justify-between py-3 px-4 hover:bg-gray-800"
                        >
                          <span className="whitespace-nowrap">{item.name}</span>
                          {activeMobileDropdown === item.name ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {activeMobileDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pl-6"
                            >
                              {item.dropdown.map((subItem) => (
                                <button
                                  key={subItem.name}
                                  onClick={() => handleNavigation(subItem, true)}
                                  className="w-full text-left py-2 px-4 text-sm hover:bg-gray-800"
                                >
                                  {subItem.name}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item)}
                        className="w-full text-left py-3 px-4 hover:bg-gray-800"
                      >
                        {item.name}
                      </button>
                    )}
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