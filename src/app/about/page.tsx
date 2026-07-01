import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/lenaproject/lena2.JPG"
                    alt="Olena Pruska, yoga teacher"
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">About Olena</span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A18] mt-2 mb-6 leading-tight">
                  Yoga isn't just a practice — <span className="italic text-[#7BA7BC]">it's a way of moving through life.</span>
                </h1>
                <div className="space-y-4 text-[#1A1A18]/70 leading-relaxed">
                  <p>
                    I'm Olena — a certified yoga teacher based in Huntington Beach, California. 
                    I was born in Ukraine and now call Southern California home. My journey into 
                    yoga began as a personal search for balance, and it changed everything.
                  </p>
                  <p>
                    I hold a 500-hour Yoga Teacher Training certification and have taught at 
                    CorePower Yoga and INSAND, where I combined functional fitness with restorative 
                    yoga. Today, I bring all of that to my own classes, private sessions, and retreats.
                  </p>
                  <p>
                    My classes are welcoming, grounding, and always a little bit joyful. I teach 
                    in English, Ukrainian, and Russian — so wherever you're from, there's a place 
                    for you on the mat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="py-16 bg-white border-y border-[#E8E4DE]">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="font-serif text-5xl text-[#7BA7BC] mb-2">500h+</p>
                <p className="text-sm text-[#1A1A18]/60 uppercase tracking-wider">Teacher Training Hours</p>
              </div>
              <div>
                <p className="font-serif text-5xl text-[#7BA7BC] mb-2">4</p>
                <p className="text-sm text-[#1A1A18]/60 uppercase tracking-wider">Yoga Styles Taught</p>
              </div>
              <div>
                <p className="font-serif text-5xl text-[#7BA7BC] mb-2">OC</p>
                <p className="text-sm text-[#1A1A18]/60 uppercase tracking-wider">Orange County & Beyond</p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A18] mb-12">Experience</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-2 bg-[#7BA7BC] rounded-full shrink-0"></div>
                <div>
                  <h3 className="font-medium text-[#1A1A18] text-lg">CorePower Yoga</h3>
                  <p className="text-[#7BA7BC] text-sm mb-1">Yoga Teacher</p>
                  <p className="text-[#1A1A18]/50 text-sm">Feb 2023 – Present</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-2 bg-[#7BA7BC] rounded-full shrink-0"></div>
                <div>
                  <h3 className="font-medium text-[#1A1A18] text-lg">INSAND</h3>
                  <p className="text-[#7BA7BC] text-sm mb-1">Fitness Coach & Restorative Yoga Instructor</p>
                  <p className="text-[#1A1A18]/50 text-sm">Oct 2023 – May 2024</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-2 bg-[#7BA7BC] rounded-full shrink-0"></div>
                <div>
                  <h3 className="font-medium text-[#1A1A18] text-lg">Independent Practice</h3>
                  <p className="text-[#7BA7BC] text-sm mb-1">Yoga Teacher · Orange County</p>
                  <p className="text-[#1A1A18]/50 text-sm">2024 – Present</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications & Languages */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="font-serif text-2xl text-[#1A1A18] mb-6">Certifications</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#7BA7BC] rounded-full mt-2"></span>
                    <span className="text-[#1A1A18]/70">500-Hour Yoga Teacher Training (RYT 500)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#7BA7BC] rounded-full mt-2"></span>
                    <span className="text-[#1A1A18]/70">200-Hour Foundation Teacher Training (RYT 200)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-[#7BA7BC] rounded-full mt-2"></span>
                    <span className="text-[#1A1A18]/70">Bachelor's Degree — Freight Forwarding</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#1A1A18] mb-6">Languages</h2>
                <p className="text-[#1A1A18]/70">
                  English · Ukrainian · Russian
                </p>
                <p className="text-sm text-[#1A1A18]/50 mt-3">
                  Teaching in multiple languages allows me to connect with students from diverse backgrounds.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certificate */}
        <section className="py-20 bg-[#FAFAF8]">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">Credential</span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A18] mt-2 mb-8">
              500-Hour Certification
            </h2>
            <div className="bg-white p-3 rounded-sm border border-[#E8E4DE] shadow-sm inline-block max-w-2xl w-full">
              <Image
                src="/certificate.png"
                alt="Olena Pruska — 500-Hour Hatha & Ashtanga Yoga Teacher Training Certificate (Adhiroha, Rishikesh)"
                width={1491}
                height={1055}
                className="w-full h-auto rounded-sm"
              />
            </div>
            <p className="text-sm text-[#1A1A18]/50 mt-4">
              Hatha &amp; Ashtanga Yoga Teacher Training, 500 Hour Level — Adhiroha, Rishikesh, India · 2024
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-28 md:py-36 overflow-hidden bg-[#FAFAF8]">
          {/* Background video at low opacity */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
            poster="/about-cta-poster.jpg"
          >
            <source src="/about-cta.mp4" type="video/mp4" />
          </video>
          {/* Soft wash to keep text legible */}
          <div className="absolute inset-0 bg-white/20" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1A18] mb-8 drop-shadow-sm">
              Ready to begin your journey?
            </h2>
            <Link
              href="/contact"
              className="inline-block bg-[#1A1A18] text-[#FAFAF8] px-8 py-4 text-sm font-medium rounded-sm hover:bg-[#7BA7BC] transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
