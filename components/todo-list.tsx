"use client"

import { useState } from "react"
import { useTask } from "@/lib/task-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Star, Zap, Target } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function TodoList() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoComplete, getPointsForPriority } = useTask()
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    category: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) return

    const points = getPointsForPriority(newTodo.priority)
    
    await addTodo({
      title: newTodo.title.trim(),
      description: newTodo.description.trim() || undefined,
      priority: newTodo.priority,
      points,
      completed: false,
      userId: "default-user", // In a real app, this would come from auth context
      category: newTodo.category.trim() || undefined
    })

    setNewTodo({
      title: "",
      description: "",
      priority: "medium",
      category: ""
    })
    setIsDialogOpen(false)
  }

  const getPriorityIcon = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low": return <Target className="h-3 w-3" />
      case "medium": return <Zap className="h-3 w-3" />
      case "high": return <Star className="h-3 w-3" />
    }
  }

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low": return "bg-blue-pastel text-blue-900"
      case "medium": return "bg-orange-pastel text-orange-900"
      case "high": return "bg-red-pastel text-red-900"
    }
  }

  const completedTodos = todos.filter(todo => todo.completed)
  const pendingTodos = todos.filter(todo => !todo.completed)

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Todos</h2>
          <p className="text-sm text-muted-foreground">
            {pendingTodos.length} pending, {completedTodos.length} completed
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-pastel hover:bg-purple-pastel/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Todo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter todo title..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newTodo.priority} onValueChange={(value: "low" | "medium" | "high") => 
                  setNewTodo(prev => ({ ...prev, priority: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (1 point)</SelectItem>
                    <SelectItem value="medium">Medium (3 points)</SelectItem>
                    <SelectItem value="high">High (5 points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  value={newTodo.category}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Work, Personal, Health..."
                />
              </div>
              
              <Button onClick={handleAddTodo} className="w-full bg-purple-pastel hover:bg-purple-pastel/90 text-white">
                Add Todo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <Card className="glass-card gradient-blue border-blue-pastel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Pending Todos ({pendingTodos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTodos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodoComplete(todo.id)}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{todo.title}</h3>
                    <Badge className={`${getPriorityColor(todo.priority)} text-xs`}>
                      {getPriorityIcon(todo.priority)}
                      <span className="ml-1">{todo.priority}</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {todo.points} pts
                    </Badge>
                  </div>
                  
                  {todo.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{todo.description}</p>
                  )}
                  
                  {todo.category && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {todo.category}
                    </Badge>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <Card className="glass-card gradient-pink border-pink-pastel">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Completed Todos ({completedTodos.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedTodos.map((todo) => (
              <div key={todo.id} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border opacity-75">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodoComplete(todo.id)}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate line-through">{todo.title}</h3>
                    <Badge className={`${getPriorityColor(todo.priority)} text-xs`}>
                      {getPriorityIcon(todo.priority)}
                      <span className="ml-1">{todo.priority}</span>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {todo.points} pts
                    </Badge>
                  </div>
                  
                  {todo.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 line-through">{todo.description}</p>
                  )}
                  
                  {todo.category && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {todo.category}
                    </Badge>
                  )}
                  
                  {todo.completedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed: {new Date(todo.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {todos.length === 0 && (
        <Card className="glass-card gradient-purple border-purple-pastel">
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground mb-4">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <h3 className="text-lg font-medium">No todos yet</h3>
              <p className="text-sm">Create your first todo to start earning points!</p>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-purple-pastel hover:bg-purple-pastel/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Todo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
