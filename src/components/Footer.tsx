import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A18] text-[#FAFAF8] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-medium mb-3">Olena Pruska</h3>
            <p className="text-[#C4B9A8] text-sm">
              Beach yoga for every body. Orange County, CA.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4 text-[#C4B9A8]">
              Navigation
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm hover:text-[#7BA7BC] transition-colors">Home</Link>
              <Link href="/schedule" className="text-sm hover:text-[#7BA7BC] transition-colors">Schedule</Link>
              <Link href="/about" className="text-sm hover:text-[#7BA7BC] transition-colors">About</Link>
              <Link href="/contact" className="text-sm hover:text-[#7BA7BC] transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4 text-[#C4B9A8]">
              Connect
            </h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm hover:text-[#7BA7BC] transition-colors">Instagram</a>
              <a href="#" className="text-sm hover:text-[#7BA7BC] transition-colors">WhatsApp</a>
              <a href="mailto:olena.pruska@yahoo.com" className="text-sm hover:text-[#7BA7BC] transition-colors">
                olena.pruska@yahoo.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#C4B9A8]/20 mt-12 pt-8 text-center text-sm text-[#C4B9A8]">
          © 2025 Olena Pruska. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
