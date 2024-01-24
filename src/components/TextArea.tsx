import { TextareaHTMLAttributes } from 'react'

export interface TextAreaProps {
  id: string
  value: string
  rest?: TextareaHTMLAttributes<HTMLAreaElement>
}

export function TextArea({ id, value, ...rest }: TextAreaProps) {
  return (
    <textarea id={id}
    value={value}
    {...rest}
    style={{
      border: '1px solid black',
      borderRadius: '5px',
    }}
    >
    </textarea>
  )
}