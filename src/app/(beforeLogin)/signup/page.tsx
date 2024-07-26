'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useUserSignUpMutation } from '@/api'
import {
  CheckBoxForm,
  DefaultInputForm,
  PhoneInfoForm,
} from '@/components/InputForm'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import { formSchemaSignUp } from '@/hooks/useVaild'
import { useRouter } from 'next/navigation'

const JoinForm = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchemaSignUp>>({
    resolver: zodResolver(formSchemaSignUp),
    defaultValues: {
      name: '',
      email: 'hin6150@gmail.com',
      phonenumber: '',
      use: false,
      privacy: false,
      marketing: false,
    },
    mode: 'onChange',
  })

  const isAllChecked =
    form.watch('use') && form.watch('privacy') && form.watch('marketing')

  const onCheckAll = (chekced: boolean) => {
    form.setValue('use', chekced, { shouldValidate: true })
    form.setValue('privacy', chekced, { shouldValidate: true })
    form.setValue('marketing', chekced, { shouldValidate: true })
  }

  const userSignUpMutation = useUserSignUpMutation(
    {
      name: form.watch('name'),
      phone: form.watch('phonenumber'),
      requiredTermsAgree: form.watch('privacy') && form.watch('use'),
      marketingEmailOptIn: !!form.watch('marketing'),
    },
    {
      onSuccess: () => {
        console.log('Success:', {
          name: form.watch('name'),
          phone: form.watch('phonenumber'),
          requiredTermsAgree: form.watch('privacy') && form.watch('use'),
          marketingEmailOptIn: !!form.watch('marketing'),
        })
        router.push('/signup/optionalInfo')
      },
      onError: (e) => {
        console.log(e)
      },
    },
  )

  const onSubmit = async (values: z.infer<typeof formSchemaSignUp>) => {
    userSignUpMutation.mutate()
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center font-pretendard">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[380px] flex-shrink-0 flex-col items-start gap-[36px]"
        >
          <div className="flex flex-col items-center justify-center gap-[8px] self-stretch">
            <p className="text-center text-h4">회원 가입</p>
          </div>

          <div className="flex flex-col items-start gap-[10px] self-stretch">
            <DefaultInputForm
              form={form}
              name="email"
              label="로그인 정보"
              disabled={true}
            />
            <DefaultInputForm form={form} name="name" label="이름" />
            <PhoneInfoForm form={form} />
          </div>

          <div className="flex flex-col items-start gap-[14px] self-stretch">
            <div className="flex items-start gap-[8px]">
              <Checkbox
                id="all"
                checked={isAllChecked}
                onCheckedChange={onCheckAll}
              />
              <label htmlFor="all" className="text-small">
                전체 동의
              </label>
            </div>

            <div className="h-[1px] self-stretch bg-gray-200" />

            <div className="flex flex-col items-start gap-[16px] self-stretch">
              <CheckBoxForm form={form} name="use" />
              <CheckBoxForm form={form} name="privacy" />
              <CheckBoxForm form={form} name="marketing" />
            </div>
          </div>

          <Button
            type="submit"
            variant={!form.formState.isValid ? 'disabled' : 'default'}
            disabled={!form.formState.isValid || userSignUpMutation.isPending}
            className="w-full"
          >
            <p className="text-body">회원가입</p>
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default JoinForm
