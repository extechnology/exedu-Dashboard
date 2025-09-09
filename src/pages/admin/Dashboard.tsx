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

const Dashboard = () => {

  const { course } = useCourse();
  const { studentProfile } = useStudentProfile();
  const accessibleStudentsCount = Array.isArray(studentProfile)
    ? studentProfile.filter((s: any) => s?.can_access_profile).length
    : 0;

  const totalStudentsCount = Array.isArray(studentProfile)
    ? studentProfile.length
    : 0;

  const totalCourses = Array.isArray(course) ? course.length : 0;

  console.log("accessibleStudentsCount", accessibleStudentsCount);
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
      value: "892",
      icon: GraduationCap,
      change: "+45",
      trend: "up",
    },
  ];

  function formatCourseName(course: string | null) {
    if (!course) return "No Course";
    return course
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }


  const recentStudents = Array.isArray(studentProfile)
    ? studentProfile.slice(0, 5)
    : [];


  const upcomingTasks = [
    {
      id: 1,
      title: "Review certificate applications",
      count: 12,
      priority: "high",
    },
    { id: 2, title: "Update course materials", count: 5, priority: "medium" },
    { id: 3, title: "Student progress review", count: 23, priority: "low" },
    { id: 4, title: "Attendance verification", count: 8, priority: "high" },
  ];

  
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
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Student
        </Button>
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
              {recentStudents.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {student?.name?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {student?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCourseName(student?.course) ?? "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge
                        variant={
                          student?.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          student?.status === "Active"
                            ? "bg-success text-success-foreground"
                            : ""
                        }
                      >
                        {student?.status ?? "Pending"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {student?.progress ?? 0}% complete
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-primary hover:text-primary"
            >
              View All Students
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.count} items
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "high"
                        ? "border-destructive text-destructive"
                        : task.priority === "medium"
                        ? "border-warning text-warning"
                        : "border-success text-success"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
            >
              <Users className="h-6 w-6 text-primary" />
              <span>Add Student</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <span>Create Course</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
            >
              <Calendar className="h-6 w-6 text-primary" />
              <span>Mark Attendance</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
            >
              <Award className="h-6 w-6 text-primary" />
              <span>Issue Certificate</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
