'use client'
import * as React from 'react'
import { CalendarHeader } from '@/components/Calendar/CalendarHeader'
import { Monthly } from '@/components/Calendar/Monthly'
import { useCalendar } from '@/hooks/useCalendar'

export default function Page() {
  const { state, handlePrevMonth, handleNextMonth, handleToday, formatMonth } =
    useCalendar()

  return (
    <div>
      <CalendarHeader
        view="month"
        year={state.year}
        month={formatMonth(state.month)}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        onToday={handleToday}
      />
      <Monthly year={state.year} month={formatMonth(state.month)} />
    </div>
  )
}
