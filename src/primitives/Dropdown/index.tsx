import { useState, useEffect, useRef } from 'react'
import { Check, X, ChevronDown } from 'lucide-react'

interface DropdownOption {
  key: string
  value: string | number
  label?: string
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string | number | (string | number)[]
  onChange?: (value: string | number | (string | number)[]) => void
  placeholder?: string
  className?: string
  multiSelect?: boolean
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  multiSelect = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(value) ? value : value ? [value] : [],
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 🧠 Normalize all options to include a label
  const normalizedOptions: DropdownOption[] =
    typeof options[0] === 'string'
      ? (options as string[]).map(o => ({ key: o, value: o, label: o }))
      : (options as DropdownOption[]).map(o => ({
          key: o.key,
          value: o.value,
          label: o.label ?? o.value,
        }))

  // 🖱️ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 🧩 Selection logic
  const handleSelect = (opt: DropdownOption) => {
    const val = opt.value

    if (multiSelect) {
      const updated = selected.includes(val)
        ? selected.filter(v => v !== val)
        : [...selected, val]
      setSelected(updated)
      onChange?.(updated)
    } else {
      setSelected([val])
      onChange?.(val)
      setIsOpen(false)
    }
  }

  // 🗑️ Remove tag (for multi-select)
  const handleRemove = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = selected.filter(v => v !== val)
    setSelected(updated)
    onChange?.(updated)
  }

  // 🏷️ Helper to get the label for a value
  const getLabel = (val: string) =>
    normalizedOptions.find(o => o.value === val)?.label ?? val

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex justify-between items-center text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
        <div className="flex flex-wrap gap-1 items-center">
          {multiSelect && selected.length > 0 ? (
            selected.map(val => (
              <span
                key={val}
                className="flex items-center bg-blue-500 text-white px-2 py-0.5 rounded-full text-sm font-medium">
                {getLabel(val)}
                <button
                  onClick={e => handleRemove(val, e)}
                  className="ml-1 focus:outline-none hover:text-gray-200"
                  aria-label={`Remove ${val}`}>
                  <X size={14} />
                </button>
              </span>
            ))
          ) : (
            <span className={selected.length ? '' : 'text-gray-500'}>
              {selected[0] ? getLabel(selected[0]) : placeholder}
            </span>
          )}
        </div>
        <ChevronDown size={18} className="ml-2 opacity-70" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {normalizedOptions.map(opt => {
            const isSelected = selected.includes(opt.value)
            return (
              <li
                key={opt.key}
                onClick={() => handleSelect(opt)}
                role="option"
                aria-selected={isSelected}
                className={`px-3 py-2 flex justify-between items-center cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-600/30 font-semibold'
                    : ''
                }`}>
                {opt.label}
                {isSelected && (
                  <Check
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
