import { useState } from "react";
import { useAdminBatchReport } from "@/hooks/useAdminBatchReport";
import {
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AdminBatchReportPage = () => {
  const { data, loading, error, refetch } = useAdminBatchReport();
  const [expandedBatches, setExpandedBatches] = useState({});
  const region = localStorage.getItem("region");
  console.log(data,"date from the hook")

  const toggleBatch = (batchNumber) => {
    setExpandedBatches((prev) => ({
      ...prev,
      [batchNumber]: !prev[batchNumber],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
          <p className="text-slate-600 font-medium">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">
            Error Loading Report
          </h3>
          <p className="text-slate-600 text-center mb-4">{error}</p>
          <button
            onClick={refetch}
            className="w-full bg-violet-600 text-white rounded-lg py-2 px-4 hover:bg-violet-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalStudents =
    data?.reduce((acc, batch) => acc + Number(batch.total_students || 0), 0) ||
    0;

  const totalEarnings =
    data?.reduce((acc, batch) => acc + Number(batch.total_earnings || 0), 0) ||
    0;

  const totalPending =
    data?.reduce((acc, batch) => acc + Number(batch.pending_fees || 0), 0) || 0;

  const totalBatches = data?.length || 0;

  console.log(totalEarnings, "totalEarnings");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Batch Report Dashboard
          </h1>
          <p className="text-slate-600">
            Overview of all course batches and student payments
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">
              Total Batches
            </h3>
            <p className="text-3xl font-bold text-slate-900">{totalBatches}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">
              Total Students
            </h3>
            <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">
              Total Earnings
            </h3>
            <p className="text-xl font-bold text-slate-900">₹{totalEarnings}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">
              Pending Fees
            </h3>
            <p className="text-xl font-bold text-slate-900">₹{totalPending}</p>
          </div>
        </div>

        {/* Batch Cards */}
        {data && data.length > 0 ? (
          <div className="space-y-6">
            {data.map((batch) => {
              const isExpanded = expandedBatches[batch.batch_number];

              return (
                <div
                  key={batch.batch_number}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all"
                >
                  {/* Batch Header - Clickable */}
                  <button
                    onClick={() => toggleBatch(batch.batch_number)}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-700 p-6 text-white hover:from-violet-700 hover:to-indigo-800 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-left">
                        <h2 className="text-2xl font-bold mb-2">
                          {batch.course_name}
                        </h2>
                        <p className="text-indigo-100">
                          Batch #{batch.batch_number}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                          <p className="text-sm font-medium">
                            {batch.total_students} Students
                          </p>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Collapsible Content */}
                  {isExpanded && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Batch Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              Total Earnings
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                              ₹{batch.total_earnings.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              Pending Fees
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                              ₹{batch.pending_fees.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">
                              Completion Rate
                            </p>
                            <p className="text-lg font-bold text-slate-900">
                              {Math.round(
                                (batch.students.filter(
                                  (s) => s.payment_completed
                                ).length /
                                  batch.total_students) *
                                  100
                              )}
                              %
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Students Table */}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                          Student Payment Details
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                                  Student
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                                  Email
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">
                                  Amount Paid
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {batch.students.map((student, idx) => (
                                <tr
                                  key={student.email}
                                  className={`border-b border-slate-100 ${
                                    idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                                  } hover:bg-indigo-50 transition-colors`}
                                >
                                  <td className="py-4 px-4">
                                    <p className="font-medium text-slate-900">
                                      {student.name}
                                    </p>
                                  </td>
                                  <td className="py-4 px-4">
                                    <p className="text-slate-600 text-sm">
                                      {student.email}
                                    </p>
                                  </td>
                                  <td className="py-4 px-4 text-right">
                                    <p className="font-semibold text-slate-900">
                                      ₹
                                      {(
                                        student.paid_amount ?? 0
                                      ).toLocaleString()}
                                    </p>
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    {student.payment_completed ? (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Paid
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4 mx-auto">
              <GraduationCap className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Batch Reports Available
            </h3>
            <p className="text-slate-600">
              There are currently no batches to display.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBatchReportPage;
