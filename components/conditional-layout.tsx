"use client"

import { usePathname } from "next/navigation"
import { SidebarNav } from "@/components/sidebar-nav"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Routes that should not have sidebar
  const noSidebarRoutes = ['/login', '/signup']
  
  // Check if current route should not have sidebar
  const shouldHideSidebar = noSidebarRoutes.includes(pathname)
  
  if (shouldHideSidebar) {
    return <>{children}</>
  }
  
  // For all other routes, show sidebar
  return (
    <SidebarNav>
      {children}
    </SidebarNav>
  )
}
