import { useProjectInfoQuery, useScheduleListQuery } from '@/api'
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
import React, { useContext, useState } from 'react'
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
import { format } from 'date-fns'
import { Monthly, Weekly, Daily, List } from '../Calendar'
import {
  RepeatScheduleDeleteModal,
  ScheduleCreateModal,
  ScheduleRepeatModal,
} from '../Modal/ScheduleModal'

type SelectedProjects = { [key: string]: boolean }
type Checked = boolean

export const CalendarHeader = () => {
  const { modals, openModal } = useModal()
  const state = useContext(CalendarContext)

  const startDate = format(state.date, 'yyyy-MM-dd')
  const endDate = format(state.date, 'yyyy-MM-dd')

  const { data: schedules } = useScheduleListQuery(startDate, endDate)
  const { data: projects } = useProjectInfoQuery()

  // 선택된 프로젝트에 따라 스케줄 필터링
  const schedule =
    schedules?.result?.filter((schedule) => {
      const isProjectSelected = state.selectedProject[schedule.projectId || '']
      return isProjectSelected || !schedule.projectId || state.myCalendar
    }) || []

  const [selectedView, setSelectedView] = useState('month')

  const handleSelectChange = (value: string) => {
    setSelectedView(value)
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
            onClick={() => state.handlePrev(selectedView)}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            onClick={() => state.handleNext(selectedView)}
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
                  // onCheckedChange={() => handleCheckedChange(project.id)}
                >
                  {project.title}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuCheckboxItem
                checked={state.myCalendar}
                // onCheckedChange={handleMyCalendarChange}
              >
                내 캘린더
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
          <Select value={selectedView} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue>
                {selectedView === 'day'
                  ? '일(Daily)'
                  : selectedView === 'week'
                    ? '주(Weekly)'
                    : selectedView === 'month'
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
