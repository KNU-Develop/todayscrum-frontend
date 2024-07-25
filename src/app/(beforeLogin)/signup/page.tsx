'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useUserSignUpMutation } from '@/api'
import {
  EmailInfoForm,
  NameInfoForm,
  PhoneInfoForm,
} from '@/components/InputForm'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { formSchemaSignUp } from '@/hook/useVaild'
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
      mail: false,
    },
  })

  const isAllChecked =
    form.watch('use') && form.watch('privacy') && form.watch('mail')

  const onCheckAll = (chekced: boolean) => {
    form.setValue('use', chekced, { shouldValidate: true })
    form.setValue('privacy', chekced, { shouldValidate: true })
    form.setValue('mail', chekced, { shouldValidate: true })
  }
  const userSignUpMutation = useUserSignUpMutation(
    {
      name: form.watch('name'),
      phone: form.watch('phonenumber'),
      requiredTermsAgree: form.watch('privacy') && form.watch('use'),
      marketingEmailOptIn: !!form.watch('mail'),
    },
    {
      onSuccess: () => {
        console.log('Success:', {
          name: form.watch('name'),
          phone: form.watch('phonenumber'),
          requiredTermsAgree: form.watch('privacy') && form.watch('use'),
          marketingEmailOptIn: !!form.watch('mail'),
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
    // const userDTO: UserSignUpDTO = {
    //   name: values.name,
    //   phone: values.phonenumber,
    //   requiredTermsAgree: values.use && values.privacy,
    //   marketingEmailOptIn: !!values.mail,
    // }

    // try {
    //   const response = await fetch('/signup', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(userDTO),
    //   })

    //   if (response.ok) {
    //     console.log('Success:', userDTO)
    //     router.push('/signup/optionalInfo')
    //   } else {
    //     console.error('Failed to submit form')
    //   }
    // } catch (error) {
    //   console.error('Error:', error)
    // }
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
            <EmailInfoForm form={form} />
            <NameInfoForm form={form} />
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
              <FormField
                control={form.control}
                name="use"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <div className="flex items-start gap-[8px]">
                        <Checkbox
                          id="use"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="use"
                          className="text-small text-gray-500"
                        >
                          <span className="text-blue-500 underline">
                            이용약관
                          </span>{' '}
                          동의 (필수)
                        </label>
                      </div>
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <div className="flex items-start gap-[8px]">
                        <Checkbox
                          id="privacy"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="privacy"
                          className="text-small text-gray-500"
                        >
                          <span className="text-blue-500 underline">
                            개인정보 수집
                          </span>{' '}
                          이용 동의 (필수)
                        </label>
                      </div>
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <div className="flex items-start gap-[8px]">
                        <Checkbox
                          id="mail"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="mail"
                          className="text-small text-gray-500"
                        >
                          마케팅 메일 수신 동의 (선택)
                        </label>
                      </div>
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            variant={!form.formState.isValid ? 'disabled' : 'default'}
            disabled={!form.formState.isValid}
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
