'use client'

import { useProjectInfoQuery } from '@/api'
import Card from '@/components/Card/Card'
import {
  ProjectCreateModal,
  ProjectDeleteModal,
  ProjectEditeModal,
  ProjectInviteModal,
} from '@/components/Modal/ProjectModal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { PlusIcon } from 'lucide-react'

const workspace = () => {
  const { data, isLoading } = useProjectInfoQuery()

  const { open, toggleModal, setModal, type } = useModal()

  const handleClick = () => {
    setModal(ModalTypes.CREATE)
    toggleModal()
  }

  if (isLoading) {
    return null
  }

  console.log(data)

  return (
    <main className="mt-5">
      <div className="mb-[30px] flex justify-end">
        <Button className="w-[180px]" onClick={handleClick}>
          <div className="flex items-center justify-center gap-2">
            <PlusIcon size={16} />
            <p className="text-body">프로젝트 생성</p>
          </div>
        </Button>
      </div>

      <div className="flex flex-wrap gap-5">
        {data?.result.map((data) => {
          return <Card data={data} />
        })}
      </div>

      {open && type == ModalTypes.CREATE && <ProjectCreateModal />}
      {open && type == ModalTypes.EDIT && <ProjectEditeModal />}
      {open && type == ModalTypes.DELETE && <ProjectDeleteModal />}
      {open && type == ModalTypes.INVITE && <ProjectInviteModal />}
    </main>
  )
}
export default workspace
