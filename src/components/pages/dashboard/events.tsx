import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventsData } from "../dashboard"; // Assuming you have the events data imported
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Link } from "lucide-react";

export function UpcomingEvents({ events }: { events: EventsData[] }) {
  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Upcoming events
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/assignment">
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
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
