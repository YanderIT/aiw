"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({ 
  id,
  value, 
  onChange, 
  placeholder = "选择日期",
  className,
  disabled = false
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()

  // 初始化时设置日期
  React.useEffect(() => {
    if (value) {
      const dateValue = new Date(value)
      if (!isNaN(dateValue.getTime())) {
        setDate(dateValue)
      }
    }
  }, [value])

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate && onChange) {
      // 格式化为 YYYY-MM-DD 格式
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      onChange(formattedDate)
    } else if (!selectedDate && onChange) {
      onChange("")
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "justify-start text-left font-normal h-14 text-lg border-gray-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "yyyy年MM月dd日") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          captionLayout="dropdown"
          endMonth={new Date(2040, 11)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
} 