import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Link from "next/link";
import { CircleUser, Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("dashboard");

  useEffect(() => {
    const path = location.pathname.substring(1) || "dashboard";
    setSelected(path);
  }, [location]);

  const handleNavClick = (path:string) => {
    setSelected(path);
    navigate(`/${path === "dashboard" ? "" : path}`);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    navigate("/login");
  };

  const navLinks = [
    { path: "dashboard", label: "Dashboard" },
    { path: "attendance", label: "Attendance" },
    { path: "assignment", label: "Assignment" },
    { path: "notes", label: "Notes" },
    { path: "calendar", label: "Calendar" },
    { path: "code", label: "Code Editor" },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 md:px-6">
      {/* Logo - Always on the left */}
      <Link
        href="#"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>

      {/* Navigation tabs - Now on the right */}
      <nav className="hidden md:flex flex-row items-center gap-5 ml-auto">
        {navLinks.map(({ path, label }) => (
          <button
            key={path}
            onClick={() => handleNavClick(path)}
            className={`${
              selected === path
                ? "text-foreground"
                : "text-muted-foreground"
            } transition-colors hover:text-foreground text-sm font-medium`}
          >
            {label}
          </button>
        ))}
      </nav>
      
      {/* Mobile menu - Remains the same */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden ml-auto">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
            {navLinks.map(({ path, label }) => (
              <button
                key={path}
                onClick={() => {
                  handleNavClick(path);
                }}
                className={`text-left ${
                  selected === path
                    ? "text-foreground"
                    : "text-muted-foreground"
                } hover:text-foreground`}
              >
                {label}
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* User controls - Now separate from navigation */}
      <div className="flex items-center gap-2 ml-4">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;