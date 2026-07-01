'use client'

import { useState, useEffect, useCallback } from 'react'
import { Trash2, LogOut } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: string
  createdAt: string
}

interface BusinessInquiry {
  id: string
  name: string
  email: string
  company: string | null
  location: string | null
  inquiryType: string
  preferredDates: string | null
  message: string
  status: string
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'messages' | 'inquiries'>('messages')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [messagesRes, inquiriesRes] = await Promise.all([
        fetch('/api/messages'),
        fetch('/api/inquiries'),
      ])

      if (messagesRes.status === 401 || inquiriesRes.status === 401) {
        setIsAuthenticated(false)
        return
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json()
        setMessages(messagesData)
      }

      if (inquiriesRes.ok) {
        const inquiriesData = await inquiriesRes.json()
        setInquiries(inquiriesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/session')
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (data.authenticated) {
          setIsAuthenticated(true)
          return fetchData()
        }
        setIsLoading(false)
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [fetchData])

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      const response = await fetch(`/api/messages?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== id))
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return
    try {
      const response = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setInquiries(inquiries.filter(i => i.id !== id))
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setPassword('')
        setIsAuthenticated(true)
        fetchData()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Incorrect password')
      }
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      // proceed even if the request fails — the cookie is the source of truth
    }
    setIsAuthenticated(false)
    setPassword('')
    setMessages([])
    setInquiries([])
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
              onClick={() => setActiveTab('messages')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'messages'
                  ? 'border-[#7BA7BC] text-[#7BA7BC]'
                  : 'border-transparent text-[#1A1A18]/60 hover:text-[#1A1A18]'
              }`}
            >
              Messages ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'inquiries'
                  ? 'border-[#7BA7BC] text-[#7BA7BC]'
                  : 'border-transparent text-[#1A1A18]/60 hover:text-[#1A1A18]'
              }`}
            >
              Inquiries ({inquiries.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {isLoading ? (
          <p className="text-center text-[#1A1A18]/60 py-12">Loading...</p>
        ) : activeTab === 'messages' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl text-[#1A1A18]">Contact Messages</h2>
            </div>

            {messages.length === 0 ? (
              <p className="text-center text-[#1A1A18]/60 py-12">No messages yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="bg-white rounded-sm border border-[#E8E4DE] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">
                            Contact
                          </span>
                          <span className="text-xs text-[#1A1A18]/40">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-medium text-[#1A1A18]">{msg.name}</h3>
                        <div className="text-sm text-[#1A1A18]/70 mt-1 space-y-0.5">
                          <p>
                            <a href={`mailto:${msg.email}`} className="hover:text-[#7BA7BC] transition-colors">
                              {msg.email}
                            </a>
                          </p>
                          <p>
                            <a href={`tel:${msg.phone}`} className="hover:text-[#7BA7BC] transition-colors">
                              {msg.phone}
                            </a>
                          </p>
                        </div>
                        <p className="text-sm text-[#1A1A18]/80 mt-3 p-3 bg-[#FAFAF8] border-l-2 border-[#7BA7BC] whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl text-[#1A1A18]">Partnership Inquiries</h2>
            </div>

            {inquiries.length === 0 ? (
              <p className="text-center text-[#1A1A18]/60 py-12">No inquiries yet.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white rounded-sm border border-[#E8E4DE] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">
                            {inq.inquiryType}
                          </span>
                          <span className="text-xs text-[#1A1A18]/40">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-medium text-[#1A1A18]">
                          {inq.name}
                          {inq.company && (
                            <span className="text-[#1A1A18]/60 font-normal"> · {inq.company}</span>
                          )}
                        </h3>
                        <div className="text-sm text-[#1A1A18]/70 mt-1 space-y-0.5">
                          <p>
                            <a href={`mailto:${inq.email}`} className="hover:text-[#7BA7BC] transition-colors">
                              {inq.email}
                            </a>
                          </p>
                          {inq.location && <p>📍 {inq.location}</p>}
                          {inq.preferredDates && (
                            <p className="text-[#1A1A18]/60">Preferred dates: {inq.preferredDates}</p>
                          )}
                        </div>
                        <p className="text-sm text-[#1A1A18]/80 mt-3 p-3 bg-[#FAFAF8] border-l-2 border-[#7BA7BC] whitespace-pre-wrap">
                          {inq.message}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="text-red-500 hover:text-red-700 transition-colors shrink-0"
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
    </div>
  )
}
