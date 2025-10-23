"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Home, 
  BarChart3, 
  Calendar, 
  Target, 
  Users, 
  Settings, 
  Menu,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserProfileSettings } from "@/components/user-profile-settings"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SidebarNavProps {
  children: React.ReactNode
}

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Todos", href: "/todos", icon: Target },
  { name: "Users", href: "/users", icon: Users },
]

export function SidebarNav({ children }: SidebarNavProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col ">
      {/* Logo */}
      <div className={`flex h-20 items-center border-b border-sidebar-border px-6 ${isCollapsed ? 'justify-center' : 'justify-between'} `}>
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/timelock.png"
              alt="Time Lock Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Time Lock</h2>
              <p className="text-xs text-muted-foreground">Task Management</p>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/timelock.png"
              alt="Time Lock Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
          </Link>
        )}
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="h-8 w-8 p-0 hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 p-6 ${isCollapsed ? 'px-5 pr-10' : ''}`}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm"
              } ${isCollapsed ? 'justify-center px-3 sidebar-tooltip' : ''}`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Menu */}
      <div className={`border-t border-sidebar-border p-6 ${isCollapsed ? 'px-4' : ''}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm transition-all duration-200 ${
                isCollapsed ? 'w-full justify-center px-3 sidebar-tooltip' : 'w-full'
              }`}
              title={isCollapsed ? `${user?.name || "User"} - ${user?.email}` : undefined}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-sidebar-foreground">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              AI Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )

  return (
    <>
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className={`hidden md:flex md:flex-col transition-all duration-300 ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}>
          <div className="flex min-h-0 flex-1 flex-col floating-sidebar mx-4 my-4 rounded-2xl">
            <SidebarContent />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden fixed top-4 left-4 z-50 bg-card shadow-lg"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0 bg-sidebar border-sidebar-border">
            <div className="mx-4 my-4 rounded-2xl floating-sidebar h-[calc(100vh-2rem)]">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
            <div>
              <h1 className="text-lg font-semibold">Time Lock</h1>
              <p className="text-sm text-muted-foreground">
                Good morning, {user?.name || "User"}
              </p>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-pastel" />
              AI Assistant Settings
            </DialogTitle>
            <DialogDescription>
              Configure your AI assistant preferences, API keys, and personal goals
            </DialogDescription>
          </DialogHeader>
          <UserProfileSettings />
        </DialogContent>
      </Dialog>
    </>
  )
}
