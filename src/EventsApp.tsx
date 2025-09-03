import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/events/EventsNavbar'
import AuthModal from './components/events/AuthModal'
import EventCard from './components/events/EventCard'
import EventDetailPage from './components/events/EventDetailPage'
import BottomNavigation from './components/events/BottomNavigation'
import ProfilePage from './components/events/ProfilePage'
import AdminDashboard from './components/events/admin/AdminDashboard'
import { ToastContainer, useToast } from './components/events/Toast'
import LoginPrompt from './components/events/LoginPrompt'
import { useAuth } from './hooks/useAuth'
import { supabase } from './lib/supabase'
import PaymentPage from './components/events/PaymentPage'

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
  price: number | null
  registration_deadline: string | null
  contact_email: string | null
  contact_phone: string | null
  prerequisites: string | null
}

function EventsApp() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:eventId" element={<EventDetailPage />} />
      <Route path="/pay/:eventId" element={<PaymentPage />} />
    </Routes>
  )
}

function HomePage() {
  const [activeSection, setActiveSection] = useState('home')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('authModalOpen');
    return savedState === 'true';
  })
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [eventFilter, setEventFilter] = useState<'all' | 'technical' | 'non-technical'>('all')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { toasts, addToast, removeToast } = useToast()
  const navigate = useNavigate()
  
  const { user, loading: authLoading } = useAuth()

  // Show welcome toast when user logs in
  useEffect(() => {
    if (user && !authLoading) {
      // Only show welcome toast if not already shown in this session
      if (!sessionStorage.getItem('welcomeToastShown')) {
        addToast({
          type: 'success',
          title: 'Welcome back!',
          message: `Welcome to ACN TechFest 4.0, ${user.email}`,
          duration: 4000
        })
        sessionStorage.setItem('welcomeToastShown', 'true');
      }
    } else if (!user && !authLoading) {
      // Reset flag on logout
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

  // Update localStorage when auth modal state changes
  useEffect(() => {
    localStorage.setItem('authModalOpen', String(isAuthModalOpen));
  }, [isAuthModalOpen]);

  const filteredEvents = events.filter(event => {
    if (eventFilter === 'all') return true
    if (eventFilter === 'technical') {
      return event.title.toLowerCase().includes('tech') || 
             event.description.toLowerCase().includes('tech') ||
             event.tagline.toLowerCase().includes('tech')
    }
    if (eventFilter === 'non-technical') {
      return !event.title.toLowerCase().includes('tech') && 
             !event.description.toLowerCase().includes('tech') &&
             !event.tagline.toLowerCase().includes('tech')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar 
        onAuthClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
      />
      
      <main className="pt-24 pb-24 md:pb-8">
        {/* Hero Section */}
        <section id="home" className="px-4 py-20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden tech-grid opacity-10">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float neon-glow"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float neon-glow" style={{ animationDelay: '1s' }}></div>
            
            {/* Matrix-style falling code effect */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-matrix-rain opacity-20"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-secondary/30 to-transparent animate-matrix-rain opacity-20" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="font-mono">&lt;</span>ACN
                <span className="gradient-text typing-cursor"> TECHFEST 4.0</span><span className="font-mono"> /&gt;</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-mono">
                <span className="text-primary">const</span> experience = <span className="text-green-400">await</span> connectWith(<span className="text-yellow-400">'events'</span>, <span className="text-yellow-400">'community'</span>);
              </p>
              <div className="terminal-effect max-w-2xl mx-auto mb-12 text-left">
                <div className="flex items-center mb-2"><span className="text-red-400">●</span><span className="text-yellow-400 ml-1">●</span><span className="text-green-400 ml-1">●</span><span className="ml-3 text-gray-400 text-xs">campus-events.terminal</span></div>
                <div><span className="text-green-400">user@campus:~$</span> <span className="text-white">npm start campus-life</span></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => scrollToSection('events')}
                  className="btn-primary font-mono"
                >
                  ./explore --events
                </button>
                <button
                  onClick={() => scrollToSection('events')}
                  className="btn-secondary font-mono"
                >
                  ls ./events/
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="px-4 py-20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="font-mono text-primary">async function</span> getUpcomingEvents() <span className="font-mono text-gray-500">{'{'}</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-mono">
                <span className="text-gray-500">//</span> Join exciting events happening around campus
              </p>
            </motion.div>

            {/* Event Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-700/50 neon-glow">
                {[
                  { id: 'all', label: 'All Events' },
                  { id: 'technical', label: 'Technical' },
                  { id: 'non-technical', label: 'Non-Technical' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setEventFilter(tab.id as any)}
                    className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                      eventFilter === tab.id
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg neon-glow font-mono'
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
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4 mb-4"></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-1/2"></div>
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

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation
        activeSection={activeSection}
        onSectionChange={scrollToSection}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        isAuthenticated={!!user}
      />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProfilePage
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        onLogin={() => {
          setShowLoginPrompt(false)
          setIsAuthModalOpen(true)
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default EventsApp