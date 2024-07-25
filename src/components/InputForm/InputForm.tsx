'use client'

import { mbtiOptions } from '@/api/services/user/model'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { CommandList } from 'cmdk'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { z } from 'zod'

import { toolList } from '@/api/services/user/model'
import { Icon } from '@/components/Icon'
import { formatPhoneNumber } from '@/hook/useVaild'
import { UseFormReturn } from 'react-hook-form'

interface entry {
  tool: string
  email: string
}

interface formType {
  form: UseFormReturn<z.infer<any>>
}

interface infoFormType {
  form: UseFormReturn<z.infer<any>>
  entries: entry[]
  setEntries: React.Dispatch<React.SetStateAction<entry[]>>
}

interface mbtiFormType {
  form: UseFormReturn<z.infer<any>>
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

export const ToolInfoForm = ({ form, entries, setEntries }: infoFormType) => {
  const [addTool, setAddTool] = React.useState<string>('')
  const [toolEmail, setToolEmail] = React.useState<string>('')

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const entrySchema = z.object({
      tool: z.string().nonempty({ message: '협업 툴을 선택하세요.' }),
      email: z.string().email({ message: '유효한 이메일을 입력하세요.' }),
    })

    const result = entrySchema.safeParse({ tool: addTool, email: toolEmail })

    if (result.success) {
      setEntries([...entries, { tool: addTool, email: toolEmail }])
      setAddTool('')
      setToolEmail('')
    } else {
      result.error.errors.forEach((error) => {
        alert(error.message)
      })
    }
  }

  const handleRemove = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index))
  }

  return (
    <FormField
      control={form.control}
      name="entries"
      render={({ field }) => (
        <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
          <FormLabel className="text-p">기타 정보</FormLabel>
          <div className="inline-flex items-start gap-[10px]">
            <FormControl>
              <Select value={addTool} onValueChange={setAddTool}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="협업 툴" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {toolList.map((tool) => {
                      return (
                        <SelectItem value={tool} key={tool}>
                          {tool}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormControl>
              <Input
                placeholder="계정 이메일"
                value={toolEmail}
                onChange={(e) => {
                  setToolEmail(e.target.value)
                }}
              />
            </FormControl>
            <FormMessage />
            <Button
              onClick={handleAdd}
              variant={!addTool || !toolEmail ? 'disabled' : 'secondary'}
              disabled={!addTool || !toolEmail}
            >
              추가
            </Button>
          </div>
          <div className="w-full">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="flex h-[32px] w-full items-center gap-[8px] self-stretch px-[8px] py-[6px]"
              >
                <Icon name="mail" />
                <span className="flex-1 text-subtle text-slate-900">
                  {entry.email}
                </span>
                <span className="text-detail text-slate-500">{entry.tool}</span>
                <Icon
                  name="cancel"
                  onClick={() => handleRemove(index)}
                  className="cursor-pointer"
                />
              </div>
            ))}
          </div>
        </FormItem>
      )}
    />
  )
}

export const StackInfoForm = ({ form }: formType) => (
  <FormField
    control={form.control}
    name="stack"
    render={({ field }) => (
      <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
        <FormLabel className="text-p">기술 스택(쉼표로 구분)</FormLabel>
        <FormControl>
          <Input
            placeholder="기술스택"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </FormControl>
      </FormItem>
    )}
  />
)

export const MBITInfoForm = ({ form, value, setValue }: mbtiFormType) => {
  const [mbtiOpen, setMbtiOpen] = React.useState<boolean>(false)

  return (
    <FormField
      control={form.control}
      name="MBTI"
      render={() => (
        <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
          <FormLabel className="text-p">MBTI</FormLabel>
          <Popover open={mbtiOpen} onOpenChange={setMbtiOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={mbtiOpen}
                className="w-full justify-between border-slate-300"
              >
                {value
                  ? mbtiOptions.find((mbtiOption) => mbtiOption.value === value)
                      ?.label
                  : 'MBTI'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-h-[200px] w-[380px] overflow-y-auto">
              <Command>
                <CommandInput placeholder="MBTI" />
                <CommandList>
                  <CommandEmpty>검색한 MBTI가 존재하지 않습니다.</CommandEmpty>
                  <CommandGroup>
                    {mbtiOptions.map((mbtiOption) => (
                      <CommandItem
                        key={mbtiOption.value}
                        value={mbtiOption.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue)
                          setMbtiOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === mbtiOption.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {mbtiOption.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  )
}

export const AddressInfoForm = ({ form }: formType) => (
  <FormField
    control={form.control}
    name="address"
    render={({ field }) => (
      <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
        <FormLabel className="text-p">거주지역</FormLabel>
        <FormControl>
          <Input
            placeholder="거주지역"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </FormControl>
      </FormItem>
    )}
  />
)

export const PhoneInfoForm = ({ form }: formType) => (
  <FormField
    control={form.control}
    name="phonenumber"
    render={({ field }) => (
      <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
        <FormLabel className="text-p">전화번호</FormLabel>
        <FormControl>
          <Input
            placeholder="전화번호"
            value={formatPhoneNumber(field.value)}
            onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
          />
        </FormControl>
        {/* <FormMessage /> */}
      </FormItem>
    )}
  />
)

export const NameInfoForm = ({ form }: formType) => (
  <FormField
    control={form.control}
    name="name"
    render={({ field }) => (
      <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
        <FormLabel className="text-p">이름</FormLabel>
        <FormControl>
          <Input
            placeholder="이름"
            {...field}
            value={field.value}
            onChange={(e) => {
              field.onChange(e.target.value)
            }}
          />
        </FormControl>
        {/* <FormMessage /> */}
      </FormItem>
    )}
  />
)

export const EmailInfoForm = ({ form }: formType) => (
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem className="flex flex-col items-start gap-[6px] self-stretch opacity-50">
        <FormLabel className="text-p">로그인 계정</FormLabel>
        <FormControl className="flex items-start gap-[8px] self-stretch">
          <Input value={field.value} disabled={true} />
        </FormControl>
      </FormItem>
    )}
  />
)
