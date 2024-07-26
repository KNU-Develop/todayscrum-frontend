'use client'

import { usePathname } from 'next/navigation'

const page = () => {
  const path = usePathname()
  const id = path.split('/').pop()

  return <div>프로젝트 페이지 {id}</div>
}

export default page
