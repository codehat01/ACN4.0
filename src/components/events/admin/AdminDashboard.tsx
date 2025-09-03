import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, Loader2, Shield, Download, QrCode, FileText, Users, Menu, Plus, Edit, Trash2, Eye, Calendar, MapPin, Phone, Mail, User, IdCard, AlertTriangle, Lock } from 'lucide-react'
import QRCode from 'qrcode'
import { supabase } from '../../../lib/supabase'
import { useAuth } from '../../../hooks/useAuth'
import { useToast } from '../Toast'

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
}

interface PaymentProof {
  id: string
  user_id: string
  user_email: string | null
  event_id: string
  event_title: string
  amount: number
  name: string
  roll_no: string | null
  team_members: string | null
  screenshot_path: string
  status: 'pending' | 'approved' | 'rejected'
  reason: string | null
  created_at: string
}

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

interface Ticket {
  id: string
  ticket_code: string
  user_id: string
  user_email: string | null
  event_id: string
  event_title: string
  holder_name: string
  roll_no: string | null
  qr_data: string | null
  pdf_path: string
  created_at: string
}

interface UserProfile {
  id: string
  name: string | null
  phone: string | null
  rollno: string | null
  branch: string | null
  created_at: string
  email?: string
  registrations_count?: number
  tickets_count?: number
}

interface AdminRole {
  user_id: string
  role: string
  permissions: any
  is_active: boolean
  granted_by: string
  created_at: string
}

async function loadJsPDF(): Promise<any> {
  const existing = (window as any).jspdf
  if (existing?.jsPDF) return existing.jsPDF
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load jsPDF'))
    document.body.appendChild(s)
  })
  return (window as any).jspdf.jsPDF
}

