'use client'
import * as React from 'react'
import { yoilClass } from './style'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { ScheduleInfo, useScheduleListQuery } from '@/api'
import { hours } from '@/hooks/useCalendar/useCalendarUtils'
import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { ScheduleCheckModal } from '../Modal/ScheduleModal'
import { EventRenderer } from './EventRenderer'

const TimeSlot: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="relative flex h-[48px] flex-[1_0_0] items-center justify-center border-b border-l border-gray-200">
    {children}
  </div>
)

interface WeeklyProps {
  week: Date
}

export const Weekly: React.FC<WeeklyProps> = ({ week }) => {
  const { modals, openModal } = useModal()
  const yoils = ['일', '월', '화', '수', '목', '금', '토']
  const weekStart = startOfWeek(week, { weekStartsOn: 0 })
  const weekDates = yoils.map((_, index) => {
    const date = addDays(weekStart, index)
    return format(date, 'd') + ' ' + yoils[index]
  })

  const startDate = format(weekStart, 'yyyy-MM-dd')
  const endDate = format(addDays(weekStart, 6), 'yyyy-MM-dd')
  const { data } = useScheduleListQuery(startDate, endDate)

  const [selectedSchedule, setSelectedSchedule] =
    React.useState<ScheduleInfo | null>(null)

  const handleScheduleSelect = (schedule: ScheduleInfo) => {
    setSelectedSchedule(schedule)
    openModal('default', ModalTypes.CHECK)
  }

  const events: ScheduleInfo[] = data?.result || []

  // const allDayEvents = events.filter((event) =>
  //   isSameDay(
  //     new Date(event.startDate),
  //     new Date(event.endDate ?? event.startDate),
  //   ),
  // )

  return (
    <div className="flex w-[864px] shrink-0 flex-col items-start gap-[10px] p-4">
      <div className="flex items-center justify-between self-stretch">
        <div className="flex h-[48px] w-[80px]" />
        {weekDates.map((dateAndYoil, index) => (
          <p
            className={`${yoilClass} ${
              yoils[index] === '일' || yoils[index] === '토'
                ? 'text-gray-500'
                : ''
            }`}
            key={index}
          >
            {dateAndYoil}
          </p>
        ))}
      </div>
      <div className="h-[1px] w-[832px] bg-gray-300" />
      <div className="flex flex-col items-start self-stretch">
        <div className="flex items-center self-stretch border-b border-gray-300">
          <div className="flex items-center justify-center gap-[10px] p-[10px]">
            <p className="text-subtle">하루종일</p>
          </div>
        </div>

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