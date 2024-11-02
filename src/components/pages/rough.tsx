import { Metadata } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { PlusCircle } from "lucide-react";

// UI Components
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Header } from "../header";
import { columns } from "./assignment/components/columns";
import { DataTable } from "./assignment/components/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AssignmentData {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  label: number;
  label_name: string;
  created_at: string;
  updated_at: string;
}

interface NewTaskData {
  title: string;
  description: string;
  status: AssignmentData["status"];
  priority: AssignmentData["priority"];
  label: number;
}

const INITIAL_TASK_STATE: NewTaskData = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  label: 1,
};

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker built using Tanstack Table.",
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function AssignmentPage() {
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskData>(INITIAL_TASK_STATE);

  const accessToken = Cookies.get("access_token");

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
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/assignment/assignments/`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assignments");
      console.error("Error fetching assignments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }
    fetchAssignments();
  }, [accessToken]);

  const handleInputChange = (field: keyof NewTaskData, value: string | number) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessToken) {
      setError("Please log in to create tasks");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/assignment/assignments/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task");
      }

      await fetchAssignments();
      setNewTask(INITIAL_TASK_STATE);
      setIsDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
      console.error("Error creating task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const transformedTasks = assignments.map((task) => ({
    id: task.id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    label: task.label_name,
    priority: task.priority,
    created_at: task.created_at,
    updated_at: task.updated_at,
  }));

  return (
    <>
      <Header />
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
            <p className="text-muted-foreground">
              Here's a list of your tasks for this month!
            </p>
            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center" disabled={!accessToken}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your assignments list.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    required
                    value={newTask.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    required
                    value={newTask.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter task description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: AssignmentData["status"]) => 
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: AssignmentData["priority"]) => 
                      handleInputChange("priority", value)
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high" aria-placeholder="J">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading assignments...</p>
          </div>
        ) : (
          <DataTable data={transformedTasks} columns={columns} />
        )}
      </div>
    </>
  );
}