import { useEffect, useState } from 'react'

/**
 * https://github.com/TanStack/table/blob/f79330e80e5efa3c3c8680a3afa4cba193dad015/examples/react/filters/src/main.tsx#L400-L427
 * @param {{value: string | number, onChange: (value: string | number) => void, debounce?: number} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>}
 */
export function DebouncedInput ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
