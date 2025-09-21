"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: 'start' | 'center' | 'end'
  className?: string
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

// Simple dropdown implementation without Radix dependency
const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child as React.ReactElement<DropdownMenuTriggerProps>, {
              onClick: () => setIsOpen(!isOpen)
            })
          }
          if (child.type === DropdownMenuContent) {
            return isOpen ? React.cloneElement(child as React.ReactElement<DropdownMenuContentProps>, {
              onClick: () => setIsOpen(false)
            }) : null
          }
        }
        return child
      })}
    </div>
  )
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ 
  children, 
  className, 
  onClick 
}) => {
  return (
    <button 
      className={cn("outline-none", className)} 
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({ 
  children, 
  align = 'start', 
  className 
}) => {
  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div className={cn(
      "absolute top-full mt-1 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      alignmentClasses[align],
      className
    )}>
      {children}
    </div>
  )
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({ 
  children, 
  asChild = false, 
  className 
}) => {
  if (asChild) {
    return React.Children.only(children) as React.ReactElement
  }

  return (
    <div className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
      className
    )}>
      {children}
    </div>
  )
}

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

// For compatibility, export other components as simple divs
const DropdownMenuGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
}