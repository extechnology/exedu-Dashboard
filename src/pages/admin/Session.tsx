import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import ExeduButton from "@/components/ui/exedu-button";
import SessionModal from "@/components/ui/session-modal";
import { Calendar, Clock, Users, User, Eye, X } from "lucide-react";
import { Session } from "@/types";
import useSession from "@/hooks/useSession";



const SessionPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const {session} = useSession()
  console.log(session,"session in session page")

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get("/session/");
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSessions();
  }, []);

  const handleSave = (newSession: Session) => {
    setSessions((prev) => [...prev, newSession]);
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

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

        {/* Session Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => {
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
                        {session.title || "Untitled Session"}
                      </h3>
                      <div className="flex items-center mt-2 text-indigo-100">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{date}</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-5 h-5" />
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
                      {session.duration}
                    </span>
                  </div>

                  {/* Tutor */}
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-3 text-purple-500" />
                    <div className="flex items-center">
                      {session.tutor_details?.profile_image ? (
                        <img
                          src={session.tutor.profile_image}
                          alt={session.tutor.name}
                          className="w-6 h-6 rounded-full mr-2 border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-purple-100 mr-2 flex items-center justify-center">
                          <User className="w-3 h-3 text-purple-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {session.tutor?.name || "No tutor assigned"}
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
                    {session.student_details.slice(0, 3).map((student, index) => {
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
                  title="open modal"
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="text-white hover:text-indigo-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
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
                    {selectedSession.duration}
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
                        {selectedSession.tutor.name}
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
                {selectedSession.students.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedSession.students.slice(0, 3).map((student) => {
                      let imgSrc: string | null = null;

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
                              src={imgSrc} // now TypeScript knows this is a string
                              alt={student.name || "Student"}
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
    </div>
  );
};

export default SessionPage;
