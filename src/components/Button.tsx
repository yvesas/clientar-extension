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
    <button id={id} style={{
      padding: '5px',
      backgroundColor: 'white',
    }}
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