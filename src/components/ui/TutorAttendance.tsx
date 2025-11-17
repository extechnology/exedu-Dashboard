import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, parseISO } from "date-fns";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useTutorAttendance } from "@/hooks/useTutorAttendance";

const TutorAttendanceModal = ({ sessions }) => {
  const { markAttendance, loading } = useTutorAttendance();

  const sortedSessions = useMemo(() => {
    return [...sessions].sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );
  }, [sessions]);

  const [selectedSessionId, setSelectedSessionId] = useState(
    sortedSessions[0]?.id || null
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const selectedSession = useMemo(
    () => sortedSessions.find((s) => s.id === selectedSessionId),
    [sortedSessions, selectedSessionId]
  );

  const tutorId = selectedSession?.tutor_details?.id;

  const handleMark = async () => {
    if (!selectedDate || !selectedStatus || !selectedSessionId) {
      return toast.error("Please select date and status.");
    }

    if (!tutorId) {
      return toast.error("Tutor ID missing!");
    }

    await markAttendance(
      tutorId,
      selectedSessionId,
      format(selectedDate, "yyyy-MM-dd"),
      selectedStatus as "present" | "absent"
    );

    toast.success("Attendance marked successfully!");

    setSelectedStatus("");
  };

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Tutor Attendance
        </h2>

        <div className="flex justify-between gap-4">
          {/* CALENDAR */}
          <div className="rounded-lg border p-3 bg-gray-50">
            <Calendar onClickDay={setSelectedDate} value={selectedDate} />
          </div>

          {/* RIGHT SECTION */}
          <div className="w-[50%]">
            {/* SESSION DROPDOWN */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Session
            </label>
            <div className="relative mb-5">
              <select
              title="select session"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2"
              >
                {sortedSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — {format(parseISO(s.start_time), "dd MMM yyyy")}
                  </option>
                ))}
              </select>
              {/* <ChevronDown className="absolute right-3 top-3 text-gray-500" /> */}
            </div>

            {/* TUTOR INFO */}
            {selectedSession && (
              <div className="bg-gray-50 border rounded-xl p-3 mb-5">
                <p className="font-medium text-gray-800">
                  Tutor: {selectedSession.tutor_details?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {selectedSession.duration}
                </p>
              </div>
            )}

            {/* SELECT ATTENDANCE */}
            {selectedDate && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">
                  Mark for {format(selectedDate, "MMMM dd, yyyy")}
                </h3>

                <div className="flex gap-3 mb-4">
                  {["present", "absent"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedStatus(s)}
                      className={`px-4 py-2 rounded-xl capitalize border ${
                        selectedStatus === s
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleMark}
                  disabled={loading}
                  className="w-full px-6 py-2 bg-green-600 text-white rounded-xl"
                >
                  {loading ? "Saving..." : "Save Attendance"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorAttendanceModal;
