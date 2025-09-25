import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import useTutorOptions from "@/api/getTutorOptions";

interface AddCourseModalProps {
  open: boolean;
  onClose: () => void;
  onCourseAdded?: () => void;
}

const courseOptions = [
  {
    value: "ai_advanced_digital_marketing",
    label: "AI Advanced Digital Marketing",
  },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "ui_ux_design", label: "UI/UX Design" },
  { value: "web_and_app_development", label: "Web & App Development" },
  { value: "video_editing", label: "Video Editing" },
  { value: "robotics", label: "Robotics" },
];

export default function AddCourseModal({
  open,
  onClose,
  onCourseAdded,
}: AddCourseModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    description: "",
    duration: "",
    tutor_id: "",
    price: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const {tutorOptions} = useTutorOptions();
  console.log(tutorOptions, "tutorOptions");

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

  const handleSelect = (value: string) => {
    setFormData({ ...formData, title: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) return toast.error("Please select a course title");
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") data.append(key, value as any);
      });

      await axiosInstance.post("/course/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course added successfully");
      onCourseAdded?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white dark:bg-card/80 rounded-xl shadow-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Add New Course
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-10 w-10 rounded-md object-cover"
              />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 px-4 py-2">
          {/* Course Title */}
          <div className="space-y-1">
            <Label>Course Title</Label>
            <Select onValueChange={handleSelect} value={formData.title}>
              <SelectTrigger className="w-full border bg-muted/50">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((course) => (
                  <SelectItem key={course.value} value={course.value}>
                    {course.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subtitle */}
          <div className="space-y-1">
            <Label>Sub Title</Label>
            <Input
              name="sub_title"
              value={formData.sub_title}
              onChange={handleChange}
              placeholder="Enter course subtitle"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Course description..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Duration</Label>
              <Input
                name="duration"
                placeholder="e.g. 6 months"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label>Tutor</Label>
              
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Price</Label>
              <Input
                name="price"
                type="number"
                placeholder="e.g. 15000"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label>Course Image</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {formData.image ? "Change Image" : "Upload Image"}
                </Button>
                <input
                  title="Upload Image"
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-12 w-12 rounded-md object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-4 py-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 flex items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
