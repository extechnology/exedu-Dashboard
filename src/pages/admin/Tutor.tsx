import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Mail, Phone, User, X } from "lucide-react";

interface Tutor {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
  image?: string;
}

const TutorPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone_number: string;
    image: File | null;
  }>({
    name: "",
    email: "",
    phone_number: "",
    image: null,
  });

  const fetchTutors = async () => {
    try {
      const res = await axiosInstance.get<Tutor[]>("/tutor/");
      setTutors(res.data);
    } catch (err) {
      console.error("Failed to fetch tutors:", err);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone_number);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await axiosInstance.post<Tutor>("/tutor/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTutors([...tutors, res.data]);
      setFormData({ name: "", email: "", phone_number: "", image: null }); // reset properly
      setOpen(false);
    } catch (err) {
      console.error("Failed to add tutor:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Tutors
            </h1>
            <p className="text-slate-600 mt-2">Manage your tutoring team</p>
          </div>
          <motion.button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md hover:scale-105 transition-transform"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="p-2 text-white group-hover:shadow-lg transition-all duration-200">
              <PlusCircle size={20} />
            </div>
            <span className="font-semibold text-white">Add New Tutor</span>
          </motion.button>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/40 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl text-white">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Tutors</p>
                <p className="text-2xl font-bold text-slate-800">
                  {tutors.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor.id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/40 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {tutor.image ? (
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="w-16 h-16 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {tutor.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Tutor Info */}
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {tutor.name}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-sm truncate max-w-[180px]">
                      {tutor.email || "No email provided"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span className="text-sm">
                      {tutor.phone_number || "No phone provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Effect Indicator */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {tutors.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No tutors yet
            </h3>
            <p className="text-slate-500 mb-6">
              Get started by adding your first tutor
            </p>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-200"
            >
              <PlusCircle size={20} />
              Add First Tutor
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Add New Tutor</h2>
                  <button
                    type="button"
                    title="Close Modal"
                    onClick={() => setOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter tutor's full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="tutor@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Profile Image
                    </label>
                    <input
                      title="Upload your profile image"
                      type="file"
                      name="profile_image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 
               focus:border-indigo-400 focus:outline-none transition-colors 
               bg-slate-50 focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                    >
                      {loading ? "Adding..." : "Add Tutor"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TutorPage;
