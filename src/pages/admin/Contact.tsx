// src/pages/EnquiryPage.tsx
import React from "react";
import useContact from "@/hooks/useContact";

const ContactPage: React.FC = () => {
  const { contact, loading, error } = useContact();
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Contacts
        </h1>

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
                <th className="p-3 text-left">Action</th>
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
                  <td className="p-3 border border-gray-200">
                    <button className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 transition">
                      View
                    </button>
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
