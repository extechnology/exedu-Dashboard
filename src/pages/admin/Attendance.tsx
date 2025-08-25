import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon,
  Users,
  Check,
  X,
  Clock,
  Filter,
  Download,
  UserCheck,
  UserX
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const courses = [
    { id: "ai-marketing", name: "AI Digital Marketing" },
    { id: "web-dev", name: "Web Development" },
    { id: "data-science", name: "Data Science" },
    { id: "ui-ux", name: "UI/UX Design" },
  ];

  const attendanceData = [
    {
      id: 1,
      student: "Alice Johnson",
      course: "AI Digital Marketing",
      date: "2024-01-25",
      status: "Present",
      checkIn: "09:00 AM",
      checkOut: "05:00 PM",
      avatar: "AJ"
    },
    {
      id: 2,
      student: "Bob Smith",
      course: "Web Development",
      date: "2024-01-25",
      status: "Late",
      checkIn: "09:30 AM",
      checkOut: "05:00 PM",
      avatar: "BS"
    },
    {
      id: 3,
      student: "Carol Davis",
      course: "Data Science",
      date: "2024-01-25",
      status: "Absent",
      checkIn: "-",
      checkOut: "-",
      avatar: "CD"
    },
    {
      id: 4,
      student: "David Wilson",
      course: "UI/UX Design",
      date: "2024-01-25",
      status: "Present",
      checkIn: "08:45 AM",
      checkOut: "05:15 PM",
      avatar: "DW"
    },
    {
      id: 5,
      student: "Eva Martinez",
      course: "AI Digital Marketing",
      date: "2024-01-25",
      status: "Present",
      checkIn: "09:10 AM",
      checkOut: "05:00 PM",
      avatar: "EM"
    }
  ];

  const stats = {
    totalStudents: 45,
    present: 32,
    absent: 8,
    late: 5,
    attendanceRate: 82
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Present: { className: "bg-success text-success-foreground", icon: UserCheck },
      Late: { className: "bg-warning text-warning-foreground", icon: Clock },
      Absent: { className: "bg-destructive text-destructive-foreground", icon: UserX }
    };
    return variants[status as keyof typeof variants] || variants.Absent;
  };

  const filteredAttendance = attendanceData.filter(record => {
    if (selectedCourse === "all") return true;
    return record.course.toLowerCase().includes(selectedCourse.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage student attendance across all courses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <UserCheck className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalStudents}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold text-success">{stats.present}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Absent Today</p>
                <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <UserX className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-foreground">{stats.attendanceRate}%</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Calendar */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Attendance List */}
        <Card className="lg:col-span-3 border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Attendance Records</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAttendance.map((record) => {
                const statusInfo = getStatusBadge(record.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                        {record.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{record.student}</p>
                        <p className="text-sm text-muted-foreground">{record.course}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">Check In</p>
                        <p className="font-medium">{record.checkIn}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-muted-foreground">Check Out</p>
                        <p className="font-medium">{record.checkOut}</p>
                      </div>
                      <Badge className={statusInfo.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
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
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary">
              <UserCheck className="h-6 w-6 text-primary" />
              <span>Mark Present</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-warning/5 hover:border-warning">
              <Clock className="h-6 w-6 text-warning" />
              <span>Mark Late</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-destructive/5 hover:border-destructive">
              <UserX className="h-6 w-6 text-destructive" />
              <span>Mark Absent</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/5 hover:border-accent">
              <Download className="h-6 w-6 text-accent" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;