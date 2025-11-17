import { useState } from "react";
import useCourseOptions from "@/hooks/useCourseOptions";
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
  console.log(courseOptions, "courseOptions");
  const region = localStorage.getItem("region");
  const regionId = localStorage.getItem("region_id");
  console.log(region,"region from localstorage")

  const [time, setTime] = useState("");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    course: "",
    batch_number: "",
    date: "",
    time_start: "",
    region: regionId,
    end_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "course" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let formattedTime = "";
      if (time) {
        const [hhmm, period] = time.split(" ");
        let [hours, minutes] = hhmm.split(":").map((x) => parseInt(x, 10));

        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:00`;
      }

      const payload = {
        ...formData,
        course: Number(formData.course),
        time_start: formattedTime,
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
        <h2 className = "p-3 mb-3 bg-gray-400 rounded-lg text-white">Institute : {region}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tutor dropdown */}

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
          <div className="space-y-4">
            {/* Batch Number */}
            <div>
              <label
                htmlFor="batch_number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Batch Number
              </label>
              <input
                type="text"
                id="batch_number"
                name="batch_number"
                value={formData.batch_number}
                onChange={handleChange}
                placeholder="Enter batch number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Starting Date
              </label>
              <input
                title="Select Date"
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ending Date
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
          </div>

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
