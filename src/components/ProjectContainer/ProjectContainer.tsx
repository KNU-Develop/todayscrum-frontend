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
import { StatusDropdown, StatusDropDownCreate } from './StatusDropDown'
import { ProfileAvatar } from '../Avatar/Avatar'
import {
  ArrowDown,
  Check,
  Trash2,
  Search,
  Filter,
  Mail,
  Settings,
} from 'lucide-react'

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
  className?: string
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
                  <ArrowDown stroke="#374151" strokeWidth={1.33} />
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
                <StatusDropDownCreate
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
export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  form,
  onClose,
  className,
}) => {
  const categories = [BoardCategory.issue, BoardCategory.feadback]

  return (
    <div
      className={`absolute right-2 z-10 mt-2 w-[120px] overflow-hidden rounded-md border bg-white shadow-lg ${className}`}
    >
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
          <Check
            className="mr-2"
            style={{
              visibility:
                category === form.watch('category') ? 'visible' : 'hidden',
            }}
            stroke="#334155"
            strokeWidth={2}
          />
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
      <div
        onClick={handleDeleteClick}
        className={`cursor-pointer ${selectedItems.length === 0 ? 'cursor-not-allowed' : ''}`}
      >
        <Trash2 width={24} height={24} />
      </div>
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
          <div
            onClick={() => setShowSearchInput(true)}
            className="cursor-pointer"
          >
            <Search width={24} height={24} />
          </div>
        )}
      </div>
      <div className="relative">
        <div onClick={handleToggleDropdown} className="cursor-pointer">
          <Filter width={24} height={24} />
        </div>
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
                  <Check
                    className={`${selectedStatuses.includes(status) ? 'visible' : 'invisible'}`}
                    stroke="#334155"
                    strokeWidth={2}
                    width={16}
                    height={16}
                  />
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
                  <Check
                    className={`${selectedAssignees.includes(assignee) ? 'visible' : 'invisible'}`}
                    stroke="#334155"
                    strokeWidth={2}
                    width={16}
                    height={16}
                  />
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
      <ArrowDown
        className="ml-1"
        style={{
          visibility: sortConfig?.key === key ? 'visible' : 'hidden',
          transform:
            sortConfig?.key === key && sortConfig.direction === 'descending'
              ? 'rotate(180deg)'
              : 'none',
          transition: 'transform 0.2s ease',
        }}
        stroke="black"
        strokeWidth={2}
        width={16}
        height={16}
      />
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
                <td className="w-[150px] border-b px-4 py-2">{item.title}</td>
                <td className="w-[200px] border-b px-4 py-2">
                  <div className="flex items-center -space-x-3">
                    {item.masters.slice(0, 5).map((member, index) => (
                      <ProfileAvatar key={index} size="24" name={member.name} />
                    ))}
                  </div>
                  {item.masters.length > 5 && (
                    <p className="text-small text-gray-400">
                      +{item.masters.length - 5}
                    </p>
                  )}
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
                  <Mail
                    stroke="#334155"
                    strokeWidth={1.33}
                    width={16}
                    height={16}
                  />
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
          <Settings
            width={24}
            height={24}
            className="cursor-pointer self-center"
            onClick={handleClick}
            strokeWidth={2}
          />
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
