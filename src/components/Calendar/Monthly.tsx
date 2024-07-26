'use client'

import * as React from 'react'
import { useSchedulesQuery } from '@/api'
import { Schedule, Schedules } from '@/api/services/schedule/model'

const daysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate()
}

const getFirstDayofMonth = (year: number, month: number) => {
  return new Date(year, month - 1, 1).getDay()
}

const getPreviousMonthDays = (year: number, month: number) => {
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  return daysInMonth(prevYear, prevMonth)
}

interface MonthlyProps {
  month: number
  year: number
}

export function Monthly({ month, year }: MonthlyProps) {
  const { data } = useSchedulesQuery()

  const weekClass =
    'flex justify-between items-center flex-[1_0_0] self-stretch'
  const yoilClass =
    'flex h-12 flex-[1_0_0] basis-0 items-center justify-center gap-[10px] text-large'
  const dayClass =
    'flex p-2 items-start gap-[10px] flex-[1_0_0] self-stretch border-b border-l border-gray-200 text-large'

  const yoils = ['일', '월', '화', '수', '목', '금', '토']

  const days = daysInMonth(year, month)
  const firstDay = getFirstDayofMonth(year, month)
  const prevMonthDays = getPreviousMonthDays(year, month)

  const generateCalendar = () => {
    const weeks = []
    let week = Array(7).fill('')
    let dayCounter = 1
    let nextMonthDayCounter = 1

    for (let i = firstDay - 1; i >= 0; i--) {
      week[i] = { day: prevMonthDays - (firstDay - 1 - i), isThisMonth: false }
    }

    for (let i = firstDay; i < 7; i++) {
      week[i] = { day: dayCounter++, isThisMonth: true }
    }

    weeks.push(week)

    while (dayCounter <= days) {
      week = Array(7).fill('')
      for (let i = 0; i < 7 && dayCounter <= days; i++) {
        week[i] = { day: dayCounter++, isThisMonth: true }
      }
      weeks.push(week)
    }

    if (weeks[weeks.length - 1].filter((day) => day !== '').length < 7) {
      for (let i = 0; i < 7; i++) {
        if (weeks[weeks.length - 1][i] === '') {
          weeks[weeks.length - 1][i] = {
            day: nextMonthDayCounter++,
            isThisMonth: false,
          }
        }
      }
    }

    while (weeks.length < 6) {
      week = Array(7).fill('')
      for (let i = 0; i < 7; i++) {
        week[i] = { day: nextMonthDayCounter++, isThisMonth: false }
      }
      weeks.push(week)
    }
    return weeks
  }

  const weeks = generateCalendar()

  const getSchedulesForDay = (day: number) => {
    if (data?.result[year]?.[month]) {
      return data.result[year][month].filter(
        (schedule) => schedule.date === day,
      )
    }
    return []
  }

  const getProjectColorClass = (project: string) => {
    switch (project) {
      case 'A':
        return 'bg-cyan-100'
      case 'B':
        return 'bg-red-100'
      case 'C':
        return 'bg-orange-100'
      default:
        return 'bg-gray-100'
    }
  }

  return (
    <div className="flex h-[932px] w-[864px] flex-shrink-0 flex-col items-start gap-[10px] p-4">
      <div className="flex items-center justify-between self-stretch">
        {yoils.map((yoil) => (
          <p
            className={`${yoilClass} ${yoil === '일' || yoil === '토' ? 'text-gray-500' : ''}`}
            key={yoil}
          >
            {yoil}
          </p>
        ))}
      </div>
      <div className="h-[1px] w-[832px] bg-gray-300" />
      <div
        className={
          'itmes-start flex h-[764px] flex-shrink-0 flex-col self-stretch rounded-[4px] border-r border-t border-gray-200'
        }
      >
        {weeks.map((week, weekIndex) => (
          <div className={weekClass} key={weekIndex}>
            {week.map(({ day, isThisMonth }, dayIndex) => {
              const schedules = getSchedulesForDay(day)
              return (
                <div
                  className={`${dayClass} ${isThisMonth ? '' : 'text-gray-300'}`}
                  key={dayIndex}
                >
                  <div className="flex h-6 flex-col">
                    {day !== '' && (
                      <>
                        <p>{day}</p>
                        <div className="flex flex-col gap-1">
                          {schedules.map((schedule, index) => (
                            <div
                              key={index}
                              className={`flex w-[119px] items-center gap-2 rounded-[5px] ${getProjectColorClass(schedule.project)}`}
                            >
                              <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-1 overflow-hidden text-ellipsis text-detail">
                                {schedule.time}
                              </p>
                              <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-1 overflow-hidden text-ellipsis text-detail">
                                {schedule.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
