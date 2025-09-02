import { ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'

interface CartIconProps {
  onClick: () => void
  className?: string
}

export default function CartIcon({ onClick, className = '' }: CartIconProps) {
  const { items, getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xs font-bold">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Pulse animation for new items */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 rounded-full bg-primary/20"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}