"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useTask } from "@/lib/task-context"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sparkles, Send, Loader2, Brain, Target, Clock } from "lucide-react"
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  contextUsed?: {
    userGoals?: string[]
    workingHours?: { start: string; end: string }
    modelUsed?: string
  }
}

interface TaskSuggestion {
  title: string
  category: string
  recurring: string
  priority: string
}

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI task assistant with memory. I can help you create tasks, track your goals, and provide personalized insights based on your work patterns. What would you like help with?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(`session_${Date.now()}`)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { tasks, addTask } = useTask()
  const { user } = useAuth()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (user && open) {
      loadUserProfile()
    }
  }, [user, open])

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${user?.id}`)
      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user) return

    // Check if API key is configured
    if (!userProfile?.geminiApiKey) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "🔑 **API Key Required**\n\nTo use the AI assistant, you need to configure your Gemini API key:\n\n1. Click on your profile menu (top right)\n2. Select 'AI Settings'\n3. Enter your Gemini API key\n4. Test the key to make sure it works\n\nYou can get a free API key from [Google AI Studio](https://aistudio.google.com/).",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          tasks: tasks.filter((t) => !t.parentTaskId),
          userId: user.id,
          sessionId,
        }),
      })

      const data = await response.json()

      if (data.error) {
        // Handle specific error cases
        if (data.error.includes('API key not configured')) {
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: "🔑 **API Key Required**\n\nTo use the AI assistant, you need to configure your Gemini API key:\n\n1. Click on your profile menu (top right)\n2. Select 'AI Settings'\n3. Enter your Gemini API key\n4. Test the key to make sure it works\n\nYou can get a free API key from [Google AI Studio](https://aistudio.google.com/).",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])
          return
        }
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        contextUsed: data.contextUsed,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Handle task suggestions
      if (data.taskSuggestions && data.taskSuggestions.length > 0) {
        data.taskSuggestions.forEach((suggestion: TaskSuggestion) => {
          if (suggestion.title && suggestion.category && suggestion.recurring) {
            addTask({
              title: suggestion.title,
              category: suggestion.category,
              recurring: suggestion.recurring.toLowerCase() as any,
              time: "09:00",
              completed: false,
              userId: user.id,
              recurrenceRule: { type: suggestion.recurring.toLowerCase() as any },
            })
          }
        })
      }
    } catch (error) {
      console.error("Error:", error)
      
      let errorContent = "Sorry, I encountered an error. Please try again."
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorContent = "🔑 **API Key Issue**\n\nThere's a problem with your Gemini API key. Please:\n\n1. Go to your profile settings\n2. Check your API key configuration\n3. Test the key to make sure it's valid\n4. Try again"
        } else if (error.message.includes('quota')) {
          errorContent = "📊 **API Quota Exceeded**\n\nYou've reached your API usage limit. Please check your Google AI Studio account or try again later."
        } else if (error.message.includes('permission')) {
          errorContent = "🚫 **Permission Error**\n\nYour API key doesn't have the required permissions. Please check your Google AI Studio settings."
        } else if (error.message.includes('billing')) {
          errorContent = "💳 **Billing Required**\n\nA billing account is required for this API. Please check your Google Cloud billing settings."
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getContextBadges = (contextUsed: any) => {
    if (!contextUsed) return null

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {contextUsed.userGoals && contextUsed.userGoals.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            Goals
          </Badge>
        )}
        {contextUsed.workingHours && (
          <Badge variant="secondary" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Schedule
          </Badge>
        )}
        {contextUsed.modelUsed && (
          <Badge variant="secondary" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            {contextUsed.modelUsed.includes('gemini') ? 'Gemini' : 'GPT'}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <>
      {isClient && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-purple-pastel hover:bg-purple-pastel/90 text-white fixed bottom-6 right-6 rounded-full shadow-lg">
              <Sparkles className="h-5 w-5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] h-[700px] flex flex-col glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-pastel" />
            AI Task Assistant
            {userProfile && (
              <Badge variant="outline" className="text-xs">
                {userProfile.preferredModel === 'gemini-flash-2.0' ? 'Gemini Flash 2.0' : 'GPT-4o Mini'}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Get personalized help with task management and productivity insights
            {userProfile?.userGoals?.length > 0 && (
              <span className="block text-xs text-muted-foreground mt-1">
                Tracking {userProfile.userGoals.length} goal{userProfile.userGoals.length !== 1 ? 's' : ''}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-purple-pastel text-white"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="text-sm prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                {message.contextUsed && getContextBadges(message.contextUsed)}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground border border-border px-4 py-2 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-border">
          <Input
            placeholder={userProfile?.geminiApiKey ? "Ask me anything about your tasks and goals..." : "Configure your API key first to start chatting..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || !userProfile?.geminiApiKey}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
      )}
    </>
  )
}
