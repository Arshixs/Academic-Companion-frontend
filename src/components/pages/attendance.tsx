import React, { useEffect, useState } from "react";
import { Header } from "../header";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { Nav } from "./attendance/nav";
import { Archive, ArchiveX, File, Inbox, Send, Trash2 } from "lucide-react";
import {Calendar} from "./attendance/calender";

// Define TypeScript interfaces for attendance data
interface AttendanceRecord {
  [date: string]: string;
}

interface AttendanceData {
  [courseId: string]: AttendanceRecord;
}

const defaultCollapsed = false;
const defaultLayout = [200];
const navCollapsedSize = 50;

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user && user.id) {
      const userId = user.id;

      // Fetch attendance data when the component mounts
      fetch(`http://127.0.0.1:8000/attendance/detailed/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data: AttendanceData) => {
          console.log("Attendance Data:", data);
          setAttendanceData(data);
        })
        .catch((error) => console.error("Error fetching attendance:", error));
    }
  }, []);
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

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
        label: "",
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
          <div className="text-center flex-none w-40 border bg-card text-card-foreground shadow-sm">
            <Nav
              className="text-center"
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              links={mapAttendanceToLinks()}
            />
          </div>
          <div className="flex-auto">
            <Calendar />
          </div>
          <div className="flex-auto w-64">02</div>
        </div>
      </main>
    </>
  );
};

export default AttendancePage;
