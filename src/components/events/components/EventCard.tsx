import { Calendar, MapPin, Users, ShoppingCart, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from './Toast'
import { useCart } from '../hooks/useCart'
import { supabase } from '../../../lib/supabaseClient'
import { useState } from 'react'

interface Event {
  id: string
  title: string
  tagline: string
  image_url: string | null
  venue: string | null
  schedule: string | null
  price?: number
}

interface EventCardProps {
  event: Event
  onClick: (eventId: string) => void
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()
  const { addToCart, isInCart } = useCart()

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
          .eq('event_id', event.id)
          .eq('user_id', user.id)

        if (error) throw error
        setIsRegistered(false)
        addToast({
          type: 'success',
          title: 'Unregistered',
          message: `You have been unregistered from ${event.title}`,
          duration: 3000
        })
      } else {
        // Register
        const { error } = await supabase
          .from('registrations')
          .insert({
            event_id: event.id,
            user_id: user.id,
          })

        if (error) throw error
        setIsRegistered(true)
        addToast({
          type: 'success',
          title: 'Registration Successful!',
          message: `You have been registered for ${event.title}`,
          duration: 3000
        })
      }
    } catch (error) {
      console.error('Error with registration:', error)
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: 'Please try again later',
        duration: 4000
      })
    } finally {
      setRegistering(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(event, 100) // Default price of ₹100
    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${event.title} added to cart`,
      duration: 2000
    })
  }

  return (
    <motion.div
      className="tech-card cursor-pointer group overflow-hidden"
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(event.id)}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-overlay"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black relative">
            <div className="absolute inset-0 tech-grid opacity-20"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2 neon-glow">
                <Calendar className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-primary font-medium font-mono text-sm">&lt;event.img /&gt;</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Tech corner accent */}
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-xs font-mono font-medium rounded-md mb-2 border border-red-500/30">
            ACN TECHFEST 4.0
          </span>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
            {event.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed font-mono">
            {event.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center space-x-4">
            {event.schedule && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-primary" />
                <span>{event.schedule}</span>
              </div>
            )}
            {event.venue && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-primary" />
                <span>{event.venue}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isInCart(event.id) && (
              <motion.button
                onClick={handleAddToCart}
                className="flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-mono font-medium bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-400 transition-all duration-200 neon-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-3 h-3" />
                <span>Cart</span>
              </motion.button>
            )}
            <motion.button
              onClick={handleRegister}
              disabled={registering}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
                isRegistered
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 neon-glow'
                  : 'bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 neon-glow font-mono'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {registering ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
              ) : isRegistered ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="font-mono">Registered</span>
                </>
              ) : (
                <>
                  <Users className="w-3 h-3" />
                  <span className="font-mono">₹{event.price || 100}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}