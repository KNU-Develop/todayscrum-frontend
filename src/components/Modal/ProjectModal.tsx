import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Modal } from './Modal'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import InputForm from '../Input/InputForm'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

function onSubmit(values: z.infer<typeof formSchema>) {
  console.log(values)
}

export const ProjectCreateModal = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  })
  return (
    <Modal>
      <p className="text-h4">프로젝트 생성</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputForm
                    id=""
                    type=""
                    label="프로젝트 이름"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputForm
                    id=""
                    type=""
                    label="프로젝트 이름"
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  )
}
