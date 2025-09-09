import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Users,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useCourse from "@/hooks/useCourse";
import AddCourseModal from "@/components/ui/AddCourseModal";
import CourseDetailsModal from "@/components/ui/courseDetailsmodal";
import useStudentProfile from "@/hooks/useStudentProfile";


// Map Django choice keys to display labels
const courseLabelMap: Record<string, string> = {
  ai_advanced_digital_marketing: "AI Advanced Digital Marketing",
  graphic_design: "Graphic Design",
  ui_ux_design: "UI/UX Design",
  web_and_app_development: "Web & App Development",
  video_editing: "Video Editing",
  robotics: "Robotics",
};

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { course } = useCourse();
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { studentProfile } = useStudentProfile();

  function formatCourseName(course: string | null) {
    if (!course) return "No Course";
    return course
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const filteredCourses = Array.isArray(course)
    ? course.filter((course) => {
        const search = searchTerm.toLowerCase();
        return (
          (course.title || "").toLowerCase().includes(search) ||
          (course.tutor || "").toLowerCase().includes(search) ||
          (course.description || "").toLowerCase().includes(search)
        );
      })
    : [];

  // Get only active users
  const activeUsers = Array.isArray(studentProfile)
    ? studentProfile.filter((p) => p.can_access_profile)
    : [];

  // Group active users by course
  const studentsByCourse: Record<string, number> = activeUsers.reduce(
    (acc, user) => {
      const courseName = user.course || "No Course"; // API gives label
      acc[courseName] = (acc[courseName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );


  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-success text-success-foreground",
      Upcoming: "bg-warning text-warning-foreground",
      Completed: "bg-primary text-primary-foreground",
      Draft: "bg-muted text-muted-foreground",
    };
    return (
      variants[status as keyof typeof variants] ||
      "bg-muted text-muted-foreground"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Course Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, edit, and manage all your educational courses.
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          onClick={() => setShowModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-3 border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground top-3" />
              <Input
                placeholder="Search courses by title, instructor, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {filteredCourses.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Courses</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_MEDIA_BASE_URL}${course.image}`}
                alt=""
              />
            </div>

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg leading-tight">
                      {formatCourseName(course.title)}
                    </CardTitle>
                    <Badge className={getStatusBadge(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCourse(course);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Students
                    </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium">{course.tutor}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {studentsByCourse[courseLabelMap[course.title]] || 0}
                  </span>
                </div>

                {/* <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(course.startDate).toLocaleDateString()}
                  </span>
                </div> */}

                {/* {course.rating > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-warning" />
                      {course.rating}
                    </span>
                  </div>
                )} */}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {/* <div className="text-lg font-bold text-primary">
                  {course.price}
                </div> */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      setDetailsOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <AddCourseModal open={showModal} onClose={() => setShowModal(false)} />
      </div>
      <div>
        <CourseDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          course={selectedCourse}
        />
      </div>

      {filteredCourses.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No courses found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Courses;
