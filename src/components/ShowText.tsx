import { ReactNode } from 'react'

export interface ShowTextProps {
  id: string
  children: ReactNode
}

export function ShowText({ id, children }: ShowTextProps) {
  return (
    <div id={id}
    style={{
      border: '1px solid black',
      borderRadius: '5px',
      minWidth:'200px',
      minHeight:'100px',
      padding: '4px'
    }}>
      {children}
    </div>
  )
}