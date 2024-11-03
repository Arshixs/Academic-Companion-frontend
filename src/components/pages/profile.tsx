import { useState, useEffect } from "react";
import { Header } from "../header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import AssignmentsCard from "./dashboard/assignmnet_table";
import { AddCourseDialog } from "./attendance/add_course";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  branch: string;
  current_semester: number;
  college: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
}

export function ProfilePage() {
  const user = Cookies.get("user")
    ? JSON.parse(Cookies.get("user") as string)
    : null;

  console.log(user?.username); // Optional chaining to avoid errors if user is null

  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    branch: user?.branch || "",
    current_semester: user?.current_semester || 0,
    college: user?.college || "",
  });

  console.log(profile);
  //   setProfile(user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const form = useForm({
    defaultValues: {
      branch: "",
      current_semester: 1,
      college: "",
    },
  });

  const accessToken = Cookies.get("access_token");

  //   useEffect(() => {
  //     // Fetch user profile
  //     if (accessToken) {
  //       // Fetch enrolled courses
  //       fetch("http://127.0.0.1:8000/api/courses/enrolled/", {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       })
  //         .then((res) => res.json())
  //         .then((data) => setCourses(data));

  //       // Fetch available courses
  //       fetch("http://127.0.0.1:8000/courses/available/", {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       })
  //         .then((res) => res.json())
  //         .then((data) => setAvailableCourses(data));
  //     }
  //   }, [accessToken]);

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/profile/update/",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourse) return;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/courses/enroll/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ course_id: selectedCourse }),
        }
      );

      if (response.ok) {
        const updatedCourses = await response.json();
        setCourses(updatedCourses);
        setSelectedCourse("");
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/courses/unenroll/${courseId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setCourses(courses.filter((course) => course.id !== courseId));
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your personal information</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="current_semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Semester</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={8}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="college"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Username
                      </p>
                      <p>{profile.username}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p>{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        First Name
                      </p>
                      <p>{profile.first_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Last Name
                      </p>
                      <p>{profile.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Branch
                      </p>
                      <p>{profile.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Current Semester
                      </p>
                      <p>{profile.current_semester}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        College
                      </p>
                      <p>{profile.college}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Enrolled Courses</CardTitle>
                  <CardDescription>
                    Manage your course enrollments
                  </CardDescription>
                </div>
                <AddCourseDialog />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
