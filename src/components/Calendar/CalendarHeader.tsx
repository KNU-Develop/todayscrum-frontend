'use client'
import React from 'react'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight, PlusIcon } from 'lucide-react'
import { Icon } from '../Icon'

type ViewType = 'month' | 'week' | 'day'
interface CalendarHeaderProps {
  view: ViewType
  month?: string
  year?: number
  week?: number
  day?: number
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  month,
  year,
  week,
  day,
  onPrev,
  onNext,
  onToday,
}) => {
  return (
    <div className="flex w-[864px] items-center justify-between self-stretch px-4">
      <div className="flex items-center gap-[16px]">
        <p className="w-[140px] text-h3">
          {year}년 {month}월
        </p>
        <Button
          onClick={onPrev}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={onNext}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button onClick={onToday} variant="outline" className="flex h-8">
          <p className="text-body">오늘</p>
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
