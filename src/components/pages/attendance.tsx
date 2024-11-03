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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface AttendanceRecord {
  [date: string]: string;
}
interface AttendanceData {
  [courseId: string]: AttendanceRecord;
}

const defaultCollapsed = false;

const AttendancePage = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [attendanceCardData, setAttendanceCardData] = useState<DashChartData[]>(
    []
  );
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [courseSelected, setCourseSelected] = useState<DashChartData>();
  const [selected, setSelected] = useState<string>();
  const [status, setStatus] = useState<string>("NOT SET");
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const user = JSON.parse(Cookies.get("user") || "{}");
  const accessToken = Cookies.get("access_token");

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchAttendanceCardData = async () => {
    if (accessToken) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
      try {
        const response = await fetch("http://127.0.0.1:8000/attendance/data/", {
          method: "GET",
          headers: myHeaders,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }
        const data = await response.json();
        setAttendanceCardData(data);
        
        if (selected) {
          const updatedCourse = data.find((item: DashChartData) => item.course_id === selected);
          setCourseSelected(updatedCourse);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch attendance data. Please try again.",
        });
        console.error("Error fetching attendance card data:", error);
      }
    }
  };

  const fetchDetailedAttendance = async () => {
    if (user && user.id && accessToken) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
      try {
        const response = await fetch("http://127.0.0.1:8000/attendance/detailed/", {
          method: "GET",
          headers: myHeaders,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch detailed attendance");
        }
        const data = await response.json();
        setAttendanceData(data);
        console.log(attendanceData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch detailed attendance. Please try again.",
        });
        console.error("Error fetching detailed attendance:", error);
      }
    }
  };

  useEffect(() => {
    fetchAttendanceCardData();
  }, [accessToken]);

  useEffect(() => {
    fetchDetailedAttendance();
  }, [accessToken, selected]);

  useEffect(() => {
    const selectedCourse = attendanceCardData.find(
      (item) => item.course_id === selected
    );
    setCourseSelected(selectedCourse);
  }, [selected, attendanceCardData]);

  useEffect(() => {
    if (selectedDate && courseSelected) {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const courseAttendance = attendanceData[selected]?.[formattedDate];
      setStatus(
        courseAttendance ? capitalizeFirstLetter(courseAttendance) : "NOT SET"
      );
    }
  }, [selectedDate, courseSelected, attendanceData, selected]);

  const handleStatusChange = async (newStatus: string) => {

    setStatus(newStatus);

    const formattedDate = selectedDate?.toLocaleDateString("en-GB");
    const attendanceData = {
      course_id: selected,
      date: formattedDate,
      status: newStatus.toLowerCase(),
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    try {
      const response = await fetch("http://127.0.0.1:8000/attendance/create/", {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit attendance.");
      }

      await response.json();
      
      // Refresh both detailed attendance and attendance card data
      await Promise.all([
        fetchDetailedAttendance(),
        fetchAttendanceCardData()
      ]);

      toast({
        title: "Success",
        description: "Attendance updated successfully!",
        variant: "default",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Select Course",
        description: "Please select a Course to update attendance",
      });
      console.error("Error submitting attendance:", error);
    }
  };

  const mapAttendanceToLinks = () => {
    const icons = [Inbox, File, Send, ArchiveX, Trash2, Archive];
    return Object.keys(attendanceData).map((course, index) => {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      const dates = Object.keys(attendanceData[course]);
      const latestDate = dates[dates.length - 1];
      const latestStatus = attendanceData[course][latestDate];
      console.log("course name:",course);
      return {
        title: course,
        label: latestStatus || "",
        icon: randomIcon,
        variant: "ghost",
      };
    });
  };

  return (
    <>
      <Header />
      <Toaster />
      <main className="h-screen gap-4 md:gap-8">
        <div className="flex flex-row h-full">
          <div className="text-center flex-none w-50 border bg-card text-card-foreground shadow-sm">
            <Nav
              className="text-center"
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              links={mapAttendanceToLinks()}
              fetchAttendanceCardData={fetchAttendanceCardData}
              fetchDetailedAttendance={fetchDetailedAttendance}
            />
          </div>
          <div className="flex-auto w-2/3 flex flex-col">
            <div className="flex-grow">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="flex-none h-1/3 flex flex-col items-start pl-4 pt-4">
              <div className="w-full mb-2">
                Date:{" "}
                <span className="ml-2">
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "No date selected"}
                </span>
              </div>
              <div className="w-full mt-2">
                Status:{" "}
                <span className="ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{status}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => handleStatusChange("Present")}
                      >
                        Present
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleStatusChange("Absent")}
                      >
                        Absent
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleStatusChange("No Class")}
                      >
                        No Class
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </div>
            </div>
          </div>
          <div className="flex-auto w-1/3 p-10 border flex items-center justify-center">
            <div className="">
              <div className="text-center">
                {courseSelected && selected ? (
                  <AttendanceCard
                    className="border-0 shadow-none"
                    key={courseSelected.course_id}
                    data={courseSelected}
                  />
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