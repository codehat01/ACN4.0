import { useState, useEffect } from 'react'
import { X, Calendar, MapPin, Users, Clock, FileText, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../../../lib/supabaseClient'

interface Event {
  id: string
  title: string
  description: string
  tagline: string
  image_url: string | null
  rules: string | null
  schedule: string | null
  venue: string | null
  club?: {
    name: string
    logo_url: string | null
  }
}

interface EventDetailProps {
  eventId: string | null
  onClose: () => void
}

export default function EventDetail({ eventId, onClose }: EventDetailProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (eventId) {
      fetchEvent()
      if (user) {
        checkRegistration()
      }
    }
  }, [eventId, user])

  const fetchEvent = async () => {
    if (!eventId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          club:clubs(name, logo_url)
        `)
        .eq('id', eventId)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
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

  const handleRegister = async () => {
    if (!user || !eventId) return

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
      } else {
        // Register
        const { error } = await supabase
          .from('registrations')
          .insert({
            event_id: eventId,
            user_id: user.id,
          })

        if (error) throw error
        setIsRegistered(true)
      }
    } catch (error) {
      console.error('Error with registration:', error)
    } finally {
      setRegistering(false)
    }
  }

  if (!eventId) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
            </div>
          ) : event ? (
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Header Image */}
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative">
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-primary/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <div className="p-6">
                {/* Event Header */}
                <div className="mb-6">
                  {event.club && (
                    <div className="flex items-center space-x-3 mb-3">
                      {event.club.logo_url ? (
                        <img
                          src={event.club.logo_url}
                          alt={event.club.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-xs font-bold">
                            {event.club.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-primary font-medium text-sm">{event.club.name}</span>
                    </div>
                  )}
                  
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{event.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{event.tagline}</p>
                </div>

                {/* Event Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {event.schedule && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Schedule</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{event.schedule}</p>
                      </div>
                    </div>
                  )}
                  
                  {event.venue && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Venue</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{event.venue}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration Button */}
                {user && (
                  <div className="mb-6">
                    <button
                      onClick={handleRegister}
                      disabled={registering}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                        isRegistered
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'btn-primary'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {registering ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                      ) : isRegistered ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Registered - Click to Unregister</span>
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5" />
                          <span>Register for Event</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Description</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {/* Rules */}
                {event.rules && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Rules & Guidelines</span>
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {event.rules}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Event not found</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}