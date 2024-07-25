import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreVertical,
  PencilIcon,
  Trash2Icon,
  UserPlusIcon,
} from 'lucide-react'
import React from 'react'
import { ProfileAvatar } from '../Avatar/Avatar'

interface CardProps {
  title: string
  description: string
  members: { name: string; avatar: string }[]
  startDate: string
  endDate: string
}

const MAX_VISIBLE_MEMBERS = 5

const Card: React.FC<CardProps> = ({
  title,
  description,
  members,
  startDate,
  endDate,
}) => {
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS)
  const remainingMemberCount = members.length - MAX_VISIBLE_MEMBERS

  return (
    <>
      <div className="shadow-base flex w-[380px] flex-col gap-14 rounded-xl border-2 border-slate-200 p-6">
        <div className="flex flex-col gap-4">
          <p className="text-h3">{title}</p>
          <p className="text-body">{description}</p>
          <p className="text-inline-code text-gray-400">
            {startDate} ~ {endDate}
          </p>
        </div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            <div className="flex -space-x-3">
              {visibleMembers.map((member, index) => (
                <ProfileAvatar
                  key={index}
                  imageUrl={member.avatar}
                  name={member.name}
                />
              ))}
            </div>
            {remainingMemberCount > 0 && (
              <p className="text-small text-gray-400">
                +{remainingMemberCount}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                name="more-vertical"
                className="cursor-pointer text-slate-500"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[184px]">
              <DropdownMenuItem>
                <div className="flex items-center gap-2 p-2">
                  <UserPlusIcon size={16} />
                  <p className="text-subtle font-medium">팀원 초대</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2 p-2">
                  <PencilIcon size={16} />
                  <p className="text-subtle font-medium">프로젝트 수정</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-center gap-2 p-2">
                  <Trash2Icon size={16} />
                  <p className="text-subtle font-medium">프로젝트 삭제</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}

export default Card
