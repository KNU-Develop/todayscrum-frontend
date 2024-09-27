'use client'

import { addDays, addMonths, subDays, subMonths } from 'date-fns'
import React, { createContext, ReactNode, useCallback, useState } from 'react'

// CalendarContext 생성
export const CalendarContext = createContext<any>(null)

interface CalendarProviderProps {
  children: ReactNode
}

const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [date, setDate] = useState(new Date())
  const [selectedProject, setSelectedProject] = React.useState<{
    [key: string]: boolean
  }>({})
  const [myCalendar, setMyCalendar] = React.useState<boolean>(true)

  const handlePrev = useCallback((unit: 'month' | 'week' | 'day') => {
    setDate((prevDate) => {
      switch (unit) {
        case 'month':
          return subMonths(prevDate, 1)
        case 'week':
          return subDays(prevDate, 7)
        case 'day':
          return subDays(prevDate, 1)
        default:
          return prevDate
      }
    })
  }, [])

  const handleNext = useCallback((unit: 'month' | 'week' | 'day') => {
    setDate((prevDate) => {
      switch (unit) {
        case 'month':
          return addMonths(prevDate, 1)
        case 'week':
          return addDays(prevDate, 7)
        case 'day':
          return addDays(prevDate, 1)
        default:
          return prevDate
      }
    })
  }, [])

  const handleToday = useCallback(() => {
    setDate(new Date())
  }, [])

  const formatMonth = (date: Date) => {
    return (date.getMonth() + 1).toString().padStart(2, '0')
  }

  return (
    <CalendarContext.Provider
      value={{
        date,
        setDate,
        handlePrev,
        handleNext,
        handleToday,
        formatMonth,
        selectedProject,
        setSelectedProject,
        myCalendar,
        setMyCalendar,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export { CalendarProvider }
