import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LineChart,
  Lock,
  Menu,
  X,
  Notebook,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: ClipboardList,
      title: "Assignment Tracker",
      description:
        "Never miss a deadline with our intuitive assignment tracking system",
    },
    {
      icon: Notebook,
      title: "Attendance Manager",
      description:
        "Track and manage your class attendance",
    },
    {
      icon: Calendar,
      title: "Calendar",
      description:
        "Track and manage your events with build in Calnedar",
    },
    {
      icon: BookOpen,
      title: "Notes",
      description:
        "Create and Access all your notes in one organized, searchable place",
    },
  ];

  const testimonials = [
    {
      quote:
        "Academic Companion has completely transformed how I manage my studies.",
      author: "Sarah J.",
      role: "Computer Science Student",
    },
    {
      quote:
        "The attendance tracking feature saves me so much time and stress.",
      author: "Michael P.",
      role: "Engineering Student",
    },
    {
      quote: "I've never been more organized with my assignments.",
      author: "Emma R.",
      role: "Mathematics Student",
    },
  ];

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Academic Companion</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <ModeToggle />
                <Button onClick={handleLogin} variant="outline">
                  Log in
                </Button>
                <Button onClick={handleSignup}>Sign up</Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Button variant="ghost" className="w-full justify-start">
                Features
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Testimonials
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Pricing
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Contact
              </Button>
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
                <Button className="w-full">Sign up</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Your Academic Success
              <span className="text-primary"> Simplified</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Manage assignments, track attendance, and monitor your academic
              progress all in one place. The smart companion for modern
              students.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button onClick={handleSignup} size="lg" className="gap-2">
                Get Started Free
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything You Need to Excel
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to make academic life easier
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 transition-all hover:border-primary"
              >
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Loved by Students
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Here's what our users have to say about Academic Companion
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardDescription className="text-lg">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Join thousands of students already using Academic Companion
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button onClick={handleSignup} size="lg" variant="secondary">
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Academic Companion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
