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
  console.log('<><>> CREATE  BUTTON clip > ')
  const typeActive = verifyColor()

  function verifyColor() {
    if (typeButton === 'new') {
      return 'clip-btn-n'
    } else if (typeButton === 'old') {
      return 'clip-btn-o'
    } else {
      return ''
    }
  }

  return (
    <button id={id} {...rest} data-extapp="clipbtn" onClick={onClick}
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
