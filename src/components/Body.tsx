import {ReactNode} from "react";
interface ComponentProps {
  children: ReactNode
}
export function Body({ children }: ComponentProps) {
  return (
    <div style={{
      zIndex: 100,
      position: 'fixed',
      top: 0,
      right: 0,
      width: '320px',
      height: '100%',
      backgroundColor: 'gray',
      padding: '5px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    }}>
      {children}
    </div>
  )
}