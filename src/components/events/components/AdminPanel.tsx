import { useState, useEffect } from 'react'
import { Shield, Plus, Edit, Trash2, Users, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'

interface Club {
  id: string
  name: string
  description: string
  short_description: string
  logo_url: string | null
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
  club_id?: string
}

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  onRefresh?: () => void
}

export default function AdminPanel({ isOpen, onClose, onRefresh }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'clubs' | 'events' | 'participants'>('clubs')
  const [clubs, setClubs] = useState<Club[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingClub, setEditingClub] = useState<Club | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showClubForm, setShowClubForm] = useState(false)
  const [showEventForm, setShowEventForm] = useState(false)
  const { user } = useAuth()

  // Check if user is admin (you can implement your own admin logic)
  const isAdmin = user?.email?.includes('admin') || user?.email === 'admin@campus.com'

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchData()
    }
  }, [isOpen, isAdmin])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [clubsResponse, eventsResponse, usersResponse] = await Promise.all([
        supabase.from('clubs').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.auth.admin.listUsers()
      ])

      if (clubsResponse.error) throw clubsResponse.error
      if (eventsResponse.error) throw eventsResponse.error

      setClubs(clubsResponse.data || [])
      setEvents(eventsResponse.data || [])
      setUsers(usersResponse.data?.users || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveClub = async (clubData: Partial<Club>) => {
    try {
      if (editingClub) {
        const { error } = await supabase
          .from('clubs')
          .update(clubData)
          .eq('id', editingClub.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('clubs')
          .insert(clubData)
        if (error) throw error
      }
      
      fetchData()
      onRefresh?.()
      setEditingClub(null)
      setShowClubForm(false)
    } catch (error) {
      console.error('Error saving club:', error)
    }
  }

  const handleDeleteClub = async (id: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return
    
    try {
      const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting club:', error)
    }
  }

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('events')
          .insert(eventData)
        if (error) throw error
      }
      
      fetchData()
      onRefresh?.()
      setEditingEvent(null)
      setShowEventForm(false)
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  if (!isOpen) return null

  if (!isAdmin) {
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
          >
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You don't have admin privileges</p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    )
  }

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
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage clubs and events</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'clubs', label: 'Clubs', icon: Users },
              { id: 'events', label: 'Events', icon: Plus },
              { id: 'participants', label: 'Participants', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {activeTab === 'clubs' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Clubs</h3>
                  <button
                    onClick={() => {
                      setEditingClub(null)
                      setShowClubForm(true)
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Club</span>
                  </button>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="card p-4 animate-pulse">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {clubs.map((club) => (
                      <div key={club.id} className="card p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                              {club.logo_url ? (
                                <img src={club.logo_url} alt={club.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <span className="text-white font-bold text-xl">{club.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">{club.name}</h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">{club.short_description}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingClub(club)
                                setShowClubForm(true)
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClub(club.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Manage Events</h3>
                  <button
                    onClick={() => {
                      setEditingEvent(null)
                      setShowEventForm(true)
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="card p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                            {event.image_url ? (
                              <img src={event.image_url} alt={event.title} className="w-full h-full rounded-lg object-cover" />
                            ) : (
                              <Plus className="w-8 h-8 text-primary" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{event.tagline}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingEvent(event)
                              setShowEventForm(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Event Participants</h3>
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Registered Users</h4>
                  {users.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No users registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {users.map((user) => (
                        <div key={user.id} className="card p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{user.email}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Status: {user.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.email_confirmed_at 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {user.email_confirmed_at ? 'Active' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Club Form Modal */}
        <ClubFormModal
          isOpen={showClubForm}
          onClose={() => {
            setShowClubForm(false)
            setEditingClub(null)
          }}
          club={editingClub}
          onSave={handleSaveClub}
        />

        {/* Event Form Modal */}
        <EventFormModal
          isOpen={showEventForm}
          onClose={() => {
            setShowEventForm(false)
            setEditingEvent(null)
          }}
          event={editingEvent}
          clubs={clubs}
          onSave={handleSaveEvent}
        />
      </div>
    </AnimatePresence>
  )
}

// Club Form Modal Component
function ClubFormModal({ isOpen, onClose, club, onSave }: {
  isOpen: boolean
  onClose: () => void
  club: Club | null
  onSave: (data: Partial<Club>) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    logo_url: ''
  })

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name,
        short_description: club.short_description,
        description: club.description,
        logo_url: club.logo_url || ''
      })
    } else {
      setFormData({
        name: '',
        short_description: '',
        description: '',
        logo_url: ''
      })
    }
  }, [club])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4">{club ? 'Edit Club' : 'Add Club'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Club Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Full Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {club ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Event Form Modal Component
function EventFormModal({ isOpen, onClose, event, clubs, onSave }: {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  clubs: Club[]
  onSave: (data: Partial<Event>) => void
}) {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    image_url: '',
    rules: '',
    schedule: '',
    venue: '',
    club_id: ''
  })

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        tagline: event.tagline,
        description: event.description,
        image_url: event.image_url || '',
        rules: event.rules || '',
        schedule: event.schedule || '',
        venue: event.venue || '',
        club_id: event.club_id || ''
      })
    } else {
      setFormData({
        title: '',
        tagline: '',
        description: '',
        image_url: '',
        rules: '',
        schedule: '',
        venue: '',
        club_id: ''
      })
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{event ? 'Edit Event' : 'Add Event'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Club</label>
              <select
                value={formData.club_id}
                onChange={(e) => setFormData({ ...formData, club_id: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Schedule</label>
              <input
                type="text"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., March 15, 2024 at 6:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Main Auditorium"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rules & Guidelines</label>
            <textarea
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary">
              {event ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}