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
  Calendar,
  BookOpen,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const courses = [
    {
      id: 1,
      title: "AI Digital Marketing",
      description: "Learn artificial intelligence applications in modern digital marketing strategies",
      instructor: "Dr. Sarah Chen",
      duration: "3 months",
      startDate: "2024-04-20",
      students: 45,
      status: "Active",
      rating: 4.8,
      price: "$299",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "Full Stack Web Development",
      description: "Complete web development course covering frontend and backend technologies",
      instructor: "Michael Rodriguez",
      duration: "6 months",
      startDate: "2024-03-15",
      students: 32,
      status: "Active",
      rating: 4.9,
      price: "$499",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Introduction to data analysis, machine learning, and statistical modeling",
      instructor: "Prof. Emily Watson",
      duration: "4 months",
      startDate: "2024-05-01",
      students: 28,
      status: "Upcoming",
      rating: 4.7,
      price: "$399",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      description: "Master user interface and user experience design principles",
      instructor: "Alex Thompson",
      duration: "2 months",
      startDate: "2024-02-10",
      students: 38,
      status: "Completed",
      rating: 4.6,
      price: "$199",
      image: "/api/placeholder/300/200"
    },
    {
      id: 5,
      title: "Mobile App Development",
      description: "Build native mobile applications for iOS and Android platforms",
      instructor: "Lisa Park",
      duration: "5 months",
      startDate: "2024-04-05",
      students: 22,
      status: "Active",
      rating: 4.8,
      price: "$449",
      image: "/api/placeholder/300/200"
    },
    {
      id: 6,
      title: "Cybersecurity Essentials",
      description: "Learn essential cybersecurity concepts and practical implementations",
      instructor: "Robert Kim",
      duration: "3 months",
      startDate: "2024-06-01",
      students: 0,
      status: "Draft",
      rating: 0,
      price: "$349",
      image: "/api/placeholder/300/200"
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-success text-success-foreground",
      Upcoming: "bg-warning text-warning-foreground",
      Completed: "bg-primary text-primary-foreground",
      Draft: "bg-muted text-muted-foreground"
    };
    return variants[status as keyof typeof variants] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
          <p className="text-muted-foreground mt-1">Create, edit, and manage all your educational courses.</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
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
              <div className="text-2xl font-bold text-foreground">{courses.length}</div>
              <div className="text-sm text-muted-foreground">Total Courses</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary" />
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                    <Badge className={getStatusBadge(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Students
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium">{course.instructor}</span>
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
                    {course.students}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(course.startDate).toLocaleDateString()}
                  </span>
                </div>

                {course.rating > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-warning" />
                      {course.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-lg font-bold text-primary">{course.price}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
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

      {filteredCourses.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No courses found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Courses;