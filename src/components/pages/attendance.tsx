import React, { useEffect, useState } from "react";
import { Header } from "../header";
import { Nav } from "./attendance/nav";
import { Archive, ArchiveX, File, Inbox, Send, Trash2 } from "lucide-react";
import { Calendar } from "./attendance/calender";
import Cookies from "js-cookie";
import { DashChartData } from "./dashboard";
import { AttendanceCard } from "./dashboard/pie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

// Define TypeScript interfaces for attendance data
interface AttendanceRecord {
  [date: string]: string;
}

interface AttendanceData {
  [courseId: string]: AttendanceRecord;
}

const defaultCollapsed = false;

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  
  const [attendanceCardData, setAttendanceCardData] = useState<DashChartData[]>(
    []
  );
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [courseSelected, setCourseSelected] = useState<DashChartData>();
  const [selected, setSelected] = useState<string>();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const user = JSON.parse(Cookies.get("user") || "{}"); // Retrieve user data from cookies
  const accessToken = Cookies.get("access_token"); // Retrieve access token from cookies

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
          setAttendanceCardData(data); // Update the state with fetched data
        })
        .catch((error) => console.error("Error fetching attendance:", error));
    }
  }, [accessToken]);

  useEffect(() => {
    if (user && user.id && accessToken) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      fetch("http://127.0.0.1:8000/attendance/detailed/", requestOptions)
        .then((response) => response.json())
        .then((data: AttendanceData) => {
          console.log("Detailed Attendance Data:", data);
          setAttendanceData(data);
        })
        .catch((error) =>
          console.error("Error fetching detailed attendance:", error)
        );
    }
  }, [accessToken]);

  useEffect(() => {
    const selectedCourse = attendanceCardData.reduce((acc, item) => {
      if (item.course_id === selected) {
        acc = item; // Assign the matched item to the accumulator
      }
      return acc;
    }, {}); // Initialize with an empty object or any other default value

    setCourseSelected(selectedCourse);

    console.log(selected);
  }, [selected]);

  // Map attendance data to Nav links
  const mapAttendanceToLinks = () => {
    const icons = [Inbox, File, Send, ArchiveX, Trash2, Archive];
    return Object.keys(attendanceData).map((course, index) => {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      const dates = Object.keys(attendanceData[course]);
      const latestDate = dates[dates.length - 1];
      const latestStatus = attendanceData[course][latestDate];

      return {
        title: course, // Course ID as title
        label: latestStatus || "", // Display the latest attendance status
        icon: randomIcon,
        variant: "ghost",
      };
    });
  };

  return (
    <>
      <Header />
      <main className="h-screen gap-4 md:gap-8">
        <div className="flex flex-row h-full">
          <div className="text-center flex-none w-50 border bg-card text-card-foreground shadow-sm">
            {" "}
            {/* 50px */}
            <Nav
              className="text-center"
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              links={mapAttendanceToLinks()}
            />
          </div>
          <div className="flex-auto w-2/3 flex flex-col">
            {" "}
            {/* Parent div as flex container */}
            <div className="flex-grow">
              {" "}
              {/* Calendar takes 3/4 of the height */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="flex-none h-1/3 flex flex-col items-start pl-4 pt-4">
              {" "}
              {/* Div takes 1/4 of the height */}
              <div className="w-full mb-2">
                Date:{" "}
                <span className="ml-2">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "No date selected"}
                </span>
              </div>{" "}
              {/* Full width with margin */}
              <div className="w-full mt-2">
                {" "}
                {/* Full width and margin-top for spacing */}
                Status:{" "}
                <span className="ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Open</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Present</DropdownMenuItem>
                      <DropdownMenuItem>Absent</DropdownMenuItem>
                      <DropdownMenuItem>No Class</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-auto w-1/3 p-10 border flex items-center justify-center">
            {" "}
            {/* 1/3 of remaining space */}
            <div className="">
              <div className="text-center">
                {courseSelected && selected ? (
                  <>
                    <AttendanceCard
                      className="border-0 shadow-none"
                      key={0}
                      data={courseSelected}
                    />
                  </>
                ) : (
                  <p>Please select a course to view attendance</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AttendancePage;
