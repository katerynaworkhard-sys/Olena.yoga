'use client'

import { useState, useEffect } from 'react'
import { X, Download, Plus, Trash2, LogOut } from 'lucide-react'

const ADMIN_PASSWORD = 'olena2025'

interface Booking {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  createdAt: string
  yogaClass: {
    dayOfWeek: string
    date: string
    time: string
    type: string
    location: string
  }
}

interface YogaClass {
  id: string
  dayOfWeek: string
  date: string
  time: string
  type: string
  duration: number
  location: string
  maxSpots: number
  _count: {
    bookings: number
  }
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'bookings' | 'schedule'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [classes, setClasses] = useState<YogaClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddClass, setShowAddClass] = useState(false)
  const [newClass, setNewClass] = useState({
    dayOfWeek: 'Monday',
    date: '',
    time: '',
    type: 'Vinyasa',
    duration: 60,
    location: '',
    maxSpots: 10,
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [bookingsRes, classesRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/classes'),
      ])
      
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData)
      }
      
      if (classesRes.ok) {
        const classesData = await classesRes.json()
        setClasses(classesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    setPassword('')
  }

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
    try {
      const response = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setBookings(bookings.filter(b => b.id !== id))
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return
    
    try {
      const response = await fetch(`/api/classes?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setClasses(classes.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Error deleting class:', error)
    }
  }

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      })
      
      if (response.ok) {
        const createdClass = await response.json()
        setClasses([...classes, { ...createdClass, _count: { bookings: 0 } }])
        setShowAddClass(false)
        setNewClass({
          dayOfWeek: 'Monday',
          date: '',
          time: '',
          type: 'Vinyasa',
          duration: 60,
          location: '',
          maxSpots: 10,
        })
      }
    } catch (error) {
      console.error('Error adding class:', error)
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Class Type', 'Day', 'Date', 'Time', 'Location', 'Booked At']
    const rows = bookings.map(b => [
      `${b.firstName} ${b.lastName}`,
      b.email,
      b.phone || '',
      b.yogaClass.type,
      b.yogaClass.dayOfWeek,
      new Date(b.yogaClass.date).toLocaleDateString(),
      b.yogaClass.time,
      b.yogaClass.location,
      new Date(b.createdAt).toLocaleString(),
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
        <div className="bg-white rounded-sm border border-[#E8E4DE] p-8 w-full max-w-md">
          <h1 className="font-serif text-2xl text-[#1A1A18] mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A18] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E4DE] rounded-sm focus:outline-none focus:border-[#7BA7BC]"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#1A1A18] text-[#FAFAF8] py-3 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E4DE] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="font-serif text-xl text-[#1A1A18]">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-[#1A1A18]/60 hover:text-[#1A1A18] transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E8E4DE]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'bookings'
                  ? 'border-[#7BA7BC] text-[#7BA7BC]'
                  : 'border-transparent text-[#1A1A18]/60 hover:text-[#1A1A18]'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'schedule'
                  ? 'border-[#7BA7BC] text-[#7BA7BC]'
                  : 'border-transparent text-[#1A1A18]/60 hover:text-[#1A1A18]'
              }`}
            >
              Schedule ({classes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {isLoading ? (
          <p className="text-center text-[#1A1A18]/60 py-12">Loading...</p>
        ) : activeTab === 'bookings' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl text-[#1A1A18]">All Bookings</h2>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-[#1A1A18] text-[#FAFAF8] px-4 py-2 text-sm rounded-sm hover:bg-[#7BA7BC] transition-colors"
              >
                <Download size={16} />
                Export to CSV
              </button>
            </div>
            
            {bookings.length === 0 ? (
              <p className="text-center text-[#1A1A18]/60 py-12">No bookings yet.</p>
            ) : (
              <div className="bg-white rounded-sm border border-[#E8E4DE] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#FAFAF8] border-b border-[#E8E4DE]">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#1A1A18]">Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#1A1A18]">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#1A1A18]">Class</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#1A1A18]">Date & Time</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#1A1A18]">Booked</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-[#1A1A18]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-[#E8E4DE] last:border-0">
                        <td className="px-4 py-3 text-sm">
                          {booking.firstName} {booking.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#1A1A18]/60">{booking.email}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="font-medium">{booking.yogaClass.type}</span>
                          <br />
                          <span className="text-xs text-[#1A1A18]/50">{booking.yogaClass.location}</span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {booking.yogaClass.dayOfWeek}, {new Date(booking.yogaClass.date).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-[#1A1A18]/50">{booking.yogaClass.time}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#1A1A18]/60">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl text-[#1A1A18]">Class Schedule</h2>
              <button
                onClick={() => setShowAddClass(true)}
                className="flex items-center gap-2 bg-[#7BA7BC] text-white px-4 py-2 text-sm rounded-sm hover:bg-[#1A1A18] transition-colors"
              >
                <Plus size={16} />
                Add New Class
              </button>
            </div>
            
            {classes.length === 0 ? (
              <p className="text-center text-[#1A1A18]/60 py-12">No classes scheduled.</p>
            ) : (
              <div className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-white rounded-sm border border-[#E8E4DE] p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">
                            {cls.dayOfWeek}
                          </span>
                          <span className="text-xs px-2 py-1 bg-[#7BA7BC]/10 text-[#7BA7BC] rounded-full">
                            {cls.type}
                          </span>
                        </div>
                        <h3 className="font-medium text-[#1A1A18]">{cls.time}</h3>
                        <p className="text-sm text-[#1A1A18]/60">{cls.duration} min • {cls.location}</p>
                        <p className="text-sm text-[#1A1A18]/60 mt-1">
                          {cls._count.bookings} / {cls.maxSpots} spots booked
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteClass(cls.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-[#1A1A18]">Add New Class</h2>
                <button
                  onClick={() => setShowAddClass(false)}
                  className="text-[#1A1A18]/60 hover:text-[#1A1A18]"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Day of Week</label>
                  <select
                    value={newClass.dayOfWeek}
                    onChange={(e) => setNewClass({ ...newClass, dayOfWeek: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC]"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={newClass.date}
                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Time</label>
                  <input
                    type="time"
                    required
                    value={newClass.time}
                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Class Type</label>
                  <select
                    value={newClass.type}
                    onChange={(e) => setNewClass({ ...newClass, type: e.target.value })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC]"
                  >
                    <option value="Vinyasa">Vinyasa</option>
                    <option value="Hot Vinyasa">Hot Vinyasa</option>
                    <option value="Hatha">Hatha</option>
                    <option value="Yin Yoga">Yin Yoga</option>
                    <option value="Yoga Sculpt">Yoga Sculpt</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Duration (minutes)</label>
                  <input
                    type="number"
                    required
                    min="30"
                    max="120"
                    value={newClass.duration}
                    onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Location</label>
                  <input
                    type="text"
                    required
                    value={newClass.location}
                    onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                    placeholder="e.g., Huntington Beach State Beach"
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1A1A18] mb-1.5">Max Spots</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={newClass.maxSpots}
                    onChange={(e) => setNewClass({ ...newClass, maxSpots: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-[#E8E4DE] rounded-sm text-sm focus:outline-none focus:border-[#7BA7BC]"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#1A1A18] text-[#FAFAF8] py-3 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
                >
                  Save Class
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
