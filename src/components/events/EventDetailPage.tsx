import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Clock, FileText, CheckCircle, Share2, Heart, Star, MessageCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'
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
  const [registrationCount, setRegistrationCount] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
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
        .from('eventsregistrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_email', user.email)
        .limit(1)

      if (error) throw error
      setIsRegistered(data && data.length > 0)
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

  const handlePayment = async () => {
    if (!user || !eventId || !event) return
    setIsProcessing(true)
    // Navigate to Payment Page with context
    navigate(`/pay/${eventId}` , { state: { eventTitle: event.title, amount: event.price ?? 0 } })
    setTimeout(() => setIsProcessing(false), 200)
  }

  const handleRegister = async () => {
    if (!user) {
      addToast({
        type: 'warning',
        title: 'Login Required',
        message: 'Please sign in before registering for events',
        duration: 4000
      })
      return
    }

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

    // If already registered, let them unregister using existing logic; otherwise go to payment
    if (isRegistered) {
      try {
        setRegistering(true)
        const { error } = await supabase
          .from('eventsregistrations')
          .delete()
          .eq('event_id', eventId)
          .eq('user_email', user.email)

        if (error) throw error

        setIsRegistered(false)
        addToast({
          type: 'success',
          title: 'Unregistered',
          message: 'You have been unregistered from this event'
        })
      } catch (error) {
        console.error('Error unregistering:', error)
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to unregister from event'
        })
      } finally {
        setRegistering(false)
      }
    } else {
      await handlePayment()
    }
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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
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
            <div className="w-full h-full min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
              <Calendar className="w-32 h-32 text-blue-200 dark:text-gray-700" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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
                <div className="flex items-center space-x-1 text-sm bg-black/20 px-2 py-1 rounded-full">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white">{registrationCount} registered</span>
                </div>
                <div className="flex items-center space-x-1 bg-black/20 px-2 py-1 rounded-full">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  ))}
                  <span className="text-sm ml-1 text-white">4.8</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Event Content */}
        <div className="bg-white dark:bg-gray-900 min-h-screen overflow-y-auto lg:overflow-visible">
          <div className="p-8 lg:p-12">

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Registration Button */}
              <div className="mb-8">
                <button
                  onClick={handleRegister}
                  disabled={registering || isProcessing}
                  className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                    isRegistered
                      ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                      : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                  } ${(registering || isProcessing) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {registering || isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span>Processing...</span>
                    </>
                  ) : isRegistered ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Registered - Click to Unregister</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      <span>Pay & Register {event.price ? `(₹${event.price})` : ''}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mb-8 bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span>About This Event</span>
                </h2>
                <div className={`overflow-hidden transition-all duration-300 ${showFullDescription ? 'max-h-[1000px]' : 'max-h-32'}`}>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
                {event.description && event.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:underline"
                  >
                    {showFullDescription ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        <span>Read more</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Rules */}
              {event.rules && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-200">
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
                    <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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

      {/* Razorpay script will be loaded here */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
    </div>
  )
}