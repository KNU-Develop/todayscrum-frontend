'use client'

import { useTeamInfoQuery, useUserInfoQuery } from '@/api'
import { BoardDto, BoardResponse } from '@/api/services/board/model'
import { useBoardQuery } from '@/api/services/board/quries'
import {
  Comment,
  CommentResponse,
  InputComment,
} from '@/api/services/comment/model'
import {
  useAddCommentMutation,
  useCommentListQuery,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} from '@/api/services/comment/quries'
import { ProjectUserInfo } from '@/api/services/project/model'
import { useOneProjectInfoQuery } from '@/api/services/project/quries'
import { ProfileAvatar } from '@/components/Avatar/Avatar'
import { Form } from '@/components/ui/form'
import { fromCreateComment } from '@/hooks/useVaild/useComment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { da, ko } from 'date-fns/locale'
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface CommentContainerProps {
  comment: Comment
  onEdit: (newComment: string) => void
  onDelete: (data: Comment) => void
}
const CommentContainer: React.FC<CommentContainerProps> = ({
  comment,
  onEdit,
  onDelete,
}) => {
  const pathName = usePathname()
  const projectId = pathName.split('/project/')[1]?.split('/')[0]

  const [filteredUsers, setFilteredUsers] = useState<ProjectUserInfo[]>([])
  const [master, setMaster] = useState<ProjectUserInfo[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const queryClient = useQueryClient()

  const user = useUserInfoQuery()
  const project = useOneProjectInfoQuery(projectId).data
  const team = project?.result?.users

  const handleEditClick = () => {
    setIsEditing(true)
    setEditedContent(comment.description)
  }

  const updateComment = useUpdateCommentMutation(comment?.id ?? '', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentList'] })
      queryClient.invalidateQueries({ queryKey: ['board'] })
      toast(`댓글 수정 성공`)
    },
  })

  useEffect(() => {
    if (editedContent.includes('@')) {
      const filterTerm =
        editedContent.split('@').pop()?.trim().toLowerCase() || ''

      const results = team?.filter(
        (participant) =>
          (participant.name.toLowerCase().includes(filterTerm) ||
            participant.email.toLowerCase().includes(filterTerm)) &&
          !master.some((item) => item.email === participant.email),
      )
      setFilteredUsers(results || [])
    } else {
      setFilteredUsers([])
    }
  }, [editedContent, master, team])

  const handleSaveClick = () => {
    onEdit(editedContent)
    const masterId = master.map((item) => parseInt(item.id, 10)) || []

    updateComment.mutate({ description: editedContent, masterId: masterId })
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value)
  }

  const handleUserSelect = (user: ProjectUserInfo) => {
    const updatedDescription = editedContent.replace(/@\w*$/, `@${user.name} `)
    setEditedContent(updatedDescription)

    const isAdded = master.some((item) => item.email === user.email)
    if (!isAdded) {
      setMaster([...master, user])
    }
    setFilteredUsers([])
  }

  return (
    <div className="mt-[32px] flex flex-col gap-[24px] rounded-md border-2 border-slate-200 p-[24px]">
      <div className="flex justify-between">
        <div className="flex gap-[8px]">
          <div className="flex items-center gap-[8px]">
            <ProfileAvatar
              size="32"
              imageUrl={comment.user.imageUrl}
              name={comment.user.name}
            />
            <div className="author">{comment.user.name}</div>
          </div>
          <div className="flex items-end text-[12px]">
            {format(comment.createdAt, 'yy.MM.dd HH:mm (EEE)', {
              locale: ko,
            })}
          </div>
        </div>
        {user.data?.result.name === comment.user.name && (
          <div className="flex gap-[12px]">
            {isEditing ? (
              <>
                <button onClick={handleSaveClick} className="text-blue-500">
                  저장
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500"
                >
                  닫기
                </button>
              </>
            ) : (
              <>
                <SvgIcon name="edit" onClick={handleEditClick} />
                <SvgIcon name="delete" onClick={() => onDelete(comment)} />
              </>
            )}
          </div>
        )}
      </div>
      <div>
        <hr className="border-t border-gray-300" />
        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={handleChange}
              className="w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {filteredUsers.length > 0 && (
              <div className="rounded border bg-white shadow-md">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                  >
                    {user.name} ({user.email})
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex px-2 py-3">{comment.description}</div>
        )}
      </div>
    </div>
  )
}
const PostContainer: React.FC<{
  board: BoardDto
  comments: Comment[] | []
}> = ({ board, comments }) => {
  const pathName = usePathname()
  const projectId = pathName.split('/project/')[1]?.split('/')[0]

  const [filteredUsers, setFilteredUsers] = useState<ProjectUserInfo[]>([])
  const [master, setMaster] = useState<ProjectUserInfo[]>([])

  const form = useForm<InputComment>({
    resolver: zodResolver(fromCreateComment),
    mode: 'onChange',
    defaultValues: {
      description: '',
      masterId: [],
    },
  })
  const queryClient = useQueryClient()
  const user = useUserInfoQuery()
  const project = useOneProjectInfoQuery(projectId).data
  const team = project?.result?.users
  const description = form.watch('description')
  const addComment = useAddCommentMutation(board?.id, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['commentList'] })
      toast(`댓글 생성 성공`)
    },
    onError: () => toast(`댓글 생성 실패`),
  })

  const deleteComment = useDeleteCommentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] })
      queryClient.invalidateQueries({ queryKey: ['commentList'] })
      toast('댓글 삭제 성공')
    },
    onError: () => toast(`댓글 삭제 실패`),
  })

  const handleDelete = (data: Comment) => {
    deleteComment.mutate(data?.id ?? '')
    console.log('댓글이 삭제되었습니다.')
  }

  const handleEdit = (newComment: string) => {}

  const handleCommentSubmit = () => {
    const masterId = master.map((item) => parseInt(item.id, 10)) || []
    form.setValue('masterId', masterId)

    addComment.mutate({
      description: form.getValues('description'),
      masterId: form.getValues('masterId'),
    })
    form.reset()
    setMaster([])
  }

  useEffect(() => {
    if (description.includes('@')) {
      const filterTerm =
        description.split('@').pop()?.trim().toLowerCase() || ''

      const results = team?.filter(
        (participant) =>
          (participant.name.toLowerCase().includes(filterTerm) ||
            participant.email.toLowerCase().includes(filterTerm)) &&
          !master.some((item) => item.email === participant.email),
      )
      setFilteredUsers(results || [])
    } else {
      setFilteredUsers([])
    }
  }, [description, master, team])

  const handleUserSelect = (user: ProjectUserInfo) => {
    const updatedDescription = description.replace(/@\w*$/, `@${user.name} `)
    form.setValue('description', updatedDescription)

    const isAdded = master.some((item) => item.email === user.email)
    if (!isAdded) {
      setMaster([...master, user])
    }
    setFilteredUsers([])
  }

  return (
    <div className="h-screen">
      {board && (
        <>
          <div className="mt-[14px] flex flex-col gap-[24px] rounded-md border-2 border-slate-200 p-[24px]">
            <div className="flex justify-between">
              <div className="flex gap-[16px]">
                <div className="relative flex w-[75px] cursor-pointer items-center rounded-[15px] bg-red-200 px-[8px]">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="w-full text-center">{board?.progress}</span>
                </div>
                <div className="text-h3">{board?.title}</div>
                <div className="flex items-end font-pretendard text-[14px] font-semibold leading-[20px] text-gray-400">
                  {board?.category}
                </div>
              </div>
              {user.data?.result.name === board.userName && (
                <div className="flex gap-[12px]">
                  <SvgIcon name="edit" />
                  <SvgIcon name="delete" />
                </div>
              )}
            </div>
            <div className="flex gap-[8px]">
              <div className="author">{board?.userName}</div>
              <div className="flex items-end text-[12px] text-gray-500">
                {format(board.createdAt, 'yy.MM.dd (EEE)', { locale: ko })}
              </div>
            </div>
            <hr className="border-t border-gray-300" />
            <div className="flex text-blue-500">
              {board?.masters.map((user) => `@${user.name}`).join(' ')}
            </div>
            <div className="flex">{board?.content}</div>
          </div>
          <div className="flex h-[65vh] flex-col justify-between">
            {comments?.map((comment, index) => (
              <CommentContainer
                key={index}
                comment={comment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            <div className="flex flex-col gap-[10px] pb-[48px]">
              <div className="font-inter mt-3 text-xl font-medium leading-4 text-black">
                댓글
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCommentSubmit)}>
                  <textarea
                    {...form.register('description')}
                    className="h-[80px] w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="댓글을 적어 주세요."
                  />
                  {filteredUsers.length > 0 && (
                    <div className="rounded border bg-white shadow-md">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="cursor-pointer px-2 py-1 hover:bg-gray-200"
                        >
                          {user.name} ({user.email})
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex flex-row justify-end">
                    <button
                      type="submit"
                      className="w-[89px] rounded border px-[16px] py-[8px] font-pretendard text-sm font-normal leading-6 text-slate-900"
                    >
                      등록
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const SvgIcon: React.FC<{ name: 'edit' | 'delete'; onClick?: () => void }> = ({
  name,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) onClick()
  }

  switch (name) {
    case 'edit':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          onClick={handleClick}
        >
          <g clipPath="url(#clip0)">
            <path
              d="M12 1.33398L14.6667 4.00065"
              stroke="#374151"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.99967 13.6673L12.6663 6.00065L9.99967 3.33398L2.33301 11.0007L1.33301 14.6673L4.99967 13.6673Z"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      )
    case 'delete':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          onClick={handleClick}
        >
          <path
            d="M2 4H14"
            stroke="#374151"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6663 4V13.3333C12.6663 14 11.9997 14.6667 11.333 14.6667H4.66634C3.99967 14.6667 3.33301 14 3.33301 13.3333V4"
            stroke="black"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.33301 4.00065V2.66732C5.33301 2.00065 5.99967 1.33398 6.66634 1.33398H9.33301C9.99967 1.33398 10.6663 2.00065 10.6663 2.66732V4.00065"
            stroke="black"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66699 7.33398V11.334"
            stroke="black"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.33301 7.33398V11.334"
            stroke="black"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return null
  }
}

const Page = () => {
  const path = usePathname()
  const boardId = path.split('/post/').pop() || null
  const BoardResponse = useBoardQuery(boardId as string, {
    enabled: !!boardId,
  })
  const CommentResponse = useCommentListQuery(boardId as string, {
    enabled: !!boardId,
  })
  const board = BoardResponse.data?.result
  const comments = CommentResponse.data?.result

  return (
    <div>
      <PostContainer
        board={board as BoardDto}
        comments={comments as Comment[] | []}
      />
    </div>
  )
}

export default Page
