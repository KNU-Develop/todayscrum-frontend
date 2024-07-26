'use client'
import * as React from 'react'
import { List } from '@/components/Calendar/List'
import { CalendarHeader } from '@/components/Calendar/CalendarHeader'
import { useCalendar } from '@/hooks/useCalendar'

export default function page() {
  const { state, formatMonth } = useCalendar()

  return (
    <div>
      <CalendarHeader
        view="month"
        month={formatMonth(state.month)}
        year={state.year}
        onPrev={() => {}}
        onNext={() => {}}
        onToday={() => {}}
      />
      <List />
    </div>
  )
}
