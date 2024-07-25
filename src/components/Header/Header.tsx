import { CalendarCheckIcon, LogOutIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ProfileAvatar } from '../Avatar/Avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const Header: React.FC = () => {
  return (
    <header className="flex h-20 items-center justify-between p-4">
      <div className="text-h3">오늘 회의</div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ProfileAvatar name="cv" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[184px]">
          <DropdownMenuItem>
            <Link href="/user/edit">
              <div className="flex items-center gap-2 p-2">
                <UserIcon size={16} />
                <p className="text-subtle font-medium">프로필 설정</p>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center gap-2 p-2">
              <CalendarCheckIcon size={16} />
              <p className="text-subtle font-medium">내 일정 관리</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center gap-2 p-2">
              <LogOutIcon size={16} />
              <p className="text-subtle font-medium">로그아웃</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Header
