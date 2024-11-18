import Header from '@/components/Header/Header'
import { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-auto flex min-h-screen w-[1180px] flex-col">
      <Header />
      {children}
    </div>
  )
}

export default layout
