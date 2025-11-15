import * as React from 'react'
import { cn } from '@/lib/utils'

interface Tiny5ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

function Tiny5Button({
  className,
  children,
  ...props
}: Tiny5ButtonProps) {
  return (
    <button
      style={{ fontFamily: 'var(--font-tiny5)' }}
      className={cn(
        "leading-3 text-base",
        "px-0.5 py-0",
        "cursor-pointer",
        "opacity-50",
        "hover:opacity-100",
        "hover:text-red-500",
        "transition-all",
        "bg-transparent",
        "border-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Tiny5Button }
