import React from 'react'

type Props = {
    text: string, 
    as: keyof JSX.IntrinsicElements,
    className?: string 
}

export default function Title({text, as, className}: Props) {
  return React.createElement(as, {className}, text)
}