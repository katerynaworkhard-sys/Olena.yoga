import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ClassCard from '@/components/ClassCard'

async function getClasses() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const classes = await prisma.yogaClass.findMany({
    where: {
      date: {
        gte: today,
      },
    },
    include: {
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: [
      { date: 'asc' },
      { time: 'asc' },
    ],
  })

  // Serialize dates to strings for client components
  return classes.map(cls => ({
    ...cls,
    date: cls.date.toISOString(),
    createdAt: cls.createdAt.toISOString(),
    updatedAt: cls.updatedAt.toISOString(),
  }))
}

export default async function SchedulePage() {
  const classes = await getClasses()

  // Group classes by day
  const groupedClasses = classes.reduce((acc, cls) => {
    const day = cls.dayOfWeek
    if (!acc[day]) acc[day] = []
    acc[day].push(cls)
    return acc
  }, {} as Record<string, typeof classes>)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Header */}
        <section className="py-16 bg-[#FAFAF8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <span className="text-xs uppercase tracking-wider text-[#7BA7BC] font-medium">Schedule</span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A18] mt-2 mb-4">
              This Week's Classes
            </h1>
            <p className="text-lg text-[#1A1A18]/60 max-w-2xl">
              Classes across Huntington Beach & Orange County.
              Check each session for the exact location.
            </p>
          </div>
        </section>

        {/* Schedule */}
        <section className="py-12 bg-white min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {classes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#1A1A18]/60 text-lg">No upcoming classes scheduled.</p>
                <p className="text-[#1A1A18]/40 text-sm mt-2">Check back soon for new sessions!</p>
              </div>
            ) : (
              <div className="space-y-12">
                {days.map((day) => {
                  const dayClasses = groupedClasses[day]
                  if (!dayClasses || dayClasses.length === 0) return null

                  return (
                    <div key={day}>
                      <h2 className="font-serif text-2xl text-[#1A1A18] mb-6 pb-2 border-b border-[#E8E4DE]">
                        {day}
                      </h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dayClasses.map((cls) => (
                          <ClassCard key={cls.id} yogaClass={cls} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* What to Bring Reminder */}
        <section className="py-12 bg-[#C4B9A8]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="bg-white rounded-sm p-6 text-center">
              <p className="text-[#1A1A18]/70 text-sm">
                <span className="font-medium">What to bring:</span> Bring your mat, water, and a light towel or blanket.
                Wear comfortable activewear you can move in.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
