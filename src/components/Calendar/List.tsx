'use client'
import * as React from 'react'
import { useSchedulesQuery } from '@/api'
import { Schedule, Schedules } from '@/api/services/schedule/model'

export function List() {
  const [month, setMonth] = React.useState(new Date().getMonth() + 1)
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [today, setToday] = React.useState(new Date().getDate())
  const { data } = useSchedulesQuery()

  const getAllFutureSchedules = (schedules: Schedules) => {
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

  const [currentSchedules, setCurrentSchedules] = React.useState<Schedules>({})

  React.useEffect(() => {
    if (data && data.result) {
      console.log('Fetched schedules:', data.result)
      setCurrentSchedules(getAllFutureSchedules(data.result))
    }
  }, [data, year, month, today])

  const groupedSchedules = Object.entries(currentSchedules).reduce(
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

  const getProjectColorClass = (project: string) => {
    switch (project) {
      case 'A':
        return 'bg-cyan-500'
      case 'B':
        return 'bg-red-500'
      case 'C':
        return 'bg-orange-500'
      default:
        return 'bg-gray-300'
    }
  }

  const formatDate = (date: number) => {
    return date.toString().padStart(2, '0')
  }

  return (
    <div className="flex h-full w-[864px] flex-shrink-0 flex-col items-start gap-[10px] p-4">
      <div className="h-[1px] w-[832px] bg-gray-300" />
      <div className="w-full">
        {Object.entries(groupedSchedules).map(([key, schedules]) => {
          const [year, month, date] = key.split('-')
          return (
            <div
              key={key}
              className="flex items-start gap-[10px] self-stretch border-b border-slate-300 p-[10px]"
            >
              <div className="flex w-[130px] items-center gap-3 px-4 py-1">
                <p className="w-7 text-center text-lead">
                  {formatDate(Number(date))}
                </p>
                <p className="w-opacity-40 py-1 text-detail">{`${month}월 ${date}일`}</p>
              </div>

              <div className="flex flex-[1_0_0] flex-col items-start justify-center gap-[10px] py-1">
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex h-[25px] w-full items-center gap-9 pl-1"
                  >
                    <div className="flex items-center gap-2 self-stretch">
                      <div
                        className={`h-2 w-2 rounded-full ${getProjectColorClass(schedule.project)}`}
                      />
                      <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-2 w-[100px] text-body">
                        {schedule.time}
                      </p>
                    </div>
                    <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-1 flex-[1_0_0]">
                      {schedule.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
