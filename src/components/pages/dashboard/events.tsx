import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventsData } from "../dashboard"; // Assuming you have the events data imported

export function UpcomingEvents({ events }: { events: EventsData[] }) {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {events.map((event, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{event.name}</p>
              <p className="text-sm text-muted-foreground">
                {event.description.substring(0, 20) + "..."}
              </p>
            </div>
            <div className="ml-auto font-medium  text-customPurple">
            {new Date(event.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
