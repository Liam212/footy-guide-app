import { useMemo, useState } from 'react'
import {
  format,
  addDays,
  startOfToday,
  startOfWeek,
  isSameDay,
  startOfDay,
} from 'date-fns'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'

interface DateSelectorProps {
  onSelect: (date: Date) => void
  initialDate?: Date | 'start' | 'today'
  onMouseEnterDate?: (date: Date) => void
}

export function DateSelector({
  onSelect,
  initialDate,
  onMouseEnterDate,
}: DateSelectorProps) {
  const [startDate, setStartDate] = useState(startOfToday())
  const [selectedDate, setSelectedDate] = useState(
    initialDate === 'start'
      ? startOfWeek(new Date())
      : initialDate === 'today'
        ? startOfToday()
        : initialDate || startOfToday(),
  )

  const dateToday = useMemo(() => startOfDay(new Date()), [])

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
    <div className="flex flex-col items-center w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mt-4">
      <p className="font-semibold dark:text-white text-center">
        {format(selectedDate, 'MMMM yyyy')}
      </p>

      <div className="flex items-center w-full mt-4 justify-between sm:justify-center">
        <button
          onClick={handlePrev}
          aria-label="Previous week"
          className="text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
          <ArrowLeft />
        </button>

        <div className="flex-1 mx-2 overflow-x-auto no-scrollbar px-3 sm:px-0">
          <div className="flex flex-nowrap space-x-2 justify-start sm:justify-center">
            {days.map(day => {
              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, dateToday)

              return (
                <button
                  key={day.getTime()}
                  onClick={() => handleSelect(day)}
                  onMouseEnter={() => onMouseEnterDate?.(day)}
                  className={`flex flex-col items-center p-2 min-w-[3rem] rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                  ${isToday && !isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                `}>
                  <span className="text-sm font-medium">
                    {format(day, 'EEE')}
                  </span>
                  <span className="text-lg font-semibold">
                    {format(day, 'd')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleNext}
          aria-label="Next week"
          className="text-white p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500">
          <ArrowRight />
        </button>
      </div>

      <button
        type="button"
        onClick={() => handleSelect(dateToday)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1
             text-sm font-medium text-gray-600 dark:text-gray-300
             hover:bg-gray-200 dark:hover:bg-gray-700
             focus:outline-none focus:ring-2 focus:ring-blue-500">
        <Calendar size={14} />
        Today
      </button>
    </div>
  )
}
