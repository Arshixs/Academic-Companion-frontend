import { Metadata } from "next";
import Image from "next/image";
import { columns } from "./assignment/components/columns";
import { DataTable } from "./assignment/components/data-table";
import { Header } from "../header";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
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

  return (
    <>
      <Header />

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
              isSubmitting={isSubmitting}
              assignment={assignments}
              setAssigment={setAssignment}
            />
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
            onDataChange={setAssignment}
          />
        )}
      </div>
    </>
  );
}
