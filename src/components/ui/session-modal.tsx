import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import useStudentProfile from "@/hooks/useStudentProfile";
import useTutorOptions from "@/api/getTutorOptions";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { Session } from "@/types";
import useCourseOptions from "@/hooks/useCourseOptions";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (newSession: Session) => void;
}

export default function SessionModal({
  isOpen,
  onClose,
  onSave,
}: SessionModalProps) {
  const [title, setTitle] = useState("");
  const { courseOptions } = useCourseOptions();
  const [dateTime, setDateTime] = useState<Date | null>(new Date());
  const [duration, setDuration] = useState<number>(60);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { tutorOptions } = useTutorOptions();
  const { studentProfile: students } = useStudentProfile();
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const region = localStorage.getItem("region");
  const regionId = localStorage.getItem("region_id");

  const handleSave = async () => {
    try {
      const payload = {
        title,
        course: selectedCourse?.id || null,
        start_time: dateTime?.toISOString(),
        duration: `PT${duration}M`,
        tutor: selectedTutor?.id || null,
        students: selectedStudents.map((s) => s.unique_id),
        region: Number(regionId),
      };

      const res = await axiosInstance.post("/session/", payload);
      console.log("Session created:", res.data);

      onSave && onSave(res.data as Session);
      onClose();
      toast.success("Session Created Successfully");
    } catch (err: any) {
      console.error(err.response?.data || err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Session Modal */}
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
            <h2 className="text-xl font-bold">Create Session</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <input
            type="text"
            placeholder={region}
            disabled
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />
          <input
            type="text"
            placeholder="Session Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          {/* Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Select Course
            </label>
            <select
              title="Select a course"
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
            title="Duration (hours)"
            type="number"
            step={0.25} // allow quarter-hour increments
            value={duration / 60} // show hours
            onChange={(e) => setDuration(Number(e.target.value) * 60)} // convert hours → minutes
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          {/* Tutor Selection */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Tutor</label>
            <button
              onClick={() => setShowTutorModal(true)}
              className="w-full border px-3 py-2 rounded-lg text-left"
            >
              {selectedTutor ? selectedTutor.name : "Select Tutor"}
            </button>
          </div>

          {/* Student Selection */}
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
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
            >
              Save
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tutor Modal */}
      {showTutorModal && (
        <div
          onClick={() => setShowTutorModal(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-md relative z-60"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Tutor</h3>
              <button
                onClick={() => setShowTutorModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {tutorOptions?.map((tutor: any) => (
                <div
                  key={tutor.id}
                  className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center hover:bg-violet-50 ${
                    selectedTutor?.id === tutor.id
                      ? "border-green-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedTutor(tutor);
                    setShowTutorModal(false);
                  }}
                >
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                  <span className="text-sm font-medium">{tutor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {showStudentModal && (
        <div
          onClick={() => setShowStudentModal(false)}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-full max-w-lg relative z-60"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Students</h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {students?.map((student: any) => {
                const isSelected = selectedStudents.some(
                  (s) => s.unique_id === student.unique_id
                );
                return (
                  <div
                    key={student.unique_id}
                    className={`cursor-pointer border rounded-xl p-3 flex items-center gap-3 hover:bg-violet-50 transition-all ${
                      isSelected
                        ? "border-green-500 ring-2 ring-green-300"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedStudents((prev) =>
                          prev.filter((s) => s.unique_id !== student.unique_id)
                        );
                      } else {
                        setSelectedStudents((prev) => [...prev, student]);
                      }
                    }}
                  >
                    {student.profile_image ? (
                      <img
                        src={student.profile_image}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-black font-bold">
                        {student.name?.charAt(0).toUpperCase() || "S"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        {student.course_details?.title_display ||
                          student.course_name ||
                          "No Course"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowStudentModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowStudentModal(false)}
                className="px-4 py-2 rounded-lg bg-green-500 text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
