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

export const generateCalendar = (year: number, month: number) => {
  const days = daysInMonth(year, month)
  const firstDay = getFirstDayofMonth(year, month)
  const prevMonthDays = getPreviousMonthDays(year, month)

  const weeks = []
  let week = Array(7).fill('')
  let dayCounter = 1
  let nextMonthDayCounter = 1

  for (let i = firstDay - 1; i >= 0; i--) {
    week[i] = { day: prevMonthDays - (firstDay - 1 - i), isThisMonth: false }
  }

  for (let i = firstDay; i < 7; i++) {
    week[i] = { day: dayCounter++, isThisMonth: true }
  }

  weeks.push(week)

  while (dayCounter <= days) {
    week = Array(7).fill('')
    for (let i = 0; i < 7 && dayCounter <= days; i++) {
      week[i] = { day: dayCounter++, isThisMonth: true }
    }
    weeks.push(week)
  }

  if (weeks[weeks.length - 1].filter((day) => day !== '').length < 7) {
    for (let i = 0; i < 7; i++) {
      if (weeks[weeks.length - 1][i] === '') {
        weeks[weeks.length - 1][i] = {
          day: nextMonthDayCounter++,
          isThisMonth: false,
        }
      }
    }
  }

  while (weeks.length < 6) {
    week = Array(7).fill('')
    for (let i = 0; i < 7; i++) {
      week[i] = { day: nextMonthDayCounter++, isThisMonth: false }
    }
    weeks.push(week)
  }

  return weeks
}
