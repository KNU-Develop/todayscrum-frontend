import { use, useEffect, useState } from 'react'
import { Modal } from './Modal'
import { useModal } from '@/hooks/useModal'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { BoardDto, MasterDto } from '@/api/services/board/model'
import { useUpdateBoardMutation } from '@/api/services/board/quries'
import { zodResolver } from '@hookform/resolvers/zod'
import { fromCreateBoard } from '@/hooks/useVaild/useBoard'
import { toast } from 'sonner'
import { Form } from '../ui/form'
import {
  DatePickerInfoForm,
  DefaultInputForm,
  ParticipateForm,
  TextAreaForm,
} from '../InputForm/InputForm'
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { CategoryDropdown } from '../ProjectContainer/ProjectContainer'
import { ProjectInfo, TeamInfo, useTeamInfoQuery } from '@/api'
import { StatusDropDownCreate } from '../ProjectContainer/StatusDropDown'

export const EditBoardModal = ({
  board,
  project,
}: {
  board: BoardDto
  project: ProjectInfo
}) => {
  const { closeModal } = useModal()

  const queryClient = useQueryClient()
  const [masters, setMasters] = useState<TeamInfo[]>([])
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const TeamList = useTeamInfoQuery(project.id)

  const form = useForm({
    resolver: zodResolver(fromCreateBoard),
    defaultValues: {
      title: board.title,
      content: board.content,
      category: board.category,
      progress: board.progress,
      mastersId: board.masters.map((master) => master.id),
    },
  })

  useEffect(() => {
    if (board.masters && TeamList.data?.result) {
      const masterIds = board.masters.map((master) => master.id)

      const matchingMasters = TeamList.data.result.filter((user) =>
        masterIds.includes(parseInt(user.id)),
      )

      setMasters(matchingMasters)
    }
  }, [board.masters, TeamList.data])

  const editBoardInfo = useUpdateBoardMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', board.id] })
      toast(`${board.title} 보드 수정 성공`, { duration: 2000 })
      closeModal('dimed')
    },
    onError: () => {
      toast(`${board.title} 보드 수정 실패`, { duration: 2000 })
    },
  })

  const onSubmit = () => {
    const inviteList = masters.map((master) => parseInt(master.id, 10))

    editBoardInfo.mutate({
      id: board.id,
      title: form.getValues('title'),
      content: form.getValues('content'),
      category: form.getValues('category'),
      progress: form.getValues('progress'),
      mastersId: inviteList,
    })
  }

  return (
    <Modal>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full min-w-[448px] flex-col gap-6"
        >
          <div className="flex justify-between">
            <h1 className="text-xl font-bold">게시글 수정</h1>
            <div
              className="relative cursor-pointer font-pretendard text-[14px] font-medium leading-[14px]"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            >
              <div className="flex gap-[4px] px-4 py-2">
                {form.watch('category')}
                <ChevronDown size={16} />
              </div>
            </div>
            {isCategoryDropdownOpen && (
              <CategoryDropdown
                className="absolute right-8 top-16"
                form={form}
                onClose={() => setIsCategoryDropdownOpen(false)}
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <DefaultInputForm form={form} name="title" label="게시글 제목" />
            <ParticipateForm
              form={form}
              participates={masters}
              setParticipates={setMasters}
            />
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">
                진행 상태
              </label>
              <div
                className="mt-1 w-full cursor-pointer rounded border bg-white shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <div className="px-4 py-2">{form.watch('progress')}</div>
              </div>
              {isStatusDropdownOpen && (
                <StatusDropDownCreate
                  form={form}
                  onClose={() => setIsStatusDropdownOpen(false)}
                />
              )}
            </div>
            <TextAreaForm form={form} name="content" label="게시글 내용" />
          </div>
          <div className="flex w-full gap-3">
            <Button
              type="button"
              title="닫기"
              variant="secondary"
              className="flex-1"
              onClick={() => closeModal('dimed')}
            >
              <p className="text-body">닫기</p>
            </Button>
            <Button
              type="submit"
              title="수정"
              disabled={!form.formState.isValid}
              variant={form.formState.isValid ? 'default' : 'disabled'}
              className="flex-1"
            >
              <p className="text-body">수정</p>
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  )
}
