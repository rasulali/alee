"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Optionally, return null or a fallback that matches your design.
    return null
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
