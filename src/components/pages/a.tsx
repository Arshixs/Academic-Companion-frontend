import React, { useState } from "react";
import { motion } from "framer-motion";
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
  ChevronRight,
  ClipboardList,
  GraduationCap,
  LineChart,
  Menu,
  X,
} from "lucide-react";

const AnimatedText = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

const FadeInWhenVisible = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: ClipboardList,
      title: "Assignment Tracker",
      description:
        "Never miss a deadline with our intuitive assignment tracking system",
    },
    {
      icon: Calendar,
      title: "Attendance Manager",
      description:
        "Track and manage your class attendance with automated notifications",
    },
    {
      icon: LineChart,
      title: "Progress Analytics",
      description:
        "Visualize your academic progress with detailed analytics and insights",
    },
    {
      icon: BookOpen,
      title: "Course Materials",
      description:
        "Access all your study materials in one organized, searchable place",
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

  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Pricing", "FAQ", "Support"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Press"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Help Center", "Contact", "Community"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Accessibility"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav
        className="fixed w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Academic Companion</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                {["Features", "Testimonials", "Pricing", "Contact"].map(
                  (item, i) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                    >
                      <Button variant="ghost">{item}</Button>
                    </motion.div>
                  )
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button variant="outline">Log in</Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Button>Sign up</Button>
                </motion.div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          className="md:hidden"
          initial="closed"
          animate={isMobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { height: "auto", opacity: 1 },
            closed: { height: 0, opacity: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
            {["Features", "Testimonials", "Pricing", "Contact"].map(
              (item, i) => (
                <motion.div
                  key={item}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Button variant="ghost" className="w-full justify-start">
                    {item}
                  </Button>
                </motion.div>
              )
            )}
            <div className="flex flex-col space-y-2 pt-2">
              <Button variant="outline" className="w-full">
                Log in
              </Button>
              <Button className="w-full">Sign up</Button>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-32 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AnimatedText>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Your Academic Success
                <motion.span
                  className="text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {" "}
                  Simplified
                </motion.span>
              </h1>
            </AnimatedText>

            <AnimatedText delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Manage assignments, track attendance, and monitor your academic
                progress all in one place. The smart companion for modern
                students.
              </p>
            </AnimatedText>

            <motion.div
              className="mt-10 flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Button size="lg" className="gap-2">
                Get Started Free
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedText>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything You Need to Excel
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Powerful features designed to make academic life easier
              </p>
            </div>
          </AnimatedText>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <Card className="border-2 transition-all hover:border-primary">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedText>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Loved by Students
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Here's what our users have to say about Academic Companion
              </p>
            </div>
          </AnimatedText>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <Card className="text-center h-full">
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
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedText>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/90">
                Join thousands of students already using Academic Companion
              </p>
              <motion.div
                className="mt-10 flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Button size="lg" variant="secondary">
                  Create Free Account
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contact Sales
                </Button>
              </motion.div>
            </div>
          </AnimatedText>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t py-12 bg-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Footer Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Logo and Description */}
            <motion.div
              className="col-span-1 md:col-span-4 lg:col-span-1"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">
                  Academic Companion
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Empowering students to achieve academic excellence through smart
                organization and productivity tools.
              </p>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              >
                <h3 className="text-sm font-semibold">{section.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <a
                        href="#"
                        className="hover:text-primary transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom Footer Section */}
          <motion.div
            className="mt-12 border-t pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                © 2024 Academic Companion. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-muted-foreground">
                <motion.a
                  href="#"
                  className="hover:text-primary"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Privacy Policy
                </motion.a>
                <span>·</span>
                <motion.a
                  href="#"
                  className="hover:text-primary"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Terms of Service
                </motion.a>
                <span>·</span>
                <motion.a
                  href="#"
                  className="hover:text-primary"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  Cookie Policy
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
