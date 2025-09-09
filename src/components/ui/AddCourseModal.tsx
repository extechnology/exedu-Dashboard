import { useState } from "react";
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
    tutor: "",
    price: "",
    image: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (value: string) => {
    setFormData({ ...formData, title: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value as any);
        }
      });

      await axiosInstance.post("/course/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onCourseAdded) onCourseAdded();
      onClose();
      toast.success("Course added successfully");
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Course Title</Label>
            <Select onValueChange={handleSelect} value={formData.title}>
              <SelectTrigger>
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

          <div>
            <Label>Sub Title</Label>
            <Input
              name="sub_title"
              value={formData.sub_title}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Duration</Label>
            <Input
              name="duration"
              placeholder="e.g. 6 months"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Tutor</Label>
            <Input
              name="tutor"
              placeholder="Tutor name"
              value={formData.tutor}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              placeholder="e.g. 15000"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Course Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
