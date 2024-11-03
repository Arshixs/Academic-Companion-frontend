import { useState, useEffect } from "react";
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
import  UpcomingEvents  from "./dashboard/events";
import Cookies from "js-cookie"; // Import js-cookie for handling cookies
import { AssignmentData } from "./assignment";
import AssignmentsCard from "./dashboard/assignmnet_table";

export interface DashChartData {
  course_id: string;
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
  // Other events...
];

const assignments2: AssignmentTableData[] = [
  { task: "Assignment 1", course: "PHY-101", duedate: new Date("2024-09-30") },
  { task: "Assignment 2", course: "MATH-201", duedate: new Date("2024-10-10") },
  { task: "Assignment 3", course: "CHEM-102", duedate: new Date("2024-10-05") },
];

export const description =
  "An application shell with a header and main content area. The header has a navbar, a search input and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

export function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<DashChartData[]>([]);
  const user = JSON.parse(Cookies.get("user") || "{}"); // Retrieve user data from cookies
  console.log(user);
  const [assignments, setAssignment] = useState<AssignmentData[]>([]);
  const accessToken = Cookies.get("access_token"); // Retrieve access token from cookies
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  const getAuthHeaders = () => {
    if (!accessToken) {
      throw new Error("No access token available");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
  };

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignment/assignments/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssignment(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch assignments"
      );
      console.error("Error fetching assignments:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (accessToken) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      fetch("http://127.0.0.1:8000/attendance/data/", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Attendance Data:", data);
          setAttendanceData(data); // Update the state with fetched data
        })
        .catch((error) => console.error("Error fetching attendance:", error));
      fetchAssignments();
    }
  }, [accessToken]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-5xl">
          Welcome <b>{user["username"]}</b>!!!
        </h1>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Attendance</CardTitle>
              <CardDescription>Current Attendance Summary</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/attendance">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {attendanceData.map((data, index) => (
                <AttendanceCard key={index} data={data} />
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Assignments Card */}
          <AssignmentsCard />

          {/* Upcoming Events Card */}
          <UpcomingEvents className="self-start" events={events} />
        </div>
      </main>
    </div>
  );
}
