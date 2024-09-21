import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ArrowUpRight, Link, Table } from "lucide-react";
import { AssignmentChartData } from "../dashboard";
import React from "react";

// Fix: Correctly define props in function signature
interface AssignmentProps {
  assignments: AssignmentChartData[];
}

// Fix: Correct arrow function syntax
export function Assignment({ assignments }: AssignmentProps) {
  return (
    <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Assignments</CardTitle>
          <CardDescription>
            Recent Assignments from your Courses.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
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
            {/* Map through the assignments array */}
            {assignments.map((assignment, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{assignment.task}</div>
                </TableCell>
                <TableCell className="hidden xl:table-cell text-center">
                  {assignment.course}
                </TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-cell text-center">
                  {new Date(assignment.duedate).toLocaleDateString()}{" "}
                  {/* Format the due date */}
                </TableCell>
                <TableCell className="pl-0 hidden xl:table-cell text-center">
                  {/* Add a checkbox for each assignment */}
                  <Checkbox id={`status-checkbox-${index}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
