import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: 'file:./prisma/dev.db',
})
const prisma = new PrismaClient({ adapter })

const sampleClasses = [
  { dayOfWeek: 'Monday', time: '5:30 PM', type: 'Hatha', duration: 60, location: 'Huntington Beach State Beach — parking lot B' },
  { dayOfWeek: 'Monday', time: '7:00 PM', type: 'Yin Yoga', duration: 75, location: 'Bolsa Chica State Beach' },
  { dayOfWeek: 'Tuesday', time: '5:00 PM', type: 'Hot Vinyasa', duration: 60, location: 'Newport Beach — Corona del Mar' },
  { dayOfWeek: 'Tuesday', time: '6:30 PM', type: 'Yoga Sculpt', duration: 55, location: 'Huntington Beach State Beach' },
  { dayOfWeek: 'Wednesday', time: '5:30 PM', type: 'Hatha', duration: 60, location: 'Huntington Beach State Beach' },
  { dayOfWeek: 'Wednesday', time: '7:00 PM', type: 'Yin Yoga', duration: 75, location: 'Sunset Beach' },
  { dayOfWeek: 'Thursday', time: '5:00 PM', type: 'Hot Vinyasa', duration: 60, location: 'Huntington Beach State Beach' },
  { dayOfWeek: 'Thursday', time: '6:30 PM', type: 'Yoga Sculpt', duration: 55, location: 'Bolsa Chica State Beach' },
  { dayOfWeek: 'Friday', time: '5:30 PM', type: 'Hatha', duration: 60, location: 'Huntington Beach State Beach' },
  { dayOfWeek: 'Friday', time: '7:00 PM', type: 'Yin Yoga', duration: 75, location: 'Newport Beach — Balboa Peninsula' },
  { dayOfWeek: 'Saturday', time: '8:00 AM', type: 'Hot Vinyasa', duration: 60, location: 'Huntington Beach State Beach' },
  { dayOfWeek: 'Saturday', time: '9:30 AM', type: 'Yoga Sculpt', duration: 55, location: 'Huntington Beach State Beach' },
]

async function main() {
  // Get next week's dates
  const today = new Date()
  const nextMonday = new Date(today)
  nextMonday.setDate(today.getDate() + (1 + 7 - today.getDay()) % 7 || 7)

  const dayIndex: Record<string, number> = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6,
  }

  for (const cls of sampleClasses) {
    const classDate = new Date(nextMonday)
    classDate.setDate(nextMonday.getDate() + dayIndex[cls.dayOfWeek])

    await prisma.yogaClass.create({
      data: {
        dayOfWeek: cls.dayOfWeek,
        date: classDate,
        time: cls.time,
        type: cls.type,
        duration: cls.duration,
        location: cls.location,
        maxSpots: 10,
      },
    })
  }

  console.log('Database seeded with sample classes!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
