import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

import { MSWComponent } from '@/api/MSWComponent'
import { ModalContextProvider } from '@/hooks/useModal/useModal'
import { cn } from '@/lib/utils'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background antialiased')}>
        {process.env.NEXT_PUBLIC_MSW === 'enable' ? (
          <MSWComponent>
            <ReactQueryProvider>
              <ModalContextProvider>
                <div>{children}</div>
                <div id="modal" />
              </ModalContextProvider>
            </ReactQueryProvider>
          </MSWComponent>
        ) : (
          <ReactQueryProvider>
            <ModalContextProvider>
              <div>{children}</div>
              <div id="modal" />
            </ModalContextProvider>
          </ReactQueryProvider>
        )}
      </body>
    </html>
  )
}
