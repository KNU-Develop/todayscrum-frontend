'use client'
import { useUserOptionalMutation } from '@/api'
import {
  AddressInfoForm,
  MBITInfoForm,
  StackInfoForm,
  ToolInfoForm,
} from '@/components/InputForm'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { formSchemaOptionalInfo } from '@/hook/useVaild'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'

const page: React.FC = () => {
  const form = useForm<z.infer<typeof formSchemaOptionalInfo>>({
    resolver: zodResolver(formSchemaOptionalInfo),
    defaultValues: {
      address: '',
      entries: [],
      stack: '',
      MBTI: '',
    },
  })

  const router = useRouter()
  const [entries, setEntries] = React.useState<
    { tool: string; email: string }[]
  >([])
  const [value, setValue] = React.useState<string>('')

  const useOptionalMutation = useUserOptionalMutation(
    {
      tool: Object.fromEntries(
        entries.map((entry) => [entry.tool, entry.email]),
      ),
      address: form.watch('address'),
      stack: form
        .watch('stack')
        .split(',')
        .map((stack) => stack.trim())
        .filter((stack) => stack !== ''),
      MBTI: value,
    },
    {
      onSuccess: () => {
        console.log('Success:', {
          tool: Object.fromEntries(
            entries.map((entry) => [entry.tool, entry.email]),
          ),
          address: form.watch('address'),
          stack: form
            .watch('stack')
            .split(',')
            .map((stack) => stack.trim())
            .filter((stack) => stack !== ''),
          MBTI: value,
        })
        router.push('/workspace')
      },
      onError: (e) => {
        console.log(e)
      },
    },
  )

  const onSubmit: SubmitHandler<
    z.infer<typeof formSchemaOptionalInfo>
  > = async (data) => {
    console.log('Success:', {
      tool: Object.fromEntries(
        entries.map((entry) => [entry.tool, entry.email]),
      ),
      address: form.watch('address'),
      stack: form
        .watch('stack')
        .split(',')
        .map((stack) => stack.trim())
        .filter((stack) => stack !== ''),
      MBTI: value,
    })
    useOptionalMutation.mutate()
    // try {
    //   const response = await fetch('/signup/optionalInfo', {
    //     method: 'POST',
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

  return (
    <div className="flex h-screen items-center justify-center py-[12rem] font-pretendard">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[380px] flex-shrink-0 flex-col items-start gap-[24px]"
        >
          <div className="flex flex-col items-center justify-center gap-[8px] self-stretch">
            <p className="text-center text-h4">선택 정보</p>
          </div>
          <div className="flex flex-col items-start gap-[16px] self-stretch">
            <AddressInfoForm form={form} />
            <ToolInfoForm
              form={form}
              entries={entries}
              setEntries={setEntries}
            />
            <StackInfoForm form={form} />
            <MBITInfoForm form={form} value={value} setValue={setValue} />

            <div className="flex items-center justify-end gap-[8px] self-stretch">
              <Button
                type="button"
                onClick={() => router.push('/workspace')}
                variant={'ghost'}
              >
                건너뛰기
              </Button>
              <Button type="submit">입력하기</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default page
