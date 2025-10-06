import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
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
    // Converts "PT90M" → 90 (minutes)
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

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 z-50 relative"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Session</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Session Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          {/* Course */}
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

          {/* Date & Time */}
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

          {/* Duration */}
          <label className="block mb-2 font-semibold">Duration (hours)</label>
          <input
            placeholder="Duration in hours"
            type="number"
            step={0.25}
            value={duration / 60}
            onChange={(e) => setDuration(Number(e.target.value) * 60)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          {/* Tutor */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Tutor</label>
            <button
              onClick={() => setShowTutorModal(true)}
              className="w-full border px-3 py-2 rounded-lg text-left"
            >
              {selectedTutor ? selectedTutor.name : "Select Tutor"}
            </button>
          </div>

          {/* Students */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Students</label>
            <button
              onClick={() => setShowStudentModal(true)}
              className="w-full border px-3 py-2 rounded-lg text-left"
            >
              {selectedStudents.length > 0
                ? `${selectedStudents.length} selected`
                : "Select Students"}
            </button>
          </div>

          {/* Actions */}
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

      {/* Tutor & Student Modals - same logic as AddSessionModal */}
      {/* Reuse same modal blocks for selecting tutor/students */}
    </>
  );
}
