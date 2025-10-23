"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { formatDateDisplay } from "@/lib/calendar-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarHeaderProps {
  date: Date
  viewMode: "day" | "week"
  onPreviousClick: () => void
  onTodayClick: () => void
  onNextClick: () => void
  onViewModeChange: (mode: "day" | "week") => void
}

export function CalendarHeader({
  date,
  viewMode,
  onPreviousClick,
  onTodayClick,
  onNextClick,
  onViewModeChange,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">{formatDateDisplay(date)}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPreviousClick}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onTodayClick}>
          Today
        </Button>
        <Button variant="outline" size="sm" onClick={onNextClick}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Select value={viewMode} onValueChange={(value) => onViewModeChange(value as "day" | "week")}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day View</SelectItem>
          <SelectItem value="week">Week View</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
