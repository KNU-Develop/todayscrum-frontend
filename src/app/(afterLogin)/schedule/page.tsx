'use client'
import { useProjectInfoQuery } from '@/api'
import { CalendarHeader } from '@/components/Header/CalendarHeader'
import { MiniCalendar } from '@/components/Calendar/Calendar'
import { TextGradientGenerator } from '@/components/ui/color-picker'
import { CalendarContext } from '@/hooks/useCalendar/calendarContext'
import * as React from 'react'

const Page = () => {
  const state = React.useContext(CalendarContext)

  const { data } = useProjectInfoQuery()

  React.useEffect(() => {
    if (data) {
      const initialSelectedProjects =
        data?.result?.reduce(
          (acc, project) => {
            acc[project.id] = true
            return acc
          },
          {} as { [key: string]: boolean },
        ) || {}
      handleFilterChange(initialSelectedProjects, true)
    }
  }, [data])

  const handleColorChange = (uid: string, newColor: string) => {
    // const editProjectInfo = useEditProjectInfo(
    //   {
    //     title: '',
    //     overview: '',
    //     startDate: '',
    //     endDate: '',
    //     color: newColor,
    //   },
    //   uid,
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({ queryKey: ['projectList'] })
    //     },
    //     onError: (e) => {
    //       console.log(e)
    //     },
    //   },
    // )
    // editProjectInfo.mutate()
  }

  const handleFilterChange = (
    updatedSelectedProject: { [key: string]: boolean },
    updatedMyCalendar: boolean,
  ) => {
    state.setSelectedProject(updatedSelectedProject)
    state.setMyCalendar(updatedMyCalendar)
  }

  return (
    <div className="m-auto flex w-[1180px]">
      <div className="flex flex-col gap-6">
        <MiniCalendar />
        <div className="flex flex-col gap-3 p-[10px]">
          <p className="text-body">내 캘린더</p>
          {data?.result?.map((project) => (
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
              initialColor="#000000"
              onColorChange={(newColor) =>
                handleColorChange('myCalendar', newColor)
              }
            />
            <p className="text-small">나의 일정</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <CalendarHeader />
      </div>
    </div>
  )
}

export default Page
