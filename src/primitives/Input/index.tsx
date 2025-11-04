export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`px-3 py-2 rounded-lg border border-gray-200 
        bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        hover:bg-gray-200 dark:hover:bg-gray-700 transition w-full
        ${props.className ?? ''}`}
    />
  )
}
