import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Header } from "../header";
import Cookies from "js-cookie";

const Calendar = () => {
  const user = JSON.parse(Cookies.get("user") || "{}");
  const accessToken = Cookies.get("access_token");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{
    [key: string]: {
      id: number;
      title: string;
      description: string;
      startTime: string;
      endTime: string;
      color: string;
    }[];
  }>({});
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventSheet, setShowEventSheet] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    color: "blue",
  });

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthData = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = startOfMonth(currentDate);

    // Add previous month's days
    const prevMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const prevMonthDays = daysInMonth(prevMonth);

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          prevMonth.getFullYear(),
          prevMonth.getMonth(),
          prevMonthDays - i
        ),
        isCurrentMonth: false,
      });
    }

    // Add current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    // Add next month's days
    const remainingDays = 42 - days.length;
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/events/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const monthEvents = await response.json();

      const transformedEvents = monthEvents.reduce((acc, event) => {
        const dateKey = event.date;
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push({
          id: event.id,
          title: event.title,
          description: event.description,
          startTime: event.start_time,
          endTime: event.end_time,
          color: event.color,
        });
        return acc;
      }, {} as Record<string, any[]>);

      setEvents(transformedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleEventSubmit = async () => {
    if (!newEvent.title || !newEvent.date) return;

    const eventData = {
      title: newEvent.title,
      description: newEvent.description,
      date: formatDate(newEvent.date),
      start_time: newEvent.startTime,
      end_time: newEvent.endTime,
      color: newEvent.color,
    };

    try {
      if (editingEventId !== null) {
        // Update existing event
        const response = await fetch(
          `http://127.0.0.1:8000/events/${editingEventId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(eventData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update event");
        }
      } else {
        // Create new event
        const response = await fetch("http://127.0.0.1:8000/events/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          throw new Error("Failed to create event");
        }
      }

      // Refresh events and reset form
      await fetchEvents();
      resetEventForm();
      setShowEventDialog(false);
      setShowEventSheet(false);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/events/${eventId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        await fetchEvents();
        setShowEventSheet(false);
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEditEvent = (event: any, index: number, date: Date) => {
    setNewEvent({
      title: event.title,
      description: event.description,
      date: date,
      startTime: event.startTime,
      endTime: event.endTime,
      color: event.color,
    });
    setEditingEventId(event.id);
    setSelectedDate(date);
    setShowEventDialog(true);
    setShowEventSheet(false);
  };

  const resetEventForm = () => {
    setNewEvent({
      title: "",
      description: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      color: "blue",
    });
    setEditingEventId(null);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent((prev) => ({ ...prev, date: date }));
    setShowEventSheet(true);
  };

  const getDayEvents = (date: Date) => {
    const dateKey = formatDate(date);
    return events[dateKey] || [];
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, accessToken]);
  const handleOpenDialog = () => {
    if (selectedDate) {
      setNewEvent((prev) => ({
        ...prev,
        date: selectedDate,
        title: "",
        description: "",
        startTime: "09:00",
        endTime: "10:00",
        color: "blue",
      }));
      setEditingEventId(null);
      setShowEventDialog(true);
      setShowEventSheet(false);
    }
  };

  return (
    <>
      <Header />
      <Card className="p-4 sm:p-6 w-full max-w-9xl mx-auto mt-6 border-0 shadow-0">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg sm:text-2xl font-semibold">
                  {currentDate.toLocaleString("default", { month: "long" })}{" "}
                  {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedDate(new Date());
                  setNewEvent((prev) => ({ ...prev, date: new Date() }));
                  setEditingEventId(null);
                  setShowEventDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-gray-50 dark:bg-gray-800 p-2 text-center font-medium text-sm"
              >
                {day}
              </div>
            ))}

            {getMonthData().map(({ date, isCurrentMonth }, index) => (
              <div
                key={index}
                className={`h-16 sm:h-20 p-1 sm:p-2 bg-white dark:bg-gray-800 ${
                  isCurrentMonth ? "" : "text-gray-400"
                } hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors`}
                onClick={() => handleDateClick(date)}
              >
                <div className="font-medium text-sm sm:text-base mb-1">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {getDayEvents(date)
                    .slice(0, 2)
                    .map((event, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-1 rounded truncate bg-${event.color}-100 text-${event.color}-700 
                        dark:bg-${event.color}-900/20 dark:text-${event.color}-400 cursor-pointer hover:opacity-80`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event, idx, date);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  {getDayEvents(date).length > 2 && (
                    <div className="text-xs p-1 rounded truncate bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-pointer hover:opacity-80">
                      +{getDayEvents(date).length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <Dialog
          open={showEventDialog}
          onOpenChange={(open) => {
            setShowEventDialog(open);
            if (!open) resetEventForm();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEventId !== null ? "Edit Event" : "Add Event"}
              </DialogTitle>
              <DialogDescription>
                {editingEventId !== null
                  ? "Update your event details below."
                  : "Fill in the details for the new event."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Input
                type="date"
                value={formatDate(newEvent.date)}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  setNewEvent({
                    ...newEvent,
                    date: new Date(
                      parseInt(year),
                      parseInt(month) - 1,
                      parseInt(day)
                    ),
                  });
                }}
              />
              <Input
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <Input
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
              <Select
                value={newEvent.color}
                onValueChange={(color) => setNewEvent({ ...newEvent, color })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
                <Input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEventSubmit}>
                {editingEventId !== null ? "Update Event" : "Add Event"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEventDialog(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
          <SheetContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDate ? selectedDate.toDateString() : ""}
              </DialogTitle>
              <DialogDescription>
                {selectedDate ? (
                  getDayEvents(selectedDate).map((event, idx) => (
                    <div
                      key={idx}
                      className={`mb-2 p-2 rounded flex items-center justify-between cursor-pointer 
                      ${
                        event.color === "blue"
                          ? "bg-blue-100 text-blue-700"
                          : ""
                      } 
                      ${event.color === "red" ? "bg-red-100 text-red-700" : ""} 
                      ${
                        event.color === "green"
                          ? "bg-green-100 text-green-700"
                          : ""
                      } 
                      ${
                        event.color === "yellow"
                          ? "bg-yellow-100 text-yellow-700"
                          : ""
                      }`}
                    >
                      <div
                        className="flex-1"
                        onClick={() =>
                          handleEditEvent(event, idx, selectedDate)
                        }
                      >
                        <h3 className="font-semibold">{event.title}</h3>
                        <p>{event.description}</p>
                        <p className="text-xs">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id); // Pass the unique event ID here
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>No events for this date.</p>
                )}
                <Button onClick={handleOpenDialog}>
                  Add Event for {selectedDate?.toDateString()}
                </Button>
              </DialogDescription>
            </DialogHeader>
          </SheetContent>
        </Sheet>
      </Card>
    </>
  );
};

export default Calendar;
