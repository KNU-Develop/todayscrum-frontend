// StatusDropDown.tsx

import ReactDOM from 'react-dom'
import { BoardProgress } from '@/api/services/board/model'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import React, { useEffect, useState, forwardRef } from 'react'

interface StatusDropdownProps {
  form: UseFormReturn<z.infer<any>>
  onClose: () => void
  position?: { top: number; left: number }
}

export const StatusDropdown = forwardRef<
  HTMLDivElement,
  StatusDropdownProps & { className?: string }
>(({ form, onClose, position, className = 'w-[130px] top-4' }, ref) => {
  const statuses = [
    BoardProgress.problem,
    BoardProgress.progress,
    BoardProgress.done,
  ]

  return ReactDOM.createPortal(
    <div
      ref={ref}
      className={`absolute z-50 overflow-hidden rounded-md border bg-white shadow-lg ${className}`}
      style={{
        top: position?.top,
        left: position?.left,
        position: 'absolute',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {statuses.map((status) => (
        <div
          key={status}
          className={`flex cursor-pointer items-center px-4 py-2 text-center hover:bg-gray-100 ${
            status === form.watch('progress') ? 'font-bold text-blue-600' : ''
          }`}
          onClick={() => {
            form.setValue('progress', status)
            onClose()
          }}
        >
          {/* ... 아이콘 및 상태 표시 ... */}
          {status}
        </div>
      ))}
    </div>,
    document.body,
  )
})

export const StatusDropDownCreate = forwardRef<
  HTMLDivElement,
  StatusDropdownProps & { className?: string }
>(({ form, onClose, className = 'w-[130px]' }, ref) => {
  const statuses = [
    BoardProgress.problem,
    BoardProgress.progress,
    BoardProgress.done,
  ]

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-white shadow-lg ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {statuses.map((status) => (
        <div
          key={status}
          className={`flex cursor-pointer items-center px-4 py-2 text-center hover:bg-gray-100 ${
            status === form.watch('progress') ? 'font-bold text-blue-600' : ''
          }`}
          onClick={() => {
            form.setValue('progress', status)
            onClose()
          }}
        >
          {/* ... 아이콘 및 상태 표시 ... */}
          {status}
        </div>
      ))}
    </div>
  )
})
