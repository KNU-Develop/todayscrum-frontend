import * as React from 'react'
import { useSchedulesQuery } from '@/api'
import { Schedule, Schedules } from '@/api/services/schedule/model'

const iterateSchedules = (
  schedules: Schedules,
  callback: (year: number, month: number, schedule: Schedule) => void,
) => {
  Object.keys(schedules)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((year) => {
      Object.keys(schedules[year])
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((month) => {
          schedules[year][month].forEach((schedule) => {
            callback(year, month, schedule)
          })
        })
    })
}

const getAllFutureSchedules = (
  schedules: Schedules,
  year: number,
  month: number,
  today: number,
) => {
  const futureSchedules: { [year: number]: { [month: number]: Schedule[] } } =
    {}

  iterateSchedules(schedules, (y, m, schedule) => {
    if (y > year || (y === year && m > month)) {
      if (!futureSchedules[y]) futureSchedules[y] = {}
      if (!futureSchedules[y][m]) futureSchedules[y][m] = []
      futureSchedules[y][m].push(schedule)
    } else if (y === year && m === month) {
      if (!futureSchedules[y]) futureSchedules[y] = {}
      if (!futureSchedules[y][m]) futureSchedules[y][m] = []
      if (schedule.date >= today) futureSchedules[y][m].push(schedule)
    }
  })

  return futureSchedules
}

const groupSchedulesByDate = (schedules: Schedules) => {
  const groupedSchedules: { [key: string]: Schedule[] } = {}

  iterateSchedules(schedules, (year, month, schedule) => {
    const key = `${year}-${month}-${schedule.date}`
    if (!groupedSchedules[key]) groupedSchedules[key] = []
    groupedSchedules[key].push(schedule)
  })

  return groupedSchedules
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
