import { useState } from "react";
import useCourseOptions from "@/hooks/useCourseOptions";
import useTutorOptions from "@/api/getTutorOptions";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

interface AddBatchModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBatchModal({
  open,
  onClose,
  onSuccess,
}: AddBatchModalProps) {
  const { courseOptions } = useCourseOptions();
  const { tutorOptions } = useTutorOptions();
  console.log(tutorOptions, "tutorOptions");
  console.log(courseOptions, "courseOptions");

  const [time, setTime] = useState("");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1–12
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    tutor_id: "",
    course: "",
    batch_number: "",
    date: "",
    time_start: "",
    duration: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "tutor_id" || name === "course" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        tutor_id: Number(formData.tutor_id),
        course: Number(formData.course),
      };

      await axiosInstance.post("/batches/", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setLoading(false);
      onSuccess();
      onClose();
      toast.success("Batch created successfully");
    } catch (err) {
      console.error(err);
      setError("Failed to create batch");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/95 rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">Add New Batch</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tutor dropdown */}
          <select
            title="Select Tutor"
            name="tutor_id"
            value={formData.tutor_id}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
            onChange={handleChange}
            required
          >
            <option value="">Select Tutor</option>
            {tutorOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            title="Select Course"
            name="course"
            value={formData.course}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
            onChange={handleChange}
            required
          >
            <option value="">Select Course</option>
            {courseOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Batch Number */}
          <input
            type="text"
            name="batch_number"
            value={formData.batch_number}
            onChange={handleChange}
            placeholder="Batch Number"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
          />

          {/* Date */}
          <input
            title="Select Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
          />

          {/* Time */}
          <div className="flex gap-2 items-center">
            {/* Hours */}
            <select
              title="Select Time"
              value={time.split(":")[0] || ""}
              onChange={(e) => setTime(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
            >
              <option value="">HH</option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            {/* Minutes */}
            <select
              title="Select Time"
              value={time.split(":")[1]?.slice(0, 2) || ""}
              onChange={(e) =>
                setTime(
                  (prev) => `${prev.split(":")[0] || ""}:${e.target.value}`
                )
              }
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
            >
              <option value="">MM</option>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* AM/PM */}
            <select
              title="Select Time"
              value={time.split(" ")[1] || ""}
              onChange={(e) =>
                setTime((prev) => `${prev.split(" ")[0]} ${e.target.value}`)
              }
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500"
            >
              <option value="">AM/PM</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div>
              <p className="text-gray-500 font-medium">Time: {time}</p>
            </div>
          </div>

          {/* Duration */}
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (e.g., 2 hours)"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Batch"}
          </button>
        </form>
      </div>
    </div>
  );
}
