import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance"; 
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";

interface Tutor {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
}

const TutorPage: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
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

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post<Tutor>("/tutor/", formData);
      setTutors([...tutors, res.data]); 
      setFormData({ name: "", email: "", phone_number: "" });
      setOpen(false);
    } catch (err) {
      console.error("Failed to add tutor:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-violet-700">Tutors</h1>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md hover:scale-105 transition-transform"
        >
          <PlusCircle size={20} /> Add Tutor
        </button>
      </div>

      {/* Tutor list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <motion.div
            key={tutor.id}
            className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold text-violet-600">
              {tutor.name}
            </h2>
            <p className="text-gray-600">{tutor.email || "No Email"}</p>
            <p className="text-gray-500">{tutor.phone_number || "No Phone"}</p>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-violet-600">
                Add Tutor
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-400"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-400"
                />
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-400"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TutorPage;
