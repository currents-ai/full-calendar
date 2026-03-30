"use client"

import { useState } from "react"
import {
  addDays,
  addHours,
  format,
  setHours,
  setMinutes,
  subDays,
} from "date-fns"
import { CalendarEvent, EventCalendar } from "react-calendar"
import { toast } from "sonner"

import { EventDialog } from "@/components/event-dialog"
import ThemeToggle from "@/components/theme-toggle"

// Sample events data with hardcoded times
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Annual Planning",
    description:
      "Strategic planning for next year, aspect-based sentiment analysis subscription",
    start: subDays(new Date(), 24), // 24 days before today
    end: subDays(new Date(), 23), // 23 days before today
    allDay: true,
    color: "sky",
    location: "Main Conference Hall",
    tag: { label: "Done", color: "green" },
  },
  {
    id: "2",
    title: "Project Deadline, Submit final deliverables" ,
    description: "Submit final deliverables",
    start: setMinutes(setHours(subDays(new Date(), 9), 13), 0),
    end: setMinutes(setHours(subDays(new Date(), 9), 15), 30),
    color: "amber",
    location: "Office",
    tag: { label: "Urgent", color: "red" },
  },
  {
    id: "3",
    title: "Quarterly Budget Review",
    description: "Strategic planning for next year",
    start: subDays(new Date(), 13),
    end: subDays(new Date(), 13),
    allDay: true,
    color: "orange",
    location: "Main Conference Hall",
    tag: { label: "Done", color: "green" },
  },
  {
    id: "4",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(new Date(), 10), 0),
    end: setMinutes(setHours(new Date(), 11), 0),
    color: "sky",
    location: "Conference Room A",
    tag: { label: "In Progress", color: "blue" },
  },
  {
    id: "5",
    title: "Lunch with Client",
    description: "Discuss new project requirements",
    start: setMinutes(setHours(addDays(new Date(), 1), 12), 0),
    end: setMinutes(setHours(addDays(new Date(), 1), 13), 15),
    color: "emerald",
    location: "Downtown Cafe",
    tag: { label: "Confirmed", color: "emerald" },
  },
  {
    id: "6",
    title: "Product Launch",
    description: "New product release",
    start: addDays(new Date(), 3),
    end: addDays(new Date(), 6),
    allDay: true,
    color: "violet",
    tag: { label: "Draft", color: "amber" },
  },
  {
    id: "7",
    title: "Sales Conference",
    description: "Discuss about new clients",
    start: setMinutes(setHours(addDays(new Date(), 4), 14), 30),
    end: setMinutes(setHours(addDays(new Date(), 5), 14), 45),
    color: "rose",
    location: "Downtown Cafe",
    tag: { label: "Pending", color: "orange" },
  },
  {
    id: "8",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 0),
    end: setMinutes(setHours(addDays(new Date(), 5), 10), 30),
    color: "orange",
    location: "Conference Room A",
  },
  {
    id: "9",
    title: "Review contracts",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 14), 0),
    end: setMinutes(setHours(addDays(new Date(), 5), 15), 30),
    color: "sky",
    location: "Conference Room A",
    tag: { label: "Review", color: "violet" },
  },
  {
    id: "10",
    title: "Team Meeting",
    description: "Weekly team sync",
    start: setMinutes(setHours(addDays(new Date(), 5), 9), 45),
    end: setMinutes(setHours(addDays(new Date(), 5), 11), 0),
    color: "amber",
    location: "Conference Room A",
  },
  {
    id: "11",
    title: "Marketing Strategy Session",
    description: "Quarterly marketing planning",
    start: setMinutes(setHours(addDays(new Date(), 9), 10), 0),
    end: setMinutes(setHours(addDays(new Date(), 9), 15), 30),
    color: "emerald",
    location: "Marketing Department",
    tag: { label: "Confirmed", color: "emerald" },
  },
  {
    id: "12",
    title: "Annual Shareholders Meeting",
    description: "Presentation of yearly results",
    start: addDays(new Date(), 17),
    end: addDays(new Date(), 17),
    allDay: true,
    color: "sky",
    location: "Grand Conference Center",
    tag: { label: "Pending", color: "orange" },
  },
  {
    id: "13",
    title: "Product Development Workshop",
    description: "Brainstorming for new features",
    start: setMinutes(setHours(addDays(new Date(), 26), 9), 0),
    end: setMinutes(setHours(addDays(new Date(), 27), 17), 0),
    color: "rose",
    location: "Innovation Lab",
    tag: { label: "Draft", color: "amber" },
  },
]

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event])
  }

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    console.log('updatedEvent', updatedEvent)
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    )
  }

  // const handleEventDelete = (eventId: string) => {
  //   setEvents(events.filter((event) => event.id !== eventId))
  // }

  const handleEventSelect = (event: CalendarEvent) => {
    console.log("Event selected:", event) // Debug log
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const handleEventCreate = (startTime: Date) => {
    console.log("Creating new event at:", startTime) // Debug log

    // Snap to 15-minute intervals
    const minutes = startTime.getMinutes()
    const remainder = minutes % 15
    if (remainder !== 0) {
      if (remainder < 7.5) {
        // Round down to nearest 15 min
        startTime.setMinutes(minutes - remainder)
      } else {
        // Round up to nearest 15 min
        startTime.setMinutes(minutes + (15 - remainder))
      }
      startTime.setSeconds(0)
      startTime.setMilliseconds(0)
    }

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: startTime,
      end: addHours(startTime, 1),
      allDay: false,
    }
    setSelectedEvent(newEvent)
    setIsEventDialogOpen(true)
    handleEventAdd(newEvent)
  }

  const handleEventSave = (event: CalendarEvent) => {
    handleEventUpdate(event)
    if (event.id) {
      // onEventUpdate?.(event)
      // Show toast notification when an event is updated
      toast(`Event "${event.title}" updated`, {
        description: format(new Date(event.start), "MMM d, yyyy"),
        position: "bottom-left",
      })
    } else {
      // onEventAdd?.({
      //   ...event,
      //   id: Math.random().toString(36).substring(2, 11),
      // })
      // Show toast notification when an event is added
      toast(`Event "${event.title}" added`, {
        description: format(new Date(event.start), "MMM d, yyyy"),
        position: "bottom-left",
      })
    }
    setIsEventDialogOpen(false)
    setSelectedEvent(null)
  }
  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId)
    setIsEventDialogOpen(false)
    setSelectedEvent(null)
    setEvents(events.filter((event) => event.id !== eventId))
    // Show toast notification when an event is deleted
    if (deletedEvent) {
      toast(`Event "${deletedEvent.title}" deleted`, {
        description: format(new Date(deletedEvent.start), "MMM d, yyyy"),
        position: "bottom-left",
      })
    }
  }

  return (
    // Add min-h-screen to make it full height
    <div className="flex flex-col p-1 sm:p-4 md:p-8">
      <EventCalendar
        events={events}
        // onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        onEventSelect={handleEventSelect}
        onEventCreate={handleEventCreate}
        eventHeight={16}
      />
      <EventDialog
        event={selectedEvent}
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false)
          setSelectedEvent(null)
        }}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />
      <div className="mt-4">
        <ThemeToggle />
      </div>
    </div>
  )
}
