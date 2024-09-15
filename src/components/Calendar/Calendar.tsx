'use client'

import * as React from 'react'

import { Calendar } from '@/components/ui/calendar'
import { CalendarContext } from '@/hooks/useCalendar/calendarContext'
import { addWeeks } from 'date-fns'

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

export function MiniCalendar({ view }: { view: string }) {
  const state = React.useContext(CalendarContext)

  const handleSelect = (date: Date | undefined) => {
    if (date && date !== state.date) {
      state.setDate(date)
    }
  }

  return (
    <Calendar
      mode="single"
      selected={state.date}
      onSelect={handleSelect}
      onNextClick={() => state.handleNext(view)}
      className="rounded-[8px] border border-gray-300"
    />
  )
}
