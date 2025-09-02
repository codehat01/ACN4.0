import { Home, Users, Calendar, User, Shield, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

interface BottomNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onAuthClick: () => void
  onProfileClick: () => void
  onAdminClick: () => void
  onCartClick: () => void
  isAuthenticated: boolean
}

export default function BottomNavigation({ 
  activeSection, 
  onSectionChange, 
  onAuthClick,
  onProfileClick,
  onAdminClick,
  onCartClick,
  isAuthenticated 
}: BottomNavigationProps) {
  const { user } = useAuth()
  const { getTotalItems } = useCart()
  const isAdmin = user?.email?.includes('admin') || user?.email === 'admin@campus.com'
  const totalItems = getTotalItems()

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'events', icon: Calendar, label: 'Events' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="mx-4 mb-4">
        <div className="glass-effect rounded-2xl shadow-large">
          <div className="flex items-center justify-around py-2 px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 flex-1"
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon 
                  className={`w-4 h-4 mb-1 transition-colors relative z-10 ${
                    activeSection === item.id ? 'text-primary-600' : 'text-gray-600'
                  }`} 
                />
                <span 
                  className={`text-xs font-medium transition-colors relative z-10 ${
                    activeSection === item.id ? 'text-primary-600' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
            
            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 flex-1"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 mb-1 text-gray-600" />
                {totalItems > 0 && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs font-medium text-gray-600">Cart</span>
            </button>
            
            {isAuthenticated ? (
              <>
                <button
                  onClick={onProfileClick}
                  className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 flex-1"
                >
                  <User className="w-4 h-4 mb-1 text-gray-600" />
                  <span className="text-xs font-medium text-gray-600">Profile</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={onAdminClick}
                    className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 flex-1"
                  >
                    <Shield className="w-4 h-4 mb-1 text-red-600" />
                    <span className="text-xs font-medium text-red-600">Admin</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 flex-1"
              >
                <User className="w-4 h-4 mb-1 text-gray-600" />
                <span className="text-xs font-medium text-gray-600">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}