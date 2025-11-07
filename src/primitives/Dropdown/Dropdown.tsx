import { useState } from 'react'
import { Check } from 'lucide-react'
import { BaseDropdown } from './BaseDropdown'

export interface DropdownOption<T extends string | number> {
  key: string
  value: T
  label?: string
}

interface DropdownProps<T extends string | number> {
  options: DropdownOption<T>[]
  value?: T
  onChange?: (value: T) => void
  placeholder?: string
  className?: string
}

export function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedLabel =
    options.find(o => o.value === value)?.label ?? placeholder

  return (
    <BaseDropdown
      label={
        <span className={value !== undefined ? '' : 'text-gray-500'}>
          {selectedLabel}
        </span>
      }
      isOpen={isOpen}
      onToggle={() => setIsOpen(o => !o)}
      className={className}>
      {options.map(opt => (
        <li
          key={opt.key}
          onClick={() => {
            onChange?.(opt.value)
            setIsOpen(false)
          }}
          className={`px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
            opt.value === value
              ? 'bg-blue-100 dark:bg-blue-600/30 font-semibold'
              : ''
          }`}>
          {opt.label}
          {opt.value === value && (
            <Check size={16} className="text-blue-600 dark:text-blue-400" />
          )}
        </li>
      ))}
    </BaseDropdown>
  )
}
