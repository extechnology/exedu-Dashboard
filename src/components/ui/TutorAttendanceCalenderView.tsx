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

  const sortedAttendance = useMemo(() => {
    return [...tutorAttendance].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [tutorAttendance]);

  const attendanceSummary = useMemo(() => {
    let totalDays = 0;
    let presentDays = 0;
    let absentDays = 0;
    let totalMinutesWorked = 0;

    tutorAttendance.forEach((record) => {
      totalDays++;

      if (record.status === "present") {
        presentDays++;

        if (record.duration) {
          const [h = 0, m = 0] = record.duration.split(":").map(Number);
          totalMinutesWorked += h * 60 + m;
        }
      }

      if (record.status === "absent") {
        absentDays++;
      }
    });

    const hours = Math.floor(totalMinutesWorked / 60);
    const minutes = totalMinutesWorked % 60;

    return {
      totalDays,
      presentDays,
      absentDays,
      totalMinutesWorked,
      formattedHours: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
    };
  }, [tutorAttendance]);

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

  const currentMonth = format(new Date(), "yyyy-MM");

  const filteredAttendance = tutorAttendance.filter((r) =>
    r.date.startsWith(currentMonth),
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[999] p-4"
    >
      <div className="grid grid-cols-2 gap-4 mb-6 pr-10">
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-sm text-gray-600">Present Days</p>
          <p className="text-2xl font-bold text-green-600">
            {attendanceSummary.presentDays}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-sm text-gray-600">Absent Days</p>
          <p className="text-2xl font-bold text-red-600">
            {attendanceSummary.absentDays}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <p className="text-sm text-gray-600">Total Days</p>
          <p className="text-2xl font-bold text-blue-600">
            {attendanceSummary.totalDays}
          </p>
        </div>

        <div className="rounded-xl bg-purple-50 p-4 text-center">
          <p className="text-sm text-gray-600">Hours Worked</p>
          <p className="text-2xl font-bold text-purple-600">
            {attendanceSummary.formattedHours}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative">
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

        {/* <div className="mt-6">
          <h3 className="font-semibold mb-3 text-gray-800">
            Full Attendance History
          </h3>

          <div className="max-h-[260px] overflow-y-auto rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Session</th>
                  <th className="px-3 py-2 text-left">Duration</th>
                  <th className="px-3 py-2 text-left">Start</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {sortedAttendance.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2">
                      {format(parseISO(record.date), "dd MMM yyyy")}
                    </td>

                    <td className="px-3 py-2">{record.session_title || "—"}</td>

                    <td className="px-3 py-2">
                      {formatDuration(record.duration)}
                    </td>

                    <td className="px-3 py-2">
                      {formatTime(record.start_time)}
                    </td>

                    <td className="px-3 py-2">
                      <span
                        className={`font-semibold capitalize ${
                          record.status === "present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {sortedAttendance.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div> */}

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
