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
import { getInitials } from '@/components/Avatar/Avatar'
import { Icon } from '@/components/Icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatPhoneNumber } from '@/hooks/useVaild'
import { format, getDay } from 'date-fns'
import { UseFormReturn } from 'react-hook-form'
import { Calendar } from '../ui/calendar'
import { Checkbox } from '../ui/checkbox'
import { Textarea } from '../ui/textarea'

interface entry {
  tool: string
  email: string
}

interface formType {
  form: UseFormReturn<z.infer<any>>
}

interface defaultFormType {
  form: UseFormReturn<z.infer<any>>
  name: string
  label: string
  [key: string]: any
}

interface checkBoxFormType {
  form: UseFormReturn<z.infer<any>>
  name: 'use' | 'privacy' | 'marketing'
}

interface avatarFormType {
  form: UseFormReturn<z.infer<any>>
  imageUrl: string
  setImageUrl: React.Dispatch<React.SetStateAction<string>>
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
        <FormMessage />
      </FormItem>
    )}
  />
)

export const AvatarInfoForm = ({
  form,
  imageUrl,
  setImageUrl,
}: avatarFormType) => {
  const [icon, setIcon] = React.useState<'camera' | 'cancel'>(() =>
    imageUrl ? 'cancel' : 'camera',
  )

  React.useEffect(() => {
    setIcon(imageUrl ? 'cancel' : 'camera')
  }, [imageUrl])

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    if (icon == 'camera') {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    } else if (icon == 'cancel') {
      setImageUrl('')
      setIcon('camera')
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageUrl(reader.result as string)
        setIcon('cancel')
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem className="flex items-center justify-center gap-[10px] self-stretch">
          <div className="relative">
            <Avatar className="h-[90px] w-[90px] items-center justify-center overflow-hidden bg-slate-100">
              <AvatarImage
                src={imageUrl ?? ''}
                alt="프로필 이미지"
                className="h-full w-full object-cover"
              />
              <AvatarFallback>
                {imageUrl ? '' : getInitials(form.getValues('name'))}
              </AvatarFallback>
            </Avatar>
            <Icon
              name={icon}
              className="absolute right-1 top-1 cursor-pointer"
              onClick={handleIconClick}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <div className="w-full">
            <DefaultInputForm form={form} name="name" label="이름" />
          </div>
        </FormItem>
      )}
    />
  )
}

export const DefaultInputForm = ({
  form,
  name,
  label,
  ...rest
}: defaultFormType) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
        <FormLabel className="text-p">{label}</FormLabel>
        <FormControl className="flex items-start gap-[8px] self-stretch">
          <Input placeholder={label} {...rest} {...field} />
        </FormControl>
      </FormItem>
    )}
  />
)

export const DatePickerInfoForm = ({
  form,
  name,
  label,
  ...rest
}: defaultFormType) => {
  const formatDate = (date: Date) => {
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][getDay(date)]
    return `${format(date, 'yyyy.MM.dd')} (${dayOfWeek})`
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
          <FormLabel className="text-p">{label}</FormLabel>
          <FormControl className="flex items-start gap-[8px] self-stretch">
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  {...rest}
                  {...field}
                  value={
                    field.value?.from
                      ? field.value.to
                        ? `${formatDate(field.value.from)} ~ ${formatDate(field.value.to)}`
                        : formatDate(field.value.from).toString()
                      : ''
                  }
                  readOnly
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  // disabled={(date) => date <= new Date()}
                  selected={field.value}
                  onSelect={field.onChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export const TextAreaForm = ({
  form,
  name,
  label,
  ...rest
}: defaultFormType) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col items-start gap-[6px] self-stretch">
        <FormLabel className="text-p">{label}</FormLabel>
        <FormControl className="flex items-start gap-[8px] self-stretch">
          <div className="grid w-full gap-2">
            <Textarea
              placeholder={label}
              {...rest}
              {...field}
              className="resize-none border border-gray-300 placeholder:text-gray-400"
            />
            <p className="text-right text-subtle">
              <span className="text-black">
                {field.value ? field.value.length : 0}
              </span>
              <span className="text-gray-400"> / 100</span>
            </p>
          </div>
        </FormControl>
      </FormItem>
    )}
  />
)

export const CheckBoxForm = ({ form, name }: checkBoxFormType) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel />
        <FormControl>
          <div className="flex items-start gap-[8px]">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={name} className="text-small text-gray-500">
              {name === 'marketing' ? (
                '마케팅 메일 수신 동의 (선택)'
              ) : (
                <>
                  <span className="text-blue-500 underline">
                    {name === 'use' ? '이용약관' : '개인정보'}
                  </span>
                  {name === 'use' ? ' 동의 (필수)' : ' 이용 동의 (필수)'}
                </>
              )}
            </label>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)
