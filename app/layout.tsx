import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { TaskProvider } from "@/lib/task-context"
import { AIAssistant } from "@/components/ai-assistant"
import { ConditionalLayout } from "@/components/conditional-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Time Lock - Task Management",
  description: "A modern task management application with MongoDB integration and beautiful multi-color theme",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <TaskProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <AIAssistant />
          </TaskProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
