/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonHTMLAttributes, ReactNode } from 'react'


export interface ButtonProps {
  id: string
  children: ReactNode
  loading?: boolean
  onClick?: (e:any) => void;
  rest?: ButtonHTMLAttributes<HTMLButtonElement>
}

export function Button({
  id,
  children,
  loading = false,
  onClick,
  ...rest
}: ButtonProps) {

  return (
    <button id={id} className='p-2 bg-gray-300 hover:bg-gray-700 text-gray-800  border border-slate-400 rounded-lg'
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
