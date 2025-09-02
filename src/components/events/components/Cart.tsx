import { useState, useEffect } from 'react'
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, MapPin, ArrowRight, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import PaymentModal from './PaymentModal'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [showPayment, setShowPayment] = useState(false)

  const handlePayment = () => {
    if (items.length === 0) return
    setShowPayment(true)
  }

  const handlePaymentSuccess = () => {
    clearCart()
    setShowPayment(false)
    onClose()
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:relative md:mx-auto md:mt-16 bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] md:max-h-[80vh] overflow-hidden flex flex-col z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(85vh - 220px)' }}>
                <AnimatePresence mode="wait">
                  {items.length === 0 ? (
                    <motion.div 
                      key="empty-cart"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-12"
                    >
                      <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 text-center">
                        Your cart is empty
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Add some events to get started
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="cart-items"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onRemove={removeFromCart}
                          onUpdateQuantity={updateQuantity}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-white dark:bg-gray-800/95 backdrop-blur-sm"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                        <span className="font-medium text-gray-700 dark:text-gray-200">₹{getTotalPrice()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Discount (10%)</span>
                        <span className="font-medium text-green-500">-₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-1.5"></div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Total Amount
                        </span>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 dark:text-gray-400 line-through mr-2">
                            ₹{(getTotalPrice() * 1.1).toFixed(2)}
                          </span>
                          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            ₹{getTotalPrice()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={clearCart}
                        className="py-2.5 px-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center space-x-1.5 w-full text-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Clear All</span>
                      </button>
                      <button
                        onClick={handlePayment}
                        className="py-2.5 px-3 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center space-x-1.5 w-full text-sm"
                      >
                        <span className="truncate">Checkout</span>
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-1.5 pt-1">
                      <Lock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400 leading-tight">
                        Secure payment processing
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPayment(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md"
            >
              <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                onSuccess={handlePaymentSuccess}
                amount={getTotalPrice()}
                items={items}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

interface CartItemProps {
  item: any
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [quantity, setQuantity] = useState(item.quantity || 1)

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => onRemove(item.id), 300)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantity(newQuantity)
    onUpdateQuantity(item.id, newQuantity)
  }

  const handleSwipeGesture = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      handleRemove()
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isRemoving ? 0 : 1, 
        y: isRemoving ? -10 : 0,
        scale: isRemoving ? 0.98 : 1,
        transition: { duration: 0.2 }
      }}
      exit={{ opacity: 0, x: -100, scale: 0.95 }}
      className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {item.title}
            </h4>
            <button
              onClick={handleRemove}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors -mt-1 -mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {item.venue && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {item.venue}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ₹{(item.price * 1.1 * quantity).toFixed(0)}
              </p>
              <p className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ₹{item.price * quantity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}