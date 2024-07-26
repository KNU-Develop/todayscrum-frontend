'use client'
import * as React from 'react'
import { List } from '@/components/Calendar/List'
import { CalendarHeader } from '@/components/Calendar/CalendarHeader'

export default function page() {
  const [month, setMonth] = React.useState(new Date().getMonth() + 1)
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [today, setToday] = React.useState(new Date().getDate())
  return (
    <div>
      <CalendarHeader
        view="month"
        month={month}
        year={year}
        onPrev={() => {}}
        onNext={() => {}}
        onToday={() => {}}
      />
      <List />
    </div>
  )
}
