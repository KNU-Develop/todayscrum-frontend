'use client'
import * as React from 'react'
import { Weekly } from '@/components/Calendar/Weekly'
import { useCalendarContext } from '../layout'
import { addDays, format, startOfWeek } from 'date-fns'
import { useProjectInfoQuery, useScheduleListQuery } from '@/api'

export default function page() {
  const { state, selectedProject, myCalendar } = useCalendarContext()

  const weekStart = startOfWeek(state.date, { weekStartsOn: 0 })
  const startDate = format(weekStart, 'yyyy-MM-dd')
  const endDate = format(addDays(weekStart, 6), 'yyyy-MM-dd')

  const { data: scheduleResponse } = useScheduleListQuery(startDate, endDate)
  const { data: projectResponse } = useProjectInfoQuery()

  const schedules = scheduleResponse?.result
  const projects = projectResponse?.result

  const filteredSchedules = schedules?.filter((schedule) => {
    const isProjectSelected = selectedProject[schedule.projectId || '']
    return isProjectSelected || !schedule.projectId || myCalendar
  })

  return (
    <div>
      <Weekly
        date={state.date}
        schedules={filteredSchedules}
        projects={projects?.map((project) => ({
          uid: project.uid,
          title: project.title,
        }))}
      />
    </div>
  )
}
