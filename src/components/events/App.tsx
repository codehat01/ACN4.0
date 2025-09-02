import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDarkMode } from './hooks/useDarkMode'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import EventCard from './components/EventCard'
import EventDetailPage from './components/EventDetailPage'
import BottomNavigation from './components/BottomNavigation'
import ProfilePage from './components/ProfilePage'
import AdminPanel from './components/AdminPanel'
import { ToastContainer, useToast } from './components/Toast'
import LoginPrompt from './components/LoginPrompt'
import { useAuth } from './hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'
import Cart from './components/Cart'

interface Event {
  id: string
  title: string
  description: string
  tagline: string
  image_url: string | null
  rules: string | null
  schedule: string | null
  venue: string | null
  capacity: number | null
  price?: number
  registration_deadline: string | null
  contact_email: string | null
  contact_phone: string | null
  prerequisites: string | null
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:eventId" element={<EventDetailPage />} />
    </Routes>
  )
}

function HomePage() {
  const { isDark } = useDarkMode()
  const [activeSection, setActiveSection] = useState('home')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    const savedState = localStorage.getItem('authModalOpen');
    return savedState === 'true';
  })
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [eventFilter, setEventFilter] = useState<'all' | 'ctf' | 'workshop' | 'competition'>('all')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { toasts, addToast, removeToast } = useToast()
  const navigate = useNavigate()
  
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (user && !authLoading) {
      if (!sessionStorage.getItem('welcomeToastShown')) {
        addToast({
          type: 'success',
          title: 'Access Granted!',
          message: `Welcome to ACN TechFest 4.0, ${user.email}`,
          duration: 4000
        })
        sessionStorage.setItem('welcomeToastShown', 'true');
      }
    } else if (!user && !authLoading) {
      sessionStorage.removeItem('welcomeToastShown');
    }
  }, [user, authLoading])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')

      if (eventsError) throw eventsError
      setEvents(eventsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      addToast({
        type: 'error',
        title: 'Connection Failed',
        message: 'Unable to establish secure connection'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`)
  }

  useEffect(() => {
    localStorage.setItem('authModalOpen', String(isAuthModalOpen));
  }, [isAuthModalOpen]);

  const filteredEvents = events.filter(event => {
    if (eventFilter === 'all') return true
    if (eventFilter === 'ctf') {
      return event.title.toLowerCase().includes('ctf') || 
             event.description.toLowerCase().includes('capture the flag') ||
             event.tagline.toLowerCase().includes('ctf')
    }
    if (eventFilter === 'workshop') {
      return event.title.toLowerCase().includes('workshop') || 
             event.description.toLowerCase().includes('workshop')
    }
    if (eventFilter === 'competition') {
      return event.title.toLowerCase().includes('competition') || 
             event.description.toLowerCase().includes('hack') ||
             event.tagline.toLowerCase().includes('competition')
    }
    return true
  })

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-black to-red-900' 
        : 'bg-gradient-to-br from-red-50 via-white to-black-50'
    }`}>
      <Navbar 
        onAuthClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main className="pt-24 pb-24 md:pb-8">
        {/* Hero Section */}
        <section id="home" className="px-4 py-20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float ${
              isDark ? 'bg-red-500/20' : 'bg-red-200/20'
            }`}></div>
            <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float ${
              isDark ? 'bg-red-700/20' : 'bg-red-100/20'
            }`} style={{ animationDelay: '1s' }}></div>
            
            <div className={`absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent to-transparent animate-pulse opacity-20 ${
              isDark ? 'via-red-500/30' : 'via-red-400/30'
            }`}></div>
            <div className={`absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent to-transparent animate-pulse opacity-20 ${
              isDark ? 'via-red-700/30' : 'via-red-300/30'
            }`} style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 leading-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <span className={`font-mono ${isDark ? 'text-red-400' : 'text-red-600'}`}>[</span>ACN TechFest
                <span className="gradient-text typing-cursor"> 4.0</span><span className={`font-mono ${isDark ? 'text-red-400' : 'text-red-600'}`}> ]</span>
              </h1>
              <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-mono ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span className={isDark ? 'text-red-400' : 'text-red-600'}>root@acn:~#</span> <span className={isDark ? 'text-green-400' : 'text-red-600'}>./exploit</span> --target=<span className={isDark ? 'text-yellow-400' : 'text-orange-500'}>"cybersecurity_events"</span> --mode=<span className={isDark ? 'text-red-400' : 'text-red-500'}>interactive</span>
              </p>
              <div className={`max-w-2xl mx-auto mb-12 text-left rounded-lg border p-4 font-mono text-sm ${
                isDark 
                  ? 'bg-black text-green-400 border-red-500/30' 
                  : 'bg-gray-900 text-green-400 border-red-500/30'
              }`}>
                <div className="flex items-center mb-2">
                  <span className={isDark ? 'text-red-400' : 'text-red-500'}>●</span>
                  <span className="text-yellow-400 ml-1">●</span>
                  <span className="text-green-400 ml-1">●</span>
                  <span className="ml-3 text-gray-400 text-xs">acn-techfest.terminal</span>
                </div>
                <div><span className="text-green-400">hacker@acn-techfest:~$</span> <span className="text-white">sudo ./start_techfest.sh</span></div>
                <div className="text-green-400 text-sm mt-1">[+] Initializing cybersecurity challenges...</div>
                <div className="text-green-400 text-sm">[+] Loading exploit frameworks...</div>
                <div className="text-yellow-400 text-sm">[!] Ready for penetration testing!</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollToSection('events')}
                  className="px-6 py-2 rounded-xl font-mono font-medium bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  ./scan --events
                </button>
                <button
                  onClick={() => scrollToSection('events')}
                  className="px-6 py-2 rounded-xl font-mono font-medium bg-black text-red-400 border border-red-500/50 shadow-lg hover:bg-red-900 hover:text-white transition-all duration-200"
                >
                  nmap -sV events/
                </button>
              </div>
              
              {/* Scroll Indicator */}
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${
                  isDark ? 'border-white/60' : 'border-gray-600/60'
                }`}>
                  <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className={`w-1 h-3 rounded-full mt-2 ${
                      isDark ? 'bg-white' : 'bg-gray-600'
                    }`}
                  />
                </div>
                <p className={`text-xs mt-2 ${
                  isDark ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Scroll to explore
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="px-4 py-20 bg-gradient-to-r from-red-900/20 to-black/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="font-mono text-red-400">function</span> launchCyberAttacks() <span className="font-mono text-gray-500">{'{'}</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto font-mono">
                <span className="text-gray-500">//</span> Penetrate. Exploit. Defend. Conquer the digital battlefield.
              </p>
            </motion.div>

            {/* Event Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-black/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-red-500/50">
                {[
                  { id: 'all', label: 'All Events' },
                  { id: 'ctf', label: 'CTF Challenges' },
                  { id: 'workshop', label: 'Workshops' },
                  { id: 'competition', label: 'Competitions' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setEventFilter(tab.id as any)}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                      eventFilter === tab.id
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg font-mono'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800 font-mono'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card overflow-hidden animate-pulse">
                    <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg w-3/4 mb-4"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <EventCard
                      event={event}
                      onClick={handleEventClick}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNavigation
        activeSection={activeSection}
        onSectionChange={scrollToSection}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        isAuthenticated={!!user}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProfilePage
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefresh={fetchData}
      />

      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false)
          setIsAuthModalOpen(true)
        }}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App