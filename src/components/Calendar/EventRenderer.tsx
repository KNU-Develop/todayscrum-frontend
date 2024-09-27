import { ScheduleInfo, useProjectInfoQuery, useUserInfoQuery } from '@/api'
import { addDays, getHours, getMinutes, isEqual, isSameDay } from 'date-fns'
import * as React from 'react'
import { getBorderColor } from './style'

const formatTime = (date: Date) => {
  const hours = getHours(date)
  const minutes = getMinutes(date)
  const period = hours >= 12 ? '오후' : '오전'
  const adjustedHours = hours % 12 || 12
  return `${period} ${adjustedHours}:${minutes.toString().padStart(2, '0')}`
}

interface EventRendererProps {
  events: ScheduleInfo[]
  dayIndex: number
  hour: number
  onScheduleSelect: (schedule: ScheduleInfo) => void
  weekStart: Date
}

export const EventRenderer: React.FC<EventRendererProps> = ({
  events,
  dayIndex,
  hour,
  onScheduleSelect,
  weekStart,
}) => {
  const { data: projects } = useProjectInfoQuery()
  const { data: userInfo } = useUserInfoQuery()

  const getColor = (schedule: ScheduleInfo) => {
    if (schedule.projectId) {
      // 프로젝트 ID가 있는 경우
      return (
        projects?.result?.find((project) => project.id === schedule.projectId)
          ?.color || 'bg-slate-100'
      )
    } else {
      // 팀 일정이 아닌 경우 사용자 색상
      return userInfo?.result.color || 'bg-slate-100'
    }
  }

  // 하루 종일 일정은 시간 섹션에서 제외
  const dayEvents = events.filter((event) => {
    const eventStart = new Date(event.startDate)
    const eventEnd = new Date(event.endDate ?? event.startDate)

    const isAllDayEvent = isEqual(eventStart, eventEnd) // startDate와 endDate가 시간까지 동일하면 하루 종일 일정으로 간주
    const isEventInDay = isSameDay(addDays(weekStart, dayIndex), eventStart)

    // 하루 종일 일정은 필터링해서 제외
    return isEventInDay && !isAllDayEvent && getHours(eventStart) === hour
  })

  dayEvents.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  )

  return (
    <>
      {dayEvents.map((event, index) => {
        const totalEvents = dayEvents.length
        let leftOffset: number
        let width: number

        if (totalEvents <= 4) {
          leftOffset = 20 * index
          width = 100 - leftOffset
        } else {
          const totalSpace = 100 - 10
          const spacing = totalSpace / totalEvents
          leftOffset = spacing * index
          width = spacing - 10
        }

        const projectColor = getColor(event) // 프로젝트 또는 유저 색상 설정

        return (
          <div
            key={index}
            className={`absolute z-10 cursor-pointer rounded-r-md rounded-br-md p-2 ${projectColor} border-l-[3px] ${getBorderColor(
              projectColor,
            )}`}
            style={{
              top: `${(getMinutes(new Date(event.startDate)) / 60) * 48}px`,
              height: `${(((getHours(new Date(event.endDate ?? event.startDate)) - getHours(new Date(event.startDate))) * 60 + (getMinutes(new Date(event.endDate ?? event.startDate)) - getMinutes(new Date(event.startDate)))) / 60) * 48}px`,
              left: `${leftOffset}px`,
              width: `${width}px`,
            }}
            onClick={() => onScheduleSelect(event)}
          >
            <div className="flex flex-col gap-3">
              <p className="display-webkit-box box-orient-vertical line-clamp-1 text-body">
                {event.title}
              </p>
              <p className="text-detail">
                {formatTime(new Date(event.startDate))}
              </p>
            </div>
          </div>
        )
      })}
    </>
  )
}
