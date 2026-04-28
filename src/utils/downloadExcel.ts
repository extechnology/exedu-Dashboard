import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

type AttendanceRecord = {
  student_name: string;
  course_name: string;
  status: string;
  date: string;
  session_title?: string | null;
};

export function downloadExcel(records: AttendanceRecord[], fileName: string) {
  if (!Array.isArray(records) || records.length === 0) {
    alert("No data available to download");
    return;
  }

  const data = records.map((r) => ({
    "Student Name": r.student_name,
    Course: r.course_name || "N/A",
    Status: r.status?.charAt(0).toUpperCase() + r.status.slice(1),
    Date: format(new Date(r.date), "dd MMM yyyy"),
    Session: r.session_title || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${fileName}.xlsx`,
  );
}
