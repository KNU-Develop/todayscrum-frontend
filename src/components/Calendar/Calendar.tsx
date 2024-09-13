'use client'

import * as React from 'react'

import { Calendar } from '@/components/ui/calendar'
import { CalendarContext } from '@/hooks/useCalendar/calendarContext'

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )
}

export function MiniCalendar() {
  const state = React.useContext(CalendarContext)
  return (
    <Calendar
      mode="single"
      selected={state.date}
      onSelect={(date) => state.setDate(date)}
      onNextClick={() => {}}
      onPrevClick={() => {}}
      className="rounded-[8px] border border-gray-300"
    />
  )
}
