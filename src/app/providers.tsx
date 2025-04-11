'use client'

import { ReactNode } from 'react'

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
} 