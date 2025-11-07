import { useEffect, useRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface BaseDropdownProps {
  label: ReactNode
  isOpen: boolean
  onToggle: () => void
  onClose?: () => void
  children: ReactNode
  className?: string
}

export function BaseDropdown({
  label,
  isOpen,
  onToggle,
  onClose,
  children,
  className = '',
}: BaseDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          onClose?.()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onToggle])

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex justify-between items-center text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
        {label}
        <ChevronDown size={18} className="ml-2 opacity-70" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {children}
        </ul>
      )}
    </div>
  )
}
