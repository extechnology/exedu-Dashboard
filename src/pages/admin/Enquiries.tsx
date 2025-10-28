import React from "react";
import useEnquiry from "@/hooks/useEnquiry";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

const Enquiries: React.FC = () => {
  const { enquiry, loading, error } = useEnquiry();

  const handleGenerateReport = () => {
      if (!enquiry.length) {
        alert("No enquiries to export");
        return;
      }
  
      // Map enquiries to Excel rows
      const data = enquiry.map((enquiry) => ({
        ID: enquiry.id,
        Name: enquiry.name,
        Email: enquiry.email,
        Number: enquiry.phone,
        Course: enquiry.title,
        "Submitted At": format(
          new Date(enquiry.created_at),
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


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-6">
            Course Enquiries
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
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Course Title</th>
                <th className="p-3 text-left">Created At</th>
                {/* <th className="p-3 text-left">Action</th> */}
              </tr>
            </thead>
            <tbody>
              {enquiry.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="p-3 border border-gray-200">{lead.id}</td>
                  <td className="p-3 border border-gray-200">{lead.name}</td>
                  <td className="p-3 border border-gray-200">{lead.phone}</td>
                  <td className="p-3 border border-gray-200">{lead.email}</td>
                  <td className="p-3 border border-gray-200">{lead.title}</td>
                  <td className="p-3 border border-gray-200">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                  {/* <td className="p-3 border border-gray-200">
                    <button className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 transition">
                      View
                    </button>
                  </td> */}
                </tr>
              ))}
              {enquiry.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-5 text-gray-500 italic"
                  >
                    No leads found.
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

export default Enquiries;
