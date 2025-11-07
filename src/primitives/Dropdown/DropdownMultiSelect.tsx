import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { BaseDropdown } from './BaseDropdown'
import type { DropdownOption } from './Dropdown'

interface MultiDropdownProps<T extends string | number> {
  options: DropdownOption<T>[]
  value?: T[]
  onChange?: (value: T[]) => void
  placeholder?: string
  className?: string
  searchable?: boolean
}

export function DropdownMultiSelect<T extends string | number>({
  options,
  value = [],
  onChange,
  placeholder = 'Select...',
  className = '',
  searchable = false,
}: MultiDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleValue = (val: T) => {
    const newValues = value.includes(val)
      ? value.filter(v => v !== val)
      : [...value, val]
    onChange?.(newValues)
    setSearchTerm('')
  }

  const getLabel = (val: T) =>
    options.find(o => o.value === val)?.label ?? String(val)

  const filteredOptions = searchTerm
    ? options.filter(o =>
        (o.label ?? String(o.value))
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      )
    : options

  useEffect(() => {
    if (!searchable) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const input = inputRef.current

      if (input?.value) return

      if (e.key.length === 1 || e.key === 'Backspace') {
        setIsOpen(true)

        setTimeout(() => {
          if (input) {
            input.focus()
            if (e.key.length === 1) {
              input.value = e.key
              setSearchTerm(e.key)
            }
          }
        }, 0)

        e.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchable])

  return (
    <BaseDropdown
      label={
        <div className="flex flex-wrap gap-1 items-center">
          {value.length > 0 ? (
            value.map(val => (
              <span
                key={val}
                className="flex items-center bg-blue-500 text-white px-2 py-0.5 rounded-full text-sm font-medium">
                {getLabel(val)}
                <span
                  onClick={e => {
                    e.stopPropagation()
                    toggleValue(val)
                  }}
                  className="ml-1 cursor-pointer hover:text-gray-200"
                  aria-label={`Remove ${val}`}>
                  <X size={14} />
                </span>
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
      }
      isOpen={isOpen}
      onToggle={() => setIsOpen(o => !o)}
      onClose={() => setIsOpen(false)}
      className={className}>
      {searchable && (
        <li className="px-3 py-2 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </li>
      )}

      {filteredOptions.map(opt => {
        const isSelected = value.includes(opt.value)
        return (
          <li
            key={opt.key}
            onClick={() => toggleValue(opt.value)}
            className={`text-white px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
              isSelected ? 'bg-blue-100 dark:bg-blue-600/30 font-semibold' : ''
            }`}>
            {opt.label}
            {isSelected && (
              <Check size={16} className="text-blue-600 dark:text-blue-400" />
            )}
          </li>
        )
      })}
    </BaseDropdown>
  )
}
