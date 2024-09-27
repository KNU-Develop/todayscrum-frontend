'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'

import { useEditUserMutation, useUserInfoQuery } from '@/api'

import {
  AvatarInfoForm,
  DefaultInputForm,
  MBITInfoForm,
  PhoneInfoForm,
  ToolInfoForm,
} from '@/components/InputForm'
import { formSchemaUserEdit } from '@/hooks/useVaild'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const profileEdit: React.FC = () => {
  const router = useRouter()
  const queryClinet = useQueryClient()
  const [entries, setEntries] = React.useState<
    { tool: string; email: string }[]
  >([])
  const [value, setValue] = React.useState<string>('')
  const [imageUrl, setImageUrl] = React.useState<string>('')

  const { data, isLoading } = useUserInfoQuery()

  const form = useForm<z.infer<typeof formSchemaUserEdit>>({
    resolver: zodResolver(formSchemaUserEdit),
    defaultValues: {
      name: '',
      email: '',
      contact: '',
      location: '',
      stacks: '',
      mbti: '',
      entries: [],
      imageUrl: '',
    },
  })

  const editUserMutation = useEditUserMutation(
    {
      name: form.watch('name'),
      email: form.watch('email'),
      contact: form.watch('contact'),
      location: form.watch('location'),
      stacks: form
        .watch('stacks')
        .split(',')
        .map((stacks) => stacks.trim())
        .filter((stacks) => stacks !== ''),
      mbti: form.watch('mbti') === '' ? null : form.watch('mbti'),
      tools: Object.fromEntries(
        entries.map((entry) => [entry.tool.toUpperCase(), entry.email]),
      ),
      imageUrl,
    },
    {
      onSuccess: () => {
        queryClinet.invalidateQueries({ queryKey: ['projectList'] })
        router.push('/home')
      },
    },
  )

  React.useEffect(() => {
    if (data !== undefined) {
      form.setValue('email', data.result.email || '')
      form.setValue('name', data.result.name || '')
      form.setValue('contact', data.result.contact || '')
      form.setValue('location', data.result.location || '')
      setEntries(
        data.result.tools.map((item) => ({
          tool: item.toolName,
          email: item.email,
        })),
      )
      form.setValue('stacks', data.result.stackNames.join(', ') || '')
      form.setValue('mbti', data.result.mbti || '')
      setImageUrl(data.result.imageUrl || '')
      setValue(data.result.mbti || '')
    }
  }, [data])

  const onSubmit = () => {
    editUserMutation.mutate()
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="mt-[-80px] flex h-full items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[380px] flex-col items-start gap-[24px]"
        >
          <div className="flex flex-col items-center justify-center gap-[8px] self-stretch">
            <p className="text-center text-h4">프로필 정보</p>
          </div>
          <div className="flex flex-col items-start gap-[16px] self-stretch">
            <DefaultInputForm
              form={form}
              name="email"
              label="로그인 정보"
              disabled
            />
            <AvatarInfoForm
              form={form}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            />
            <ToolInfoForm
              form={form}
              entries={entries}
              setEntries={setEntries}
            />
            <PhoneInfoForm form={form} />
            <DefaultInputForm form={form} name="location" label="거주지역" />
            <DefaultInputForm
              form={form}
              name="stacks"
              label="기술스택(쉼표로 구분)"
              placeholder="기술스택"
            />
            <MBITInfoForm form={form} value={value} setValue={setValue} />

            <div className="itmes-center flex justify-end gap-[8px] self-stretch">
              <Button
                type="button"
                onClick={() => router.push('/home')}
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
