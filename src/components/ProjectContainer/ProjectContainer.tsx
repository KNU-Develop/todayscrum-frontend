import React, { useState, useEffect, SetStateAction, useRef } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { da, fr, id, ko } from 'date-fns/locale'
import { ProjectInfo, useProjectInfoQuery, useUserInfoQuery } from '@/api'
import { format } from 'date-fns'
import {
  useAddBoardMutation,
  useBoardListQuery,
  useDeleteBoardMutation,
  useUpdateBoardMutation,
} from '@/api/services/board/quries'
import {
  projectInfo,
  useOneProjectInfoQuery,
} from '@/api/services/project/quries'
import {
  BoardCategory,
  BoardDto,
  BoardProgress,
  BoardProps,
  InputBoard,
} from '@/api/services/board/model'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { error, time } from 'console'
import { ProjectUserInfo, TeamInfo } from '@/api/services/project/model'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/useModal'
import {
  ProjectCreateModal,
  ProjectDeleteModal,
  ProjectEditModal,
  ProjectInviteModal,
} from '@/components/Modal/ProjectModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { ParticipateForm } from '../InputForm'
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import { Form } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fromCreateBoard } from '@/hooks/useVaild/useBoard'
import { z } from 'zod'
import { StatusDropdown } from './StatusDropDown'

interface TeamCheckboxProps {
  id: string
  name: string
}

interface TimeSlot {
  time: string
  attendance: string
}

interface ScheduleItemProps {
  date: string
  timeslots: TimeSlot[]
}

export interface BoardItem {
  type: string
  title: string
  assignee: string
  createdDate: string
  status: string
  [key: string]: string
}

interface StatusDropdownProps {
  form: UseFormReturn<z.infer<any>>
  onClose: () => void
}

interface CategoryDropdownProps {
  form: UseFormReturn<z.infer<any>>
  onClose: () => void
}

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: (items: string[]) => void
  selectedItems: string[]
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  selectedItems,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[448px] rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-lg font-bold">
          해당 게시글을 삭제하시겠습니까?
        </h2>
        <p className="text-center text-gray-600">
          해당 행동은 되돌릴 수 없습니다.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="w-[186px] rounded bg-[#DBEAFE] px-4 py-2 text-[#3B82F6]"
          >
            취소
          </button>
          <button
            onClick={() => onDelete(selectedItems)}
            className="w-[186px] rounded bg-[#007AFF] px-4 py-2 text-white"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

interface CreateModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (post: InputBoard) => void
}

const CreatePostModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [masters, setMasters] = useState<TeamInfo[]>([])

  const form = useForm({
    resolver: zodResolver(fromCreateBoard),
    mode: 'onChange',
    defaultValues: {
      title: '',
      progress: BoardProgress.problem,
      category: BoardCategory.issue,
      content: '',
      mastersId: [] as number[],
    },
  })

  useEffect(() => {
    console.log(form.watch('category'))
  }, [form.watch('category')])

  if (!isOpen) return null

  const onSubmit = () => {
    const invitedList =
      masters.map((item) => parseInt(item.id, 10)).filter((id) => !isNaN(id)) ||
      []
    onCreate({
      title: form.watch('title'),
      progress: form.watch('progress'),
      category: form.watch('category'),
      content: form.watch('content'),
      mastersId: invitedList,
    })
    form.reset({
      title: '',
      progress: BoardProgress.problem,
      category: BoardCategory.issue,
      content: '',
      mastersId: [] as number[],
    })
    setMasters([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-[448px] rounded-md bg-white p-6 shadow-lg">
            <div className="flex justify-between">
              <h2 className="mb-4 flex text-center text-lg font-bold">
                게시글 작성
              </h2>
              <div
                className="relative font-pretendard text-[14px] font-medium leading-[14px]"
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
              >
                <div className="flex gap-[4px] px-4 py-2">
                  {form.watch('category')}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                {isCategoryDropdownOpen && (
                  <CategoryDropdown
                    form={form}
                    onClose={() => setIsCategoryDropdownOpen(false)}
                  />
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                게시글 제목
              </label>
              <input
                type="text"
                {...form.register('title')}
                className="mt-[6px] w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="제목"
              />
            </div>
            <div>
              <ParticipateForm
                form={form}
                participates={masters}
                setParticipates={setMasters}
              />
            </div>
            <div className="relative mb-4 mt-3">
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
                <StatusDropdown
                  // className="top-13 w-full"
                  form={form}
                  onClose={() => setIsStatusDropdownOpen(false)}
                />
              )}
            </div>
            <div className="mb-4 h-[117px] w-full">
              <label className="block text-sm font-medium text-gray-700">
                게시글 내용
              </label>
              <textarea
                {...form.register('content')}
                className="mt-[6px] h-full w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="내용을 적어 주세요."
              />
            </div>
            <div className="mt-12 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  setMasters([])
                  form.reset({
                    title: '',
                    progress: BoardProgress.problem,
                    category: BoardCategory.issue,
                    content: '',
                    mastersId: [] as number[],
                  })
                  onClose()
                }}
                className="w-[186px] rounded bg-[#DBEAFE] px-4 py-2 text-[#3B82F6]"
              >
                취소
              </button>
              <button className="w-[186px] rounded bg-[#007AFF] px-4 py-2 text-white">
                생성
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  form,
  onClose,
}) => {
  const categories = [BoardCategory.issue, BoardCategory.feadback]

  return (
    <div className="absolute right-2 z-10 mt-2 w-[120px] overflow-hidden rounded-md border bg-white shadow-lg">
      {categories.map((category) => (
        <div
          key={category}
          className={`flex cursor-pointer items-center px-4 py-2 text-center hover:bg-gray-100 ${
            category === form.watch('category') ? 'font-bold text-blue-600' : ''
          }`}
          onClick={() => {
            form.setValue('category', category)
            onClose()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="mr-2"
            style={{
              visibility:
                category === form.watch('category') ? 'visible' : 'hidden',
            }}
          >
            <path
              d="M13.3332 4L5.99984 11.3333L2.6665 8"
              stroke="#334155"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {category}
        </div>
      ))}
    </div>
  )
}

const TeamCheckbox: React.FC<TeamCheckboxProps> = ({ id, name }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        className="rounded-[2px] border border-gray-200 bg-white"
      />
      <label htmlFor={id} className="text-[14px]">
        {name}
      </label>
    </div>
  )
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ date, timeslots }) => {
  return (
    <div>
      <div className="text-h5 py-[6px]">
        {date}
        {timeslots.map((slot, index) => (
          <div className="pw-[32px] mt-[8px]" key={index}>
            <span>{slot.time}</span>
            <span>{slot.attendance}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const scheduleData = {
  date: '2024년 07월 14일',
  timeslots: [
    { time: '08:00 ~ 09:00', attendance: '5/6인 참석' },
    { time: '08:00 ~ 09:00', attendance: '5/6인 참석' },
  ],
} // api 연동시 수정해야함!

type FilterChangeProps = {
  statuses: string[]
  assignees: string[]
  search: string
}
interface FilterBarProps {
  onFilterChange: (filters: FilterChangeProps) => void
  id: string
  selectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
}

const FilterBar: React.FC<FilterBarProps> = ({
  onFilterChange,
  id,
  selectedItems,
  setSelectedItems,
}) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleDeleteClick = () => {
    if (selectedItems.length > 0) {
      setDeleteModalOpen(true)
    } else {
      toast('삭제할 게시물이 선택되지 않았습니다.', { duration: 3000 })
    }
  }

  const handleCloseModal = () => {
    setDeleteModalOpen(false)
  }

  const DeleteBoard = useDeleteBoardMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardList'] })
      setSelectedItems([])
      setDeleteModalOpen(false)

      toast('보드 삭제 성공', { duration: 3000 })
    },
    onError: () => toast('보드 삭제 실패', { duration: 3000 }),
  })
  const handleDeleteItems = (items: string[]) => {
    items.forEach((item) => DeleteBoard.mutate(item))
  }
  const AddBoard = useAddBoardMutation(id, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardList'] })
      toast('보드 생성 성공', { duration: 3000 })
    },
    onError: () => toast('보드 생성 실패', { duration: 3000 }),
  })
  const handleCreatePost = (dto: InputBoard) => {
    AddBoard.mutate(dto)
  }

  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [showSearchInput, setShowSearchInput] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSearchInput(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [inputRef])

  const handleToggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible)
  }

  const handleSelectItem = (category: 'status' | 'assignee', value: string) => {
    if (category === 'status') {
      setSelectedStatuses((prevSelectedStatuses) =>
        prevSelectedStatuses.includes(value)
          ? prevSelectedStatuses.filter((item) => item !== value)
          : [...prevSelectedStatuses, value],
      )
    } else {
      setSelectedAssignees((prevSelectedAssignees) =>
        prevSelectedAssignees.includes(value)
          ? prevSelectedAssignees.filter((item) => item !== value)
          : [...prevSelectedAssignees, value],
      )
    }
  }

  useEffect(() => {
    onFilterChange({
      statuses: selectedStatuses,
      assignees: selectedAssignees,
      search,
    })
  }, [selectedStatuses, selectedAssignees, search, onFilterChange])

  return (
    <div className="relative flex items-center gap-2 p-2">
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteItems}
        selectedItems={selectedItems}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        onClick={handleDeleteClick}
        fill="none"
        className={`cursor-pointer ${selectedItems.length === 0 ? 'cursor-not-allowed' : ''}`}
      >
        <path
          d="M3 6H21"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 11V17"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 11V17"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="relative">
        {showSearchInput ? (
          <input
            ref={inputRef}
            type="text"
            placeholder="제목으로 검색하기"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-[384px] flex-grow rounded border px-2 py-1 transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              showSearchInput ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            onClick={() => setShowSearchInput(true)}
            className="cursor-pointer"
          >
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.0004 21.0004L16.6504 16.6504"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          onClick={handleToggleDropdown}
          className="cursor-pointer"
        >
          <path
            d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {isDropdownVisible && (
          <div className="absolute left-0 top-full z-10 mt-4 w-48 rounded-md bg-white shadow-lg">
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div className="px-4 py-2 text-sm text-gray-700">상태</div>
              {['긴급', '진행중', '완료'].map((status) => (
                <div
                  key={status}
                  className="flex cursor-pointer items-center gap-[8px] px-4 py-2 text-sm text-gray-700"
                  onClick={() => handleSelectItem('status', status)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`${selectedStatuses.includes(status) ? 'visible' : 'invisible'}`}
                  >
                    <path
                      d="M13.3337 4L6.00033 11.3333L2.66699 8"
                      stroke="#334155"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {status}
                </div>
              ))}
              <div className="border-t border-gray-200" />
              <div className="px-4 py-2 text-sm text-gray-700">담당자</div>
              {['사람 A', '사람 B', '사람 C'].map((assignee) => (
                <div
                  key={assignee}
                  className="flex cursor-pointer items-center gap-[8px] px-4 py-2 text-sm text-gray-700"
                  onClick={() => handleSelectItem('assignee', assignee)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className={`${selectedAssignees.includes(assignee) ? 'visible' : 'invisible'}`}
                  >
                    <path
                      d="M13.3337 4L6.00033 11.3333L2.66699 8"
                      stroke="#334155"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {assignee}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => setCreateModalOpen(true)}
        className="rounded-[6px] border-[1px] px-4 py-2 transition duration-200 hover:bg-blue-600 hover:text-white"
      >
        + 게시글 작성
      </button>
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreatePost}
      />
    </div>
  )
}

const Board: React.FC<BoardProps> = ({
  items,
  SelectedItems,
  setSelectedItems,
}) => {
  const handleSelectAll = () => {
    if (SelectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.id))
    }
  }

  const [sortConfig, setSortConfig] = useState<{
    key: keyof BoardDto
    direction: string
  } | null>(null)
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(
    null,
  )

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const statusRefs = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()
  const route = useRouter()

  useEffect(() => {
    if (activeDropdownIndex !== null) {
      const handleClickOutside = (event: MouseEvent) => {
        const statusRef = statusRefs.current[activeDropdownIndex]
        const dropdownElement = dropdownRef.current

        if (
          statusRef &&
          !statusRef.contains(event.target as Node) &&
          dropdownElement &&
          !dropdownElement.contains(event.target as Node)
        ) {
          setActiveDropdownIndex(null)
        }
      }

      const handleScroll = () => {
        setActiveDropdownIndex(null)
      }

      document.addEventListener('mousedown', handleClickOutside)

      window.addEventListener('scroll', handleScroll)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.addEventListener('scroll', handleScroll)
      } else {
        window.addEventListener('scroll', handleScroll)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)

        window.removeEventListener('scroll', handleScroll)
        if (scrollContainerRef.current) {
          scrollContainerRef.current.removeEventListener('scroll', handleScroll)
        } else {
          window.removeEventListener('scroll', handleScroll)
        }
      }
    }
  }, [activeDropdownIndex])

  const handleSelectItem = (id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id],
    )
  }

  const sortedItems = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...items].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return items
  }, [items, sortConfig])

  const requestSort = (key: keyof BoardDto) => {
    let direction = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const renderSortIcon = (key: string) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="ml-1"
        style={{ visibility: sortConfig?.key === key ? 'visible' : 'hidden' }}
      >
        <path
          d="M8 3.33398V12.6673"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform:
              sortConfig?.key === key && sortConfig.direction === 'descending'
                ? 'rotate(180deg)'
                : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
        <path
          d="M12.6663 8L7.99967 12.6667L3.33301 8"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform:
              sortConfig?.key === key && sortConfig.direction === 'descending'
                ? 'rotate(180deg)'
                : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </svg>
    )
  }

  const UpdateBoard = useUpdateBoardMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boardList'] })
      toast('보드 수정 성공', { duration: 1000 })
    },
    onError: () => toast('보드 수정 실패', { duration: 3000 }),
  })

  const form = useForm({
    defaultValues: {
      progress: BoardProgress.problem,
    },
  })

  const handleStatusClick = (index: number) => {
    form.setValue('progress', items[index].progress)
    if (activeDropdownIndex === index) {
      setActiveDropdownIndex(null)
    } else {
      setActiveDropdownIndex(index)
      if (statusRefs.current[index]) {
        const rect = statusRefs.current[index]!.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        })
      }
    }
  }

  const handleChangeStatus = (index: number, newStatus: BoardProgress) => {
    // const uid = items[index].id

    const updatedBoard: InputBoard = {
      id: items[index].id,
      title: items[index].title,
      content: items[index].content,
      category: items[index].category,
      progress: newStatus,
      mastersId: items[index].masters.map((master) => master.id),
    }
    UpdateBoard.mutate(updatedBoard)
    items[index].progress = newStatus
  }

  const renderStatus = (status: BoardProgress, index: number) => {
    return (
      <div
        className={`relative flex w-[75px] cursor-pointer items-center rounded-[15px] ${
          status === BoardProgress.problem
            ? 'bg-red-200'
            : status === BoardProgress.progress
              ? 'bg-blue-200'
              : 'bg-green-200'
        } px-[8px]`}
        ref={(el) => {
          statusRefs.current[index] = el
        }}
        onClick={() => handleStatusClick(index)}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            status === BoardProgress.problem
              ? 'bg-red-500'
              : status === BoardProgress.progress
                ? 'bg-blue-500'
                : 'bg-green-500'
          }`}
        />
        <span className="w-full text-center">
          {status === BoardProgress.problem
            ? '긴급'
            : status === BoardProgress.progress
              ? '진행중'
              : '완료'}
        </span>
        {activeDropdownIndex === index && (
          <StatusDropdown
            className="w-[200px]"
            form={form}
            onClose={() => {
              handleChangeStatus(index, form.watch('progress'))
              setActiveDropdownIndex(null)
            }}
            position={dropdownPosition}
            ref={dropdownRef}
          />
        )}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="h-[356px]">
        <div>
          <table className="w-full">
            <thead className="text-left">
              <tr>
                <th className="w-[50px] border-b px-5 py-2">
                  <Checkbox />
                </th>
                <th
                  className="w-[100px] cursor-pointer border-b px-4 py-2"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center justify-start">
                    종류
                    {renderSortIcon('category')}
                  </div>
                </th>
                <th
                  className="w-[200px] cursor-pointer border-b px-4 py-2"
                  onClick={() => requestSort('title')}
                >
                  <div className="flex items-center justify-start">
                    제목
                    {renderSortIcon('title')}
                  </div>
                </th>
                <th
                  className="w-[150px] cursor-pointer border-b px-4 py-2"
                  onClick={() => requestSort('masters')}
                >
                  <div className="flex items-center justify-start">
                    담당자
                    {renderSortIcon('masters')}
                  </div>
                </th>
                <th
                  className="w-[150px] cursor-pointer border-b px-4 py-2"
                  onClick={() => requestSort('createdAt')}
                >
                  <div className="flex items-center">
                    생성일자
                    {renderSortIcon('createdAt')}
                  </div>
                </th>
                <th
                  className="w-[100px] cursor-pointer border-b px-4 py-2"
                  onClick={() => requestSort('progress')}
                >
                  <div className="flex items-center">
                    진행 상태
                    {renderSortIcon('progress')}
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex h-full items-center justify-center text-h3">
          검색 결과가 없습니다.
        </div>
      </div>
    )
  }
  return (
    <div className="h-[356px]">
      <div>
        <table className="w-full">
          <thead className="text-left">
            <tr>
              <th className="w-[50px] border-b px-5 py-2">
                <Checkbox
                  checked={
                    SelectedItems.length === items.length && items.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th
                className="w-[100px] cursor-pointer border-b px-4 py-2"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center justify-start">
                  종류
                  {renderSortIcon('category')}
                </div>
              </th>
              <th
                className="w-[200px] cursor-pointer border-b px-4 py-2"
                onClick={() => requestSort('title')}
              >
                <div className="flex items-center justify-start">
                  제목
                  {renderSortIcon('title')}
                </div>
              </th>
              <th
                className="w-[150px] cursor-pointer border-b px-4 py-2"
                onClick={() => requestSort('masters')}
              >
                <div className="flex items-center justify-start">
                  담당자
                  {renderSortIcon('masters')}
                </div>
              </th>
              <th
                className="w-[150px] cursor-pointer border-b px-4 py-2"
                onClick={() => requestSort('createdAt')}
              >
                <div className="flex items-center">
                  생성일자
                  {renderSortIcon('createdAt')}
                </div>
              </th>
              <th
                className="w-[100px] cursor-pointer border-b px-4 py-2"
                onClick={() => requestSort('progress')}
              >
                <div className="flex items-center">
                  진행 상태
                  {renderSortIcon('progress')}
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div
        className="max-h-[300px] min-h-[200px] overflow-y-auto"
        ref={scrollContainerRef}
      >
        <table className="w-full bg-white">
          <tbody>
            {sortedItems.map((item, index) => (
              <tr
                key={index}
                onClick={() =>
                  route.push(`${window.location.pathname}/post/${item.id}`)
                }
              >
                <td
                  className="w-[50px] border-b px-5 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={SelectedItems.includes(item.id)}
                    onCheckedChange={() => {
                      handleSelectItem(item.id)
                    }}
                  />
                </td>
                <td className="w-[100px] border-b px-4 py-2">
                  {item.category}
                </td>
                <td className="w-[200px] border-b px-4 py-2">{item.title}</td>
                <td className="w-[150px] border-b px-4 py-2">
                  {item.masters.length === 0
                    ? null
                    : item.masters.length === 1
                      ? item.masters[0].name
                      : `${item.masters[0].name} +${item.masters.length - 1}`}
                </td>
                <td className="w-[150px] border-b px-2 py-2">
                  {format(item.createdAt, 'yy.MM.dd (EEE)', { locale: ko })}
                </td>
                <td
                  className="relative w-[100px] border-b py-2 pl-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusClick(index)
                  }}
                >
                  {renderStatus(item.progress, index)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
interface TeamMemberModalProps {
  isOpen: boolean
  onClose: () => void
  memberInfo: ProjectUserInfo
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  isOpen,
  onClose,
  memberInfo,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[448px] rounded-md bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-lg font-bold">팀원 정보</h2>

        <div className="mb-4 flex items-center gap-[16px]">
          <label className="block w-[100px] text-sm font-medium text-gray-700">
            이름:
          </label>
          {memberInfo?.name}
        </div>

        <div className="mb-4 flex items-center gap-[16px]">
          <label className="block w-[100px] text-sm font-medium text-gray-700">
            개인 연락처:
          </label>
          {memberInfo?.contact}
        </div>

        <div className="mb-4 flex items-center gap-[16px]">
          <label className="block w-[100px] text-sm font-medium text-gray-700">
            거주지역:
          </label>
          {memberInfo?.location}
        </div>

        <div className="mb-4 flex items-center gap-[16px]">
          <label className="block w-[100px] text-sm font-medium text-gray-700">
            MBTI:
          </label>
          {memberInfo?.mbti}
        </div>

        <div className="mb-4 flex items-center gap-[16px]">
          <label className="block w-[100px] text-sm font-medium text-gray-700">
            보유 기술 스택:
          </label>
          {memberInfo?.stackNames.join(', ')}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            이메일:
          </label>
          <div className="mb-4">
            {memberInfo?.tools.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-[8px] py-[6px]"
              >
                <div className="flex items-center gap-[8px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.334 2.66699H2.66732C1.93094 2.66699 1.33398 3.26395 1.33398 4.00033V12.0003C1.33398 12.7367 1.93094 13.3337 2.66732 13.3337H13.334C14.0704 13.3337 14.6673 12.7367 14.6673 12.0003V4.00033C14.6673 3.26395 14.0704 2.66699 13.334 2.66699Z"
                      stroke="#334155"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.6673 4.66699L8.68732 8.46699C8.4815 8.59594 8.24353 8.66433 8.00065 8.66433C7.75777 8.66433 7.5198 8.59594 7.31398 8.46699L1.33398 4.66699"
                      stroke="#334155"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>{item.email}</span>
                </div>

                <span className="cursor-pointer text-gray-500">
                  {item.toolName}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-[186px] rounded bg-blue-500 px-4 py-2 text-white"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

const TeamBoard = ({ project }: { project: ProjectInfo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<ProjectUserInfo | null>(
    null,
  )
  const handleCardClick = (member: ProjectUserInfo) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  return (
    <div className="py-8">
      <h2 className="mb-6 text-2xl font-bold">팀원 정보</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {project.users?.map((member) => (
          <div
            key={member.id}
            onClick={() => handleCardClick(member)}
            className="cursor-pointer rounded-md border border-slate-200 bg-white p-[8px] shadow"
          >
            <div className="flex h-[90px] items-center justify-center bg-gray-200">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>
            <div className="min-h-[60px] py-[8px]">
              <h3 className="text-[14px] font-semibold">{member.name}</h3>
              <p className="text-[12px] text-gray-600">{member.mbti}</p>
              <span className="font-semibold">
                {member.stackNames.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <TeamMemberModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          memberInfo={selectedMember}
        />
      )}
    </div>
  )
}

const ProjectContainer = ({ data }: { data: ProjectInfo }) => {
  if (!data) {
    return <div>Loading...</div>
  }

  const { openModal, modals } = useModal()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterChangeProps>({
    statuses: [],
    assignees: [],
    search: '',
  })

  const boardResponse = useBoardListQuery(data.id)
  const user = useUserInfoQuery().data
  const boardList = boardResponse.data?.result || []

  const filteredItems = boardList.filter((item) => {
    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(item.progress)
    const matchesAssignee =
      filters.assignees.length === 0 ||
      filters.assignees.includes(item.category)
    const matchesSearch = item.title.includes(filters.search)
    return matchesStatus && matchesAssignee && matchesSearch
  })

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleClick = () => {
    openModal('dimed', ModalTypes.EDIT)
  }

  const renderModal = () => {
    if (!modals.dimed.open) return null

    switch (modals.dimed.type) {
      case ModalTypes.CREATE:
        return <ProjectCreateModal />
      case ModalTypes.EDIT:
        if (data != null) {
          return <ProjectEditModal project={data} />
        }
      case ModalTypes.DELETE:
        if (data != null) {
          return <ProjectDeleteModal uid={data.id} />
        }
      case ModalTypes.INVITE:
        if (data != null) {
          return <ProjectInviteModal uid={data.id} />
        }

      default:
        return null
    }
  }

  return (
    <div className="Container">
      <div className="flex justify-between pt-[90px]">
        <div className="flex">
          <div className="text-h1">{data.title}</div>
          <div className="self-end pl-[24px] text-h3">
            {format(data.startDate, 'yy.MM.dd (EEE)', { locale: ko })} ~
            {format(data.endDate, 'yy.MM.dd (EEE)', { locale: ko })}{' '}
          </div>
        </div>
        {user != undefined && data.users[0].name === user.result.name && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="cursor-pointer self-center"
            onClick={handleClick}
          >
            <path
              d="M12.22 2H11.78C11.2496 2 10.7409 2.21071 10.3658 2.58579C9.99072 2.96086 9.78 3.46957 9.78 4V4.18C9.77964 4.53073 9.68706 4.87519 9.51154 5.17884C9.33602 5.48248 9.08374 5.73464 8.78 5.91L8.35 6.16C8.04596 6.33554 7.70108 6.42795 7.35 6.42795C6.99893 6.42795 6.65404 6.33554 6.35 6.16L6.2 6.08C5.74107 5.81526 5.19584 5.74344 4.684 5.88031C4.17217 6.01717 3.73555 6.35154 3.47 6.81L3.25 7.19C2.98526 7.64893 2.91345 8.19416 3.05031 8.706C3.18717 9.21783 3.52154 9.65445 3.98 9.92L4.13 10.02C4.43228 10.1945 4.68362 10.4451 4.85905 10.7468C5.03448 11.0486 5.1279 11.391 5.13 11.74V12.25C5.1314 12.6024 5.03965 12.949 4.86405 13.2545C4.68844 13.5601 4.43521 13.8138 4.13 13.99L3.98 14.08C3.52154 14.3456 3.18717 14.7822 3.05031 15.294C2.91345 15.8058 2.98526 16.3511 3.25 16.81L3.47 17.19C3.73555 17.6485 4.17217 17.9828 4.684 18.1197C5.19584 18.2566 5.74107 18.1847 6.2 17.92L6.35 17.84C6.65404 17.6645 6.99893 17.5721 7.35 17.5721C7.70108 17.5721 8.04596 17.6645 8.35 17.84L8.78 18.09C9.08374 18.2654 9.33602 18.5175 9.51154 18.8212C9.68706 19.1248 9.77964 19.4693 9.78 19.82V20C9.78 20.5304 9.99072 21.0391 10.3658 21.4142C10.7409 21.7893 11.2496 22 11.78 22H12.22C12.7504 22 13.2591 21.7893 13.6342 21.4142C14.0093 21.0391 14.22 20.5304 14.22 20V19.82C14.2204 19.4693 14.3129 19.1248 14.4885 18.8212C14.664 18.5175 14.9163 18.2654 15.22 18.09L15.65 17.84C15.954 17.6645 16.2989 17.5721 16.65 17.5721C17.0011 17.5721 17.346 17.6645 17.65 17.84L17.8 17.92C18.2589 18.1847 18.8042 18.2566 19.316 18.1197C19.8278 17.9828 20.2645 17.6485 20.53 17.19L20.75 16.8C21.0147 16.3411 21.0866 15.7958 20.9497 15.284C20.8128 14.7722 20.4785 14.3356 20.02 14.07L19.87 13.99C19.5648 13.8138 19.3116 13.5601 19.136 13.2545C18.9604 12.949 18.8686 12.6024 18.87 12.25V11.75C18.8686 11.3976 18.9604 11.051 19.136 10.7455C19.3116 10.4399 19.5648 10.1862 19.87 10.01L20.02 9.92C20.4785 9.65445 20.8128 9.21783 20.9497 8.706C21.0866 8.19416 21.0147 7.64893 20.75 7.19L20.53 6.81C20.2645 6.35154 19.8278 6.01717 19.316 5.88031C18.8042 5.74344 18.2589 5.81526 17.8 6.08L17.65 6.16C17.346 6.33554 17.0011 6.42795 16.65 6.42795C16.2989 6.42795 15.954 6.33554 15.65 6.16L15.22 5.91C14.9163 5.73464 14.664 5.48248 14.4885 5.17884C14.3129 4.87519 14.2204 4.53073 14.22 4.18V4C14.22 3.46957 14.0093 2.96086 13.6342 2.58579C13.2591 2.21071 12.7504 2 12.22 2Z"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
        {renderModal()}
      </div>
      <div className="py-[36px] text-h3">{data.overview}</div>
      <hr className="mb-[36px] border-t border-gray-300" />
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">보드</h1>
        <FilterBar
          onFilterChange={setFilters}
          id={data.id}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
      <div className="container p-[24px]">
        <Board
          items={filteredItems}
          SelectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
      <hr className="border-t border-gray-300" />
      <div className="py-[36px] text-h3">캘린더</div>
      <div className="flex">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          locale={ko}
        />
      </div>
      <div className="mt-[32px] flex flex-col gap-[12px] p-[1px]">
        프로젝트 팀원
        <TeamCheckbox id="1" name="팀원 A" />
        <TeamCheckbox id="2" name="팀원 B" />
        <TeamCheckbox id="3" name="팀원 C" />
        <TeamCheckbox id="4" name="팀원 내 개인 캘린더" />
        <TeamCheckbox id="5" name="팀원 프로젝트 회의" />
      </div>
      <div className="mt-[24px] w-[300px]">
        회의 추천 일정
        <ScheduleItem
          date={scheduleData.date}
          timeslots={scheduleData.timeslots}
        />
        <ScheduleItem
          date={scheduleData.date}
          timeslots={scheduleData.timeslots}
        />
      </div>
      <div>
        <TeamBoard project={data} />
      </div>
    </div>
  )
}

export default ProjectContainer
