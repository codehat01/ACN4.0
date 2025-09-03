import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from './Toast'
import { ArrowLeft, Upload, QrCode, Loader2, User, Mail, IdCard, Users, AlertCircle } from 'lucide-react'
import { validateRollNumber, validateEmail, validateName, getRollNumberHelpText } from '../../utils/validation'

interface EventData {
  id: string
  title: string
  price: number | null
  payment_url: string | null
}

interface QRCodeRow {
  qr_code_id: string
  qr_image_url: string | null
  upi_intent: string | null
  payee_name: string | null
  transaction_count: number
  max_transactions: number
  transactions_remaining: number
}

// Client-side image compression with size validation
async function compressImage(file: File, options?: { maxWidth?: number; maxHeight?: number; maxSizeKB?: number; quality?: number }): Promise<{ blob: Blob; sizeKB: number }> {
  const maxWidth = options?.maxWidth ?? 1024
  const maxHeight = options?.maxHeight ?? 1024
  const maxSizeKB = options?.maxSizeKB ?? 1000 // 1MB max
  const minSizeKB = 50 // 50KB min
  let quality = options?.quality ?? 0.8

  // Check original file size
  const originalSizeKB = file.size / 1024
  if (originalSizeKB < minSizeKB) {
    throw new Error(`File too small. Minimum size is ${minSizeKB}KB, got ${originalSizeKB.toFixed(1)}KB`)
  }
  if (originalSizeKB > maxSizeKB) {
    throw new Error(`File too large. Maximum size is ${maxSizeKB}KB, got ${originalSizeKB.toFixed(1)}KB`)
  }

  // Check file type
  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.')
  }

  const img = document.createElement('img')
  const reader = new FileReader()

  const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    reader.onload = () => {
      img.src = reader.result as string
      img.onload = () => resolve(img)
      img.onerror = reject
    }
    reader.onerror = reject
  })

  reader.readAsDataURL(file)
  await loadPromise

  const canvas = document.createElement('canvas')
  let { width, height } = img

  // Maintain aspect ratio while fitting into bounds
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = Math.floor(width * ratio)
    height = Math.floor(height * ratio)
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  let blob: Blob | null = null
  for (let i = 0; i < 6; i++) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob) break
    const sizeKB = blob.size / 1024
    if (sizeKB <= maxSizeKB && sizeKB >= minSizeKB) break
    quality -= 0.15
    if (quality < 0.3) break
  }

  if (!blob) throw new Error('Compression failed')
  
  const finalSizeKB = blob.size / 1024
  if (finalSizeKB < minSizeKB) {
    throw new Error(`Compressed file too small: ${finalSizeKB.toFixed(1)}KB. Minimum: ${minSizeKB}KB`)
  }
  if (finalSizeKB > maxSizeKB) {
    throw new Error(`Compressed file too large: ${finalSizeKB.toFixed(1)}KB. Maximum: ${maxSizeKB}KB`)
  }

  return { blob, sizeKB: finalSizeKB }
}

