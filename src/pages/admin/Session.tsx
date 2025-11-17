import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import ExeduButton from "@/components/ui/exedu-button";
import SessionModal from "@/components/ui/session-modal";
import {
  Calendar,
  Clock,
  Users,
  User,
  Eye,
  X,
  Search,
  Edit,
} from "lucide-react";
import { Session } from "@/types";
import useSession from "@/hooks/useSession";
import useCourseOptions from "@/hooks/useCourseOptions";
import EditSessionModal from "@/components/ui/EditSessionModal";

const SessionPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { session } = useSession();
  const { courseOptions } = useCourseOptions();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const region = localStorage.getItem("region");
  console.log(session, "session");

  const handleSessionUpdate = (updated: Session) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const sessionsWithCourseTitle = session?.filter((session) => {
    const course = courseOptions.find((c) => c.id === session.course && c?.region_name === region);
    return {
      ...session,
      courseTitle: course ? course.title : "Unknown Course",
    };
  });

  console.log(sessionsWithCourseTitle, "session with course title");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get("/session/");
        const sortedSessions = res.data.sort((a: Session, b: Session) => {
          if (a.created_at && b.created_at) {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          }
          return (b.id || 0) - (a.id || 0);
        });
        setSessions(sortedSessions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSessions();
  }, []);

  const handleSave = (newSession: Session) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) => session?.region_name === region).filter((session) => {
    const query = searchQuery.toLowerCase();
    return (
      session.title?.toLowerCase().includes(query) ||
      session.tutor_details?.name?.toLowerCase().includes(query) ||
      session.student_details?.some((student) =>
        student.name?.toLowerCase().includes(query)
      ) ||
      session.duration?.toLowerCase().includes(query)
    );
  });

  function formatCourseName(course: string | null) {
    if (!course) return "No Course";
    return course
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  console.log(filteredSessions, "filteredSessions");
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sessions
            </h1>
            <p className="text-gray-600 mt-2">Manage your tutoring sessions</p>
          </div>
          <ExeduButton
            label="Create Session"
            onClick={() => setShowModal(true)}
          />
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sessions by title, tutor, student, or duration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredSessions.length} session
              {filteredSessions.length !== 1 ? "s" : ""} matching "{searchQuery}
              "
            </p>
          )}
        </div>

        {/* Session Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const { date, time } = formatDateTime(session.start_time);

            return (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold truncate">
                        {formatCourseName(session.course_details?.title) ||
                          "Untitled Session"}
                      </h3>
                      <div className="flex items-center mt-2 text-indigo-100">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{date}</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div>
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Time and Duration */}
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 mr-3 text-indigo-500" />
                    <span className="text-sm font-medium">{time}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {(() => {
                        if (!session?.duration) return "";
                        const [hoursStr, minutesStr] =
                          session.duration.split(":");
                        const hours = parseInt(hoursStr, 10);
                        const minutes = parseInt(minutesStr, 10);
                        if (minutes > 0) {
                          return `${hours + minutes / 60} hr`;
                        }
                        return `${hours} hr`;
                      })()}
                    </span>
                  </div>

                  {/* Tutor */}
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-purple-500" />
                    <div className="flex items-center">
                      {session.tutor_details?.profile_image ? (
                        <img
                          src={session.tutor.profile_image}
                          alt={session.tutor_details.name}
                          className="w-6 h-6 rounded-full mr-2 border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-purple-100 mr-2 flex items-center justify-center">
                          <User className="w-3 h-3 text-purple-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {session.tutor_details?.name || "No tutor assigned"}
                      </span>
                    </div>
                  </div>

                  {/* Students Count */}
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3 text-emerald-500" />
                    <span className="text-sm text-gray-700">
                      {session.student_details.length} student
                      {session.student_details.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 pb-4">
                  <div className="flex -space-x-2">
                    {session.student_details
                      .slice(0, 3)
                      .map((student, index) => {
                        let imgSrc = "";

                        if (student.profile_image) {
                          if (typeof student.profile_image === "string") {
                            imgSrc = student.profile_image;
                          } else if (student.profile_image instanceof File) {
                            imgSrc = URL.createObjectURL(student.profile_image);
                          }
                        }

                        return (
                          <div key={student.id} className="relative">
                            {imgSrc ? (
                              <img
                                src={imgSrc}
                                alt={student.name}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white shadow-sm flex items-center justify-center">
                                <span className="text-xs font-semibold text-white">
                                  {student.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {session.student_details.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">
                          +{session.student_details.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No sessions yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first session to get started
            </p>
            <ExeduButton
              label="Create Your First Session"
              onClick={() => setShowModal(true)}
            />
          </div>
        )}

        {/* No Search Results */}
        {sessions.length > 0 && filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or create a new session
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showModal && (
        <SessionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Session Detail Modal */}
      {showDetailModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedSession.title || "Session Details"}
                  </h2>
                  <div className="flex items-center text-indigo-100">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {formatDateTime(selectedSession.start_time).date}
                    </span>
                    <span className="mx-3">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {formatDateTime(selectedSession.start_time).time}
                    </span>
                  </div>
                </div>
                <button
                  title="close modal"
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-indigo-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div
                onClick={() => {
                  setSelectedSession(selectedSession);
                  setEditModalOpen(true);
                }}
                title="edit session"
                className="text-sm relative bottom-4 right-3 rounded-md flex justify-end  text-white"
              >
                <Edit className="w-5 h-5" />
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Session Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Duration</h3>
                  </div>
                  <p className="text-indigo-700 font-medium">
                    <span className="text-sm ">
                      {(() => {
                        if (!session[0]?.duration) return "";
                        const [hoursStr, minutesStr] =
                          session[0].duration.split(":");
                        const hours = parseInt(hoursStr, 10);
                        const minutes = parseInt(minutesStr, 10);
                        if (minutes > 0) {
                          return `${hours + minutes / 60} hr`;
                        }
                        return `${hours} hr`;
                      })()}
                    </span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      Participants
                    </h3>
                  </div>
                  <p className="text-purple-700 font-medium">
                    {selectedSession.students.length +
                      (selectedSession.tutor ? 1 : 0)}{" "}
                    total
                  </p>
                </div>
              </div>

              {/* Tutor Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl">
                <div className="flex items-center mb-3">
                  <User className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Tutor</h3>
                </div>
                {selectedSession.tutor ? (
                  <div className="flex items-center">
                    {selectedSession.tutor.profile_image ? (
                      <img
                        src={selectedSession.tutor.profile_image}
                        alt={selectedSession.tutor.name}
                        className="w-12 h-12 rounded-full border-3 border-emerald-200 mr-3"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center mr-3">
                        <User className="w-6 h-6 text-emerald-700" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {selectedSession.tutor_details.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Session Instructor
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No tutor assigned</p>
                )}
              </div>

              {/* Students Section */}
              <div>
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    Students ({selectedSession.students.length})
                  </h3>
                </div>
                {selectedSession.student_details.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedSession.student_details.map((student) => {
                      let imgSrc: string | null = null;
                      console.log("Rendering student:", student.name);

                      if (student.profile_image) {
                        if (typeof student.profile_image === "string") {
                          imgSrc = student.profile_image;
                        } else if (student.profile_image instanceof File) {
                          imgSrc = URL.createObjectURL(student.profile_image);
                        }
                      }

                      return (
                        <div key={student.id} className="relative">
                          {imgSrc ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={imgSrc}
                                alt={student.name || "Student"}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                              />
                              <h1>{student?.name ?? "Student"}</h1>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white shadow-sm flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">
                                {student.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No students enrolled yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <EditSessionModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        sessionData={selectedSession}
        onUpdate={handleSessionUpdate}
      />
    </div>
  );
};

export default SessionPage;
