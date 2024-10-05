'use client'

import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { formSchemaCheckSchedule, fromSchemaSchedule } from '@/hooks/useVaild'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CalendarIcon,
  LockIcon,
  PencilIcon,
  RepeatIcon,
  Trash2Icon,
  UsersIcon,
} from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import {
  DeleteScheduleType,
  ProjectInviteStatus,
  ScheduleInfo,
  ScheduleVisibility,
  TeamInfo,
  useAddScheduleMutation,
  useDeleteScheduleMutation,
  useEditScheduleMutation,
  useProjectInfoQuery,
  useScheduleDetailQuery,
  useTeamInfoQuery,
  useUserInfoQuery,
} from '@/api'
import { useQueryClient } from '@tanstack/react-query'
import { formatDateTime } from '@/hooks/useCalendar'
import {
  DateTimePickerForm,
  DefaultInputForm,
  DropdownForm,
  EndDateForm,
  ParticipateForm,
  RepeatDayForm,
  SelectForm,
  TextAreaForm,
} from '../InputForm'
import { ProfileAvatar } from '../Avatar/Avatar'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Form } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Modal, ScheduleModal } from './Modal'
import { ScheduleParticipateForm } from '../InputForm/InputForm'
import {
  Invite,
  InviteResponse,
  InviteStatus,
} from '@/api/services/schedule/model'
import { id } from 'date-fns/locale'
import { ProjectUserRole } from '@/api/services/project/model'

const getRepeatOptions = (date: Date) => {
  const dayOfWeekNames = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ]
  // const dayOfWeek = dayOfWeekNames[date.getDay()]

  // const monthDay = date.getDate()
  // const month = date.getMonth() + 1

  return [
    '반복 안함',
    '매일',
    // `매주 ${dayOfWeek}`,
    // `매월 ${monthDay}일`,
    // `매년 ${month}월 ${monthDay}일`,
    '맞춤 설정',
  ]
}

