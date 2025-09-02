import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Clock, FileText, CheckCircle, Download, Share2, Heart, Star, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../../../lib/supabaseClient'
import { useToast } from './Toast'

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
  created_at: string
}

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [showPaymentQR, setShowPaymentQR] = useState(false)
  const [paymentQR, setPaymentQR] = useState('')
  const [registrationCount, setRegistrationCount] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()
  
  const checkProfileComplete = async () => {
    if (!user) return false
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error || !profile) return false
      
      return profile.name && profile.phone && profile.rollno && profile.branch
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    if (eventId) {
      fetchEvent()
      if (user) {
        checkRegistration()
        checkFavorite()
      }
      fetchRegistrationCount()
    }
  }, [eventId, user])

  const fetchEvent = async () => {
    if (!eventId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          tagline,
          image_url,
          rules,
          schedule,
          venue,
          capacity,
          price,
          registration_deadline,
          contact_email,
          contact_phone,
          prerequisites,
          created_at
        `)
        .eq('id', eventId)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load event details'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRegistrationCount = async () => {
    if (!eventId) return

    try {
      const { count, error } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)

      if (error) throw error
      setRegistrationCount(count || 0)
    } catch (error) {
      console.error('Error fetching registration count:', error)
    }
  }

  const checkFavorite = async () => {
    if (!eventId || !user) return

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setIsFavorite(!!data)
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const checkRegistration = async () => {
    if (!eventId || !user) return

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      setIsRegistered(!!data)
    } catch (error) {
      console.error('Error checking registration:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!user || !eventId) {
      addToast({
        type: 'warning',
        title: 'Login Required',
        message: 'Please sign in to add favorites'
      })
      return
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id)

        if (error) throw error
        setIsFavorite(false)
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            event_id: eventId,
            user_id: user.id,
          })

        if (error) throw error
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const shareEvent = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.tagline,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: 'Event link copied to clipboard'
    })
  }

  const generatePaymentQR = async () => {
    if (!event) return

    // Generate UPI payment URL (example with dummy UPI ID)
    const upiId = 'campusevents@upi'
    const amount = '100' // Example amount
    const upiUrl = `upi://pay?pa=${upiId}&pn=Campus Events&am=${amount}&cu=INR&tn=Payment for ${event.title}`
    
    try {
      const qrDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setPaymentQR(qrDataUrl)
      setShowPaymentQR(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to generate payment QR code'
      })
    }
  }

  const handleRegister = async () => {
    // Check if user is logged in
    if (!user) {
      addToast({
        type: 'warning',
        title: 'Login Required',
        message: 'Please sign in before registering for events',
        duration: 4000
      })
      return
    }

    // Check if profile is complete
    const isProfileComplete = await checkProfileComplete()
    if (!isProfileComplete) {
      addToast({
        type: 'warning',
        title: 'Profile Incomplete',
        message: 'Please complete your profile (Name, Phone, Roll No, Branch) before registering',
        duration: 5000
      })
      return
    }

    setRegistering(true)
    try {
      if (isRegistered) {
        // Unregister
        const { error } = await supabase
          .from('registrations')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id)

        if (error) throw error
        setIsRegistered(false)
        addToast({
          type: 'success',
          title: 'Unregistered',
          message: 'You have been unregistered from this event'
        })
      } else {
        // Show payment QR first
        await generatePaymentQR()
      }
    } catch (error) {
      console.error('Error with registration:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to process registration'
      })
    } finally {
      setRegistering(false)
    }
  }

  const confirmPayment = async () => {
    if (!user || !eventId) return

    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
        })

      if (error) throw error
      setIsRegistered(true)
      setShowPaymentQR(false)
      addToast({
        type: 'success',
        title: 'Registration Successful!',
        message: 'You have been registered for this event'
      })
    } catch (error) {
      console.error('Error confirming registration:', error)
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to confirm registration'
      })
    }
  }

  const downloadQR = () => {
    if (!paymentQR) return
    
    const link = document.createElement('a')
    link.download = `${event?.title.replace(/\s+/g, '_')}_Payment_QR.png`
    link.href = paymentQR
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Not Found</h1>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Column - Event Image */}
        <div className="relative overflow-hidden">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full min-h-screen object-cover"
            />
          ) : (
            <div className="w-full h-full min-h-screen bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Calendar className="w-32 h-32 text-primary/50" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          
          {/* Back Button - Top Left */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg z-10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Action Buttons - Top Right */}
          <div className="absolute top-6 right-6 flex space-x-2 z-10">
            <button
              onClick={toggleFavorite}
              className={`p-3 backdrop-blur-sm rounded-full transition-colors shadow-lg ${
                isFavorite 
                  ? 'bg-red-500/90 text-white hover:bg-red-600/90' 
                  : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={shareEvent}
              className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Event Title Overlay - Bottom */}
          <div className="absolute bottom-8 left-6 right-6 text-white z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-sm bg-black/30 rounded-2xl p-6"
            >
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-white/90 text-lg">{event.tagline}</p>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-1 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{registrationCount} registered</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm ml-1">4.8</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Event Content */}
        <div className="bg-white dark:bg-gray-900 min-h-screen overflow-y-auto lg:overflow-visible event-content-scroll">
          <div className="p-8 lg:p-12">
            {/* Mobile scroll indicator */}
            <div className="lg:hidden flex justify-center mb-4">
              <motion.button
                onClick={() => {
                  const rightColumn = document.querySelector('.event-content-scroll')
                  if (rightColumn) {
                    rightColumn.scrollTo({ top: 200, behavior: 'smooth' })
                  }
                }}
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-12 border-2 border-primary/60 dark:border-primary/40 rounded-full flex justify-center items-start pt-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-primary transition-all duration-300 active:scale-95"
              >
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="w-1.5 h-4 bg-primary rounded-full"
                />
              </motion.button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Registration Button */}
              <div className="mb-8">
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                    isRegistered
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      : 'btn-primary'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {registering ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                  ) : isRegistered ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Registered - Click to Unregister</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-6 h-6" />
                      <span>Register for Event {event.price ? `(₹${event.price})` : ''}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className="w-6 h-6" />
                  <span>About This Event</span>
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Rules */}
              {event.rules && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Clock className="w-6 h-6" />
                    <span>Rules & Guidelines</span>
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {event.rules}
                    </p>
                  </div>
                </div>
              )}

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {event.schedule && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Calendar className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Schedule</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{event.schedule}</p>
                    </div>
                  </div>
                )}
                
                {event.venue && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Venue</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{event.venue}</p>
                    </div>
                  </div>
                )}
                
                {event.price && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-6 h-6 text-primary font-bold text-lg">₹</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Price</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">₹{event.price}</p>
                    </div>
                  </div>
                )}
                
                {event.registration_deadline && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Clock className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Deadline</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{new Date(event.registration_deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                
                {(event.contact_email || event.contact_phone) && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl sm:col-span-2">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">Contact</p>
                      <div className="space-y-1">
                        {event.contact_email && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{event.contact_email}</p>
                        )}
                        {event.contact_phone && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{event.contact_phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl sm:col-span-2">
                    <Users className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">Capacity</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((registrationCount / event.capacity) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {registrationCount} / {event.capacity}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Prerequisites */}
              {event.prerequisites && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-6 h-6" />
                    <span>Prerequisites</span>
                  </h2>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {event.prerequisites}
                    </p>
                  </div>
                </div>
              )}

              {/* Related Events */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Events</h2>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Related events will appear here</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment QR Modal */}
      {showPaymentQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPaymentQR(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Complete Payment</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Scan the QR code below to pay ₹100 for event registration
            </p>
            
            <div className="bg-white p-4 rounded-xl shadow-inner mb-6 inline-block">
              <img src={paymentQR} alt="Payment QR Code" className="w-48 h-48" />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={downloadQR}
                className="flex-1 btn-secondary flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download QR</span>
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 btn-primary"
              >
                Payment Done
              </button>
            </div>
            
            <button
              onClick={() => setShowPaymentQR(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}