import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AttendanceCard } from "./dashboard/pie";
import { Header } from "../header";
import { ArrowUpRight } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { UpcomingEvents } from "./dashboard/events";

export interface DashChartData {
  name: string;
  total_class: number;
  present: number;
  absent: number;
  fill?: string;
}

export interface AssignmentTableData {
  task: string;
  course: string;
  duedate: Date;
}

export interface EventsData {
  name: string;
  date: Date;
  description: string;
}

const events: EventsData[] = [
  {
    name: "Tech Innovation Conference",
    date: new Date("2024-10-15"),
    description:
      "A conference showcasing the latest in tech innovations, including AI, blockchain, and more.",
  },
  {
    name: "AI Workshop",
    date: new Date("2024-11-05"),
    description:
      "A hands-on workshop focused on AI and machine learning tools and applications.",
  },
  {
    name: "Hackathon 2024",
    date: new Date("2024-12-01"),
    description:
      "A 48-hour hackathon where participants solve real-world problems using coding skills.",
  },
  {
    name: "Career Fair 2024",
    date: new Date("2024-09-30"),
    description:
      "Meet industry professionals, submit resumes, and explore job opportunities in tech.",
  },
  {
    name: "Open Source Summit",
    date: new Date("2024-11-22"),
    description:
      "An event celebrating open source projects with discussions, workshops, and networking opportunities.",
  },
  {
    name: "Digital Marketing Expo",
    date: new Date("2024-10-10"),
    description:
      "Learn the latest trends in digital marketing from industry leaders and top professionals.",
  },
  {
    name: "Blockchain Symposium",
    date: new Date("2024-12-12"),
    description:
      "A gathering of blockchain developers, investors, and enthusiasts to explore new use cases.",
  },
  {
    name: "Cybersecurity Awareness Day",
    date: new Date("2024-09-28"),
    description:
      "A day-long event focused on cybersecurity best practices and future trends in the field.",
  },
];

const assignments2: AssignmentTableData[] = [
  {
    task: "Assignment 1",
    course: "PHY-101",
    duedate: new Date("2024-09-30"),
  },
  {
    task: "Assignment 2",
    course: "MATH-201",
    duedate: new Date("2024-10-10"),
  },
  {
    task: "Assignment 3",
    course: "CHEM-102",
    duedate: new Date("2024-10-05"),
  },
];

const attendanceData: DashChartData[] = [
  {
    name: "PHY-101",
    total_class: 15,
    present: 12,
    absent: 3,
  },
  {
    name: "MA-101",
    total_class: 10,
    present: 6,
    absent: 4,
  },
  {
    name: "CHE-101",
    total_class: 12,
    present: 9,
    absent: 3,
  },
  {
    name: "CHE-101",
    total_class: 12,
    present: 9,
    absent: 3,
  },
  // Add more data as needed
];

export const description =
  "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

export function Dashboard() {
    console.log(localStorage.getItem("user"));
    const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-5xl">Welcome <b>{user["username"]}</b>!!!</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {attendanceData.map((data, index) => (
            <AttendanceCard key={index} data={data} />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Assignments Card */}
          <Card
            className="xl:col-span-2 self-start"
            x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Assignments</CardTitle>
                <CardDescription>
                  Recent Assignment from your Courses.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/assignment">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead className="text-center">Course</TableHead>
                    <TableHead className="text-center">Due Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments2.map((assignment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{assignment.task}</div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-center">
                        {assignment.course}
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-cell text-center">
                        {new Date(assignment.duedate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="pl-0 hidden xl:table-cell text-center">
                        <Checkbox id={`status-checkbox-${index}`} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <UpcomingEvents className="self-start" events={events}  />
        </div>
      </main>
    </div>
  );
}