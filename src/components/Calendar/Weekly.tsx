'use client'
import * as React from 'react'
import { yoilClass } from './style'
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns'
import {
  ProjectInfo,
  ScheduleInfo,
  useProjectInfoQuery,
  useUserInfoQuery,
} from '@/api'
import { hours, TimeSlot } from '@/hooks/useCalendar/useCalendarUtils'
import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { ScheduleCheckModal } from '../Modal/ScheduleModal'
import { EventRenderer } from './EventRenderer'

interface WeeklyProps {
  date: Date
  schedules: ScheduleInfo[] | undefined
  projects: ProjectInfo[] | undefined
}

export const Weekly: React.FC<WeeklyProps> = ({
  date,
  schedules,
  projects,
}) => {
  const { modals, openModal } = useModal()
  const today = new Date()
  const yoils = ['일', '월', '화', '수', '목', '금', '토']
  const weekStart = startOfWeek(date, { weekStartsOn: 0 })
  const weekDates = yoils.map((_, index) => {
    const date = addDays(weekStart, index)
    return {
      date, // 각 날짜를 저장
      formatted: format(date, 'd') + ' ' + yoils[index],
      isToday: isSameDay(date, today),
    }
  })

  const { data: userInfo } = useUserInfoQuery() // 사용자 정보 가져오기

  const [selectedSchedule, setSelectedSchedule] =
    React.useState<ScheduleInfo | null>(null)

  const handleScheduleSelect = (schedule: ScheduleInfo) => {
    setSelectedSchedule(schedule)
    openModal('default', ModalTypes.CHECK)
  }

  const events: ScheduleInfo[] = schedules || []

  // 하루 종일 이벤트 필터링 (startDate와 endDate가 날짜와 시간 모두 동일한 경우)
  const allDayEvents = events.filter((event) => {
    const start = new Date(event.startDate)
    const end = event.endDate ? new Date(event.endDate) : start
    return start.getTime() === end.getTime() // 날짜와 시간까지 동일할 때
  })

  const getColor = (schedule: ScheduleInfo) => {
    if (schedule.projectId) {
      // 프로젝트 ID가 있는 경우
      return (
        projects?.find((project) => project.id === schedule.projectId)?.color ||
        'bg-slate-100'
      )
    } else {
      // 팀 일정이 아닌 경우 사용자 색상
      return userInfo?.result.color || 'bg-slate-100'
    }
  }

  return (
    <div className="flex w-[864px] shrink-0 flex-col items-start gap-[10px] p-4">
      <div className="flex items-center justify-between self-stretch">
        <div className="flex h-[48px] w-[80px]" />
        {weekDates.map((day, index) => (
          <p
            className={`${yoilClass} ${
              yoils[index] === '일' || yoils[index] === '토'
                ? 'text-gray-500'
                : ''
            } ${day.isToday ? 'flex rounded-full bg-slate-100' : ''}`}
            key={index}
          >
            {day.formatted}
          </p>
        ))}
      </div>
      <div className="h-[1px] w-[832px] bg-gray-300" />

      {/* 하루 종일 섹션 */}
      <div className="flex w-full flex-col items-start self-stretch">
        <div className="flex items-center self-stretch border-b border-gray-300">
          <div className="flex items-center justify-center gap-[10px] p-[10px]">
            <p className="text-subtle">하루종일</p>
          </div>
          <div className="flex">
            {weekDates.map((day, dayIndex) => (
              <div key={dayIndex} className="flex flex-col items-center">
                {allDayEvents
                  .filter((event) =>
                    isSameDay(new Date(event.startDate), day.date),
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className={`flex cursor-pointer items-center ${getColor(event)}`}
                      onClick={() => handleScheduleSelect(event)}
                    >
                      <p>{event.title}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 시간별 섹션 */}
      <div className="flex flex-col items-start self-stretch">
        {hours.map((hour, index) => (
          <div
            className="relative flex items-center justify-between self-stretch"
            key={index}
          >
            <div className="flex w-[80px]" />
            <div className="absolute bottom-[-10px] left-[15px] text-subtle">
              {hour}
            </div>
            {yoils.map((_, dayIndex) => (
              <TimeSlot key={dayIndex}>
                <EventRenderer
                  events={events}
                  dayIndex={dayIndex}
                  hour={index}
                  onScheduleSelect={handleScheduleSelect}
                  weekStart={weekStart}
                />
              </TimeSlot>
            ))}
          </div>
        ))}
      </div>

      {modals.default.open &&
        modals.default.type == ModalTypes.CHECK &&
        selectedSchedule && (
          <ScheduleCheckModal scheduleId={selectedSchedule.id} />
        )}
    </div>
  )
}
