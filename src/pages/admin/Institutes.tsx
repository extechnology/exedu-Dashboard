import axiosInstance from "@/api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Mail, Phone, User, X, Edit } from "lucide-react";
import EditTutorModal from "@/components/ui/EditTutorModal";
import { useEffect, useState } from "react";
import useRegion from "@/hooks/useRegion";
import type { Region } from "@/types";
import { format } from "date-fns";
import EditRegionModal from "@/components/ui/editInstituteModal";
import useUsers from "@/hooks/useUser";

const InstitutePage: React.FC = () => {
  const [institutes, setInstitutes] = useState<Region[]>([]);
  const [open, setOpen] = useState(false);
  const {
    region: Regions,
    loading: regionLoading,
    error: regionError,
  } = useRegion();
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const region = localStorage.getItem("region");
  const regionId = localStorage.getItem("region_id");
  const { data } = useUsers();
  console.log(data, "user data");
  const userId = localStorage.getItem("userId");
  console.log(userId, "user id");

  const superUser = data?.filter(
    (user) => user.id === Number(userId) && user.is_superuser === true,
  );
  console.log(superUser, "super user");
  const [formData, setFormData] = useState<{
    phone: string;
    image: File | null;
    region: number;
  }>({
    phone: "",
    image: null,
    region: Number(regionId),
  });

  const handleInstituteUpdated = (updatedRegion: Region) => {
    setInstitutes((prev) =>
      prev.map((t) => (t.id === updatedRegion.id ? updatedRegion : t)),
    );
  };

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
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("region", String(formData.region));
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await axiosInstance.post<Region>("/region/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setInstitutes([...institutes, res.data]);
      setFormData({ phone: "", image: null, region: Number(regionId) });
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
              Institutes
            </h1>
            <p className="text-slate-600 mt-2">Manage your Institutes here</p>
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
            <span className="font-semibold text-white">Add New Institute</span>
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
                <p className="text-sm text-slate-600">Total Institutes</p>
                <p className="text-2xl font-bold text-slate-800">
                  {Regions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Regions.map((region, index) => (
            <motion.div
              key={region.id}
              className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/40 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {superUser?.some((user) => user.is_superuser) && (
                <div
                  className="pt-4 absolute right-5 top-3 flex justify-center"
                  title="Edit region"
                >
                  <div
                    onClick={() => {
                      setSelectedRegion(region);
                      setEditOpen(true);
                    }}
                  >
                    <Edit className="text-slate-400 group-hover:text-indigo-600 h-4 w-4" />
                  </div>
                </div>
              )}

              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {region.image ? (
                  <img
                    src={region.image}
                    alt={region.region}
                    className="w-16 h-16 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {region.region.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* region Info */}
              <div className="text-center space-y-3">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {region.region || "No email provided"}
                </h3>
                <h3 className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">
                  {region.phone || "No Phone provided"}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span className="text-sm truncate max-w-[180px]">
                      {region.created_at &&
                        format(
                          new Date(region.created_at),
                          "dd MMM yyyy, hh:mm a",
                        )}
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
        {Regions.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <User size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No Institutes yet
            </h3>
            <p className="text-slate-500 mb-6">
              Get started by adding your first Institute
            </p>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-200"
            >
              <PlusCircle size={20} />
              Add First Institute
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
                  <h2 className="text-2xl font-bold">Add New Institute</h2>
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
                      Institute
                    </label>
                    <input
                      type="text"
                      name="region"
                      placeholder="Enter the Institute Place"
                      value={formData.region}
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
                      name="phone"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={formData.phone}
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
                      {loading ? "Adding..." : "Add Institute"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <EditRegionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        region={selectedRegion}
        onRegionUpdated={handleInstituteUpdated}
      />
    </div>
  );
};

export default InstitutePage;
