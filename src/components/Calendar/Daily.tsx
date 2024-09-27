'use client'
import * as React from 'react'
import { ProjectInfo, ScheduleInfo } from '@/api'
import { hours } from '@/hooks/useCalendar/useCalendarUtils'
import { EventRenderer } from './EventRenderer'
import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { ScheduleCheckModal } from '../Modal/ScheduleModal'

const TimeSlot: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="relative flex h-[48px] flex-[1_0_0] items-center justify-center border-b border-l border-gray-200">
    {children}
  </div>
)

interface DailyProps {
  date: Date
  schedules: ScheduleInfo[] | undefined
  projects: ProjectInfo[] | undefined
}

export const Daily: React.FC<DailyProps> = ({ date, schedules, projects }) => {
  const { modals, openModal } = useModal()

  const [selectedSchedule, setSelectedSchedule] =
    React.useState<ScheduleInfo | null>(null)

  const handleScheduleSelect = (schedule: ScheduleInfo) => {
    setSelectedSchedule(schedule)
    openModal('default', ModalTypes.CHECK)
  }

  const filterAllDaySchedules = (schedules: ScheduleInfo[]) => {
    return schedules.filter((schedule) => {
      return schedule.startDate.toString() === schedule.endDate.toString()
    })
  }

  const filterPersonalSchedules = (schedules: ScheduleInfo[]) => {
    return schedules.filter((schedule) => schedule.projectId === null)
  }

  const renderEvents = (projectId: string | null, hour: number) => {
    const events = projectId
      ? (schedules || []).filter(
          (schedule: ScheduleInfo) => schedule.projectId === projectId,
        )
      : filterPersonalSchedules(schedules || [])

    return (
      <EventRenderer
        events={events}
        dayIndex={0}
        hour={hour}
        onScheduleSelect={handleScheduleSelect}
        weekStart={date}
      />
    )
  }

  return (
    <div className="flex w-[864px] shrink-0 flex-col items-start gap-[10px] p-4">
      <div className="flex items-center justify-between self-stretch">
        <div className="flex h-[48px] w-[80px]" />
        <p className="flex-[1_0_0] gap-[10px] text-center text-large">
          나의 일정
        </p>
        {projects?.map((project) => (
          <p
            className="flex-1 gap-[10px] text-center text-large"
            key={project.id}
          >
            {project.title}
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
            <TimeSlot key="personal">{renderEvents(null, index)}</TimeSlot>
            {projects?.map((project) => (
              <TimeSlot key={project.id}>
                {renderEvents(project.id, index)}
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
