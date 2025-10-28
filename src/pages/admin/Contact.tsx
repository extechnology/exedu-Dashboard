// src/pages/EnquiryPage.tsx
import React from "react";
import useContact from "@/hooks/useContact";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";


const ContactPage: React.FC = () => {
  const { contact, loading, error } = useContact();
  const handleGenerateReport = () => {
    if (!contact.length) {
      alert("No enquiries to export");
      return;
    }

    // Map enquiries to Excel rows
    const data = contact.map((enquiry) => ({
      ID: enquiry.id,
      Name: enquiry.name,
      Email: enquiry.email,
      Number: enquiry.number,
      Course: enquiry.course,
      "Submitted At": format(
        new Date(enquiry.submitted_at),
        "dd MMM yyyy, hh:mm a"
      ),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    // Export as Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      blob,
      `Enquiries_Report_${format(new Date(), "yyyy-MM-dd_HH-mm")}.xlsx`
    );
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-6">
            Contacts
          </h1>
          <div className="flex justify-end mb-4">
            <button
            title="generate report"
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-2 rounded-lg hover:opacity-90"
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Number</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Submitted At</th>
                {/* <th className="p-3 text-left">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {contact.map((enquiry) => (
                <tr
                  key={enquiry.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="p-3 border border-gray-200">{enquiry.id}</td>
                  <td className="p-3 border border-gray-200">{enquiry.name}</td>
                  <td className="p-3 border border-gray-200">
                    {enquiry.email}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {enquiry.number}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {enquiry.course}
                  </td>
                  <td className="p-3 border border-gray-200">
                    {new Date(enquiry.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {contact.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-5 text-gray-500 italic"
                  >
                    No enquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
