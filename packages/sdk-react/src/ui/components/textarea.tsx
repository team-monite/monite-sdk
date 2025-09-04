import * as React from "react"

import { cn } from "@/ui/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "mtw:border-input mtw:placeholder:text-muted-foreground mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:aria-invalid:ring-destructive/20 mtw:dark:aria-invalid:ring-destructive/40 mtw:aria-invalid:border-destructive mtw:dark:bg-input/30 mtw:flex mtw:field-sizing-content mtw:min-h-16 mtw:w-full mtw:rounded-md mtw:border mtw:bg-transparent mtw:px-3 mtw:py-2 mtw:text-base mtw:shadow-xs mtw:transition-[color,box-shadow] mtw:outline-none mtw:focus-visible:ring-[3px] mtw:disabled:cursor-not-allowed mtw:disabled:opacity-50 mtw:md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