export default function SecureUltimateAdminDashboard({ isOpen, onClose }: AdminDashboardProps) {
  const { user } = useAuth()
  const { addToast } = useToast()

  // Security states
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null)
  const [securityCheck, setSecurityCheck] = useState<'checking' | 'passed' | 'failed'>('checking')
  const [accessAttempts, setAccessAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  
  // UI states
  const [activeTab, setActiveTab] = useState<'payments' | 'events' | 'tickets' | 'users'>('payments')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Data states
  const [payments, setPayments] = useState<PaymentProof[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  
  // Filters
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  
  // Event form
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    tagline: '',
    venue: '',
    schedule: '',
    price: '',
    capacity: '',
    contact_email: '',
    contact_phone: ''
  })

  // 🔒 ULTRA-SECURE ADMIN CHECK
  useEffect(() => {
    const performSecurityCheck = async () => {
      if (!user?.id) {
        setSecurityCheck('failed')
        setIsAdmin(false)
        setAdminLoading(false)
        return
      }
      
      try {
        setSecurityCheck('checking')
        
        // Step 1: Check if user exists in admin_roles table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()
        
        if (adminError || !adminData) {
          console.warn('🚫 Admin access denied - No admin role found')
          await logSecurityEvent('unauthorized_access_attempt', {
            user_id: user.id,
            user_email: user.email,
            reason: 'No admin role found'
          })
          setAccessAttempts(prev => prev + 1)
          setSecurityCheck('failed')
          setIsAdmin(false)
          setAdminLoading(false)
          return
        }

        // Step 2: Verify admin role is valid and active
        if (!adminData.is_active || !adminData.permissions) {
          console.warn('🚫 Admin access denied - Inactive or no permissions')
          await logSecurityEvent('unauthorized_access_attempt', {
            user_id: user.id,
            user_email: user.email,
            reason: 'Inactive admin role or no permissions'
          })
          setAccessAttempts(prev => prev + 1)
          setSecurityCheck('failed')
          setIsAdmin(false)
          setAdminLoading(false)
          return
        }

        // Step 3: Double-check with RPC function (if available)
        try {
          const { data: rpcResult, error: rpcError } = await supabase.rpc('is_admin')
          if (rpcError) {
            console.warn('RPC check failed, using direct table check')
          } else if (!rpcResult) {
            console.warn('🚫 Admin access denied - RPC function returned false')
            await logSecurityEvent('unauthorized_access_attempt', {
              user_id: user.id,
              user_email: user.email,
              reason: 'RPC function returned false'
            })
            setAccessAttempts(prev => prev + 1)
            setSecurityCheck('failed')
            setIsAdmin(false)
            setAdminLoading(false)
            return
          }
        } catch (rpcErr) {
          console.warn('RPC function not available, proceeding with table check')
        }

        // Step 4: All checks passed - Grant access
        console.log('✅ Admin access granted')
        setAdminRole(adminData)
        setIsAdmin(true)
        setSecurityCheck('passed')
        
        // Log successful access
        await logSecurityEvent('admin_access_granted', {
          user_id: user.id,
          user_email: user.email,
          role: adminData.role,
          permissions: adminData.permissions
        })
        
      } catch (err) {
        console.error('🚫 Security check failed:', err)
        await logSecurityEvent('security_check_error', {
          user_id: user.id,
          user_email: user.email,
          error: err
        })
        setAccessAttempts(prev => prev + 1)
        setSecurityCheck('failed')
        setIsAdmin(false)
      } finally {
        setAdminLoading(false)
      }
    }
    
    performSecurityCheck()
  }, [user?.id])

  // 🔒 Block access after too many failed attempts
  useEffect(() => {
    if (accessAttempts >= 3) {
      setIsBlocked(true)
      addToast({
        type: 'error',
        title: 'Access Blocked',
        message: 'Too many unauthorized access attempts. Contact system administrator.',
        duration: 10000
      })
    }
  }, [accessAttempts])

  // 🔒 Security logging function
  const logSecurityEvent = async (event: string, data: any) => {
    try {
      await supabase.rpc('log_admin_action', {
        action_name: event,
        table_name: 'security_log',
        record_id: null,
        old_data: null,
        new_data: data
      })
    } catch (err) {
      console.error('Failed to log security event:', err)
    }
  }

  // 🔒 Permission checker
  const hasPermission = (permission: string): boolean => {
    if (!adminRole?.permissions) return false
    return adminRole.permissions[permission] === true
  }

  // Load data when tab changes (with permission checks)
  useEffect(() => {
    if (!isOpen || !isAdmin || securityCheck !== 'passed') return
    
    if (activeTab === 'payments' && hasPermission('can_approve_payments')) loadPayments()
    if (activeTab === 'events' && hasPermission('can_manage_events')) loadEvents()
    if (activeTab === 'tickets') loadTickets()
    if (activeTab === 'users' && hasPermission('can_view_users')) loadUsers()
  }, [isOpen, isAdmin, activeTab, paymentFilter, securityCheck, adminRole])

  // Data loaders (same as before but with security logging)
  const loadPayments = async () => {
    if (!hasPermission('can_approve_payments')) {
      await logSecurityEvent('unauthorized_data_access', {
        user_id: user?.id,
        attempted_action: 'load_payments'
      })
      return
    }
    
    setLoading(true)
    try {
      let query = supabase.from('payment_proofs').select('*').order('created_at', { ascending: false })
      if (paymentFilter !== 'all') {
        query = query.eq('status', paymentFilter)
      }
      const { data, error } = await query
      if (error) throw error
      setPayments(data || [])
      
      await logSecurityEvent('data_access', {
        user_id: user?.id,
        action: 'load_payments',
        count: data?.length || 0
      })
    } catch (err) {
      console.error('Failed to load payments:', err)
      addToast({ type: 'error', title: 'Failed to load payments' })
    } finally {
      setLoading(false)
    }
  }

  const loadEvents = async () => {
    if (!hasPermission('can_manage_events')) {
      await logSecurityEvent('unauthorized_data_access', {
        user_id: user?.id,
        attempted_action: 'load_events'
      })
      return
    }
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setEvents(data || [])
      
      await logSecurityEvent('data_access', {
        user_id: user?.id,
        action: 'load_events',
        count: data?.length || 0
      })
    } catch (err) {
      console.error('Failed to load events:', err)
      addToast({ type: 'error', title: 'Failed to load events' })
    } finally {
      setLoading(false)
    }
  }

  const loadTickets = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTickets(data || [])
      
      await logSecurityEvent('data_access', {
        user_id: user?.id,
        action: 'load_tickets',
        count: data?.length || 0
      })
    } catch (err) {
      console.error('Failed to load tickets:', err)
      addToast({ type: 'error', title: 'Failed to load tickets' })
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    if (!hasPermission('can_view_users')) {
      await logSecurityEvent('unauthorized_data_access', {
        user_id: user?.id,
        attempted_action: 'load_users'
      })
      return
    }
    
    setLoading(true)
    try {
      // Get profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Get emails from payment_proofs
      const { data: authUsers, error: authError } = await supabase
        .from('payment_proofs')
        .select('user_id, user_email')

      if (authError) console.error('Auth users error:', authError)

      // Get registration counts
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select('user_id')

      if (regError) console.error('Registrations error:', regError)

      // Get ticket counts
      const { data: ticketCounts, error: ticketError } = await supabase
        .from('tickets')
        .select('user_id')

      if (ticketError) console.error('Tickets error:', ticketError)

      // Combine data
      const usersData = profiles?.map(profile => {
        const paymentProof = authUsers?.find(p => p.user_id === profile.id)
        const regCount = registrations?.filter(r => r.user_id === profile.id).length || 0
        const ticketCount = ticketCounts?.filter(t => t.user_id === profile.id).length || 0
        
        return {
          ...profile,
          email: paymentProof?.user_email || 'Unknown',
          registrations_count: regCount,
          tickets_count: ticketCount
        }
      }) || []

      setUsers(usersData)
      
      await logSecurityEvent('data_access', {
        user_id: user?.id,
        action: 'load_users',
        count: usersData.length
      })
    } catch (err) {
      console.error('Failed to load users:', err)
      addToast({ type: 'error', title: 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }

  // Payment actions (with security checks)
  const handleApprovePayment = async (payment: PaymentProof) => {
    if (!hasPermission('can_approve_payments')) {
      await logSecurityEvent('unauthorized_action_attempt', {
        user_id: user?.id,
        attempted_action: 'approve_payment',
        payment_id: payment.id
      })
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to approve payments' })
      return
    }
    
    try {
      setLoading(true)
      
      // Generate ticket
      const ticketCode = `TKT-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
      const qrPayload = {
        type: 'ticket',
        code: ticketCode,
        event_id: payment.event_id,
        event_title: payment.event_title,
        user_id: payment.user_id,
        user_email: payment.user_email,
        created_at: new Date().toISOString()
      }
      
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload))
      
      // Generate PDF
      const jsPDF = await loadJsPDF()
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      
      // Header
      doc.setFillColor('#b22049')
      doc.rect(0, 0, 595.28, 70, 'F')
      doc.setTextColor('#ffffff')
      doc.setFontSize(20)
      doc.text('Event Ticket', 40, 45)
      
      // Content
      doc.setTextColor('#111111')
      doc.setFontSize(14)
      let y = 110
      const addLine = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold')
        doc.text(label, 40, y)
        doc.setFont('helvetica', 'normal')
        doc.text(value, 180, y)
        y += 24
      }
      
      addLine('Ticket Code:', ticketCode)
      addLine('Event:', payment.event_title)
      addLine('Holder:', payment.name)
      addLine('Roll No:', payment.roll_no || '-')
      addLine('Amount:', `₹${payment.amount}`)
      addLine('Issued:', new Date().toLocaleString())
      
      // QR Code
      doc.addImage(qrDataUrl, 'PNG', 400, 100, 160, 160)
      
      // Footer
      doc.setFontSize(10)
      doc.setTextColor('#555555')
      doc.text('Present this ticket and valid ID at the event venue.', 40, 780)
      
      const pdfBlob = doc.output('blob') as Blob
      
      // Upload PDF
      const pdfPath = `${payment.event_id}/${payment.user_id}/${ticketCode}.pdf`
      const { error: uploadError } = await supabase.storage
        .from('tickets')
        .upload(pdfPath, pdfBlob, { contentType: 'application/pdf', cacheControl: '3600', upsert: false })
      
      if (uploadError) throw uploadError
      
      // Create ticket record
      const { error: ticketError } = await supabase.from('tickets').insert({
        ticket_code: ticketCode,
        user_id: payment.user_id,
        user_email: payment.user_email,
        event_id: payment.event_id,
        event_title: payment.event_title,
        holder_name: payment.name,
        roll_no: payment.roll_no,
        qr_data: JSON.stringify(qrPayload),
        pdf_path: pdfPath
      })
      
      if (ticketError) throw ticketError
      
      // Update payment status
      const { error: updateError } = await supabase
        .from('payment_proofs')
        .update({ status: 'approved', reason: null })
        .eq('id', payment.id)
      
      if (updateError) throw updateError
      
      // Log the action
      await logSecurityEvent('payment_approved', {
        user_id: user?.id,
        payment_id: payment.id,
        ticket_code: ticketCode,
        event_id: payment.event_id,
        amount: payment.amount
      })
      
      addToast({ type: 'success', title: 'Payment approved and ticket issued!' })
      loadPayments()
      
    } catch (err: any) {
      console.error('Approve failed:', err)
      await logSecurityEvent('payment_approval_failed', {
        user_id: user?.id,
        payment_id: payment.id,
        error: err.message
      })
      addToast({ type: 'error', title: 'Approve failed', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectPayment = async (payment: PaymentProof) => {
    if (!hasPermission('can_approve_payments')) {
      await logSecurityEvent('unauthorized_action_attempt', {
        user_id: user?.id,
        attempted_action: 'reject_payment',
        payment_id: payment.id
      })
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to reject payments' })
      return
    }
    
    const reason = window.prompt('Enter rejection reason:')
    if (!reason) return
    
    try {
      const { error } = await supabase
        .from('payment_proofs')
        .update({ status: 'rejected', reason })
        .eq('id', payment.id)
      
      if (error) throw error
      
      await logSecurityEvent('payment_rejected', {
        user_id: user?.id,
        payment_id: payment.id,
        reason: reason,
        event_id: payment.event_id
      })
      
      addToast({ type: 'success', title: 'Payment rejected' })
      loadPayments()
    } catch (err: any) {
      console.error('Reject failed:', err)
      addToast({ type: 'error', title: 'Reject failed', message: err.message })
    }
  }

  // Event actions (with security checks)
  const handleSaveEvent = async () => {
    if (!hasPermission('can_manage_events')) {
      await logSecurityEvent('unauthorized_action_attempt', {
        user_id: user?.id,
        attempted_action: 'save_event'
      })
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to manage events' })
      return
    }
    
    try {
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        tagline: eventForm.tagline,
        venue: eventForm.venue,
        schedule: eventForm.schedule,
        price: eventForm.price ? parseInt(eventForm.price) : null,
        capacity: eventForm.capacity ? parseInt(eventForm.capacity) : null,
        contact_email: eventForm.contact_email || null,
        contact_phone: eventForm.contact_phone || null
      }

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id)
        if (error) throw error
        
        await logSecurityEvent('event_updated', {
          user_id: user?.id,
          event_id: editingEvent.id,
          changes: eventData
        })
        
        addToast({ type: 'success', title: 'Event updated!' })
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData)
        if (error) throw error
        
        await logSecurityEvent('event_created', {
          user_id: user?.id,
          event_data: eventData
        })
        
        addToast({ type: 'success', title: 'Event created!' })
      }

      setShowEventForm(false)
      setEditingEvent(null)
      setEventForm({
        title: '', description: '', tagline: '', venue: '', schedule: '',
        price: '', capacity: '', contact_email: '', contact_phone: ''
      })
      loadEvents()
    } catch (err: any) {
      console.error('Save event failed:', err)
      addToast({ type: 'error', title: 'Save failed', message: err.message })
    }
  }

  const handleEditEvent = (event: Event) => {
    if (!hasPermission('can_manage_events')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to edit events' })
      return
    }
    
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      description: event.description,
      tagline: event.tagline,
      venue: event.venue || '',
      schedule: event.schedule || '',
      price: event.price?.toString() || '',
      capacity: event.capacity?.toString() || '',
      contact_email: event.contact_email || '',
      contact_phone: event.contact_phone || ''
    })
    setShowEventForm(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!hasPermission('can_manage_events')) {
      await logSecurityEvent('unauthorized_action_attempt', {
        user_id: user?.id,
        attempted_action: 'delete_event',
        event_id: eventId
      })
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to delete events' })
      return
    }
    
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
      
      if (error) throw error
      
      await logSecurityEvent('event_deleted', {
        user_id: user?.id,
        event_id: eventId
      })
      
      addToast({ type: 'success', title: 'Event deleted!' })
      loadEvents()
    } catch (err: any) {
      console.error('Delete failed:', err)
      addToast({ type: 'error', title: 'Delete failed', message: err.message })
    }
  }

  if (!isOpen) return null

  // 🔒 Security check loading
  if (adminLoading || securityCheck === 'checking') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-6 h-6 animate-pulse" />
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="text-lg font-bold mb-2">Security Check</h3>
          <p className="text-sm text-white/70">Verifying admin credentials...</p>
          <div className="mt-4 flex space-x-2">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // 🔒 Access blocked
  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="relative bg-red-900/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md text-white border border-red-500">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <h2 className="text-xl font-bold">Access Blocked</h2>
          </div>
          <p className="text-sm text-red-200 mb-4">
            Multiple unauthorized access attempts detected. Your access has been temporarily blocked.
          </p>
          <p className="text-xs text-red-300 mb-4">
            Contact the system administrator to restore access.
          </p>
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // 🔒 Access denied
  if (!isAdmin || securityCheck === 'failed') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-red-900/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md text-white border border-red-500">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold">Access Denied</h2>
          </div>
          <p className="text-sm text-red-200 mb-4">
            🚫 Unauthorized access attempt detected and logged.
          </p>
          <div className="bg-red-800/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-red-300">
              <strong>Security Notice:</strong> Admin access is restricted to authorized personnel only. 
              All access attempts are monitored and logged.
            </p>
          </div>
          <div className="text-xs text-red-400 mb-4">
            User ID: {user?.id || 'Not authenticated'}<br/>
            Attempts: {accessAttempts}/3
          </div>
          <button 
            onClick={onClose} 
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // Filter tabs based on permissions
  const tabs = [
    { id: 'payments', label: 'Payments', icon: QrCode, count: payments.length, permission: 'can_approve_payments' },
    { id: 'events', label: 'Events', icon: FileText, count: events.length, permission: 'can_manage_events' },
    { id: 'tickets', label: 'Tickets', icon: Download, count: tickets.length, permission: null },
    { id: 'users', label: 'Users', icon: Users, count: users.length, permission: 'can_view_users' }
  ].filter(tab => !tab.permission || hasPermission(tab.permission))

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop')" }} />
      
      <div className="relative h-full flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/10 backdrop-blur-sm m-4 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🔒 Secure Admin</h2>
              <p className="text-xs text-green-300">✅ Authenticated as {adminRole?.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 rounded-lg hover:bg-white/10"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile Tab Navigation */}
          {isMobileMenuOpen && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setActiveTab(tab.id as any)
                    setIsMobileMenuOpen(false) 
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 p-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white h-full">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">🔒 Secure Admin</h3>
                <p className="text-xs text-green-300">✅ {adminRole?.role}</p>
                <p className="text-xs text-white/50">{user?.email}</p>
              </div>
              
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                      activeTab === tab.id ? 'bg-white/20' : 'hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="flex-1">{tab.label}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <p className="text-xs text-green-300">🛡️ Security Active</p>
                <p className="text-xs text-white/70">All actions logged</p>
              </div>
              
              <button 
                onClick={onClose} 
                className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Secure Logout
              </button>
            </div>
          </div>

          {/* Main Content - Same as UltimateAdminDashboard but with permission checks */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-white min-h-full">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {activeTab === 'payments' && '💳 Payment Approvals'}
                    {activeTab === 'events' && '📅 Events Management'}
                    {activeTab === 'tickets' && '🎫 Issued Tickets'}
                    {activeTab === 'users' && '👥 Registered Users'}
                  </h2>
                  <p className="text-sm text-white/70 mt-1">
                    {activeTab === 'payments' && `${payments.length} payment proofs`}
                    {activeTab === 'events' && `${events.length} events`}
                    {activeTab === 'tickets' && `${tickets.length} tickets issued`}
                    {activeTab === 'users' && `${users.length} registered users`}
                  </p>
                </div>
                <button onClick={onClose} className="hidden md:block p-2 rounded-lg hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content - Same as UltimateAdminDashboard */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mr-3" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  {/* PAYMENTS TAB */}
                  {activeTab === 'payments' && hasPermission('can_approve_payments') && (
                    <div>
                      {/* Filter */}
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {['all', 'pending', 'approved', 'rejected'].map(status => (
                            <button
                              key={status}
                              onClick={() => setPaymentFilter(status as any)}
                              className={`px-4 py-2 rounded-lg text-sm capitalize ${
                                paymentFilter === status 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-white/10 text-white/70 hover:bg-white/15'
                              }`}
                            >
                              {status} ({payments.filter(p => status === 'all' || p.status === status).length})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Payments List */}
                      {payments.length === 0 ? (
                        <div className="text-center py-12">
                          <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-white/70">No payment proofs found</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {payments.map((payment) => (
                            <div key={payment.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold">{payment.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                      payment.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                                      'bg-red-500/20 text-red-300'
                                    }`}>
                                      {payment.status}
                                    </span>
                                  </div>
                                  <p className="text-sm text-white/80">{payment.event_title}</p>
                                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/60">
                                    <span>₹{payment.amount}</span>
                                    <span>{payment.user_email}</span>
                                    {payment.roll_no && <span>{payment.roll_no}</span>}
                                    <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                                  </div>
                                  {payment.team_members && (
                                    <p className="text-sm text-white/60 mt-1">
                                      Team: {payment.team_members}
                                    </p>
                                  )}
                                  {payment.reason && (
                                    <p className="text-sm text-red-300 mt-1">
                                      Reason: {payment.reason}
                                    </p>
                                  )}
                                </div>
                                
                                {payment.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleApprovePayment(payment)}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                    >
                                      <CheckCircle className="w-4 h-4 inline mr-1" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectPayment(payment)}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                    >
                                      <XCircle className="w-4 h-4 inline mr-1" />
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* EVENTS TAB */}
                  {activeTab === 'events' && hasPermission('can_manage_events') && (
                    <div>
                      {/* Add Event Button */}
                      <div className="mb-6">
                        <button
                          onClick={() => {
                            setEditingEvent(null)
                            setEventForm({
                              title: '', description: '', tagline: '', venue: '', schedule: '',
                              price: '', capacity: '', contact_email: '', contact_phone: ''
                            })
                            setShowEventForm(true)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Add Event
                        </button>
                      </div>

                      {/* Events List */}
                      {events.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-white/70">No events found</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {events.map((event) => (
                            <div key={event.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                              {event.image_url && (
                                <img 
                                  src={event.image_url} 
                                  alt={event.title}
                                  className="w-full h-32 object-cover rounded-lg mb-3"
                                />
                              )}
                              <h3 className="font-semibold mb-2">{event.title}</h3>
                              <p className="text-sm text-white/70 mb-2">{event.tagline}</p>
                              <div className="text-sm text-white/60 space-y-1">
                                {event.venue && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3" />
                                    {event.venue}
                                  </div>
                                )}
                                {event.schedule && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {event.schedule}
                                  </div>
                                )}
                                {event.price && (
                                  <div>₹{event.price}</div>
                                )}
                              </div>
                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                >
                                  <Edit className="w-3 h-3 inline mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                >
                                  <Trash2 className="w-3 h-3 inline mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TICKETS TAB */}
                  {activeTab === 'tickets' && (
                    <div>
                      {tickets.length === 0 ? (
                        <div className="text-center py-12">
                          <Download className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-white/70">No tickets issued yet</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold">{ticket.holder_name}</h3>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                                      {ticket.ticket_code}
                                    </span>
                                  </div>
                                  <p className="text-sm text-white/80">{ticket.event_title}</p>
                                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/60">
                                    <span>{ticket.user_email}</span>
                                    {ticket.roll_no && <span>{ticket.roll_no}</span>}
                                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      if (ticket.qr_data) {
                                        const qrWindow = window.open('', '_blank')
                                        if (qrWindow) {
                                          QRCode.toDataURL(ticket.qr_data).then(url => {
                                            qrWindow.document.write(`
                                              <html>
                                                <head><title>QR Code - ${ticket.ticket_code}</title></head>
                                                <body style="text-align: center; padding: 20px;">
                                                  <h2>${ticket.ticket_code}</h2>
                                                  <img src="${url}" style="max-width: 300px;" />
                                                  <p>${ticket.event_title}</p>
                                                </body>
                                              </html>
                                            `)
                                          })
                                        }
                                      }
                                    }}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                  >
                                    <Eye className="w-3 h-3 inline mr-1" />
                                    View QR
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* USERS TAB */}
                  {activeTab === 'users' && hasPermission('can_view_users') && (
                    <div>
                      {users.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-white/70">No users found</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {users.map((user) => (
                            <div key={user.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    <h3 className="font-semibold">{user.name || 'Unknown'}</h3>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-white/70">
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-3 h-3" />
                                      {user.email}
                                    </div>
                                    {user.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        {user.phone}
                                      </div>
                                    )}
                                    {user.rollno && (
                                      <div className="flex items-center gap-2">
                                        <IdCard className="w-3 h-3" />
                                        {user.rollno}
                                      </div>
                                    )}
                                    {user.branch && (
                                      <div>{user.branch}</div>
                                    )}
                                  </div>
                                  <div className="flex gap-4 mt-2 text-sm">
                                    <span className="text-blue-300">
                                      {user.registrations_count || 0} registrations
                                    </span>
                                    <span className="text-green-300">
                                      {user.tickets_count || 0} tickets
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Permission Denied Messages */}
                  {activeTab === 'payments' && !hasPermission('can_approve_payments') && (
                    <div className="text-center py-12">
                      <Lock className="w-16 h-16 mx-auto mb-4 text-red-400" />
                      <p className="text-red-300">🚫 Access Denied: Payment approval permission required</p>
                    </div>
                  )}

                  {activeTab === 'events' && !hasPermission('can_manage_events') && (
                    <div className="text-center py-12">
                      <Lock className="w-16 h-16 mx-auto mb-4 text-red-400" />
                      <p className="text-red-300">🚫 Access Denied: Event management permission required</p>
                    </div>
                  )}

                  {activeTab === 'users' && !hasPermission('can_view_users') && (
                    <div className="text-center py-12">
                      <Lock className="w-16 h-16 mx-auto mb-4 text-red-400" />
                      <p className="text-red-300">🚫 Access Denied: User viewing permission required</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal - Same as UltimateAdminDashboard */}
      {showEventForm && hasPermission('can_manage_events') && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button 
                onClick={() => setShowEventForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  value={eventForm.tagline}
                  onChange={(e) => setEventForm({...eventForm, tagline: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Venue</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule</label>
                  <input
                    type="text"
                    value={eventForm.schedule}
                    onChange={(e) => setEventForm({...eventForm, schedule: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={eventForm.contact_email}
                    onChange={(e) => setEventForm({...eventForm, contact_email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={eventForm.contact_phone}
                    onChange={(e) => setEventForm({...eventForm, contact_phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}