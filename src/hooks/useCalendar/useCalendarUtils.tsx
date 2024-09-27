import {
  startOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  getDate,
  getMonth,
  getYear,
  isValid,
  parseISO,
  format,
} from 'date-fns'

export const hours = [
  '오전 1시',
  '오전 2시',
  '오전 3시',
  '오전 4시',
  '오전 5시',
  '오전 6시',
  '오전 7시',
  '오전 8시',
  '오전 9시',
  '오전 10시',
  '오전 11시',
  '오후 12시',
  '오후 1시',
  '오후 2시',
  '오후 3시',
  '오후 4시',
  '오후 5시',
  '오후 6시',
  '오후 7시',
  '오후 8시',
  '오후 9시',
  '오후 10시',
  '오후 11시',
  '',
]

export const TimeSlot: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <div className="relative flex h-[48px] flex-[1_0_0] items-center justify-center border-b border-l border-gray-200">
    {children}
  </div>
)

export const daysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate()
}

export const getFirstDayofMonth = (year: number, month: number) => {
  return new Date(year, month - 1, 1).getDay()
}

export const getPreviousMonthDays = (year: number, month: number) => {
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  return daysInMonth(prevYear, prevMonth)
}

export const formatDate = (date: number) => {
  return date.toString().padStart(2, '0')
}

// 요일 변환 함수
const getDayOfWeek = (date: Date): string => {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[date.getDay()]
}

// 시간 포맷 변환 함수
const formatTime = (date: Date): string => {
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = hours >= 12 ? '오후' : '오전'
  const adjustedHours = hours % 12 === 0 ? 12 : hours % 12
  return `${period} ${adjustedHours}:${minutes}`
}

// 날짜와 시간 포맷팅 함수
export const formatDateTime = (startDate: string, endDate?: string): string => {
  const start = parseISO(startDate)
  const end = endDate ? parseISO(endDate) : undefined

  if (!isValid(start)) return ''

  const startDateFormatted =
    format(start, 'yyyy. MM. dd') +
    `(${getDayOfWeek(start)}) ${formatTime(start)}`

  const endDateFormatted = end ? formatTime(end) : ''

  if (!end || startDate === endDate) {
    return `${format(start, 'yyyy. MM. dd')}(${getDayOfWeek(start)}) `
  }

  return `${startDateFormatted} ~ ${endDateFormatted}`
}

interface DayInfo {
  day: number
  isThisMonth: boolean
  date: Date
}

export const generateCalendar = (date: Date): DayInfo[][] => {
  const month = getMonth(date)
  const year = getYear(date)

  const firstDayOfMonth = startOfMonth(date)
  const startOfCalendar = startOfWeek(firstDayOfMonth)
  const endOfCalendar = endOfWeek(addDays(startOfMonth(addMonths(date, 1)), -1))

  const weeks: DayInfo[][] = []
  let currentDay = startOfCalendar

  while (currentDay <= endOfCalendar) {
    const week: DayInfo[] = []
    for (let i = 0; i < 7; i++) {
      week.push({
        day: getDate(currentDay),
        isThisMonth: getMonth(currentDay) === month,
        date: new Date(currentDay),
      })
      currentDay = addDays(currentDay, 1)
    }
    weeks.push(week)
  }

  while (weeks.length < 6) {
    const lastWeek = weeks[weeks.length - 1]
    const lastDayOfLastWeek = lastWeek[lastWeek.length - 1].date
    const newWeek: DayInfo[] = []
    for (let i = 0; i < 7; i++) {
      const newDay = addDays(lastDayOfLastWeek, i + 1)
      newWeek.push({
        day: getDate(newDay),
        isThisMonth: false,
        date: new Date(newDay),
      })
    }
    weeks.push(newWeek)
  }

  return weeks
}
