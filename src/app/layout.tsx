import type { Metadata } from 'next'
import './globals.css'

import { MSWComponent } from '@/api/MSWComponent'
import { InitialSetting } from '@/components/InitialSetting'
import { CalendarProvider } from '@/hooks/useCalendar/calendarContext'
import { ModalContextProvider } from '@/hooks/useModal/useModal'
import { cn } from '@/lib/utils'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: '오늘 회의',
  description: '일정 조율부터 프로젝트 관리까지',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background antialiased')}>
        <Toaster />
        {process.env.NEXT_PUBLIC_MSW === 'enable' ? (
          <MSWComponent>
            <ReactQueryProvider>
              <ModalContextProvider>
                <CalendarProvider>
                  <InitialSetting />
                  <div>{children}</div>
                  <div id="scheduleModal" />
                  <div id="modal" />
                </CalendarProvider>
              </ModalContextProvider>
            </ReactQueryProvider>
          </MSWComponent>
        ) : (
          <ReactQueryProvider>
            <ModalContextProvider>
              <CalendarProvider>
                <InitialSetting />
                <div>{children}</div>
                <div id="scheduleModal" />
                <div id="modal" />
              </CalendarProvider>
            </ModalContextProvider>
          </ReactQueryProvider>
        )}
      </body>
    </html>
  )
}
