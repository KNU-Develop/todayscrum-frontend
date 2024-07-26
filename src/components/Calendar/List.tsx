// List.tsx
'use client'
import * as React from 'react'
import { formatDate, useFutureSchedules } from '@/hooks/useCalendar'
import { getDotColorClass } from './style'

export function List() {
  const { groupedSchedules } = useFutureSchedules()

  return (
    <div className="flex h-full w-[864px] flex-shrink-0 flex-col items-start gap-[10px] p-4">
      <div className="h-[1px] w-[832px] bg-gray-300" />
      <div className="w-full">
        {Object.entries(groupedSchedules).map(([key, schedules]) => {
          const [year, month, date] = key.split('-')
          return (
            <div
              key={key}
              className="flex items-start gap-[10px] self-stretch border-b border-slate-300 p-[10px]"
            >
              <div className="flex w-[130px] items-center gap-3 px-4 py-1">
                <p className="w-7 text-center text-lead">
                  {formatDate(Number(date))}
                </p>
                <p className="w-opacity-40 py-1 text-detail">{`${month}월 ${date}일`}</p>
              </div>

              <div className="flex flex-[1_0_0] flex-col items-start justify-center gap-[10px] py-1">
                {schedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex h-[25px] w-full items-center gap-9 pl-1"
                  >
                    <div className="flex items-center gap-2 self-stretch">
                      <div
                        className={`h-2 w-2 rounded-full ${getDotColorClass(schedule.project)}`}
                      />
                      <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-2 w-[130px] text-body">
                        {schedule.isAllday ? '하루종일' : schedule.time}
                      </p>
                    </div>
                    <p className="display-webkit-box webkit-box-orient-vertical webkit-line-clamp-1 flex-[1_0_0]">
                      {schedule.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