export default function PaymentPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const location = useLocation() as any
  const { user } = useAuth()
  const { addToast } = useToast()

  const [step, setStep] = useState<1 | 2>(1)
  const [event, setEvent] = useState<EventData | null>(null)
  const [qr, setQr] = useState<QRCodeRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [teamMembers, setTeamMembers] = useState('') // comma-separated optional

  // Upload state
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Validation states
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [rollNoError, setRollNoError] = useState('')

  // Real-time validation
  const handleNameChange = (value: string) => {
    setName(value)
    if (value && !validateName(value)) {
      setNameError('Name should be 2-50 characters, letters only with spaces, hyphens, or apostrophes')
    } else {
      setNameError('')
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handleRollNoChange = (value: string) => {
    setRollNo(value)
    if (value && !validateRollNumber(value)) {
      setRollNoError(getRollNumberHelpText())
    } else {
      setRollNoError('')
    }
  }

  // Disable page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Prefill from auth/profile and load event + active QR
  useEffect(() => {
    const init = async () => {
      if (!eventId) return
      setLoading(true)
      try {
        // Load event data
        const { data: ev, error: evErr } = await supabase
          .from('events')
          .select('id, title, price, payment_url')
          .eq('id', eventId)
          .single()
        
        if (evErr) throw evErr
        setEvent(ev as EventData)

        // Get active QR code for this event
        const { data: qrData, error: qrErr } = await supabase.rpc('get_active_qr_code', {
          event_uuid: eventId
        })
        
        if (qrErr) {
          console.error('QR load error:', qrErr)
          // Fallback to old method if new function doesn't exist
          const { data: fallbackQr } = await supabase
            .from('qr_codes')
            .select('qr_code_id, upi_intent, qr_image_url, payee_name')
            .eq('event_id', eventId)
            .maybeSingle()
          
          if (fallbackQr) {
            setQr({
              qr_code_id: fallbackQr.qr_code_id || 'QR001',
              qr_image_url: fallbackQr.qr_image_url,
              upi_intent: fallbackQr.upi_intent,
              payee_name: fallbackQr.payee_name,
              transaction_count: 0,
              max_transactions: 20,
              transactions_remaining: 20
            })
          }
        } else if (qrData && qrData.length > 0) {
          setQr(qrData[0])
        }

        // Prefill user data
        if (user?.email) setEmail(user.email)
        if (user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, rollno')
            .eq('id', user.id)
            .maybeSingle()
          
          if (profile?.name) setName(profile.name)
          if (profile?.rollno) setRollNo(profile.rollno)
        }

      } catch (e) {
        console.error(e)
        addToast({ type: 'error', title: 'Load failed', message: 'Unable to load event/payment data' })
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [eventId, user?.id])

  const amount = useMemo(() => {
    return event?.price ?? location?.state?.amount ?? 0
  }, [event, location?.state])

  const eventTitle = useMemo(() => {
    return event?.title ?? location?.state?.eventTitle ?? 'Selected Event'
  }, [event, location?.state])

  const qrUrl = useMemo(() => {
    // Priority: explicit QR image -> UPI intent -> fallback to payment_url -> fallback to title
    if (qr?.qr_image_url) return qr.qr_image_url
    const data = qr?.upi_intent || event?.payment_url || `Payment for ${eventTitle}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(data)}`
  }, [qr, event?.payment_url, eventTitle])

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!name || !email) {
      addToast({ type: 'warning', title: 'Missing details', message: 'Please fill name and email' })
      return
    }

    // Check for validation errors
    if (nameError || emailError || rollNoError) {
      addToast({ type: 'error', title: 'Validation errors', message: 'Please fix the errors before continuing' })
      return
    }

    // Final validation
    if (!validateName(name)) {
      setNameError('Invalid name format')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email format')
      return
    }

    if (rollNo && !validateRollNumber(rollNo)) {
      setRollNoError('Invalid roll number format')
      return
    }

    setStep(2)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const { blob, sizeKB } = await compressImage(f, { maxWidth: 1200, maxHeight: 1200, maxSizeKB: 1000, quality: 0.8 })
      const compressedFile = new File([blob], `${Date.now()}.jpg`, { type: 'image/jpeg' })
      setFile(compressedFile)
      setPreviewUrl(URL.createObjectURL(compressedFile))
      addToast({ 
        type: 'success', 
        title: 'Image validated', 
        message: `File size: ${sizeKB.toFixed(1)}KB (50KB-1MB allowed)` 
      })
    } catch (err: any) {
      console.error(err)
      addToast({ type: 'error', title: 'Validation failed', message: err.message })
    }
  }

  const handleSubmitProof = async () => {
    if (!user) {
      addToast({ type: 'warning', title: 'Login required' })
      return
    }
    if (!eventId || !eventTitle) return
    if (!file) {
      addToast({ type: 'warning', title: 'No screenshot', message: 'Upload payment screenshot first' })
      return
    }

    setSubmitting(true)
    try {
      // Use the actual QR code ID from the loaded QR data
      const qrCodeId = qr?.qr_code_id || 'QR001'
      
      // Increment QR transaction count and get transaction number
      const { data: transactionResult, error: transErr } = await supabase.rpc('increment_qr_transaction', {
        event_uuid: eventId,
        qr_id: qrCodeId
      })
      
      let transactionNumber = 1
      let actualQrId = qrCodeId
      
      if (transErr) {
        console.error('Transaction increment error:', transErr)
        // Fallback: use simple numbering
        transactionNumber = Math.floor(Math.random() * 20) + 1
      } else if (transactionResult && transactionResult.length > 0) {
        const result = transactionResult[0]
        if (!result.success) {
          throw new Error(result.message || 'Failed to process QR transaction')
        }
        transactionNumber = result.new_transaction_number
        actualQrId = result.new_qr_code_id || qrCodeId
        
        if (result.qr_switched) {
          addToast({ 
            type: 'info', 
            title: 'QR Code Switched', 
            message: `Switched to ${actualQrId} (previous QR was full)` 
          })
        }
      }
      
      // Create organized file path: event_id/qr_code_id/transaction_number_user_id.jpg
      const fileExtension = 'jpg'
      const path = `${eventId}/${actualQrId}/${String(transactionNumber).padStart(2, '0')}_${user.id}.${fileExtension}`
      
      // Upload to storage bucket with organized path
      const { error: upErr } = await supabase.storage.from('payment_proofs').upload(path, file, {
        cacheControl: '3600',
        contentType: 'image/jpeg',
        upsert: false,
      })
      if (upErr) throw upErr

      // Use the organized path as screenshot_path
      const screenshot_path = path

      // Insert record with pending status and additional metadata
      const { error: insErr } = await supabase.from('payment_proofs').insert({
        user_id: user.id,
        user_email: user.email,
        event_id: eventId,
        event_title: eventTitle,
        amount: amount || 0,
        name: name.trim(),
        roll_no: rollNo.trim() || null,
        team_members: teamMembers.trim() || null,
        screenshot_path,
        status: 'pending',
        qr_code_id: actualQrId,
        transaction_number: transactionNumber,
        file_size_bytes: file.size,
        file_type: file.type
      })
      if (insErr) throw insErr

      addToast({ 
        type: 'success', 
        title: 'Submitted', 
        message: `Payment proof uploaded to ${actualQrId}/Transaction #${transactionNumber}. Awaiting verification.` 
      })
      
      // Return to event page
      navigate(`/event/${eventId}`)
    } catch (err: any) {
      console.error(err)
      addToast({ type: 'error', title: 'Upload failed', message: err?.message || 'Could not submit proof' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading payment...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Background image with glass overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative h-full flex flex-col">
        <div className="p-4 md:p-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-effect text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="text-sm text-white/90 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            ⚠️ Do not scroll. Complete payment and upload screenshot before leaving this page.
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Stepper */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className={`flex items-center space-x-2`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step === 1 ? 'bg-[#b22049] text-white' : 'bg-white text-[#b22049]'
                  }`}
                >
                  1
                </div>
                <span className="text-white">Details</span>
              </div>
              <div className="h-px w-24 bg-white/40" />
              <div className={`flex items-center space-x-2`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    step === 2 ? 'bg-[#b22049] text-white' : 'bg-white text-[#b22049]'
                  }`}
                >
                  2
                </div>
                <span className="text-white">Pay & Upload</span>
              </div>
            </div>

            {/* Panel */}
            <div className="glass-effect rounded-2xl p-6 md:p-8 text-white">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{eventTitle}</h2>
                <p className="text-white/80 mt-1">Amount: <span className="font-semibold">₹{amount || 0}</span></p>
                <p className="text-xs text-green-300 mt-2">✅ Enhanced with flexible validation for all colleges</p>
              </div>

              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center bg-white/10 rounded-lg px-3">
                        <User className="w-4 h-4 text-white/70 mr-2" />
                        <input
                          className="bg-transparent outline-none w-full py-3 placeholder-white/60"
                          placeholder="Full Name *"
                          value={name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          required
                        />
                      </div>
                      {nameError && (
                        <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {nameError}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center bg-white/10 rounded-lg px-3">
                        <Mail className="w-4 h-4 text-white/70 mr-2" />
                        <input
                          className="bg-transparent outline-none w-full py-3 placeholder-white/60"
                          placeholder="Email *"
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          required
                        />
                      </div>
                      {emailError && (
                        <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {emailError}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center bg-white/10 rounded-lg px-3">
                        <IdCard className="w-4 h-4 text-white/70 mr-2" />
                        <input
                          className="bg-transparent outline-none w-full py-3 placeholder-white/60"
                          placeholder="Roll No (e.g., CH.EN.U4CYS22001, 19BCE001)"
                          value={rollNo}
                          onChange={(e) => handleRollNoChange(e.target.value)}
                        />
                      </div>
                      {rollNoError && (
                        <p className="text-red-300 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {rollNoError}
                        </p>
                      )}
                      {!rollNoError && rollNo && validateRollNumber(rollNo) && (
                        <p className="text-green-300 text-xs mt-1">✅ Valid roll number format</p>
                      )}
                    </div>
                    
                    <div className="flex items-center bg-white/10 rounded-lg px-3">
                      <Users className="w-4 h-4 text-white/70 mr-2" />
                      <input
                        className="bg-transparent outline-none w-full py-3 placeholder-white/60"
                        placeholder="Team Members (comma separated)"
                        value={teamMembers}
                        onChange={(e) => setTeamMembers(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={!name || !email || nameError || emailError || rollNoError}
                      className={`px-6 py-3 rounded-lg font-semibold ${
                        !name || !email || nameError || emailError || rollNoError 
                          ? 'opacity-50 cursor-not-allowed bg-gray-600' 
                          : 'hover:bg-[#a01e42]'
                      }`}
                      style={{ backgroundColor: !name || !email || nameError || emailError || rollNoError ? undefined : '#b22049', color: 'white' }}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-white/10 p-4 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">Scan to Pay</h3>
                      <p className="text-sm text-white/80">
                        Pay <span className="font-bold">₹{amount || 0}</span>
                        {qr?.payee_name ? (
                          <> to <span className="font-semibold">{qr.payee_name}</span></>
                        ) : null}
                      </p>
                      {qr && (
                        <p className="text-xs text-white/60 mt-1">
                          QR: {qr.qr_code_id} • {qr.transactions_remaining} slots remaining
                        </p>
                      )}
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      {/* QR Code */}
                      <img src={qrUrl} className="w-48 h-48 object-contain" alt="Payment QR" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm text-white/80">Upload payment screenshot (50KB-1MB, JPEG/PNG/WebP)</label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center px-4 py-2 rounded-lg cursor-pointer border border-white/20 hover:bg-white/10">
                        <Upload className="w-4 h-4 mr-2" />
                        <span>Select Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      </label>
                      {file && <span className="text-sm text-white/80">{(file.size/1024).toFixed(0)} KB</span>}
                    </div>
                    {previewUrl && (
                      <div className="mt-2">
                        <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg border border-white/20" />
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <div className="text-xs text-white/70 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      ⚠️ Do not scroll. Complete payment and upload screenshot before leaving this page.
                    </div>
                    <button
                      onClick={handleSubmitProof}
                      disabled={submitting || !file}
                      className={`px-6 py-3 rounded-lg font-semibold ${submitting || !file ? 'opacity-70 cursor-not-allowed' : ''}`}
                      style={{ backgroundColor: '#b22049', color: 'white' }}
                    >
                      {submitting ? (
                        <span className="inline-flex items-center"><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</span>
                      ) : (
                        'Submit Proof'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}