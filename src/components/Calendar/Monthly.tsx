'use client'

import * as React from 'react'
import { useSchedulesQuery } from '@/api'
import { generateCalendar } from '@/hooks/useCalendar'
import {
  weekClass,
  yoilClass,
  dayClass,
  getDotColorClass,
  getProjectColorClass,
} from './style'

interface MonthlyProps {
  month: string
  year: number
}

export function Monthly({ month, year }: MonthlyProps) {
  const yoils = ['일', '월', '화', '수', '목', '금', '토']
  const weeks = generateCalendar(year, parseInt(month))

  const { data } = useSchedulesQuery()
  const getSchedulesForDay = (day: number, isThisMonth: boolean) => {
    if (isThisMonth && data?.result[year]?.[parseInt(month)]) {
      return data.result[year][parseInt(month)].filter(
        (schedule) => schedule.date === day,
      )
    }

    if (!isThisMonth) {
      const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1
      const prevYear = parseInt(month) === 1 ? year - 1 : year
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1
      const nextYear = parseInt(month) === 12 ? year + 1 : year

      if (data?.result[prevYear]?.[prevMonth] && day > 15) {
        return data.result[prevYear][prevMonth].filter(
          (schedule) => schedule.date === day,
        )
      } else if (data?.result[nextYear]?.[nextMonth] && day < 15) {
        return data.result[nextYear][nextMonth].filter(
          (schedule) => schedule.date === day,
        )
      }
    }
    return []
  }

  const formatTime = (time: string) => {
    if (!time) return ''

    const [startTime] = time.split('~')
    const [period, timePart] = startTime.trim().split(' ')
    let [hour, minute] = timePart.split(':')

    if (period === '오후') {
      hour = String(parseInt(hour) + 12)
    }
    minute = minute || '00'

    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
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
          'flex h-[764px] flex-shrink-0 flex-col items-start self-stretch rounded-[4px] border-r border-t border-gray-200'
        }
      >
        {weeks.map((week, weekIndex) => (
          <div className={weekClass} key={weekIndex}>
            {week.map(({ day, isThisMonth }, dayIndex) => {
              const schedules = getSchedulesForDay(day, isThisMonth)
              return (
                <div
                  className={`${dayClass} ${isThisMonth ? '' : 'text-gray-300'}`}
                  key={dayIndex}
                >
                  <div className="flex h-6 w-full flex-col">
                    {day !== '' && (
                      <>
                        <p className="p-2">{day}</p>
                        <div className="flex flex-col gap-[2px]">
                          {schedules.map((schedule, index) => (
                            <div
                              key={index}
                              className={`flex h-[25px] items-center gap-[5px] overflow-hidden text-ellipsis rounded-[5px] pl-1 ${getProjectColorClass(schedule.project)}`}
                            >
                              <div
                                className={`h-1 w-1 rounded-full ${getDotColorClass(schedule.project)}`}
                              />
                              <p className="display-webkit-box box-orient-vertical line-clamp-2 text-center text-detail">
                                {formatTime(schedule.time)}
                              </p>
                              <p className="display-webkit-box box-orient-vertical line-clamp-1 text-center text-detail">
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
