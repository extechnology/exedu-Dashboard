import { useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { X } from "lucide-react";
import useTutorData from "@/hooks/useTutorDatas";

const TutorAttendanceCalendarView = ({ tutor, onClose }) => {
  const { tutorAttendance } = useTutorData(tutor?.id);
  console.log(tutorAttendance, "tutor attendance in TutorAttendanceCalenderView");

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

        <Calendar tileClassName={tileClassName} />

        <div className="flex justify-center gap-4 mt-6">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div> Present
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div> Absent
          </span>
        </div>
      </div>
    </div>
  );
};

export default TutorAttendanceCalendarView;
