import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Link } from "lucide-react";
import Cookies from "js-cookie";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  color: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);
  const accessToken = Cookies.get("access_token");
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:8000/events/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Function to get background opacity
  const getBackgroundColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-500",
      red: "bg-red-500",
      green: "bg-green-500",
      yellow: "bg-yellow-400",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      orange: "bg-orange-400",
      gray: "bg-gray-500",
    };
    return colors[color.toLowerCase()] || "bg-gray-100";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Loading upcoming events...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>Upcoming events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className={`rounded-lg transition-all hover:shadow-lg ${getBackgroundColor(
              event.color
            )} `}
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-lg">{event.title}</h4>
                <p className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <p className={`text-sm opacity-90`}>
                {event.description.length > 50
                  ? `${event.description.substring(0, 50)}...`
                  : event.description}
              </p>
              <div className="flex justify-between items-center">
                <p className={`text-xs opacity-90`}>
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center text-gray-500">No upcoming events</p>
        )}
      </CardContent>
    </Card>
  );
}
