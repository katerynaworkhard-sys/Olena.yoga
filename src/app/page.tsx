'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

type YogaStyle = {
  title: string
  image: string
  shortDesc: string
  longDesc: string
}

const CLASSES: YogaStyle[] = [
  {
    title: "Vinyasa",
    image: "/classes/vinyasa.jpg",
    shortDesc: "Dynamic, breath-led flow that strengthens and energizes.",
    longDesc:
      "A breath-led flow where every movement meets the rhythm of your inhale and exhale. Expect a steady build of heat — not from a heated studio, but from your own ujjayi breath and the steady cadence of the sequence. You'll move through sun salutations, balancing postures, and grounding flows, finishing in a deep, well-earned savasana with the sound of the waves beside you. Best for anyone who wants to feel strong, focused, and fully present by the end.",
  },
  {
    title: "Hatha",
    image: "/classes/hatha.jpg",
    shortDesc: "Foundational postures held with intention. Perfect for all levels.",
    longDesc:
      "The classical foundation of yoga. We hold each posture long enough to find the breath inside it — exploring alignment, refining subtle muscular engagement, and letting the body settle into stillness. Slower than Vinyasa, but never passive. Perfect if you're new to the mat, recovering from a long week, or simply want to remember what it feels like to move with intention. Open to every level.",
  },
  {
    title: "Yin Yoga",
    image: "/classes/yin-yoga.jpg",
    shortDesc: "Deep, slow, restorative. For recovery, flexibility, and calm.",
    longDesc:
      "Long, quiet holds — three to five minutes per pose — targeting the deep connective tissue around the hips, spine, and shoulders. We meet the body where it is and let gravity do the work. Yin is for nervous-system reset, joint mobility, and the kind of release you can't force in faster classes. Bring a blanket. The ocean takes care of the soundtrack.",
  },
  {
    title: "Yoga Sculpt",
    image: "/classes/yoga-sculpt.jpg",
    shortDesc: "Strength meets yoga. Expect sweat, challenge, and results.",
    longDesc:
      "Yoga meets strength training. We weave light weights, body-weight resistance, and short cardio bursts into a flowing yoga structure — squats, lunges, presses, all stitched together with breath. Expect to sweat, expect to feel it tomorrow, and expect to leave grinning. Bring water and a willing attitude.",
  },
]

export default function Home() {
  const [activeClass, setActiveClass] = useState<YogaStyle | null>(null)

  // Close the class modal on Escape and lock background scroll while open.
  useEffect(() => {
    if (!activeClass) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveClass(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeClass])

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
      <Navbar overlay />
      <main className="flex-1">
        {/* Hero Section — full-bleed background video */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background video */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-poster.jpg"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Dark overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />

          {/* Centered content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            {/* Label tags - delay 0.15s, slide 8px */}
            <div
              className="animate-hero-up flex flex-wrap justify-center items-center gap-3 mb-6"
              style={{ animationDelay: '0.15s', '--slide-distance': '8px' } as React.CSSProperties}
            >
              <span className="text-xs uppercase tracking-wider text-white/80 font-medium">California ®</span>
              <span className="text-xs uppercase tracking-wider text-white/80 font-medium">•</span>
              <span className="text-xs uppercase tracking-wider text-white/80 font-medium">Certified 500h RYT</span>
              <span className="text-xs uppercase tracking-wider text-white/80 font-medium">•</span>
              <span className="text-xs uppercase tracking-wider text-white/80 font-medium">English · Ukrainian · Russian</span>
            </div>

            {/* "Beach Yoga" - delay 0.30s, slide 20px */}
            <h1
              className="animate-hero-up font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] text-white drop-shadow-lg"
              style={{ animationDelay: '0.30s', '--slide-distance': '20px' } as React.CSSProperties}
            >
              Beach Yoga
            </h1>

            {/* "Huntington Beach" - delay 0.45s, slide 20px */}
            <h1
              className="animate-hero-up font-serif text-6xl md:text-7xl lg:text-8xl font-light leading-[1.05] italic text-white drop-shadow-lg mb-6"
              style={{ animationDelay: '0.45s', '--slide-distance': '20px' } as React.CSSProperties}
            >
              Huntington Beach
            </h1>

            {/* Subtitle - delay 0.60s, slide 12px */}
            <p
              className="animate-hero-up text-lg md:text-xl text-white/90 mb-8 max-w-xl mx-auto drop-shadow"
              style={{ animationDelay: '0.60s', '--slide-distance': '12px' } as React.CSSProperties}
            >
              Vinyasa, Hatha & Yin — on the sand, under the California sky.
            </p>

            {/* Button - delay 0.75s, slide 8px */}
            <Link
              href="/schedule"
              className="animate-hero-up inline-block bg-white text-[#1A1A18] px-8 py-4 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] hover:text-white transition-colors"
              style={{ animationDelay: '0.75s', '--slide-distance': '8px' } as React.CSSProperties}
            >
              View Schedule
            </Link>
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
              {CLASSES.map((cls) => (
                <button
                  key={cls.title}
                  onClick={() => setActiveClass(cls)}
                  className="group text-left cursor-pointer"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-sm">
                    <Image
                      src={cls.image}
                      alt={`${cls.title} beach yoga`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-[#1A1A18] group-hover:text-[#7BA7BC] transition-colors">{cls.title}</h3>
                  <p className="text-sm text-[#1A1A18]/60">{cls.shortDesc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* What to Bring Section */}
        <section className="py-24 bg-gradient-to-b from-white via-[#7BA7BC]/15 to-[#FAFAF8]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A18] mb-12 text-center">What to Bring</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
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

      {/* Class detail modal */}
      {activeClass && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveClass(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeClass.title} class details`}
        >
          <div
            className="relative bg-white rounded-lg w-full max-w-xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveClass(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#1A1A18] hover:bg-[#FAFAF8] transition-colors"
            >
              <X size={18} />
            </button>

            {/* Image header with title overlay */}
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={activeClass.image}
                alt={`${activeClass.title} beach yoga`}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-t-lg" />
              <h3 className="absolute bottom-5 left-6 font-serif text-4xl text-white drop-shadow-md">
                {activeClass.title}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <p className="text-[#1A1A18]/80 leading-relaxed mb-6">
                {activeClass.longDesc}
              </p>
              <Link
                href="/schedule"
                className="block w-full bg-[#1A1A18] text-white text-center py-4 text-sm font-medium tracking-wider uppercase rounded-sm hover:bg-[#7BA7BC] transition-colors"
              >
                Reserve Your Spot
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
