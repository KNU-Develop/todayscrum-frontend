'use client'

import * as React from 'react'
import { generateCalendar } from '@/hooks/useCalendar'
import { weekClass, yoilClass, dayClass, getDotColor } from './style'
import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { ScheduleCheckModal } from '../Modal/ScheduleModal'
import { ScheduleInfo, ProjectInfo } from '@/api'

interface MonthlyProps {
  date: Date
  schedules: ScheduleInfo[] | undefined
  projects: ProjectInfo[] | undefined
}

export const Monthly: React.FC<MonthlyProps> = ({
  date,
  schedules,
  projects,
}) => {
  const { modals, openModal } = useModal()
  const yoils = ['일', '월', '화', '수', '목', '금', '토']
  const weeks = generateCalendar(date)
  const today = new Date()

  const [selectedSchedule, setSelectedSchedule] =
    React.useState<ScheduleInfo | null>(null)

  const handleScheduleSelect = (schedule: ScheduleInfo) => {
    setSelectedSchedule(schedule)
    openModal('default', ModalTypes.CHECK)
  }

  const getProjectColor = (projectId: string) => {
    return (
      projects?.find((project) => project.id === projectId)?.color ||
      'bg-slate-100'
    )
  }

  const getSchedulesForDay = (day: Date, isThisMonth: boolean) => {
    if (!schedules) {
      return []
    }

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.startDate).getDate()
      const scheduleMonth = new Date(schedule.startDate).getMonth() + 1
      const scheduleYear = new Date(schedule.startDate).getFullYear()

      if (
        isThisMonth &&
        scheduleYear === day.getFullYear() &&
        scheduleMonth === day.getMonth() + 1 &&
        scheduleDate === day.getDate()
      ) {
        return true
      }

      return false
    })
  }

  const formatTime = (startDate: string, endDate: string) => {
    if (!startDate) return ''

    const startTime = startDate.split('T')[1]
    const endTime = endDate.split('T')[1]

    if (!endTime || startDate === endDate) return '하루 종일'

    const [startHourString, startMinute] = startTime.split(':')
    const startHour = parseInt(startHourString)

    if (isNaN(startHour)) return ''

    const period = startHour < 12 ? '오전' : '오후'
    const startHour12 = startHour % 12 || 12

    return `${period} ${startHour12}:${startMinute}`
  }

  return (
    <div className="flex h-auto w-[864px] flex-shrink-0 flex-col gap-[10px] p-4">
      <div className="flex w-full items-center justify-between self-stretch">
        {yoils.map((yoil) => (
          <p
            className={`${yoilClass} ${yoil === '일' || yoil === '토' ? 'text-gray-500' : ''}`}
            key={yoil}
          >
            {yoil}
          </p>
        ))}
      </div>
      <div className="h-[1px] w-full bg-gray-300" />
      <div className="flex h-[764px] w-full flex-shrink-0 flex-col items-start self-stretch rounded-[4px] border-r border-t border-gray-200">
        {weeks.map((week, weekIndex) => (
          <div className={weekClass} key={weekIndex}>
            {week.map(({ day, isThisMonth, date }, dayIndex) => {
              const schedules = getSchedulesForDay(date, isThisMonth)
              const isToday =
                today.getDate() === day &&
                today.getMonth() === date.getMonth() &&
                today.getFullYear() === date.getFullYear()
              return (
                <div
                  className={`${dayClass} ${isThisMonth ? '' : 'text-gray-300'}`}
                  key={dayIndex}
                >
                  <div className="flex h-auto w-full flex-col">
                    {day !== null && (
                      <>
                        <div>
                          <p
                            className={`p-2 ${isToday ? 'flex h-11 w-11 items-center justify-center rounded-full bg-black text-white' : ''}`}
                          >
                            {day}
                          </p>
                        </div>
                        <div className="flex flex-col gap-[3px]">
                          {schedules.map((schedule, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                handleScheduleSelect(schedule)
                              }}
                              className={`flex h-[25px] w-full cursor-pointer items-center gap-[6px] rounded-[5px] pl-1 ${getProjectColor(schedule.projectId ?? '')}`}
                            >
                              <div
                                className={`h-1 w-1 flex-shrink-0 rounded-full ${getDotColor(getProjectColor(schedule.projectId ?? 'bg-red-300'))}`}
                              />
                              <p className="display-webkit-box box-orient-vertical line-clamp-2 text-detail">
                                {formatTime(
                                  schedule.startDate,
                                  schedule.endDate,
                                )}
                              </p>
                              <p className="display-webkit-box box-orient-vertical line-clamp-1 text-detail">
                                {schedule.title}
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
      {modals.default.open &&
        modals.default.type === ModalTypes.CHECK &&
        selectedSchedule && (
          <ScheduleCheckModal scheduleId={selectedSchedule?.id} />
        )}
    </div>
  )
}
