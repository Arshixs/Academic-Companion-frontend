import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Assignment } from "./dashboard/assignmnet_table";

export interface DashChartData {
  name: string;
  total_class: number;
  present: number;
  absent: number;
  fill?: string;
}

export interface AssignmentChartData {
  task: string;
  course: string;
  duedate: Date;
}

const assignments2: AssignmentChartData[] = [
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
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {attendanceData.map((data, index) => (
            <AttendanceCard key={index} data={data} />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Assignments</CardTitle>
                <CardDescription>
                  Recent Assignment from your Courses.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
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
                  {/* Map through the assignments array */}
                  {assignments2.map((assignment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{assignment.task}</div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-center">
                        {assignment.course}
                      </TableCell>
                      <TableCell className="hidden md:table-cell lg:hidden xl:table-cell text-center">
                        {new Date(assignment.duedate).toLocaleDateString()}{" "}
                        {/* Format the due date */}
                      </TableCell>
                      <TableCell className="pl-0 hidden xl:table-cell text-center">
                        {/* Add a checkbox for each assignment */}
                        <Checkbox id={`status-checkbox-${index}`} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              <div className="flex items-center gap-4">

                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$1,999.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Jackson Lee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    jackson.lee@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$39.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p className="text-sm text-muted-foreground">
                    isabella.nguyen@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$299.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    William Kim
                  </p>
                  <p className="text-sm text-muted-foreground">
                    will@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$99.00</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/05.png" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    sofia.davis@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">+$39.00</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
