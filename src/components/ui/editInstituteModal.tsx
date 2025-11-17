import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import type { Region } from "@/types";

interface EditRegionModalProps {
  open: boolean;
  onClose: () => void;
  region: Region | null;
  onRegionUpdated: (updatedRegion: Region) => void;
}


const EditRegionModal = ({
  open,
  onClose,
  region,
  onRegionUpdated,
}: EditRegionModalProps) => {
  const [formData, setFormData] = useState({
    region: "",
    phone: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  // Prefill data when modal opens
  useEffect(() => {
    if (region) {
      setFormData({
        region: region.region || "",
        phone: region.phone || "",
        image: null,
      });
    }
  }, [region]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!region) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("region", formData.region);
      formDataToSend.append("phone", formData.phone);
      if (formData.image) formDataToSend.append("image", formData.image);

      const res = await axiosInstance.patch<Region>(
        `/region/${region.id}/`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Institute updated successfully");
      onRegionUpdated(res.data);
      onClose();
    } catch (error) {
      console.error("Error updating Institute:", error);
      toast.error("Failed to update Institute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Institute</h2>
                <button
                title="Close"
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Full Name *
                  </label>
                  <input
                    placeholder="John Doe"
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                  />
                </div>


                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <input
                    placeholder="+91 98765 43210"
                    type="text"
                    name="phone"
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
                    placeholder="Upload Profile Image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-indigo-400 focus:outline-none transition-colors bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium disabled:opacity-50 hover:shadow-lg transition-all duration-200"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditRegionModal;
