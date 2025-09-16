import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Calendar,
  Award,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useCourse from "@/hooks/useCourse";
import useStudentProfile from "@/hooks/useStudentProfile";
import AddCourseModal from "@/components/ui/AddCourseModal";
import { Link } from "react-router-dom";


type StatusVariant = "Active" | "Completed" | "Pending";

const Dashboard = () => {
  const { course } = useCourse();
  const { studentProfile } = useStudentProfile();
  const [showModal, setShowModal] = useState(false);
  const accessibleStudentsCount = Array.isArray(studentProfile)
    ? studentProfile.filter((s: any) => s?.can_access_profile).length
    : 0;

  const totalStudentsCount = Array.isArray(studentProfile)
    ? studentProfile.length
    : 0;

  const totalCourses = Array.isArray(course) ? course.length : 0;

  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;


  const allStudents = Array.isArray(studentProfile) ? studentProfile : [];

  const paginatedStudents = showAll
    ? allStudents.slice(
        (currentPage - 1) * studentsPerPage,
        currentPage * studentsPerPage
      )
    : allStudents.slice(0, 5);

  const totalPages = Math.ceil(allStudents.length / studentsPerPage);

  console.log("accessibleStudentsCount", accessibleStudentsCount);
  console.log("paginatted", paginatedStudents);

  const stats = [
    {
      name: "Total Students",
      value: totalStudentsCount,
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      name: "Accessible Students",
      value: accessibleStudentsCount,
      icon: Users,
      change: "+5%",
      trend: "up",
    },
    {
      name: "Active Courses",
      value: totalCourses,
      icon: BookOpen,
      change: "+3",
      trend: "up",
    },
    {
      name: "Certificates Issued",
      value: "4",
      icon: GraduationCap,
      change: "+45",
      trend: "up",
    },
  ];


function formatCourseName(
  course: string | { title?: string; course_name?: string } | null
) {
  if (!course) return "No Course";

  let courseTitle = "";

  if (typeof course === "string") {
    courseTitle = course;
  } else if (typeof course === "object") {
    courseTitle = course.course_name || course.title || "";
  }

  if (!courseTitle) return "No Course";

  return courseTitle
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}


  const recentStudents = Array.isArray(studentProfile)
    ? studentProfile.slice(0, 5)
    : [];

  const getStatusBadge = (status: string): string => {
    const variants: Record<StatusVariant, string> = {
      Active: "bg-blue-500 text-white",
      Completed: "bg-blue-500 text-white",
      Pending: "bg-orange-500 text-black",
    };
    return variants[status as StatusVariant] || "bg-gray-300 text-black";
  };

  const getPaymentStatusBadge = (
    paymentCompleted: boolean,
    paidAmount?: number
  ): string => {
    if (paymentCompleted) {
      return "bg-green-500 text-white";
    } else if (paidAmount && paidAmount > 0) {
      return "bg-yellow-500 text-black";
    } else {
      return "bg-red-500 text-white";
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your education center.
          </p>
        </div>
        {/* <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Student
        </Button> */}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-success font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Students */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedStudents.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {student?.profile_image ? (
                      <div>
                        <img
                          src={`${import.meta.env.VITE_MEDIA_BASE_URL}${
                            student?.profile_image
                          }`}
                          className="h-11 w-11 rounded-full object-cover"
                          alt="profile"
                        />
                      </div>
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                        {student?.name?.charAt(0) ?? "?"}
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-foreground">
                        {student?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.course_name
                          ? formatCourseName(student.course_name)
                          : formatCourseName(student.course)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`${getStatusBadge(
                            student.can_access_profile ? "Active" : "Pending"
                          )}`}
                        >
                          {student.can_access_profile ? "Active" : "Pending"}
                        </Badge>

                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                            student.payment_completed,
                            student.paid_amount
                          )}`}
                        >
                          {student.payment_completed
                            ? "Paid"
                            : student.paid_amount > 0
                            ? "Partial"
                            : "Unpaid"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {!showAll ? (
              <Button
                variant="ghost"
                className="w-full mt-4 text-primary hover:text-white"
                onClick={() => setShowAll(true)}
              >
                View All Students
              </Button>
            ) : (
              <div className="flex flex-col items-center  gap-4 mt-4">
                {/* Pagination Controls */}
                <div className="flex gap-2 ">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm  content-center text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary"
                  onClick={() => {
                    setShowAll(false);
                    setCurrentPage(1);
                  }}
                >
                  Show Less
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {/* <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center hover:text-black gap-2 hover:bg-primary/5 hover:border-primary"
              >
                <Users className="h-6 w-6 text-primary" />
                <span>Add Student</span>
              </Button> */}
              <Button
                variant="outline"
                onClick={() => setShowModal(true)}
                className="h-auto p-4 flex flex-col items-center hover:text-black gap-2 hover:bg-primary/5 hover:border-primary"
              >
                <BookOpen className="h-6 w-6 text-primary" />
                <span>Create Course</span>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center hover:text-black gap-2 hover:bg-primary/5 hover:border-primary"
              >
                <Link
                  to="/admin/attendance"
                  className="flex flex-col items-center gap-2"
                >
                  <Calendar className="h-6 w-6 text-primary" />
                  <span>Mark Attendance</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center hover:text-black gap-2 hover:bg-primary/5 hover:border-primary"
              >
                <Link
                  to="/admin/certificates"
                  className="flex flex-col items-center gap-2"
                >
                  <Award className="h-6 w-6 text-primary" />
                  <span>Issue Certificates</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}

      <AddCourseModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Dashboard;
