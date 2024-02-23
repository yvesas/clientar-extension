/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonHTMLAttributes, ReactNode } from 'react'


export interface ButtonProps {
  id: string
  typeButton?: 'primary' | 'secondary' | 'danger'
  children: ReactNode
  loading?: boolean
  onClick?: (e:any) => void;
  rest?: ButtonHTMLAttributes<HTMLButtonElement>
}

export function Button({
  id,
  typeButton = 'primary',
  children,
  loading = false,
  onClick,
  ...rest
}: ButtonProps) {
  const typeActive = verifyColor()

  function verifyColor() {
    if (typeButton === 'primary') {
      return 'bg-[#4d4ddb]  text-white hover:bg-[#4d4ddbc5]'
    } else if (typeButton === 'secondary') {
      return 'bg-[#f5a523] text-white hover:bg-[#f5a523b6]'
    } else if (typeButton === 'danger') {
      return 'bg-[#DC143C] text-white hover:bg-[#dc143cc9]'
    } else {
      return ''
    }
  }

  return (
    <button id={id} 
    className={[
      'p-2 border rounded-lg',    
      typeActive,
    ].join(' ')}  
    
    
    {...rest}
      onClick={onClick} >
      {!loading ? (
        children
      ) : (
        <span>...</span>
      )}
    </button>
  )
}
