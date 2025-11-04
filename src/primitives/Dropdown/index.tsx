import { useState } from 'react'

interface DropdownProps {
  options: string[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (val: string) => {
    onChange?.(val)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 rounded-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
        <span>{value || placeholder}</span>
        <span className="ml-2">&#9662;</span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 rounded-lg max-h-60 overflow-auto shadow-lg">
          {options.map(opt => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition">
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
