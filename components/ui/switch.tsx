"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-muted data-[state=unchecked]:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=checked]:bg-muted dark:data-[state=unchecked]:bg-muted inline-flex h-[1.15rem] w-9 shrink-0 items-center rounded-full border border-border shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-[18px] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-secondary/40 data-[state=checked]:bg-secondary"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
