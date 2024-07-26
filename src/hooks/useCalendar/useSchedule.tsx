import * as React from 'react'
import { useSchedulesQuery } from '@/api'
import { Schedule, Schedules } from '@/api/services/schedule/model'

const getAllFutureSchedules = (
  schedules: Schedules,
  year: number,
  month: number,
  today: number,
) => {
  const futureSchedules: { [year: number]: { [month: number]: Schedule[] } } =
    {}
  const years = Object.keys(schedules)
    .map(Number)
    .sort((a, b) => a - b)

  for (const y of years) {
    const months = Object.keys(schedules[y])
      .map(Number)
      .sort((a, b) => a - b)
    futureSchedules[y] = {}
    for (const m of months) {
      if (y > year || (y === year && m > month)) {
        futureSchedules[y][m] = schedules[y][m]
      } else if (y === year && m === month) {
        futureSchedules[y][m] = schedules[y][m].filter(
          (schedule: Schedule) => schedule.date >= today,
        )
      }
    }
  }

  return futureSchedules
}

const groupSchedulesByDate = (schedules: Schedules) => {
  return Object.entries(schedules).reduce(
    (acc: { [key: string]: Schedule[] }, [year, months]) => {
      Object.entries(months as { [key: string]: Schedule[] }).forEach(
        ([month, schedules]) => {
          schedules.forEach((schedule) => {
            const key = `${year}-${month}-${schedule.date}`
            if (!acc[key]) {
              acc[key] = []
            }
            acc[key].push(schedule)
          })
        },
      )
      return acc
    },
    {},
  )
}

export const useFutureSchedules = () => {
  const [date, setDate] = React.useState(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      today: now.getDate(),
    }
  })

  const { data } = useSchedulesQuery()
  const [currentSchedules, setCurrentSchedules] = React.useState<Schedules>({})
  const [groupedSchedules, setGroupedSchedules] = React.useState<{
    [key: string]: Schedule[]
  }>({})

  React.useEffect(() => {
    if (data && data.result) {
      console.log('Fetched schedules:', data.result)
      const { year, month, today } = date
      const futureSchedules = getAllFutureSchedules(
        data.result,
        year,
        month,
        today,
      )
      setCurrentSchedules(futureSchedules)
      setGroupedSchedules(groupSchedulesByDate(futureSchedules))
    }
  }, [data, date])

  const setMonth = (month: number) => setDate((prev) => ({ ...prev, month }))
  const setYear = (year: number) => setDate((prev) => ({ ...prev, year }))
  const setToday = (today: number) => setDate((prev) => ({ ...prev, today }))

  return {
    currentSchedules,
    groupedSchedules,
    date,
    setMonth,
    setYear,
    setToday,
  }
}
