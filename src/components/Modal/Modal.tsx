import { useModal } from '@/hooks/useModal'
import { createPortal } from 'react-dom'

const ModalMain = ({ children }: { children: React.ReactNode }) => {
  const { open, toggleModal, closing } = useModal()

  if (!open) {
    return null
  }

  const modalPortal = document.querySelector('#modal') as HTMLDivElement

  const clickBackdrop = () => {
    toggleModal()
  }

  return createPortal(
    <div
      id="modal-backdrop"
      className={`${closing ? 'animate-fade-out' : 'animate-fade-in'} fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50`}
      onClick={clickBackdrop}
    >
      <div
        className={`${closing ? 'animate-disappear-bottom' : 'animate-appear-up'} flex h-fit w-fit min-w-[410px] flex-col items-center justify-center gap-6 rounded-lg bg-white p-8`}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {children}
      </div>
    </div>,
    modalPortal,
  )
}

export const Modal = Object.assign(ModalMain, {})
