"use client";

import React from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { access } from "fs";

interface AddCourseDialogProp {
  fetchAttendanceCardData: () => Promise<void>;
  fetchDetailedAttendance: () => Promise<void>;
}

export function AddCourseDialog({
  fetchAttendanceCardData,
  fetchDetailedAttendance,
}: AddCourseDialogProp) {
  const [courseId, setCourseId] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const access = Cookies.get("access_token");
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/college/course/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`, // Assuming you store JWT token in localStorage
          },
          body: JSON.stringify({
            course_id: courseId,
            course_name: courseName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create course");
      }

      const data = await response.json();
      fetchAttendanceCardData();
      fetchDetailedAttendance();

      toast({
        title: "Success",
        description: "Course created successfully",
      });

      // Reset form and close dialog
      setCourseId("");
      setCourseName("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add Course</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Enter the details for the new course below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseId">Course ID</Label>
            <Input
              id="courseId"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="Enter course ID"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name"
              disabled={isLoading}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Add Course"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
