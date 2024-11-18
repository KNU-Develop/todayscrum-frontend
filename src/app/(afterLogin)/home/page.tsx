'use client'

import { ProjectInfo, useProjectInfoQuery } from '@/api'
import Card from '@/components/Card/Card'
import {
  ProjectCreateModal,
  ProjectDeleteModal,
  ProjectEditModal,
  ProjectInviteModal,
} from '@/components/Modal/ProjectModal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/useModal'
import { ModalTypes } from '@/hooks/useModal/useModal'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

const Home = () => {
  const { data, isLoading } = useProjectInfoQuery({
    refetchOnMount: true,
  })

  const { openModal, modals } = useModal()

  const [selectedProject, setSelectedProject] = useState<ProjectInfo | null>(
    null,
  )

  const handleClick = () => {
    openModal('dimed', ModalTypes.CREATE)
  }

  if (isLoading || data == null) {
    return null
  }

  const renderModal = () => {
    if (!modals.dimed.open) return null

    switch (modals.dimed.type) {
      case ModalTypes.CREATE:
        return <ProjectCreateModal />
      case ModalTypes.EDIT:
        if (selectedProject != null) {
          return <ProjectEditModal project={selectedProject} />
        }
      case ModalTypes.DELETE:
        if (selectedProject != null) {
          return <ProjectDeleteModal uid={selectedProject.id} />
        }
      case ModalTypes.INVITE:
        if (selectedProject != null) {
          return <ProjectInviteModal uid={selectedProject.id} />
        }

      default:
        return null
    }
  }

  return (
    <main className="mt-5 flex flex-grow flex-col">
      <div className="mb-[30px] flex justify-end">
        <Button className="w-[180px]" onClick={handleClick}>
          <div className="flex items-center justify-center gap-2">
            <PlusIcon size={16} />
            <p className="text-body">프로젝트 생성</p>
          </div>
        </Button>
      </div>

      <div className="flex flex-grow flex-wrap gap-5">
        {(data?.result?.length ?? 0 > 0) ? (
          data?.result?.map((projectData) => (
            <Card
              key={projectData.id}
              data={projectData}
              setSelectedProject={setSelectedProject}
            />
          ))
        ) : (
          <div
            className="w-full self-center text-center text-lg font-semibold"
            onClick={handleClick}
          >
            프로젝트를 생성해주세요.
          </div>
        )}
      </div>

      {renderModal()}
    </main>
  )
}
export default Home
