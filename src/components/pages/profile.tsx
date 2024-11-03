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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { AddCourseDialog } from "./attendance/add_course";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
  id: number;
  course_id: string;
  course_name: string;
  college_name: string;
  created_at: string;
}

export function ProfilePage() {
  const { toast } = useToast();
  const user = Cookies.get("user")
    ? JSON.parse(Cookies.get("user") as string)
    : null;

  const [profile, setProfile] = useState<UserProfile>({
    username: user?.username || "",
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    branch: user?.branch || "",
    current_semester: user?.current_semester || 0,
    college: user?.college || "",
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    defaultValues: {
      branch: profile.branch,
      current_semester: profile.current_semester,
      college: profile.college,
    },
  });

  const accessToken = Cookies.get("access_token");

  const fetchCourses = async () => {
    if (accessToken) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${accessToken}`);
      try {
        const response = await fetch("http://127.0.0.1:8000/users/courses/", {
          method: "GET",
          headers: myHeaders,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch courses. Please try again.",
        });
        console.error("Error fetching courses:", error);
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [accessToken]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!accessToken) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    try {
      console.log(courseId);
      const response = await fetch(
        `http://127.0.0.1:8000/users/delete/${courseId}/`,
        {
          method: "DELETE",
          headers: myHeaders,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      toast({
        title: "Success",
        description: "Course deleted successfully",
      });

      // Refresh the courses list
      fetchCourses();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete course. Please try again.",
      });
      console.error("Error deleting course:", error);
    }
  };

  // Update the onSubmit function in your ProfilePage component
  const onSubmit = async (data: any) => {
    if (!accessToken) return;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    // Only include fields that have changed
    const updatedData: any = {};
    if (data.branch !== profile.branch) updatedData.branch = data.branch;
    if (data.current_semester !== profile.current_semester)
      updatedData.current_semester = data.current_semester;
    if (data.college !== profile.college) {
      updatedData.college_name = data.college;
      updatedData.college_location = data.college_location;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/users/profile/patch/",
        {
          method: "PATCH",
          headers: myHeaders,
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);

      setIsEditing(false);
      const currentUser = Cookies.get("user")
        ? JSON.parse(Cookies.get("user") as string)
        : null;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          branch: updatedProfile.branch,
          current_semester: updatedProfile.current_semester,
          college: updatedProfile.college,
        };

        // Set the updated user cookie
        Cookies.set("user", JSON.stringify(updatedUser), {
          expires: 7, // or whatever expiration you're using
          path: "/", // or your specific path
        });
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <Toaster />
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
                    <FormField
                      control={form.control}
                      name="college_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College Location</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Required if entering a new college"
                            />
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
                <AddCourseDialog fetchAttendanceCardData={fetchCourses} />
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
                      <TableCell>{course.course_id}</TableCell>
                      <TableCell>{course.course_name}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCourse(course.course_id)}
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
