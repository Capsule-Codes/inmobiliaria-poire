"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AutocompleteOption = string

export interface AutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string
  onValueChange?: (value: string) => void
  options: AutocompleteOption[]  
  minChars?: number  
  emptyMessage?: string
}

export const Autocomplete = React.forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      value = "",
      onValueChange,
      options,
      minChars = 3,
      emptyMessage = "Sin resultados",
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const [isFocused, setIsFocused] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)
    const skipAutoOpenRef = React.useRef(true)

    const getFilteredOptions = React.useCallback(
      (query: string) => {
        const trimmed = query.trim()
        if (!trimmed || trimmed.length < minChars) return []
        const needle = trimmed.toLowerCase()
        const unique = new Set<string>()
        return options.filter((option) => {
          const normalized = option.trim()
          if (!normalized) return false
          const candidate = normalized.toLowerCase()
          if (!candidate.includes(needle)) return false
          if (unique.has(candidate)) return false
          unique.add(candidate)
          return true
        })
      },
      [options, minChars]
    )

    const filteredOptions = React.useMemo(
      () => getFilteredOptions(value ?? ""),
      [getFilteredOptions, value]
    )

    const showEmptyState =
      isFocused &&
      !disabled &&
      (value ?? "").trim().length >= minChars &&
      filteredOptions.length === 0

    React.useEffect(() => {
      if (skipAutoOpenRef.current || disabled) return
      const shouldOpen = filteredOptions.length > 0
      setIsOpen(shouldOpen)
      if (!shouldOpen) {
        setHighlightedIndex(0)
      }
    }, [disabled, filteredOptions])

    React.useEffect(() => {
      if (!isOpen) return
      function handlePointerDown(event: PointerEvent) {
        if (!containerRef.current) return
        if (containerRef.current.contains(event.target as Node)) return
        setIsOpen(false)
      }
      window.addEventListener("pointerdown", handlePointerDown)
      return () => {
        window.removeEventListener("pointerdown", handlePointerDown)
      }
    }, [isOpen])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value
      skipAutoOpenRef.current = false
      onValueChange?.(nextValue)
      const nextOptions = getFilteredOptions(nextValue)
      if (!disabled && nextOptions.length > 0) {
        setIsOpen(true)
        setHighlightedIndex(0)
      } else {
        setIsOpen(false)
      }
    }

    const handleSelect = (option: string) => {
      skipAutoOpenRef.current = true
      onValueChange?.(option)
      setIsOpen(false)
      setHighlightedIndex(0)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || filteredOptions.length === 0) return
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % filteredOptions.length)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setHighlightedIndex((prev) =>
          prev === 0 ? filteredOptions.length - 1 : prev - 1
        )
      } else if (event.key === "Enter") {
        event.preventDefault()
        const option = filteredOptions[highlightedIndex]
        if (option) handleSelect(option)
      } else if (event.key === "Escape") {
        if (isOpen) {
          event.preventDefault()
          setIsOpen(false)
        }
      }
    }

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      rest.onBlur?.(event)      
      setTimeout(() => {
        const isStillInside = containerRef.current?.contains(document.activeElement)
        if (!isStillInside) {
          setIsOpen(false)
          setIsFocused(false)
        }
      }, 0)
    }

    return (
      <div ref={containerRef} className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className={className}
          disabled={disabled}
          autoComplete="off"
          {...rest}
        />

        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
            <ul className="max-h-56 overflow-auto py-1 text-sm">
              {filteredOptions.map((option, index) => {
                const isActive = index === highlightedIndex
                return (
                  <li key={`${option}-${index}`}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 px-3 py-2 text-left transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted"
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {showEmptyState && (
          <div className="absolute z-40 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-lg px-3 py-2 text-sm">
            {emptyMessage}
          </div>
        )}
      </div>
    )
  }
)

Autocomplete.displayName = "Autocomplete"
