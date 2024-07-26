'use client'
import * as React from 'react'
import { CalendarHeader } from '@/components/Calendar/CalendarHeader'
import { Monthly } from '@/components/Calendar/Monthly'

export default function page() {
  const [month, setMonth] = React.useState(new Date().getMonth() + 1)
  const [year, setYear] = React.useState(new Date().getFullYear())

  const handlePrevMonth = React.useCallback(() => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }, [month, year])

  const handleNextMonth = React.useCallback(() => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }, [month, year])

  const handleToday = React.useCallback(() => {
    const today = new Date()
    setMonth(today.getMonth() + 1)
    setYear(today.getFullYear())
  }, [])

  return (
    <div>
      <CalendarHeader
        view="month"
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={handleToday}
      />
      <Monthly year={year} month={month} />
    </div>
  )
}
