'use client'
import * as React from 'react'
import { formatDate } from '@/hooks/useCalendar'
import { getDotColor } from './style'
import { ProjectInfo, ScheduleInfo, useUserInfoQuery } from '@/api'
import { format } from 'date-fns'

interface ListProps {
  schedules: ScheduleInfo[] | undefined
  projects: ProjectInfo[] | undefined
}

export function List({ schedules, projects }: ListProps) {
  const { data: userInfo } = useUserInfoQuery() // 사용자 정보 가져오기
  const groupedSchedules: Record<string, ScheduleInfo[]> = {}
  const today = format(new Date(), 'yyyy-MM-dd')

  if (schedules) {
    schedules.forEach((schedule) => {
      const dateKey = format(new Date(schedule.startDate), 'yyyy-MM-dd')
      if (!groupedSchedules[dateKey]) {
        groupedSchedules[dateKey] = []
      }
      groupedSchedules[dateKey].push(schedule)
    })
  }

  const formatTime = (start: string, end: string): string => {
    const formatSingleTime = (
      time: string,
    ): { period: string; hour12: number; minutes: string } => {
      const date = new Date(time)
      const hour = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const period = hour < 12 ? '오전' : '오후'
      const hour12 = hour % 12 || 12

      return { period, hour12, minutes }
    }

    const formatHourAndMinutes = (hour12: number, minutes: string) => {
      return minutes === '00' ? `${hour12}시` : `${hour12}시 ${minutes}분`
    }

    const {
      period: startPeriod,
      hour12: startHour12,
      minutes: startMinutes,
    } = formatSingleTime(start)
    const {
      period: endPeriod,
      hour12: endHour12,
      minutes: endMinutes,
    } = end ? formatSingleTime(end) : { period: '', hour12: 0, minutes: '' }

    if (start === end) {
      return '하루 종일'
    }

    const endTime = formatHourAndMinutes(endHour12, endMinutes)

    // 시작 시간과 끝 시간이 같은 '오전' 또는 '오후'일 경우 한 번만 출력
    if (startPeriod === endPeriod) {
      return `${startPeriod} ${formatHourAndMinutes(startHour12, startMinutes)} ~ ${endTime}`
    }

    return `${startPeriod} ${formatHourAndMinutes(startHour12, startMinutes)} ~ ${endPeriod} ${endTime}`
  }

  const getProjectColor = (projectId: string) => {
    const projectColor = projects?.find(
      (project) => project.id === projectId,
    )?.color
    return projectColor || userInfo?.result.color || '#ccc' // 프로젝트 색상이 없으면 사용자 색상 사용
  }

  return (
    <div className="flex h-full w-[864px] flex-shrink-0 flex-col items-start gap-[10px] p-4">
      <div className="h-[1px] w-[832px] bg-gray-300" />
      <div className="w-full">
        {Object.keys(groupedSchedules).length > 0 ? (
          Object.entries(groupedSchedules).map(([key, schedules]) => {
            const [year, month, date] = key.split('-')
            const isToday = key === today
            return (
              <div
                key={key}
                className="flex gap-[10px] self-stretch border-b border-slate-300 p-[10px]"
              >
                <div className="flex w-[150px] items-center gap-5 px-4 py-1">
                  <div
                    className={`${isToday ? 'flex h-9 items-center justify-center rounded-full bg-black text-white' : ''}`}
                  >
                    <p className="w-9 text-center text-lead">
                      {formatDate(Number(date))}
                    </p>
                  </div>
                  <p className="w-opacity-40 py-1 text-detail">{`${month}월 ${date}일`}</p>
                </div>

                <div className="flex flex-1 flex-col items-start justify-center gap-[10px] py-1">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center gap-9 pl-1"
                    >
                      <div className="flex items-center gap-2 self-stretch">
                        <div
                          className={`h-2 w-2 rounded-full ${getDotColor(getProjectColor(schedule.projectId ?? ''))}`}
                        />
                        <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-2 w-[130px] text-body">
                          {formatTime(schedule.startDate, schedule.endDate)}
                        </p>
                      </div>
                      <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-1 flex-[1_0_0]">
                        {schedule.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex items-center justify-center py-10">
            <p className="text-gray-500">일정 없음</p>
          </div>
        )}
      </div>
    </div>
  )
}
