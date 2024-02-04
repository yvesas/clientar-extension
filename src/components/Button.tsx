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
      return 'bg-gray-300 hover:bg-gray-800 text-gray-800 border-slate-400'
    } else if (typeButton === 'secondary') {
      return 'bg-gray-300 hover:bg-gray-800 text-gray-800 border-slate-400'
    } else if (typeButton === 'danger') {
      return 'bg-red-400 hover:bg-red-800 text-gray-100 border-red-400'
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
