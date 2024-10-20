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

export const description =
  "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image.";

export function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<DashChartData[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user && user.id) {
      const userId = user.id;

      // Fetch attendance data when the component mounts
      fetch(`http://127.0.0.1:8000/attendance/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Attendance Data:", data);
          setAttendanceData(data); // Update the state with the fetched data
        })
        .catch((error) => console.error("Error fetching attendance:", error));
    }
  }, []); // Re-run this effect if `user` changes
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
          <UpcomingEvents className="self-start" events={events} />
        </div>
      </main>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// type CourseType = {
//   id: number;
//   course_name: string;
//   description: string;
// };

// export function Dashboard() {
//   const [courses, setCourses] = useState<CourseType[]>([]); // State to hold the course data
//   const [error, setError] = useState<string>(""); // State for error messages
//   const navigate = useNavigate();

//   // Function to get CSRF token from cookies
//   const getCSRFToken = () => {
//     const cookieValue = document.cookie.split("; ").find((row) => row.startsWith("csrftoken="));
//     return cookieValue ? cookieValue.split("=")[1] : "";
//   };

//   // Fetch function to get courses for a specific user ID
//   const fetchUserCourses = async (userId: number) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/users/courses/${userId}/`, {
//         method: "GET",
//         credentials: "include",
//         headers: {
//           'X-CSRFToken': getCSRFToken(), // Include CSRF token if required
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch courses");
//       }

//       const data = await response.json();
//       setCourses(data); // Update the state with the retrieved courses
//     } catch (error) {
//       console.error("Error fetching user courses:", error);
//       setError(error.message); // Set the error message
//       navigate("/login"); // Redirect to login if there's an error
//     }
//   };

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const userId = user.id; // Get user ID from localStorage

//     if (userId) {
//       fetchUserCourses(userId); // Call the fetch function with userId
//     } else {
//       setError("User not found. Please log in."); // Handle case when userId is not found
//       navigate("/login"); // Redirect to login if userId is not present
//     }
//   }, [navigate]); // Dependency array with navigate

//   return (
//     <div>
//       {error && <p className="text-red-500">{error}</p>}
//       {courses.length > 0 ? (
//         <ul>
//           {courses.map((course) => (
//             <li key={course.id}>
//               <h2>{course.course_name}</h2>
//               <p>{course.description}</p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No courses found.</p>
//       )}
//     </div>
//   );
// };
