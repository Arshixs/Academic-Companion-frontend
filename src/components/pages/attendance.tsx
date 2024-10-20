import React from "react";
import { Header } from "../header";
import { ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { Nav } from "./attendance/nav";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

// Define your default state variables
const defaultCollapsed = false; // Change as per your requirement
const defaultLayout = [200]; // Define your layout size
const navCollapsedSize = 50; // Define your collapsed size

const AttendancePage = () => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (<>
      <Header />
      <main className="grid-cols-2 h-full gap-4 md:gap-8">
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
              sizes
            )}`;
          }}
          className="h-full w-10"
        >
          <div className="border-r ">
            <ResizablePanel
              defaultSize={defaultLayout[0]}
              collapsedSize={navCollapsedSize}
              collapsible={true}
              minSize={15}
              maxSize={20}
              onCollapse={() => {
                setIsCollapsed(true);
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                  true
                )}`;
              }}
              onResize={() => {
                setIsCollapsed(false);
                document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                  false
                )}`;
              }}
              className="w-64"
            >
              <Separator />
              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Inbox",
                    label: "128",
                    icon: Inbox,
                    variant: "default",
                  },
                  { title: "Drafts", label: "9", icon: File, variant: "ghost" },
                  { title: "Sent", label: "", icon: Send, variant: "ghost" },
                  {
                    title: "Junk",
                    label: "23",
                    icon: ArchiveX,
                    variant: "ghost",
                  },
                  { title: "Trash", label: "", icon: Trash2, variant: "ghost" },
                  {
                    title: "Archive",
                    label: "",
                    icon: Archive,
                    variant: "ghost",
                  },
                ]}
              />
              <Separator />
              <Nav
                isCollapsed={isCollapsed}
                links={[
                  {
                    title: "Social",
                    label: "972",
                    icon: Users2,
                    variant: "ghost",
                  },
                  {
                    title: "Updates",
                    label: "342",
                    icon: AlertCircle,
                    variant: "ghost",
                  },
                  {
                    title: "Forums",
                    label: "128",
                    icon: MessagesSquare,
                    variant: "ghost",
                  },
                  {
                    title: "Shopping",
                    label: "8",
                    icon: ShoppingCart,
                    variant: "ghost",
                  },
                  {
                    title: "Promotions",
                    label: "21",
                    icon: Archive,
                    variant: "ghost",
                  },
                ]}
              />
            </ResizablePanel>
          </div>
        </ResizablePanelGroup>
      </main>
  </>
  );
};

export default AttendancePage;
