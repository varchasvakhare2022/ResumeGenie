import { useEffect, useRef } from 'react'
import { useDebounce } from './useDebounce'

export function useAutoSave<T>(
  value: T,
  onSave: (value: T) => void,
  delay: number = 400
) {
  const debouncedValue = useDebounce(value, delay)
  const isFirstRender = useRef(true)
  const previousValueRef = useRef<T | undefined>(undefined)

  useEffect(() => {
    // Skip first render to avoid saving on mount
    if (isFirstRender.current) {
      isFirstRender.current = false
      previousValueRef.current = debouncedValue
      return
    }

    // Only save if value has actually changed (deep comparison for objects)
    if (debouncedValue !== undefined && debouncedValue !== null) {
      const hasChanged = JSON.stringify(previousValueRef.current) !== JSON.stringify(debouncedValue)
      
      if (hasChanged) {
        previousValueRef.current = debouncedValue
        onSave(debouncedValue)
      }
    }
  }, [debouncedValue, onSave])
}

