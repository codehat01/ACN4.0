import { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: X,
  info: Info,
  warning: AlertCircle,
}

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const Icon = icons[toast.type]
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const duration = toast.duration || 5000
    const interval = 50
    const decrement = (interval / duration) * 100

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - decrement
        if (newProgress <= 0) {
          clearInterval(progressTimer)
          return 0
        }
        return newProgress
      })
    }, interval)

    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, duration)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [toast.id, toast.duration, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={`p-4 rounded-lg border shadow-lg ${colors[toast.type]} max-w-sm w-full relative overflow-hidden`}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-black/20 w-full">
        <motion.div
          className="h-full bg-current opacity-60"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>
      
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold">{toast.title}</p>
          {toast.message && (
            <p className="text-sm opacity-90 mt-1">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return { toasts, addToast, removeToast }
}