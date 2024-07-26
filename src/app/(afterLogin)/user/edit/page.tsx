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
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const profileEdit: React.FC = () => {
  const router = useRouter()
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
          router.push('/workspace')
      },
    },
  )

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
              disabled={true}
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
            <DefaultInputForm form={form} name="address" label="거주지역" />
            <DefaultInputForm
              form={form}
              name="stack"
              label="기술스택(쉼포로 구분)"
              placeholder="기술스택"
            />
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
