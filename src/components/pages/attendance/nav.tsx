import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import {AddCourseDialog} from "./add_course";

interface NavProps {
  isCollapsed: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
  fetchAttendanceCardData : () => Promise<void>;
  fetchDetailedAttendance : () => Promise<void>;
}

export function Nav({ links, isCollapsed, setSelected, fetchAttendanceCardData, fetchDetailedAttendance }: NavProps) {
  const handleClick = (title: string) => {
    setSelected(title);
    console.log(`helloworld ${title}`);
  };
  console.log("links", links);

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2 border-0"
    >
      <div className="flex items-center justify-between px-2">
        <span
          className={cn(
            "text-sm font-semibold",
            isCollapsed ? "hidden" : "block"
          )}
        >
          Courses
        </span>
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <AddCourseDialog />
            </TooltipTrigger>
            <TooltipContent side="right">Add Course</TooltipContent>
          </Tooltip>
        ) : (
          <AddCourseDialog fetchAttendanceCardData={fetchAttendanceCardData} fetchDetailedAttendance={fetchDetailedAttendance} />
        )}
      </div>
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          console.log("Link Title:", link.title); // Add this line for debugging
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              {/* The rest of your code */}
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              onClick={() => handleClick(link.title)}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start"
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              <span>{link.title}</span> {/* Ensure link.title is displayed */}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
