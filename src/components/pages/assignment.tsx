import { Metadata } from "next";
import Image from "next/image";
import { columns } from "./assignment/components/columns";
import { DataTable } from "./assignment/components/data-table";
import { UserNav } from "./assignment/components/user-nav";
import { taskSchema } from "./assignment/data/schema";
import { Header } from "../header";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Label } from "../ui/label";
import AssignmentDialog from "./assignment/add-assignments";

export interface AssignmentData {
  id: 1;
  title: string;
  description: string;
  status: string;
  priority: string;
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
  description: "A task and issue tracker build using Tanstack Table.",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function AssignmentPage() {
  const [assignments, setAssignment] = useState<AssignmentData[]>([]);
  const user = JSON.parse(Cookies.get("user") || "{}"); // Retrieve user data from cookies
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = Cookies.get("access_token"); // Retrieve access token from cookies
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    label: 1,
  });

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
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }
    fetchAssignments();
  }, [accessToken]);

  for (const obj of assignments) {
    console.log(JSON.stringify(obj, null, 2));
  }
  const handleInputChange = (field, value) => {
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
    id: task.title, // Use the title as the new id
    title: task.description, // Use description as the new title
    status: task.status, // Set a default status
    label: task.label_name, // Set a default label
    priority: task.priority,
    created_at: task.created_at,
    updated_at: task.updated_at,
    data_base_id: task.id,
  }));

  console.log(transformedTasks);

  return (
    <>
      <Header />
      {/* <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
            <p className="text-muted-foreground">
              Here's a list of your tasks for this month!
            </p>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <AssignmentDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
            {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
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
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      required
                      value={newTask.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter task title"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      required
                      value={newTask.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
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
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) =>
                        handleInputChange("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
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
            </Dialog> */}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <p>Loading assignments...</p>
          </div>
        ) : (
          <DataTable
            onUpdateRow={assignments}
            data={transformedTasks}
            columns={columns}
          />
        )}
      </div>
    </>
  );
}
