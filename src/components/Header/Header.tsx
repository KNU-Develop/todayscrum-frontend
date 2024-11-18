'use client'

import Cookies from 'js-cookie'
import { CalendarCheckIcon, LogOutIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ProfileAvatar } from '../Avatar/Avatar'
import NotificationDropdown from '../Notification/Notification'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const Header: React.FC = () => {
  const deleteCookie = () => {
    Cookies.remove('access')
    Cookies.remove('refresh')
  }

  return (
    <header className="flex h-20 items-center justify-between py-4">
      <Link href="/home">
        <div className="text-h3">오늘 회의</div>
      </Link>
      <DropdownMenu>
        <div className="flex">
          <NotificationDropdown />
          <DropdownMenuTrigger>
            <ProfileAvatar name="cv" size="40" />
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent className="w-[184px]">
          <Link href="/user/edit">
            <DropdownMenuItem>
              <div className="flex items-center gap-2 p-2">
                <UserIcon size={16} />
                <p className="text-subtle font-medium">프로필 설정</p>
              </div>
            </DropdownMenuItem>
          </Link>
          <Link href="/schedule">
            <DropdownMenuItem>
              <div className="flex items-center gap-2 p-2">
                <CalendarCheckIcon size={16} />
                <p className="text-subtle font-medium">내 일정 관리</p>
              </div>
            </DropdownMenuItem>
          </Link>
          <Link href="/" onClick={deleteCookie}>
            <DropdownMenuItem>
              <div className="flex items-center gap-2 p-2">
                <LogOutIcon size={16} />
                <p className="text-subtle font-medium">로그아웃</p>
              </div>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

export default Header
