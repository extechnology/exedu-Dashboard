import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import useStudentProfile from "@/hooks/useStudentProfile";
import useTutorOptions from "@/api/getTutorOptions";
import useCourseOptions from "@/hooks/useCourseOptions";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { Session } from "@/types";

interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: Session | null;
  onUpdate?: (updatedSession: Session) => void;
}

export default function EditSessionModal({
  isOpen,
  onClose,
  sessionData,
  onUpdate,
}: EditSessionModalProps) {
  const { courseOptions } = useCourseOptions();
  const { tutorOptions } = useTutorOptions();
  const { studentProfile: students } = useStudentProfile();

  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState<number>(60);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    if (sessionData) {
      setTitle(sessionData.title || "");
      setDateTime(new Date(sessionData.start_time));
      setDuration(parseDuration(sessionData.duration));
      setSelectedTutor(
        tutorOptions.find((t: any) => t.id === sessionData.tutor) || null
      );
      setSelectedCourse(
        courseOptions.find((c: any) => c.id === sessionData.course) || null
      );
      setSelectedStudents(
        students?.filter((s: any) =>
          sessionData.students?.includes(s.unique_id)
        ) || []
      );
    }
  }, [sessionData, tutorOptions, courseOptions, students]);

  const parseDuration = (isoDuration: string) => {
    const match = isoDuration.match(/PT(\d+)M/);
    return match ? parseInt(match[1], 10) : 60;
  };

  const handleUpdate = async () => {
    if (!sessionData) return;
    try {
      const payload = {
        title,
        course: selectedCourse?.id || null,
        start_time: dateTime?.toISOString(),
        duration: `PT${duration}M`,
        tutor: selectedTutor?.id || null,
        students: selectedStudents.map((s) => s.unique_id),
      };

      const res = await axiosInstance.patch(
        `/session/${sessionData.id}/`,
        payload
      );
      onUpdate && onUpdate(res.data as Session);
      onClose();
      toast.success("Session updated successfully!");
    } catch (err: any) {
      console.error(err.response?.data || err);
      toast.error("Failed to update session");
    }
  };

  const toggleStudentSelection = (student: any) => {
    setSelectedStudents((prev) =>
      prev.find((s) => s.unique_id === student.unique_id)
        ? prev.filter((s) => s.unique_id !== student.unique_id)
        : [...prev, student]
    );
  };

  const isStudentSelected = (student: any) => {
    return selectedStudents.some((s) => s.unique_id === student.unique_id);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 z-50 relative max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Session</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder="Session Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <div className="space-y-1 mb-4">
            <label className="text-sm font-medium text-slate-700">
              Select Course
            </label>
            <select
              title="Select Course"
              value={selectedCourse?.id || ""}
              onChange={(e) =>
                setSelectedCourse(
                  courseOptions.find(
                    (c: any) => c.id === Number(e.target.value)
                  )
                )
              }
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
            >
              <option value="">Select a course</option>
              {courseOptions.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <label className="block mb-2 font-semibold">Date & Time</label>
          <DatePicker
            selected={dateTime}
            onChange={(date: Date | null) => setDateTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <label className="block mb-2 font-semibold">Duration (hours)</label>
          <input
            placeholder="Duration in hours"
            type="number"
            step={0.25}
            value={duration / 60}
            onChange={(e) => setDuration(Number(e.target.value) * 60)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Tutor</label>
            <button
              onClick={() => setShowTutorModal(true)}
              className="w-full border px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors"
            >
              {selectedTutor ? selectedTutor.name : "Select Tutor"}
            </button>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Students</label>
            <button
              onClick={() => setShowStudentModal(true)}
              className="w-full border px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors"
            >
              {selectedStudents.length > 0
                ? `${selectedStudents.length} student${
                    selectedStudents.length > 1 ? "s" : ""
                  } selected`
                : "Select Students"}
            </button>
            {selectedStudents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedStudents.map((student) => (
                  <span
                    key={student.unique_id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {student.name}
                    <button
                      onClick={() => toggleStudentSelection(student)}
                      className="hover:text-indigo-900"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border">
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              Update
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tutor Selection Modal */}
      <AnimatePresence>
        {showTutorModal && (
          <div
            onClick={() => setShowTutorModal(false)}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Select Tutor</h3>
                <button
                  onClick={() => setShowTutorModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                {tutorOptions.map((tutor: any) => (
                  <div
                    key={tutor.id}
                    onClick={() => {
                      setSelectedTutor(tutor);
                      setShowTutorModal(false);
                    }}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      selectedTutor?.id === tutor.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {tutor.name?.charAt(0).toUpperCase() || "T"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">
                          {tutor.name}
                        </h4>
                        {tutor.email && (
                          <p className="text-sm text-slate-500">
                            {tutor.email}
                          </p>
                        )}
                      </div>
                      {selectedTutor?.id === tutor.id && (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student Selection Modal */}
      <AnimatePresence>
        {showStudentModal && (
          <div
            onClick={() => setShowStudentModal(false)}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Select Students</h3>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {students && students.length > 0 ? (
                  students.map((student: any) => (
                    <div
                      key={student.unique_id}
                      onClick={() => toggleStudentSelection(student)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        isStudentSelected(student)
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                          {student.name?.charAt(0).toUpperCase() || "S"}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">
                            {student.name}
                          </h4>
                          {student.email && (
                            <p className="text-sm text-slate-500">
                              {student.email}
                            </p>
                          )}
                          {student.grade && (
                            <p className="text-xs text-slate-400">
                              Grade: {student.grade}
                            </p>
                          )}
                        </div>
                        {isStudentSelected(student) && (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No students available
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                >
                  Done ({selectedStudents.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
