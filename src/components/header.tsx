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

  const handleNavClick = (path) => {
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
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/80 backdrop-blur-lg px-4 md:px-6">
      {/* Left side - Logo and Name */}
      <div className="flex items-center gap-2">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="hidden md:inline">Academic Companion</span>
        </Link>
      </div>

      {/* Right side - Navigation and Controls */}
      <div className="flex flex-1 items-center justify-end gap-4">
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {navLinks.map(({ path, label }) => (
            <button
              key={path}
              onClick={() => handleNavClick(path)}
              className={`${
                selected === path
                  ? "text-foreground font-bold"
                  : "text-muted-foreground "
              } transition-colors hover:text-foreground text-base`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
};

export default Header;