// src/hooks/useCalendar.tsx
import * as React from 'react'

interface CalendarState {
  month: number
  year: number
}

export function useCalendar() {
  const [state, setState] = React.useState<CalendarState>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  const handlePrevMonth = React.useCallback(() => {
    setState((prevState) => {
      const newMonth = prevState.month === 1 ? 12 : prevState.month - 1
      const newYear =
        prevState.month === 1 ? prevState.year - 1 : prevState.year
      return { month: newMonth, year: newYear }
    })
  }, [])

  const handleNextMonth = React.useCallback(() => {
    setState((prevState) => {
      const newMonth = prevState.month === 12 ? 1 : prevState.month + 1
      const newYear =
        prevState.month === 12 ? prevState.year + 1 : prevState.year
      return { month: newMonth, year: newYear }
    })
  }, [])

  const handleToday = React.useCallback(() => {
    const today = new Date()
    setState({ month: today.getMonth() + 1, year: today.getFullYear() })
  }, [])

  const formatMonth = (month: number) => {
    return month.toString().padStart(2, '0')
  }

  return {
    state,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    formatMonth,
  }
}
