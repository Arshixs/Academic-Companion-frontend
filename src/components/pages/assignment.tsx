import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

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

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export default function AssignmentPage() {
  const [assignments, setAssignment] = useState<AssignmentData[]>([]);
  const user = JSON.parse(Cookies.get("user") || "{}"); // Retrieve user data from cookies
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

  useEffect(() => {
    if (accessToken) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      fetch("http://127.0.0.1:8000/assignment/assignments/", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setAssignment(data); // Update the state with fetched data
        })
        .catch((error) => console.error(error));
    }
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
  const fetchAssignments = () => {
    if (accessToken) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      fetch("http://127.0.0.1:8000/assignment/assignments/", {
        method: "GET",
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((data) => {
          setAssignment(data);
        })
        .catch((error) => console.error("Error fetching assignments:", error));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) return;

    setIsSubmitting(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      const response = await fetch(
        "http://127.0.0.1:8000/assignment/assignments/",
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(newTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      // Reset form and close dialog
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        label: 1,
      });
      setIsDialogOpen(false);

      // Refresh assignments list
      fetchAssignments();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const transformedTasks = assignments.map((task) => ({
    id: task.title, // Use the title as the new id
    title: task.description, // Use description as the new title
    status: task.status, // Set a default status
    label: "documentation", // Set a default label
    priority: task.priority,
    created_at: task.created_at,
    updated_at: task.updated_at,
    data_base_id: task.id,
  }));

  console.log(transformedTasks);

  return (
    <>
      <Header />
      <Dialog>
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
      </Dialog>
      )
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
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Assignments!
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of your tasks for this month!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            </Dialog>
          </div>
        </div>

        <DataTable
          onUpdateRow={assignments}
          data={transformedTasks}
          columns={columns}
        />
      </div>
    </>
  );
}
