import Header from '@/components/Header/Header'
import { ReactNode } from 'react'

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="m-auto h-screen w-[1180px]">
      <Header />
      {children}
    </div>
  )
}

export default layout
