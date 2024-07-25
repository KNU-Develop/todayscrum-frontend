'use client'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem } from '@/components/ui/form'
import { SubmitHandler, useForm } from 'react-hook-form'

import { useEditUserMutation, useUserInfoQuery } from '@/api'
import { getInitials } from '@/components/Avatar/Avatar'
import { Icon } from '@/components/Icon'
import {
  AddressInfoForm,
  EmailInfoForm,
  MBITInfoForm,
  NameInfoForm,
  PhoneInfoForm,
  StackInfoForm,
  ToolInfoForm,
} from '@/components/InputForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formSchemaUserEdit } from '@/hook/useVaild'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const profileEdit: React.FC = () => {
  const router = useRouter()
  const [entries, setEntries] = React.useState<
    { tool: string; email: string }[]
  >([])
  const [value, setValue] = React.useState<string>('')
  const [imageUrl, setImageUrl] = React.useState<string>('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [icon, setIcon] = React.useState<'camera' | 'cancel'>(() =>
    imageUrl ? 'cancel' : 'camera',
  )

  const { data } = useUserInfoQuery()

  const form = useForm<z.infer<typeof formSchemaUserEdit>>({
    resolver: zodResolver(formSchemaUserEdit),
    defaultValues: {
      name: '',
      email: '',
      phonenumber: '',
      address: '',
      stack: '',
      MBTI: '',
      entries: [],
      imageUrl: '',
    },
  })

  const editUserMutation = useEditUserMutation(
    {
      name: form.watch('name'),
      email: form.watch('email'),
      phone: form.watch('phonenumber'),
      address: form.watch('address'),
      stack: form
        .watch('stack')
        .split(',')
        .map((stack) => stack.trim())
        .filter((stack) => stack !== ''),
      MBTI: form.watch('MBTI'),
      tool: Object.fromEntries(
        entries.map((entry) => [entry.tool, entry.email]),
      ),
      imageUrl: imageUrl,
    },
    {
      onSuccess: () => {
        console.log('Success:', {
          name: form.watch('name'),
          email: form.watch('email'),
          phone: form.watch('phonenumber'),
          address: form.watch('address'),
          stack: form
            .watch('stack')
            .split(',')
            .map((stack) => stack.trim())
            .filter((stack) => stack !== ''),
          MBTI: form.watch('MBTI'),
          tool: Object.fromEntries(
            entries.map((entry) => [entry.tool, entry.email]),
          ),
          imageUrl: imageUrl,
        }),
          router.push('/')
      },
    },
  )

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

  React.useEffect(() => {
    if (data !== undefined) {
      form.setValue('email', data.result.email)
      form.setValue('name', data.result.name)
      form.setValue('phonenumber', data.result.phone)
      form.setValue('address', data.result.address)
      setEntries(
        Object.entries(data.result.tool).map(([tool, email]) => ({
          tool,
          email: email as string,
        })),
      )
      form.setValue('stack', data.result.stack.join(', '))
      form.setValue('MBTI', data.result.MBTI)
      setImageUrl(data.result.imageUrl || '')
      setIcon(data.result.imageUrl ? 'cancel' : 'camera')
    }
  }, [data])

  const onSubmit: SubmitHandler<z.infer<typeof formSchemaUserEdit>> = async (
    values,
  ) => {
    editUserMutation.mutate()
    // const userInfo: EditUserInfoDTO = {
    //   name: values.name,
    //   tool: Object.fromEntries(
    //     entries.map((entry) => [entry.tool, entry.email]),
    //   ),
    //   phone: values.phonenumber,
    //   address: values.address,
    //   stack: values.stack
    //     .split(',')
    //     .map((stack) => stack.trim())
    //     .filter((stack) => stack !== ''),
    //   MBTI: values.MBTI,
    //   imageUrl: imageUrl,
    // }
    // try {
    //   const response = await fetch('/user/edit', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(userInfo),
    //   })
    //   if (response.ok) {
    //     console.log('Success:', userInfo)
    //     router.push('/workspace')
    //   } else {
    //     console.error('Failed to submit form')
    //   }
    // } catch (error) {
    //   console.error('Error:', error)
    // }
  }

  if (data == null) {
    return <div>DATA ERROR</div>
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center font-pretendard">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[380px] flex-col items-start gap-[24px]"
        >
          <div className="flex flex-col items-center justify-center gap-[8px] self-stretch">
            <p className="text-center text-h4">프로필 정보</p>
          </div>
          <div className="flex flex-col items-start gap-[16px] self-stretch">
            <EmailInfoForm form={form} />
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
                    <NameInfoForm form={form} />
                  </div>
                </FormItem>
              )}
            />
            <ToolInfoForm
              form={form}
              entries={entries}
              setEntries={setEntries}
            />
            <PhoneInfoForm form={form} />
            <AddressInfoForm form={form} />
            <StackInfoForm form={form} />
            <MBITInfoForm form={form} value={value} setValue={setValue} />

            <div className="itmes-center flex justify-end gap-[8px] self-stretch">
              <Button
                type="button"
                onClick={() => router.push('/workspace')}
                className="bg-white text-gray-400 hover:bg-gray-100"
              >
                취소하기
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                수정하기
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default profileEdit
