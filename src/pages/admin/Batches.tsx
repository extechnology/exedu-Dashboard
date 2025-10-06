import { useState } from "react";
import AddBatchModal from "@/components/ui/addBatchModal";
import useBatches from "@/hooks/useBatch";
import {
  PlusCircle,
  X,
  Clock,
  Calendar,
  User,
  Users,
  BookOpen,
  Timer,
  Search,
  Filter,
  ChevronRight,
  GraduationCap,
  Mail,
  Edit,
} from "lucide-react";
import useStudentProfile from "@/hooks/useStudentProfile";
import type { Tutor } from "@/api/getTutorOptions";
import type { Batch } from "@/types";
import { Link } from "react-router-dom";

export default function BatchesPage() {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { batch } = useBatches();
  const { studentProfile } = useStudentProfile();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  console.log(selectedBatch);
  console.log(batch, "batch");
  console.log(studentProfile, "studentProfile");

  const filteredStudents = selectedBatch
    ? studentProfile.filter(
        (student) => student.batch_number === selectedBatch.batch_number
      )
    : [];

  const filteredBatches = batch?.filter(
    (b) =>
      b.batch_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tutor &&
        b.tutor.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.course_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudentCount = (batchNumber: string) => {
    return studentProfile.filter(
      (student) => student.batch_number === batchNumber
    ).length;
  };

  function formatCourseName(course: string | null) {
    if (!course) return "No Course";
    return course
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-2">
              Batch Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and monitor your training batches
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Batches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {batch?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {studentProfile?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="Search batches, tutors, or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            {/* <select
              title="Filter Batches"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Batches</option>
              <option value="recent">Recent</option>
              <option value="upcoming">Upcoming</option>
            </select> */}

            <AddBatchModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              onSuccess={() => {
                console.log("Batch created successfully!");
              }}
            />
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium"
            >
              <PlusCircle size={20} />
              Add Batch
            </button>
          </div>
        </div>
      </div>

      {/* Batch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBatches?.map((b) => (
          <div
            key={b.id}
            className="group bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedBatch(b)}
          >
            {/* Batch Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Batch {b.batch_number}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatCourseName(b.course_name)}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>

            {/* Batch Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Date:</span>
                </div>
                <span className="text-gray-900">{b.date}</span>
                <span className="text-gray-400">to</span>
                <span className="text-gray-900">{b.end_date || "--"}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-600">
                    {b.time_start
                      ? new Date(
                          `1970-01-01T${b.time_start}`
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "--"}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Count */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">Students</span>
              </div>
              <span className="text-lg font-bold text-indigo-600">
                {getStudentCount(b.batch_number)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredBatches?.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No batches found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or create a new batch
          </p>
        </div>
      )}

      {/* Enhanced Batch Details Modal */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
              <button
                title="Close"
                type="button"
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                onClick={() => setSelectedBatch(null)}
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    Batch {selectedBatch.batch_number}
                  </h2>
                  <p className="text-indigo-100">
                    {" "}
                    {formatCourseName(selectedBatch.course_name)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end relative bottom-2">
                <button className="flex items-center gap-2 px-3 py-1.5 shadow-lg backdrop-blur-md  text-white rounded-lg transition-colors">
                  <span>Edit</span>
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Batch Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBatch.date} to {selectedBatch.end_date || "--"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Start Time</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBatch.time_start
                          ? new Date(
                              `1970-01-01T${selectedBatch.time_start}`
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "--"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-2xl border border-orange-100">
                  <div className="flex items-center gap-3">
                    <Timer className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBatch.time_start} hrs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Students Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    Enrolled Students
                  </h3>
                  <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {filteredStudents?.length} Students
                  </div>
                </div>

                {filteredStudents?.length > 0 ? (
                  <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.unique_id}
                        className="bg-white p-4 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="text-decoration-none cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {student.profile_image ? (
                                <img
                                  src={`${import.meta.env.VITE_MEDIA_BASE_URL}${
                                    student.profile_image
                                  }`}
                                  alt={student.name}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                                />
                              ) : (
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                                  {student.name
                                    ? student.name.charAt(0).toUpperCase()
                                    : "?"}
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {student.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <p className="text-sm text-gray-600">
                                  {student.email}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  {student.course_name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                Active
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      No Students Enrolled
                    </h4>
                    <p className="text-gray-500">
                      This batch doesn't have any students assigned yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
