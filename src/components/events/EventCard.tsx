import { Calendar, MapPin, Users, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from './Toast'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

interface Event {
  id: string
  title: string
  tagline: string
  image_url: string | null
  venue: string | null
  schedule: string | null
    price?: number | null
}

interface EventCardProps {
  event: Event
  onClick?: (eventId: string) => void
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  
  
  // Check registration status on component mount
  useEffect(() => {
    if (user && event.id) {
      checkRegistration()
    } else {
      setIsRegistered(false)
    }
  }, [user, event.id])

  const checkRegistration = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('id')
        .eq('event_id', event.id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) throw error
      setIsRegistered(!!data)
    } catch (error) {
      console.error('Error checking registration:', error)
    }
  }

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

  const handleRegister = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
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

    // Navigate to payment page flow with context
    setIsRegistering(true)
    navigate(`/pay/${event.id}`, {
      state: { eventTitle: event.title, amount: event.price ?? 0 },
    })
    setTimeout(() => setIsRegistering(false), 200)
  }

  return (
    <motion.div
      className="tech-card cursor-pointer group overflow-hidden"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative h-48 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Users className="h-16 w-16 text-white opacity-50" />
          </div>
        )}
        {isRegistered && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Registered
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {event.tagline}
        </p>

        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          {event.venue && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.venue}</span>
            </div>
          )}
          {event.schedule && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.schedule}</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={handleRegister}
            disabled={isRegistering || isRegistered}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
              isRegistered
                ? 'bg-green-100 text-green-800 cursor-default dark:bg-green-900 dark:text-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
            } ${isRegistering ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isRegistering ? (
              'Processing...'
            ) : isRegistered ? (
              'Registered'
            ) : (
              'Pay & Register'
            )}
          </button>
          
          <a
            href={`/event/${event.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
          >
            View Details
          </a>
        </div>
      </div>
    </motion.div>
  )
}