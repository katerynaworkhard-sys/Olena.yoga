'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`animate-hero-down fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FAFAF8]/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
      style={{ animationDelay: '0s', '--slide-distance': '-10px' } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-serif text-2xl font-medium tracking-tight text-[#1A1A18]"
          >
            Olena Pruska
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-[#1A1A18] hover:text-[#7BA7BC] transition-colors">
              Home
            </Link>
            <Link href="/schedule" className="text-sm font-medium text-[#1A1A18] hover:text-[#7BA7BC] transition-colors">
              Schedule
            </Link>
            <Link href="/about" className="text-sm font-medium text-[#1A1A18] hover:text-[#7BA7BC] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-[#1A1A18] hover:text-[#7BA7BC] transition-colors">
              Contact
            </Link>
          </div>

          <Link
            href="/schedule"
            className="bg-[#1A1A18] text-[#FAFAF8] px-5 py-2.5 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
          >
            Book a Class
          </Link>
        </div>
      </div>
    </nav>
  )
}
