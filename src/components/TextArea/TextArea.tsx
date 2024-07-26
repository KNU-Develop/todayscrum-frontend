'use client'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface TextareaWithTextProps {
  label: string
  maxLength?: number
}

export function TextareaWithText({
  label,
  maxLength = 100,
}: TextareaWithTextProps) {
  const [text, setText] = useState<string>('')

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  return (
    <div className="font-Pretendard grid w-full gap-1.5 text-black">
      <Label htmlFor="message-2" className="text-base">
        {label}
      </Label>
      <Textarea
        id="message-2"
        placeholder={label}
        value={text}
        onChange={handleChange}
        className="resize-none border border-gray-300 placeholder:text-gray-400"
      />
      <p className="text-right text-sm font-normal leading-5 text-muted-foreground">
        <span className="text-black">{text.length}</span>
        <span className="text-gray-400">/{maxLength}</span>
      </p>
    </div>
  )
}
