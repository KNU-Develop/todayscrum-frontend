'use client'
import {
  EditProjectDTO,
  useEditProjectColor,
  useEditProjectInfo,
  useProjectInfoQuery,
  useScheduleListQuery,
} from '@/api'
import { CalendarHeader } from '@/components/Header/CalendarHeader'
import { MiniCalendar } from '@/components/Calendar/Calendar'
import { TextGradientGenerator } from '@/components/ui/color-picker'
import { CalendarContext } from '@/hooks/useCalendar/calendarContext'
import * as React from 'react'
import { Daily, List, Monthly, Weekly } from '@/components/Calendar'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import { useQueryClient } from '@tanstack/react-query'

const Page = () => {
  const state = React.useContext(CalendarContext)

  const queryClient = useQueryClient()

  const startDate = format(startOfMonth(state.date), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(state.date), 'yyyy-MM-dd')

  const { data: schedules } = useScheduleListQuery(startDate, endDate)
  const { data: projects } = useProjectInfoQuery()

  const [selectedView, setSelectedView] = React.useState('month')

  // 선택된 프로젝트에 따라 스케줄 필터링
  const schedule =
    schedules?.result?.filter((schedule) => {
      const isProjectSelected = state.selectedProject[schedule.projectId || '']
      const isMySchedule = state.myCalendar && !schedule.projectId
      return isProjectSelected || isMySchedule
    }) || []

  const editProjectColor = useEditProjectColor({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectList'] })
    },
    onError: (e) => console.log(e),
  })

  const handleColorChange = (uid: string, newColor: string) => {
    const projectToUpdate = projects?.result?.find(
      (project) => project.id == uid,
    )

    if (projectToUpdate) {
      const updateProject: EditProjectDTO = {
        ...projectToUpdate,
        color: newColor,
      }

      editProjectColor.mutate({ dto: updateProject, uid })
    }
  }

  return (
    <div className="m-auto flex w-[1180px]">
      <div className="flex flex-col gap-6">
        <MiniCalendar view={selectedView} />
        <div className="flex flex-col gap-3 p-[10px]">
          <p className="text-body">내 캘린더</p>
          {projects?.result?.map((project) => (
            <div className="flex items-center gap-2" key={project.id}>
              <TextGradientGenerator
                initialColor={project.color}
                onColorChange={(newColor) =>
                  handleColorChange(project.id, newColor)
                }
              />
              <p className="text-small">{project.title}</p>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <TextGradientGenerator
              initialColor="bg-slate-100"
              onColorChange={(newColor) =>
                handleColorChange('myCalendar', newColor)
              }
            />
            <p className="text-small">나의 일정</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <CalendarHeader view={selectedView} setView={setSelectedView} />
        {selectedView === 'day' ? (
          <Daily
            date={state.date}
            schedules={schedule}
            projects={projects?.result?.map((project) => ({
              uid: project.id,
              title: project.title,
            }))}
          />
        ) : null}
        {selectedView === 'list' ? (
          <List schedules={schedule} projects={projects?.result} />
        ) : null}
        {selectedView === 'week' ? (
          <Weekly date={state.date} schedules={schedule} />
        ) : null}
        {selectedView === 'month' ? (
          <Monthly
            date={state.date}
            schedules={schedule}
            projects={projects?.result}
          />
        ) : null}
      </div>
    </div>
  )
}

export default Page
