// app/page.jsx

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Home() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('access')?.value
  const refreshToken = cookieStore.get('refresh')?.value

  if (accessToken && refreshToken) {
    redirect(
      `/auth/token?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    )
  } else {
    redirect('/login')
  }
}
