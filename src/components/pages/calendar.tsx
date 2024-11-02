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
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // Assuming you have a Sheet component
import { Header } from "../header";
import { calendarService } from "./calendar/calendarapi";
import Cookies from "js-cookie";

const Calendar = () => {
  const user = JSON.parse(Cookies.get("user") || "{}"); // Retrieve user data from cookies
  const accessToken = Cookies.get("access_token"); // Retrieve access token from cookies
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
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventIndex, setEditingEventIndex] = useState<number | null>(
    null
  );
  const [showEventSheet, setShowEventSheet] = useState(false);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const startOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(), // Set default date to current date
    startTime: "09:00",
    endTime: "10:00",
    color: "blue",
  });
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
    const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
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
    if (selectedDate) {
      setNewEvent((prevEvent) => ({ ...prevEvent, date: selectedDate }));
    }
  }, [selectedDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    resetEventForm();
    setNewEvent((prev) => ({ ...prev, date: date })); // Set the correct date here
    setShowEventSheet(true);
  };

  const handleOpenDialog = () => {
    setSelectedDate(selectedDate || new Date()); // Default to today's date if none selected
    setNewEvent((prev) => ({ ...prev, date: selectedDate || new Date() }));
    setShowEventDialog(true);
  };

  const handleAddEvent = async () => {
    if (newEvent.date && newEvent.title) {
      try {
        const eventData = {
          title: newEvent.title,
          description: newEvent.description,
          date: formatDate(newEvent.date),
          start_time: newEvent.startTime,
          end_time: newEvent.endTime,
          color: newEvent.color,
        };

        const response = await fetch("http://127.0.0.1:8000/events/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(eventData),
        });
        const result = await response.json();
        console.log(result);

        // Refresh events and reset form
        fetchEvents();
        resetEventForm();
        setShowEventDialog(false);
      } catch (error) {
        console.error("Failed to create event:", error);
      }
    }
  };
  const handleUpdateEvent = async (eventId: number) => {
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        date: formatDate(newEvent.date),
        start_time: newEvent.startTime,
        end_time: newEvent.endTime,
        color: newEvent.color,
      };

      const response = await fetch(`http://127.0.0.1:8000/events/${eventId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your-jwt-token",
        },
        body: JSON.stringify(eventData),
      });
      const result = await response.json();
      console.log(result);

      // Refresh events and reset form
      fetchEvents();
      resetEventForm();
      setShowEventDialog(false);
    } catch (error) {
      console.error("Failed to update event:", error);
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
        console.log("Event deleted successfully");
        fetchEvents();
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const getDayEvents = (date: Date) => {
    const dateKey = formatDate(date);

    console.log(dateKey, events);
    return events[dateKey] || [];
  };

  const handleEditEvent = (event, index, date) => {
    setNewEvent({
      ...event,
      date: date, // Set the date for the event being edited
    });
    setIsEditing(true);
    setEditingEventIndex(index);
    setSelectedDate(date); // Keep the date context for the selected event
    setShowEventDialog(true); // Open the dialog to edit the event
  };

  const resetEventForm = () => {
    setNewEvent({
      title: "",
      description: "",
      date: new Date(), // Reset to current date
      startTime: "09:00",
      endTime: "10:00",
      color: "blue",
    });
    setIsEditing(false);
    setEditingEventIndex(null);
  };

  useEffect(() => {
    fetchEvents();
  }, [currentDate, accessToken]);

  return (
    <>
      <Header />
      <Card className="p-4 sm:p-6 w-full max-w-7xl mx-auto">
        {/* Calendar Header */}
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
                  setNewEvent((prev) => ({ ...prev, date: new Date() })); // Set the date to the current date
                  setShowEventDialog(true); // Open dialog to add a new event
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Calendar Grid */}
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {/* Week day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="bg-gray-50 dark:bg-gray-800 p-2 text-center font-medium text-sm"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
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
                          handleEditEvent(event, event.id, date); // Pass date for editing
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

        {/* Event Dialog */}
        <Dialog
          open={showEventDialog}
          onOpenChange={(open) => {
            setShowEventDialog(open);
            if (!open) resetEventForm();
          }}
        >
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Event" : "Add Event"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update your event details below."
                  : "Fill in the details for the new event."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {/* Date Input */}
              <Input
                type="date"
                value={newEvent.date.toLocaleDateString("en-CA")} // 'en-CA' gives YYYY-MM-DD format
                autoFocus={true}
                onChange={(e) => {
                  const parts = e.target.value.split("-");
                  const localDate = new Date(parts[0], parts[1] - 1, parts[2]); // Create local date from input
                  setNewEvent({ ...newEvent, date: localDate });
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
              <Button onClick={handleUpdateEvent}>
                {isEditing ? "Update Event" : "Add Event"}
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

        {/* ShadCN Sheet */}
        <Sheet open={showEventSheet} onOpenChange={setShowEventSheet}>
          <SheetTrigger />
          <SheetContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDate ? selectedDate.toDateString() : ""}
              </DialogTitle>
              <DialogDescription>
                {/* Display events for the selected date */}
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
