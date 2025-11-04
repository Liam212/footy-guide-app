import { useState } from 'react'
import { format, addDays, startOfToday, startOfWeek } from 'date-fns'

interface DateSelectorProps {
  onSelect: (date: Date) => void
  initialDate?: Date | 'start' | 'today'
}

export function DateSelector({ onSelect, initialDate }: DateSelectorProps) {
  const [startDate, setStartDate] = useState(startOfToday())
  const [selectedDate, setSelectedDate] = useState(
    initialDate === 'start'
      ? startOfWeek(new Date())
      : initialDate === 'today'
        ? startOfToday()
        : initialDate || startOfToday(),
  )

  const handleSelect = (date: Date) => {
    setSelectedDate(date)
    onSelect(date)
  }

  const handlePrev = () => {
    setStartDate(prev => addDays(prev, -7))
  }

  const handleNext = () => {
    setStartDate(prev => addDays(prev, 7))
  }

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i))

  return (
    <div className="flex items-center w-full bg-gray-200 p-2 rounded-lg mt-4">
      <button
        onClick={handlePrev}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        &#8592;
      </button>

      <div className="flex flex-1 mx-2 space-x-2">
        {days.map(day => {
          const isSelected = day.toDateString() === selectedDate.toDateString()

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleSelect(day)}
              className={`flex flex-col items-center p-2 rounded-lg transition w-full
            ${
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
              <span className="text-sm font-medium">{format(day, 'EEE')}</span>
              <span className="text-lg font-semibold">{format(day, 'd')}</span>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        &#8594;
      </button>
    </div>
  )
}
