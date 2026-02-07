import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import { parseISO, format } from "date-fns";
import "react-calendar/dist/Calendar.css";
import { X } from "lucide-react";
import useTutorData from "@/hooks/useTutorDatas";

const TutorAttendanceCalendarView = ({ tutor, onClose }) => {
  const { tutorAttendance } = useTutorData(tutor?.id);
  console.log(
    tutorAttendance,
    "tutor attendance in TutorAttendanceCalenderView",
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedAttendance = useMemo(() => {
    if (!selectedDate) return null;

    const formatted = format(selectedDate, "yyyy-MM-dd");
    return tutorAttendance.find((record) => record.date === formatted);
  }, [selectedDate, tutorAttendance]);

  console.log(tutor, "tutor from props in TutorAttendanceCalenderView");
  const attendanceMap = useMemo(() => {
    const map = {};
    tutorAttendance.forEach((record) => {
      map[record.date] = record.status;
    });
    return map;
  }, [tutorAttendance]);
  console.log(attendanceMap, "attendance map");

  const tileClassName = ({ date }) => {
    const formatted = format(date, "yyyy-MM-dd");

    if (attendanceMap[formatted] === "present") {
      return "rounded-full bg-green-200 text-green-700 font-semibold";
    }
    if (attendanceMap[formatted] === "absent") {
      return "rounded-full bg-red-200 text-red-700 font-semibold";
    }
    return "";
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return "-";
    const [hours, minutes] = duration.split(":").map(Number);

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes) return `${minutes} minutes`;
    return "-";
  };

  const formatTime = (dateTime?: string) => {
    if (!dateTime) return "-";

    // Django format → ISO-safe
    const isoString = dateTime.replace(" ", "T");

    return format(parseISO(isoString), "hh:mm a");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative">
        <button
          title="close"
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-center mb-6">
          Attendance for {tutor?.name}
        </h2>
        <div className="flex justify-center">
          <Calendar
            tileClassName={tileClassName}
            onClickDay={(value) => setSelectedDate(value)}
          />
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div> Present
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div> Absent
          </span>
        </div>

        {selectedDate && (
          <div className="mt-6 border rounded-2xl p-4 bg-gray-50">
            <h3 className="font-semibold mb-3">
              {format(selectedDate, "MMMM dd, yyyy")}
            </h3>

            {selectedAttendance ? (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Session:</span>{" "}
                  {selectedAttendance.session_title || "—"}
                </p>

                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {formatDuration(selectedAttendance.duration)}
                </p>

                <p>
                  <span className="font-medium">Start Time:</span>{" "}
                  {formatTime(selectedAttendance.start_time)}
                </p>

                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`capitalize font-semibold ${
                      selectedAttendance.status === "present"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedAttendance.status}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No attendance recorded for this date.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorAttendanceCalendarView;
