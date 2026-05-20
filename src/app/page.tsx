'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { MapPin, Droplets, Sun, Leaf, Shirt, Sparkles } from "lucide-react"

export default function Home() {
  useEffect(() => {
    const section = document.querySelector('#about-strip');
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const cols = section.querySelectorAll('.about-col');
        const lines = section.querySelectorAll('.about-line');

        cols.forEach((col, i) => {
          setTimeout(() => col.classList.add('visible'), i * 200);
        });

        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('visible'), i * 200);
        });

        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [])
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-screen pt-20">
          <div className="max-w-7xl mx-auto lg:px-8 py-8 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 px-6 lg:px-0">
                {/* Label tags - delay 0.15s, slide 8px */}
                <div 
                  className="animate-hero-up flex flex-wrap gap-3 mb-6"
                  style={{ animationDelay: '0.15s', '--slide-distance': '8px' } as React.CSSProperties}
                >
                  <span className="text-xs uppercase tracking-wider text-[#C4B9A8] font-medium">California ®</span>
                  <span className="text-xs uppercase tracking-wider text-[#C4B9A8] font-medium">•</span>
                  <span className="text-xs uppercase tracking-wider text-[#C4B9A8] font-medium">Certified 500h RYT</span>
                  <span className="text-xs uppercase tracking-wider text-[#C4B9A8] font-medium">•</span>
                  <span className="text-xs uppercase tracking-wider text-[#C4B9A8] font-medium">English · Ukrainian · Russian</span>
                </div>

                {/* "Beach Yoga" - delay 0.30s, slide 20px */}
                <h1 
                  className="animate-hero-up font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-[#1A1A18] mb-2"
                  style={{ animationDelay: '0.30s', '--slide-distance': '20px' } as React.CSSProperties}
                >
                  Beach Yoga
                </h1>

                {/* "Huntington Beach" - delay 0.45s, slide 20px */}
                <h1 
                  className="animate-hero-up font-serif text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] italic text-[#7BA7BC] mb-6"
                  style={{ animationDelay: '0.45s', '--slide-distance': '20px' } as React.CSSProperties}
                >
                  Huntington Beach
                </h1>

                {/* Subtitle - delay 0.60s, slide 12px */}
                <p 
                  className="animate-hero-up text-lg text-[#1A1A18]/70 mb-6 max-w-md"
                  style={{ animationDelay: '0.60s', '--slide-distance': '12px' } as React.CSSProperties}
                >
                  Vinyasa, Hatha & Yin — on the sand, under the California sky.
                </p>

                {/* Button - delay 0.75s, slide 8px */}
                <Link
                  href="/schedule"
                  className="animate-hero-up inline-block bg-[#1A1A18] text-[#FAFAF8] px-8 py-4 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
                  style={{ animationDelay: '0.75s', '--slide-distance': '8px' } as React.CSSProperties}
                >
                  View Schedule
                </Link>
              </div>

              {/* Hero photo - delay 0.90s, scale animation */}
              <div 
                className="animate-hero-scale order-1 lg:order-2 relative w-full h-[70vh] lg:h-[85vh]"
                style={{ animationDelay: '0.90s' } as React.CSSProperties}
              >
                <Image
                  src="/lenaproject/lena1.JPG"
                  alt="Olena Pruska - Beach Yoga Teacher"
                  fill
                  className="object-cover lg:rounded-sm"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Strip - 3 Columns */}
        <section id="about-strip" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="about-col flex">
                <div className="about-line w-0.5 bg-[#7BA7BC] self-stretch mr-6 shrink-0" />
                <div className="py-2">
                  <h3 className="font-serif text-xl mb-3 text-[#1A1A18]">Move with Intention</h3>
                  <p className="text-sm text-[#1A1A18]/60 leading-relaxed">
                    Every class blends physical flow with breath awareness, meeting you where you are.
                  </p>
                </div>
              </div>
              {/* Column 2 */}
              <div className="about-col flex">
                <div className="about-line w-0.5 bg-[#7BA7BC] self-stretch mr-6 shrink-0" />
                <div className="py-2">
                  <h3 className="font-serif text-xl mb-3 text-[#1A1A18]">All Levels Welcome</h3>
                  <p className="text-sm text-[#1A1A18]/60 leading-relaxed">
                    Whether it's your first sun salutation or you've been practicing for years, there's space for you on the mat.
                  </p>
                </div>
              </div>
              {/* Column 3 */}
              <div className="about-col flex">
                <div className="about-line w-0.5 bg-[#7BA7BC] self-stretch mr-6 shrink-0" />
                <div className="py-2">
                  <h3 className="font-serif text-xl mb-3 text-[#1A1A18]">Outdoors & Alive</h3>
                  <p className="text-sm text-[#1A1A18]/60 leading-relaxed">
                    Feel the sand beneath your feet and the ocean breeze on your skin. Nature is the studio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tagline */}
        <section className="py-24 bg-[#FAFAF8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1A1A18] leading-relaxed">
              "Where the ocean meets your breath — that's where we practice."
            </p>
          </div>
        </section>

        {/* Classes Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">Classes</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A18] mt-2">Find Your Flow</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group">
                <div className="bg-[#7BA7BC]/10 p-6 rounded-sm mb-4 aspect-square flex items-center justify-center">
                  <Droplets className="w-12 h-12 text-[#7BA7BC]" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-[#1A1A18]">Hot Vinyasa</h3>
                <p className="text-sm text-[#1A1A18]/60">Dynamic, heat-building flow that strengthens and energizes.</p>
              </div>
              <div className="group">
                <div className="bg-[#8B9A7C]/10 p-6 rounded-sm mb-4 aspect-square flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-[#8B9A7C]" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-[#1A1A18]">Hatha</h3>
                <p className="text-sm text-[#1A1A18]/60">Foundational postures held with intention. Perfect for all levels.</p>
              </div>
              <div className="group">
                <div className="bg-[#A69CC0]/10 p-6 rounded-sm mb-4 aspect-square flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-[#A69CC0]" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-[#1A1A18]">Yin Yoga</h3>
                <p className="text-sm text-[#1A1A18]/60">Deep, slow, restorative. For recovery, flexibility, and calm.</p>
              </div>
              <div className="group">
                <div className="bg-[#C98B76]/10 p-6 rounded-sm mb-4 aspect-square flex items-center justify-center">
                  <Sun className="w-12 h-12 text-[#C98B76]" />
                </div>
                <h3 className="font-serif text-xl mb-2 text-[#1A1A18]">Yoga Sculpt</h3>
                <p className="text-sm text-[#1A1A18]/60">Strength meets yoga. Expect sweat, challenge, and results.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What to Bring Section */}
        <section className="py-20 bg-[#C4B9A8]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-sm p-8 md:p-12">
              <h2 className="font-serif text-3xl text-[#1A1A18] mb-8 text-center">What to Bring</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🧘</span>
                  <p className="text-sm text-[#1A1A18]/70">Yoga mat (or rent one from Olena — ask when booking)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">💧</span>
                  <p className="text-sm text-[#1A1A18]/70">Water bottle (stay hydrated in the sun!)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🕶️</span>
                  <p className="text-sm text-[#1A1A18]/70">Sunscreen & sunglasses</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🌿</span>
                  <p className="text-sm text-[#1A1A18]/70">Light towel or blanket (for Yin/Savasana)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">👟</span>
                  <p className="text-sm text-[#1A1A18]/70">Comfortable activewear</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">✅</span>
                  <p className="text-sm text-[#1A1A18]/70">Open mind & good vibes</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">Pricing</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A18] mt-2">Invest in Your Practice</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-[#E8E4DE] rounded-sm p-8 text-center hover:border-[#7BA7BC] transition-colors">
                <h3 className="font-serif text-2xl text-[#1A1A18] mb-2">Drop-In</h3>
                <p className="font-serif text-4xl text-[#7BA7BC] mb-2">$25</p>
                <p className="text-sm text-[#1A1A18]/60 mb-6">Single class. Pay and show up.</p>
                <Link
                  href="/schedule"
                  className="inline-block w-full bg-[#1A1A18] text-[#FAFAF8] py-3 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
                >
                  Book Now
                </Link>
              </div>
              <div className="border border-[#7BA7BC] rounded-sm p-8 text-center relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7BA7BC] text-white text-xs px-3 py-1 rounded-full">
                  Popular
                </span>
                <h3 className="font-serif text-2xl text-[#1A1A18] mb-2">3-Class Pack</h3>
                <p className="font-serif text-4xl text-[#7BA7BC] mb-2">$65</p>
                <p className="text-sm text-[#1A1A18]/60 mb-1">Save a little, flow more.</p>
                <p className="text-xs text-[#7BA7BC] mb-6">$21.67/class</p>
                <Link
                  href="/request/3-class-pack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full bg-[#7BA7BC] text-white py-3 text-sm font-medium rounded-sm hover:bg-[#1A1A18] transition-colors"
                >
                  Book Now
                </Link>
              </div>
              <div className="border border-[#E8E4DE] rounded-sm p-8 text-center hover:border-[#7BA7BC] transition-colors">
                <h3 className="font-serif text-2xl text-[#1A1A18] mb-2">Monthly Unlimited</h3>
                <p className="font-serif text-4xl text-[#7BA7BC] mb-2">$180</p>
                <p className="text-sm text-[#1A1A18]/60 mb-1">12 classes. Full commitment, full results.</p>
                <p className="text-xs text-[#7BA7BC] mb-6">$15/class</p>
                <Link
                  href="/request/monthly-unlimited"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full bg-[#1A1A18] text-[#FAFAF8] py-3 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">Testimonials</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#1A1A18] mt-2">What Students Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-sm border border-[#E8E4DE]">
                <p className="text-[#1A1A18]/70 mb-6 leading-relaxed">
                  "Olena's classes are the highlight of my week. She creates such a welcoming, peaceful atmosphere on the beach."
                </p>
                <p className="text-sm font-medium text-[#1A1A18]">— Sarah M., Huntington Beach</p>
              </div>
              <div className="bg-white p-8 rounded-sm border border-[#E8E4DE]">
                <p className="text-[#1A1A18]/70 mb-6 leading-relaxed">
                  "I've tried many yoga teachers and Olena is truly special. Her cues are clear, her energy is calming."
                </p>
                <p className="text-sm font-medium text-[#1A1A18]">— Jessica T., Newport Beach</p>
              </div>
              <div className="bg-white p-8 rounded-sm border border-[#E8E4DE]">
                <p className="text-[#1A1A18]/70 mb-6 leading-relaxed">
                  "The Yin class at sunset was unforgettable. I left feeling completely renewed."
                </p>
                <p className="text-sm font-medium text-[#1A1A18]">— Mike R., Orange County</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 bg-[#1A1A18]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#FAFAF8] mb-8">
              Ready to roll out your mat?
            </h2>
            <Link
              href="/schedule"
              className="inline-block bg-[#FAFAF8] text-[#1A1A18] px-8 py-4 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] hover:text-white transition-colors"
            >
              See This Week's Schedule
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
