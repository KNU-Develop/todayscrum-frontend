import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 p-10">
      <Link href="/workspace" prefetch>
        <Button className="w-[300px]">
          <p>워크스페이스로 이동하기</p>
        </Button>
      </Link>
      <Link href="/login">
        <Button className="w-[300px]">
          <p>로그인 하기</p>
        </Button>
      </Link>
    </main>
  )
}
