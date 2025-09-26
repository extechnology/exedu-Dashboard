"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Users,
  Clock,
  Download,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStudentProfile from "@/hooks/useStudentProfile";
import useAttendance from "@/hooks/useAttendance";
import useCourse from "@/hooks/useCourse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useSession from "@/hooks/useSession";

type Status = "Present" | "Absent" | "Late" | null;

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const { studentProfile, loading, error } = useStudentProfile();
  const { course, loading: courseLoading, error: courseError } = useCourse();
  const CourseTitles = Array.isArray(course) ? course.map((c) => c.title) : [];
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const { session } = useSession();
  console.log(session, "sessions");
  const selectedSessionObj = Array.isArray(course)
    ? course.find((c: any) => c.title === selectedSession)
    : null;
  const sessionId = selectedSession ? Number(selectedSession) : undefined;
  const {
    records,
    saveAttendance,
    loading: attendanceLoading,
    error: attendanceError,
  } = useAttendance(selectedDate, sessionId);

  const accessibleStudents = useMemo(
    () =>
      Array.isArray(studentProfile)
        ? studentProfile.filter((s: any) => s?.can_access_profile)
        : [],
    [studentProfile]
  );

  const SessionOptions = Array.isArray(session)
    ? session.map((s: any) => {
        const formattedLabel = `Session ${s.title} - ${s.duration} (${s.start_time})`;
        return (
          <SelectItem key={s.id} value={String(s.id)}>
            {formattedLabel}
          </SelectItem>
        );
      })
    : [];

  const firstCourseValue =
    SessionOptions.length > 0 ? (SessionOptions[0].props.value as string) : "";

  const filteredStudents = useMemo(() => {
    if (!selectedSession) {
      return accessibleStudents.filter((s: any) => s.title);
    }
    return accessibleStudents.filter(
      (s: any) => String(s.student_details) === selectedSession
    );
  }, [accessibleStudents, selectedSession]);

  useEffect(() => {
    if (SessionOptions.length > 0 && !selectedSession) {
      setSelectedSession(SessionOptions[0].props.value as string);
    }
  }, [SessionOptions, selectedSession]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage, studentsPerPage]);

  function formatCourseName(course: string | null) {
    if (!course) return "No Course";
    return course
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const [statusMap, setStatusMap] = useState<Record<string, Status>>({});

  useEffect(() => {
    if (records.length > 0) {
      const next: Record<string, Status> = {};
      records.forEach((r) => {
        if (r.status === "present") next[String(r.student)] = "Present";
        else if (r.status === "absent") next[String(r.student)] = "Absent";
        else if (r.status === "late") next[String(r.student)] = "Late";
        else next[String(r.student)] = null;
      });
      setStatusMap(next);
    } else {
      setStatusMap({});
    }
  }, [records, accessibleStudents]);

  const setStudentStatus = (id: string, status: Status) =>
    setStatusMap((m) => ({ ...m, [id]: status }));

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    let present = 0,
      absent = 0,
      late = 0;
    for (const s of filteredStudents) {
      const st = statusMap[s.unique_id];
      if (st === "Present") present++;
      else if (st === "Late") late++;
      else if (st === "Absent") absent++;
    }
    const attendanceRate = total ? Math.round((present / total) * 100) : 0;
    return { totalStudents: total, present, absent, late, attendanceRate };
  }, [filteredStudents, statusMap]);

  const getStatusBadge = (status: Status) => {
    const variants = {
      Present: {
        className: "bg-success text-success-foreground",
        icon: UserCheck,
      },
      Late: { className: "bg-warning text-warning-foreground", icon: Clock },
      Absent: {
        className: "bg-destructive text-destructive-foreground",
        icon: UserX,
      },
    };
    return variants[status];
  };

  const bulkSet = (status: Status) => {
    setStatusMap((m) => {
      const next = { ...m };
      filteredStudents.forEach((s: any) => {
        next[s.unique_id] = status;
      });
      return next;
    });
  };

  const handleGenerateReport = () => {
    if (!filteredStudents.length) {
      alert("No students available for report");
      return;
    }

    const data = filteredStudents.map((student: any) => {
      const status = statusMap[student.unique_id] || "Not Marked";
      return {
        Name: student.name,
        Course: formatCourseName(student.course),
        Status: status,
        Date: selectedDate.toLocaleDateString(),
      };
    });

    data.push({
      Name: "----",
      Course: "Summary",
      Status: `Present: ${stats.present}, Absent: ${stats.absent}, Late: ${stats.late}`,
      Date: "",
    });

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    // Export as Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `Attendance_Report_${selectedDate.toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Attendance Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage student attendance across all courses.
          </p>
        </div>
      </div>

      {/* Stats Overview (DYNAMIC) */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalStudents}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Present Today
                </p>
                <p className="text-2xl font-bold text-success">
                  {stats.present}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Absent Today
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {stats.absent}
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Attendance Rate
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.attendanceRate}%
                </p>
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
        <Card className="w-full content-center max-w-md mx-auto border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>Select Date</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Attendance List */}
        <Card className="lg:col-span-3 border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Attendance Records</CardTitle>
              <div className="flex gap-2">
                <div className="flex gap-2">
                  <Button
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                    onClick={() => {
                      if (!sessionId) {
                        alert(
                          "Please select a course before saving attendance"
                        );
                        return;
                      }

                      const updates = filteredStudents.map((s: any) => {
                        const uiStatus = statusMap[s.unique_id] || "Absent"; // "Present" | "Absent" | "Late"
                        return {
                          student: s.unique_id, // UUID
                          status: uiStatus.toLowerCase() as
                            | "present"
                            | "absent"
                            | "late",
                        };
                      });

                      saveAttendance(updates);
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select
                    value={selectedSession}
                    onValueChange={setSelectedSession}
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Filter by Session" />
                    </SelectTrigger>
                    <SelectContent>{SessionOptions}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{String(error)}</p>}

            <div className="space-y-4">
              {!loading && filteredStudents.length === 0 && (
                <p className="text-muted-foreground">No students found.</p>
              )}

              {paginatedStudents
                .slice()
                .sort((a: any, b: any) =>
                  (a?.name || "").localeCompare(b?.name || "")
                )
                .map((student: any) => {
                  const currentStatus: Status = statusMap[student.unique_id];
                  const statusInfo = getStatusBadge(currentStatus) || {
                    icon: () => null,
                    label: currentStatus,
                    color: "gray",
                  };
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={student.unique_id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                          {student.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium  text-foreground">
                            {student.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.course_name || "No Course"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={
                              currentStatus === "Present"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setStudentStatus(student.unique_id, "Present")
                            }
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              currentStatus === "Late" ? "default" : "outline"
                            }
                            onClick={() =>
                              setStudentStatus(student.unique_id, "Late")
                            }
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              currentStatus === "Absent" ? "default" : "outline"
                            }
                            onClick={() =>
                              setStudentStatus(student.unique_id, "Absent")
                            }
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Absent
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pagination Controls */}
      {filteredStudents.length > studentsPerPage && (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <span className="text-sm text-muted-foreground">
                  Showing {paginatedStudents.length} of{" "}
                  {filteredStudents.length} students
                </span>
              </div>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions (now functional for the current filtered list) */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
              onClick={() => bulkSet("Present")}
            >
              <UserCheck className="h-6 w-6 text-primary" />
              <span>Mark All Present (Filtered)</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-warning/5 hover:border-warning"
              onClick={() => bulkSet("Late")}
            >
              <Clock className="h-6 w-6 text-warning" />
              <span>Mark All Late (Filtered)</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-destructive/5 hover:border-destructive"
              onClick={() => bulkSet("Absent")}
            >
              <UserX className="h-6 w-6 text-destructive" />
              <span>Mark All Absent (Filtered)</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/5 hover:border-accent"
              onClick={handleGenerateReport}
            >
              <Download className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
