import { useState, useEffect } from 'react'
import { X, CreditCard, Smartphone, Timer, CheckCircle, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  amount: number
  items: any[]
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount, items }: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    if (isOpen && !razorpayLoaded) {
      loadRazorpay()
    }
  }, [isOpen])

  const loadRazorpay = () => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)
  }

  const handleRazorpayPayment = () => {
    if (!razorpayLoaded) return

    const options = {
      key: '4U2czmO8AORyNW9jGhaSyHQv', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'ACN TechFest 4.0',
      description: 'Cybersecurity Event Registration',
      image: '/logo.png',
      handler: function (response: any) {
        setPaymentStatus('success')
        setTimeout(() => {
          onSuccess()
          setPaymentStatus('pending')
        }, 2000)
      },
      prefill: {
        name: 'Student Name',
        email: 'student@acn.edu',
        contact: '9999999999'
      },
      theme: {
        color: '#dc2626'
      },
      modal: {
        ondismiss: function() {
          setPaymentStatus('pending')
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ 
            opacity: 0, 
            y: '100%',
            scale: 0.9 
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: 1 
          }}
          exit={{ 
            opacity: 0, 
            y: '100%',
            scale: 0.9 
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.5 
          }}
          className="relative bg-gray-900 border border-red-500/30 rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {paymentStatus === 'success' ? (
            <PaymentSuccess amount={amount} />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-red-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-mono">Secure Payment</h2>
                    <p className="text-sm text-gray-400 font-mono">
                      Total: ₹{amount}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Terminal-style payment info */}
                <div className="bg-black border border-green-500/30 rounded-lg p-4 font-mono text-sm">
                  <div className="text-green-400 mb-2">[+] Payment Gateway Initialized</div>
                  <div className="text-white">Amount: ₹{amount}</div>
                  <div className="text-white">Items: {items.length}</div>
                  <div className="text-yellow-400">[!] Secure connection established</div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handleRazorpayPayment}
                  disabled={!razorpayLoaded || paymentStatus === 'processing'}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 font-mono"
                >
                  {!razorpayLoaded ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading Payment Gateway...</span>
                    </>
                  ) : paymentStatus === 'processing' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay ₹{amount} via Razorpay</span>
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-gray-500 font-mono">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Secured by Razorpay | 256-bit SSL Encryption
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

function PaymentSuccess({ amount }: { amount: number }) {
  return (
    <div className="p-8 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-white mb-2 font-mono">
        Payment Successful!
      </h3>
      <p className="text-gray-400 mb-4 font-mono">
        ₹{amount} charged successfully
      </p>
      <div className="bg-black border border-green-500/30 rounded-lg p-3 font-mono text-sm">
        <div className="text-green-400">[+] Transaction completed</div>
        <div className="text-green-400">[+] Registration confirmed</div>
      </div>
    </div>
  )
}