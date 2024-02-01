/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonHTMLAttributes, ReactNode } from 'react'


export interface ButtonProps {
  id: string
  typeButton?: 'new' | 'old'
  children: ReactNode
  loading?: boolean
  onClick?: (e:any) => void;
  rest?: ButtonHTMLAttributes<HTMLButtonElement>
}

export function ButtonClip({
  id,
  typeButton = 'new',
  children,
  loading = false,
  onClick,
  ...rest
}: ButtonProps) {
  const typeActive = verifyColor()

  function verifyColor() {
    if (typeButton === 'new') {
      return 'border rounded-lg bg-[#67C23A] hover:bg-gray-800 text-white-500 border-slate-400'
    } else if (typeButton === 'old') {
      return 'border rounded-lg bg-[#67C23A] hover:bg-red-800 text-white-500 border-red-400'
    } else {
      return ''
    }
  }

  return (
    <button id={id} {...rest} onClick={onClick}
    className={[typeActive,].join(' ')}  
    >
      {!loading ? (
        children
      ) : (
        <span>...</span>
      )}
    </button>
  )
}
