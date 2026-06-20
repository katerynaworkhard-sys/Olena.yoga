'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // White text while overlaid on the dark hero video and not yet scrolled.
  const light = overlay && !scrolled

  const linkClass = light
    ? 'text-sm font-medium text-white/90 hover:text-white transition-colors'
    : 'text-sm font-medium text-[#1A1A18] hover:text-[#7BA7BC] transition-colors'

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
            className={`font-serif text-2xl font-medium tracking-tight transition-colors ${
              light ? 'text-white' : 'text-[#1A1A18]'
            }`}
          >
            Olena Pruska
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={linkClass}>
              Home
            </Link>
            <Link href="/schedule" className={linkClass}>
              Schedule
            </Link>
            <Link href="/about" className={linkClass}>
              About
            </Link>
            <Link href="/contact" className={linkClass}>
              Contact
            </Link>
            <Link href="/inquiries" className={linkClass}>
              Make an Inquiry
            </Link>
          </div>

          <Link
            href="/schedule"
            className={`px-5 py-2.5 text-sm font-medium rounded-sm transition-colors ${
              light
                ? 'bg-white text-[#1A1A18] hover:bg-[#7BA7BC] hover:text-white'
                : 'bg-[#1A1A18] text-[#FAFAF8] hover:bg-[#7BA7BC]'
            }`}
          >
            Book a Class
          </Link>
        </div>
      </div>
    </nav>
  )
}
