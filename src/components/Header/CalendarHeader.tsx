import { useProjectInfoQuery } from '@/api'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { ChevronLeft, ChevronRight, FilterIcon, PlusIcon } from 'lucide-react'
import React, { Dispatch, SetStateAction, useContext, useEffect } from 'react'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

import { CalendarContext } from '@/hooks/useCalendar/calendarContext'
import {
  RepeatScheduleDeleteModal,
  ScheduleCreateModal,
  ScheduleRepeatModal,
} from '../Modal/ScheduleModal'

export const CalendarHeader = ({
  view,
  setView,
}: {
  view: string
  setView: Dispatch<SetStateAction<string>>
}) => {
  const { modals, openModal } = useModal()
  const state = useContext(CalendarContext)

  const { data: projects } = useProjectInfoQuery()

  useEffect(() => {
    // projects가 유효하고, selectedProject가 설정되어 있지 않을 경우에만 실행
    if (projects?.result?.length && Object.keys(state.selectedProject).length === 0) {
      const initialSelectedProjects = projects.result.reduce(
        (acc: { [key: string]: boolean }, project: any) => {
          acc[project.id] = true
          return acc
        },
        {},
      )
      state.setSelectedProject(initialSelectedProjects)
    }
  }, [projects, state.selectedProject, state])

  const handleSelectChange = (value: string) => {
    setView(value)
  }

  const handleCheckedChange = (projectId: string) => {
    state.setSelectedProject((prevSelected: { [key: string]: boolean }) => ({
      ...prevSelected,
      [projectId]: !prevSelected[projectId],
    }))
  }

  const handleMyCalendarChange = () => {
    state.setMyCalendar((prev: boolean) => !prev)
  }

  return (
    <>
      <div className="flex w-[864px] items-center justify-between self-stretch px-4">
        <div className="flex items-center gap-[16px]">
          <p className="w-[140px] text-h3">
            {state.date.getFullYear()}년{' '}
            {(state.date.getMonth() + 1).toString().padStart(2, '0')}월
          </p>
          <Button
            onClick={() => state.handlePrev(view)}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            onClick={() => state.handleNext(view)}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            onClick={state.handleToday}
            variant="outline"
            className="flex h-8"
          >
            <p className="text-body">오늘</p>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FilterIcon size={16} />
                <p>필터</p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[160px] items-start">
              <DropdownMenuLabel>필터</DropdownMenuLabel>
              {projects?.result?.map((project) => (
                <DropdownMenuCheckboxItem
                  key={project.id}
                  checked={!!state.selectedProject[project.id]}
                  onCheckedChange={() => handleCheckedChange(project.id)}
                >
                  {project.title}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuCheckboxItem
                checked={state.myCalendar}
                onCheckedChange={handleMyCalendarChange}
              >
                나의 일정
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => openModal('default', ModalTypes.CREATE)}
          >
            <PlusIcon size={16} />
            <p className="text-subtle">일정 추가</p>
          </Button>
          <Select value={view} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue>
                {view === 'day'
                  ? '일(Daily)'
                  : view === 'week'
                    ? '주(Weekly)'
                    : view === 'month'
                      ? '월(Monthly)'
                      : '일정(List)'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>캘린더 타입</SelectLabel>
                <SelectItem value="day">일(Daily)</SelectItem>
                <SelectItem value="week">주(Weekly)</SelectItem>
                <SelectItem value="month">월(Monthly)</SelectItem>
                <SelectItem value="list">일정(List)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {modals.default.open && modals.default.type === ModalTypes.CREATE && (
        <ScheduleCreateModal />
      )}
      {modals.dimed.type === ModalTypes.REPEAT && <ScheduleRepeatModal />}
      {modals.dimed.type === ModalTypes.DELETE_REPEAT && (
        <RepeatScheduleDeleteModal />
      )}
    </>
  )
}
