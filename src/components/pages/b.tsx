import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LineChart,
  Menu,
  X,
} from "lucide-react";

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: ClipboardList,
      title: "Assignment Tracker",
      description: "Intelligent tracking for every deadline.",
    },
    {
      icon: Calendar,
      title: "Attendance Manager",
      description: "Perfect attendance, effortlessly managed.",
    },
    {
      icon: LineChart,
      title: "Progress Analytics",
      description: "Beautiful insights into your academic journey.",
    },
    {
      icon: BookOpen,
      title: "Course Materials",
      description: "All your resources, elegantly organized.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation - Apple-style sticky nav with blur effect */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-xl" : "bg-background"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="ml-2 text-sm font-medium">Academic</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Button variant="ghost" className="text-sm font-medium">
                Features
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Why Academic
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Support
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Buy
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute w-full bg-background/95 backdrop-blur-xl md:hidden">
            <div className="space-y-1 px-6 pb-6 pt-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                Features
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Why Academic
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Support
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Buy
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Apple-style with large typography */}
      <section className="relative pt-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">
              Academic.
            </h1>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-primary sm:text-6xl">
              Think different about studying.
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-xl text-muted-foreground">
              Beautifully designed. Intelligently crafted. The perfect companion
              for the modern student.
            </p>
            <div className="mt-12 flex items-center justify-center space-x-4">
              <Button size="lg" className="h-12 rounded-full px-8 text-lg">
                Buy
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="h-12 rounded-full px-8 text-lg"
              >
                Learn more <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Apple-style with large images and minimal text */}
      <section className="mt-32 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-slate-50 p-8 transition-all hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <feature.icon className="h-16 w-16 text-primary" />
                <h3 className="mt-6 text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-lg text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Apple-style with gradient background */}
      <section className="mt-32 bg-gradient-to-b from-primary to-primary/80 py-32 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Ready to transform your academic journey?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-foreground/90">
            Join the academic revolution. Available now for all devices.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-12 h-12 rounded-full px-8 text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer - Apple-style minimal footer */}
      <footer className="border-t border-border/40 bg-background py-12 text-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="space-y-3">
              <p className="font-medium">Shop and Learn</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Education</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium">Academic Services</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Academic+ </li>
                <li>Support</li>
                <li>For Business</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium">About Academic</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Newsroom</li>
                <li>Leadership</li>
                <li>Careers</li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="font-medium">Legal</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>Privacy</li>
                <li>Terms of Use</li>
                <li>Legal Information</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border/40 pt-8 text-muted-foreground">
            <p>Copyright © 2024 Academic Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