export const ScheduleCreateModal = () => {
  const { closeModal } = useModal()
  const queryClient = useQueryClient()

  const [allDay, setAllDay] = React.useState(false)
  const [participates, setParticipates] = React.useState<TeamInfo[]>([])
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [selectedEndDate, setSelectedEndDate] = React.useState<
    Date | undefined
  >(undefined)
  const [selectedRepeat, setSelectedRepeat] = React.useState('반복 안함')

  const repeatOptions = getRepeatOptions(selectedDate)

  const { data: projects } = useProjectInfoQuery()
  const { data: userInfo } = useUserInfoQuery()

  const projectOptions =
    projects?.result?.map((project) => ({
      value: project.id, // 프로젝트 id를 value로 설정
      label: project.title, // 프로젝트 이름을 label로 설정
    })) || []

  const form = useForm({
    resolver: zodResolver(fromSchemaSchedule),
    defaultValues: {
      type: '개인 일정',
      title: '',
      content: '',
      period: { from: new Date(), to: new Date() },
      visible: 'PRIVATE',
      projectId: null,
      inviteList: [] as string[],
    },
  })

  const addScheduleInfo = useAddScheduleMutation(
    {
      title: form.watch('title'),
      content: form.watch('content'),
      startDate: new Date(
        form.watch('period')?.from.getTime() + 9 * 60 * 60 * 1000,
      ).toISOString(),
      endDate: new Date(
        form.watch('period')?.to.getTime() + 9 * 60 * 60 * 1000,
      ).toISOString(),
      visible: form.watch('visible') as ScheduleVisibility,
      projectId: form.watch('projectId') || null,
      inviteList: (form.watch('inviteList') as string[]) || [],
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['schedules'],
        })
        closeModal('default')
      },
      onError: (e) => {
        console.log(e)
      },
    },
  )

  React.useEffect(() => {
    const scheduleType = form.watch('type')

    if (scheduleType === '개인 일정') {
      form.setValue('projectId', null)
      form.setValue('visible', 'PRIVATE') // 개인 일정일 때는 PRIVATE로 설정
    } else if (scheduleType === '팀 일정') {
      form.setValue('visible', 'PUBLIC') // 팀 일정일 때는 PUBLIC로 설정
    }
  }, [form.watch('type')])

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    setSelectedRepeat('반복 안함')
    setSelectedEndDate(undefined)
  }

  const handleAllDayChange = (checked: boolean) => {
    setAllDay(checked)
    if (checked) {
      // allDay가 체크된 경우 endDate를 startDate와 동일하게 설정
      form.setValue('period', {
        from: form.watch('period').from,
        to: form.watch('period').from, // startDate와 동일하게 설정
      })
      setSelectedEndDate(form.watch('period').from)
    }
  }

  const onSubmit = () => {
    const invitedList = participates.map((item) => item.id) || []
    form.setValue('inviteList', Array.isArray(invitedList) ? invitedList : [])
    console.log(form.watch('inviteList'))

    addScheduleInfo.mutate()
  }

  return (
    <ScheduleModal>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[384px] flex-col gap-4"
        >
          <div className="flex items-center justify-between self-stretch">
            <p className="text-h4">일정 생성</p>
            <div className="flex items-center gap-[6px]">
              <CalendarIcon className="h-4 w-4" />
              <DropdownForm
                form={form}
                options={[
                  { value: '개인 일정', label: '개인 일정' },
                  { value: '팀 일정', label: '팀 일정' },
                ]}
                defaultValue="개인 일정"
                label="일정 유형"
                name="type"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <DefaultInputForm form={form} name="title" label="일정 이름" />
            <div className="flex flex-col gap-[6px]">
              <DateTimePickerForm
                form={form}
                name="period"
                label="일정 시간"
                allDay={allDay}
                setAllDay={setAllDay}
                setSelectedDate={handleDateChange}
                maxDate={selectedEndDate}
              />
              <div className="flex items-center justify-between self-stretch">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="allday"
                    checked={allDay}
                    onCheckedChange={(checked: boolean) =>
                      handleAllDayChange(checked)
                    }
                  />
                  <label htmlFor="allday" className="text-small">
                    하루 종일
                  </label>
                </div>
                {form.watch('type') === '개인 일정' ? (
                  <div className="flex items-center gap-1">
                    <LockIcon className="h-4 w-4" />
                    <DropdownForm
                      form={form}
                      options={[
                        { value: 'PRIVATE', label: '비공개' },
                        { value: 'PUBLIC', label: '공개' },
                      ]}
                      defaultValue="PRIVATE"
                      label="공개 여부"
                      name="visible"
                    />
                  </div>
                ) : (
                  <DropdownForm
                    form={form}
                    options={projectOptions} // 객체 배열로 전달
                    defaultValue={form.watch('projectId') || '프로젝트 팀'}
                    label="프로젝트 팀"
                    name="projectId"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex w-full flex-col gap-4">
                <Label>반복 여부</Label>
                <SelectForm
                  form={form}
                  value={selectedRepeat}
                  setValue={setSelectedRepeat}
                  options={repeatOptions}
                  defaultValue="반복 안함"
                  name="repeat"
                  className="w-full"
                />
              </div>
              {selectedRepeat !== '반복 안함' && (
                <div className="flex w-full flex-col gap-4">
                  <Label>종료 일자</Label>
                  <EndDateForm
                    form={form}
                    disabled={false}
                    minDate={selectedDate}
                    setSelectedEndDate={setSelectedEndDate}
                  />
                </div>
              )}
            </div>

            {form.watch('type') === '팀 일정' && (
              <ScheduleParticipateForm
                form={form}
                participates={participates}
                setParticipates={setParticipates}
              />
            )}
          </div>

          <TextAreaForm form={form} name="content" label="일정 내용" />

          <div className="flex w-full items-start justify-end gap-[12px] self-stretch">
            <Button
              type="button"
              title="취소"
              variant="secondary"
              onClick={() => closeModal('default')}
              className="flex-1"
            >
              <p className="text-body">취소</p>
            </Button>
            <Button
              title="생성"
              className="flex-1"
              disabled={!form.formState.isValid}
              variant={form.formState.isValid ? 'default' : 'disabled'}
            >
              <p className="text-body">생성</p>
            </Button>
          </div>
        </form>
      </Form>
    </ScheduleModal>
  )
}

export const ScheduleEditModal = ({ scheduleId }: { scheduleId: string }) => {
  const { closeModal } = useModal()
  const queryClient = useQueryClient()

  const [allDay, setAllDay] = React.useState(false)
  const [participates, setParticipates] = React.useState<TeamInfo[]>([])
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [selectedEndDate, setSelectedEndDate] = React.useState<
    Date | undefined
  >(undefined)
  const [selectedRepeat, setSelectedRepeat] = React.useState('반복 안함')

  const repeatOptions = getRepeatOptions(selectedDate)

  const { data: schedules } = useScheduleDetailQuery(scheduleId)
  const { data: projects } = useProjectInfoQuery()
  // const userList = useTeamInfoQuery()
  const selectedProject = projects?.result?.find(
    (project) => project.id === schedules?.result.projectId,
  )
  const { data: userInfo } = useUserInfoQuery()

  const projectOptions =
    projects?.result?.map((project) => ({
      value: project.id, // id를 value로 설정
      label: project.title, // title을 label로 설정
    })) || []

  const getProjectTitle = (projectId: string) => {
    return (
      projects?.result?.find((project) => project.id === projectId)?.title || ''
    )
  }

  const form = useForm({
    resolver: zodResolver(fromSchemaSchedule),
    defaultValues: {
      type: schedules?.result.projectId ? '팀 일정' : '개인 일정',
      title: schedules?.result.title,
      content: schedules?.result.content,
      period: {
        from: new Date(schedules?.result.startDate ?? ''),
        to: new Date(schedules?.result.endDate ?? ''),
      },
      visible: schedules?.result.visible ?? ScheduleVisibility,
      projectId: schedules?.result.projectId ?? null,
      inviteList: (schedules?.result.inviteList as Invite[]) ?? [],
    },
  })

  const editScheduleInfo = useEditScheduleMutation(scheduleId, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      closeModal('dimed')
      closeModal('default')
    },
    onError: (e) => {
      console.log(e)
    },
  })

  React.useEffect(() => {
    const scheduleType = form.watch('type')
    if (scheduleType === '개인 일정') {
      form.setValue('projectId', null)
    } else {
      form.setValue('projectId', form.getValues('projectId') ?? null)
    }
  }, [form.watch('type')])

  const handleAllDayChange = (checked: boolean) => {
    setAllDay(checked)
    if (checked) {
      // allDay가 체크된 경우 endDate를 startDate와 동일하게 설정
      form.setValue('period', {
        from: form.watch('period').from,
        to: form.watch('period').from, // startDate와 동일하게 설정
      })
      setSelectedEndDate(form.watch('period').from)
    }
  }
  React.useEffect(() => {
    const inviteList = form.getValues('inviteList') // 미리 inviteList를 가져옴

    if (form.watch('type') === '팀 일정') {
      const userData = selectedProject?.users
        .filter((user) => inviteList.some((item) => item.id === user.id))
        .map((user) => {
          const matchedInvite = inviteList.find((item) => item.id === user.id)

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            choice: user.choice,
            role: user.role,
            location: user.location,
            mbti: user.mbti,
            imageUrl: user.imageUrl,
            color: user.color,
            attend: matchedInvite?.state,
          }
        })
      setParticipates(userData as TeamInfo[])
    } else if (form.watch('type') === '개인 일정') {
      const userData = [
        {
          id: userInfo?.result.id,
          name: userInfo?.result.name,
          email: userInfo?.result.email,
          choice: ProjectInviteStatus.Acceped,
          role: ProjectUserRole.Master,
          location: userInfo?.result.location,
          mbti: userInfo?.result.mbti,
          imageUrl: userInfo?.result.imageUrl,
          color: userInfo?.result.color,
          attend: InviteStatus.ACCEPTED,
        },
      ]
      setParticipates(userData as TeamInfo[])
    }
  }, [form.watch('inviteList'), selectedProject?.users])

  const onSubmit = () => {
    let userId = participates.map((item) => item.id)

    if (participates.length === 0) {
      userId = userInfo?.result.id ? [userInfo?.result.id] : []
    }

    editScheduleInfo.mutate({
      title: form.watch('title') ?? '',
      content: form.watch('content') ?? '',
      startDate: new Date(
        form.watch('period')?.from.getTime() + 9 * 60 * 60 * 1000,
      ).toISOString(),
      endDate: new Date(
        form.watch('period')?.to.getTime() + 9 * 60 * 60 * 1000,
      ).toISOString(),
      visible: form.watch('visible') as ScheduleVisibility,
      projectId: form.watch('projectId') || null,
      inviteList: userId || [],
    })
  }

  return (
    <Modal>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[384px] flex-col gap-4"
        >
          <div className="flex items-center justify-between self-stretch">
            <p className="text-h4">일정 수정</p>
            <div className="flex items-center gap-[6px]">
              <CalendarIcon className="h-4 w-4" />
              <DropdownForm
                form={form}
                options={[
                  { value: '개인 일정', label: '개인 일정' },
                  { value: '팀 일정', label: '팀 일정' },
                ]}
                defaultValue="개인 일정"
                label="일정 유형"
                name="type"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <DefaultInputForm form={form} name="title" label="일정 이름" />
            <div className="flex flex-col gap-[6px]">
              <DateTimePickerForm
                form={form}
                name="period"
                label="일정 시간"
                allDay={allDay}
                setAllDay={setAllDay}
                setSelectedDate={setSelectedDate}
                maxDate={selectedEndDate}
              />
              <div className="flex items-center justify-between self-stretch">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="allday"
                    checked={allDay}
                    onCheckedChange={(checked: boolean) =>
                      handleAllDayChange(checked)
                    }
                  />
                  <Label htmlFor="allday" className="text-small">
                    하루 종일
                  </Label>
                </div>
                {form.watch('type') === '개인 일정' ? (
                  <div className="flex items-center gap-1">
                    <LockIcon className="h-4 w-4" />
                    <DropdownForm
                      form={form}
                      options={[
                        { value: 'PRIVATE', label: '비공개' },
                        { value: 'PUBLIC', label: '공개' },
                      ]}
                      defaultValue="내용 비공개"
                      label="공개 여부"
                      name="visible"
                    />
                  </div>
                ) : (
                  <DropdownForm
                    form={form}
                    options={projectOptions}
                    defaultValue={getProjectTitle(
                      schedules?.result.projectId ?? '프로젝트 팀',
                    )}
                    label="프로젝트 팀"
                    name="projectId"
                  />
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex w-full flex-col gap-4">
                <Label>반복 여부</Label>
                <SelectForm
                  form={form}
                  value={selectedRepeat}
                  setValue={setSelectedRepeat}
                  options={repeatOptions}
                  defaultValue="반복 안함"
                  name="repeat"
                  className="w-full"
                />
              </div>
              {selectedRepeat !== '반복 안함' && (
                <div className="flex w-full flex-col gap-4">
                  <Label>종료 일자</Label>
                  <EndDateForm
                    form={form}
                    disabled={false}
                    minDate={selectedDate}
                    setSelectedEndDate={setSelectedEndDate}
                  />
                </div>
              )}
            </div>

            {form.watch('type') === '팀 일정' && (
              <ScheduleParticipateForm
                form={form}
                participates={participates}
                setParticipates={setParticipates}
              />
            )}
          </div>

          <TextAreaForm form={form} name="content" label="일정 내용" />

          <div className="flex w-full items-start justify-end gap-[12px] self-stretch">
            <Button
              type="button"
              title="취소"
              variant="secondary"
              onClick={() => closeModal('dimed')}
              className="flex-1"
            >
              <p className="text-body">취소</p>
            </Button>
            <Button
              title="수정"
              className="flex-1"
              disabled={!form.formState.isValid}
              variant={form.formState.isValid ? 'default' : 'disabled'}
            >
              <p className="text-body">수정</p>
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  )
}

export const ScheduleCheckModal = ({ scheduleId }: { scheduleId: string }) => {
  const { modals, openModal, closeModal } = useModal()
  const [selectedSchedule, setSelectedSchedule] =
    React.useState<ScheduleInfo | null>(null)

  const { data: schedules } = useScheduleDetailQuery(scheduleId)
  const { data: projects } = useProjectInfoQuery()

  const getProjectTitle = (projectId: string) => {
    return (
      projects?.result?.find((project) => project.id === projectId)?.title || ''
    )
  }

  const formatVisible = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return '내용 공개'
      case 'PRIVATE':
        return '내용 비공개'
      default:
        return '알 수 없음'
    }
  }

  const handleEditClick = (schedule: ScheduleInfo) => {
    setSelectedSchedule(schedule)
    openModal('dimed', ModalTypes.EDIT)
  }
  const handleDeleteClick = (schedule: ScheduleInfo) => {
    setSelectedSchedule(schedule)
    openModal('dimed', ModalTypes.DELETE)
  }

  const form = useForm({
    resolver: zodResolver(formSchemaCheckSchedule),
    defaultValues: {
      type: schedules?.result.projectId ? '팀 일정' : '개인 일정',
      title: '',
      content: '',
      visible: '',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      repeat: '',
      projectId: '',
      inviteList: [],
    },
  })

  React.useEffect(() => {
    if (schedules && schedules.result) {
      const schedule: ScheduleInfo = {
        id: scheduleId,
        title: schedules.result.title,
        visible: schedules.result.visible ?? ScheduleVisibility.PUBLIC,
        startDate: schedules.result.startDate,
        endDate: schedules.result.endDate ?? '',
        projectId: schedules.result.projectId ?? '',
        inviteList: schedules.result.inviteList ?? [],
      }
      setSelectedSchedule(schedule)
      form.setValue(
        'type',
        schedules.result.projectId ? '팀 일정' : '개인 일정',
      )
      form.setValue('title', schedules.result.title)
      form.setValue('content', schedules.result.content ?? '')
      form.setValue('visible', schedules.result.visible ?? '')
      form.setValue('startDate', schedules.result.startDate)
      form.setValue('endDate', schedules.result.endDate ?? '')
      form.setValue('projectId', schedules.result.projectId ?? '')
    }
  }, [schedules, scheduleId])

  const title = form.watch('title')
  const type = form.watch('type')
  const startDate = form.watch('startDate')
  const endDate = form.watch('endDate')
  const description = form.watch('content')
  const visible = form.watch('visible')
  const repeat = form.watch('repeat')
  const participate = form.watch('inviteList')

  const onSubmit = () => {
    closeModal('default')
  }

  return (
    <ScheduleModal>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-[384px] flex-[1_0_0] flex-col items-start gap-6"
        >
          <div className="flex items-center justify-between self-stretch">
            <p className="text-h4">{title}</p>
            <div className="flex gap-2">
              <PencilIcon
                className="h-6 w-6 cursor-pointer"
                onClick={() => {
                  if (selectedSchedule) {
                    handleEditClick(selectedSchedule)
                  }
                }}
              />
              <Trash2Icon
                className="h-6 w-6 cursor-pointer"
                onClick={() => {
                  if (selectedSchedule) {
                    handleDeleteClick(selectedSchedule)
                  }
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 self-stretch">
            <p>{formatDateTime(startDate, endDate)}</p>

            <div className="flex items-center justify-between self-stretch">
              <div className="flex w-[88px] items-center gap-2">
                <p className="text-small text-gray-400">{repeat}</p>
                <RepeatIcon className="h-4 w-4" />
              </div>
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1">
                  {type === '팀 일정' ? (
                    <>
                      <UsersIcon className="h-4 w-4" />
                      <span className="text-small">
                        {getProjectTitle(schedules?.result.projectId ?? '')}
                      </span>
                    </>
                  ) : (
                    <>
                      <LockIcon className="h-4 w-4" />
                      <span className="text-small">
                        {formatVisible(visible)}
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-small">{type}</span>
                </div>
              </div>
            </div>
            {type === '팀 일정' && (
              <div className="flex h-[36px] items-center gap-2 self-stretch px-[8px] py-[6px] text-detail">
                {/* <ProfileAvatar
                  imageUrl={participate.imageUrl}
                  name={participate.name}
                  size="30px"
                />
                <p className="flex-[1_0_0] text-small">{participate.name}</p>
                <p className={`text-detail ${attendClass}`}>
                  {participate.attend}
                </p> */}
              </div>
            )}
            <p className="text-p">{description}</p>
          </div>

          <Button className="w-full" onClick={() => closeModal('default')}>
            <p>닫기</p>
          </Button>
        </form>
      </Form>

      {modals.dimed.type === ModalTypes.DELETE && selectedSchedule && (
        <ScheduleDeleteModal
          scheduleId={selectedSchedule.id}
          deleteType={DeleteScheduleType.THIS}
        />
      )}
      {modals.dimed.type === ModalTypes.EDIT && selectedSchedule && (
        <ScheduleEditModal scheduleId={selectedSchedule.id} />
      )}
    </ScheduleModal>
  )
}

export const ScheduleRepeatModal = () => {
  const { closeModal } = useModal()
  const [selectedCycle, setSelectedCycle] = React.useState<string>('')
  const [selectedOption, setSelectedOption] = React.useState<string>('none')
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [selecteEndDate, setSelectedEndDate] = React.useState<Date | undefined>(
    new Date(),
  )

  const cycleOptions = ['일(Day)', '주(Week)', '월(Month)', '년(Year)']

  const form = useForm({
    resolver: zodResolver(fromSchemaSchedule),
    defaultValues: {
      period: { from: new Date(), to: new Date() },
      repeat: '1',
      cycle: '',
      day: '',
      endDate: undefined,
    },
  })

  const handleRadioChange = (value: string) => {
    setSelectedOption(value)
  }

  const handleSubmit = () => {
    form.getValues('endDate')
    console.log('endDate:', form.getValues('endDate'))

    closeModal('dimed')
  }

  return (
    <Modal>
      <p className="text-h4">반복 맞춤 설정</p>
      <Form {...form}>
        <form className="flex w-[384px] shrink-0 flex-col items-start gap-6">
          <div className="flex flex-col gap-2 self-stretch">
            <div className="flex items-end gap-2">
              <DefaultInputForm form={form} name="repeat" label="반복 주기" />
              <SelectForm
                form={form}
                value={selectedCycle}
                setValue={setSelectedCycle}
                options={cycleOptions}
                defaultValue="일(Day)"
                name="cycle"
                className="w-[200px]"
              />
            </div>
            {selectedCycle === '주(Week)' && <RepeatDayForm form={form} />}

            <Label>종료</Label>
            <RadioGroup
              defaultValue="none"
              className="gap-1"
              onValueChange={handleRadioChange}
            >
              <div className="flex h-[40px] items-center space-x-2">
                <RadioGroupItem value="none" id="r1" />
                <Label htmlFor="r1">없음</Label>
              </div>
              <div className="flex items-center gap-9 self-stretch">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="date" id="r2" />
                  <Label htmlFor="r2">날짜</Label>
                </div>

                <EndDateForm
                  form={form}
                  disabled={selectedOption !== 'date'}
                  minDate={selectedDate}
                  setSelectedEndDate={setSelectedEndDate}
                />
              </div>
              <div className="self-stertch flex items-center gap-9">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="times" id="r3" />
                  <Label htmlFor="r3">횟수</Label>
                </div>
                <Input
                  placeholder="0회 반복"
                  className="flex-[1_0_0]"
                  disabled={selectedOption !== 'times'}
                />
              </div>
            </RadioGroup>
          </div>
          <div className="flex w-full items-start justify-end gap-[12px] self-stretch">
            <Button
              title="취소"
              type="button"
              onClick={() => closeModal('dimed')}
              className="flex flex-[1_0_0] gap-[10px] bg-blue-100"
            >
              <p className="text-body text-blue-500">취소</p>
            </Button>
            <Button
              title="확인"
              type="button"
              onClick={handleSubmit}
              className="flex flex-[1_0_0] gap-[10px]"
            >
              <p className="text-body">확인</p>
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  )
}

export const ScheduleDeleteModal = ({
  scheduleId,
  deleteType,
}: {
  scheduleId: string
  deleteType: DeleteScheduleType
}) => {
  const { closeModal } = useModal()
  const queryClient = useQueryClient()

  const form = useForm()

  const deleteScheduleInfo = useDeleteScheduleMutation(scheduleId, deleteType, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['schedules'],
      })

      console.log('Delete Success:', scheduleId)
      closeModal('dimed')
    },
    onError: (e) => {
      console.error('Fail:', e)
    },
  })

  const handleDeleteClick = () => {
    deleteScheduleInfo.mutate()
    closeModal('dimed')
    closeModal('default')
  }
  return (
    <Modal>
      <p className="text-h4">해당 일정을 삭제하시겠습니까?</p>
      <p className="text-p">해당 행동은 되돌릴 수 없습니다.</p>
      <div className="flex w-full gap-3">
        <Button
          title="취소"
          variant="secondary"
          className="flex flex-[1_0_0]"
          onClick={() => {
            closeModal('dimed')
          }}
        >
          <p className="text-body">취소</p>
        </Button>
        <Button
          type="submit"
          title="삭제"
          className="flex flex-[1_0_0]"
          onClick={handleDeleteClick}
        >
          <p className="text-body">삭제</p>
        </Button>
      </div>
    </Modal>
  )
}

export const RepeatScheduleDeleteModal = () => {
  const { closeModal } = useModal()
  const form = useForm()

  function onSubmit() {
    closeModal('dimed')
  }

  return (
    <ScheduleModal>
      <p className="text-h4">반복되는 일정을 삭제하시겠습니까?</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <RadioGroup
            defaultValue="only"
            className="flex w-[384px] flex-col items-start gap-4 px-4 py-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="only" id="r1" />
              <Label htmlFor="r1">이 일정만</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="future" id="r2" />
              <Label htmlFor="r2">이 일정과 향후 일정</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r3" />
              <Label htmlFor="r3">모든 일정</Label>
            </div>
          </RadioGroup>

          <div className="flex w-full gap-3">
            <Button
              title="취소"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                closeModal('dimed')
              }}
            >
              <p className="text-body">취소</p>
            </Button>
            <Button
              type="submit"
              title="삭제"
              className="flex-1"
              onClick={() => {
                closeModal('dimed')
                closeModal('default')
              }}
            >
              <p className="text-body">삭제</p>
            </Button>
          </div>
        </form>
      </Form>
    </ScheduleModal>
  )
}
