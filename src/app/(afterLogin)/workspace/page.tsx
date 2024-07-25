'use client'

import Card from '@/components/Card/Card'
import { ProjectCreateModal } from '@/components/Modal/ProjectModal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/useModal'

export default function Home() {
  const project = {
    title: '프로젝트 이름이 들어 가야겠죠',
    description: '설명이 들어 가야겠죠',
    members: [
      { name: '재연', avatar: '/avatar1.png' },
      { name: '서우', avatar: '/avatar1.png' },
      { name: '홍기', avatar: '/avatar1.png' },
      { name: '재연', avatar: '/avatar1.png' },
      { name: '재연', avatar: '/avatar1.png' },
      { name: '재연', avatar: '/avatar1.png' },
      { name: '재연', avatar: '/avatar1.png' },
    ],
    startDate: '2024.07.01 (월)',
    endDate: '2024.07.11 (일)',
  }
  const { open, toggleModal } = useModal()

  const handleClick = () => {
    toggleModal()
  }

  return (
    <main className="mt-5">
      <div className="mb-[30px] flex justify-end">
        <Button className="w-[180px]" onClick={handleClick}>
          + 프로젝트 생성
        </Button>
      </div>
      <div className="flex flex-wrap gap-5">
        <Card {...project} />
        <Card {...project} />
        <Card {...project} />
        <Card {...project} />
      </div>
      {open && <ProjectCreateModal />}
    </main>
  )
}
