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
import axiosInstance from "@/api/axiosInstance";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useCourse from "@/hooks/useCourse";
import { toast } from "sonner";

const AddCourseModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { fetchCourses } = useCourse();
  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    description: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (open) {
      axiosInstance
        .get("/course-options/")
        .then((res) => setCourseOptions(res.data))
        .catch((err) => console.error(err));
    }
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "image" && files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("sub_title", formData.sub_title);
      data.append("description", formData.description);
      if (formData.image) data.append("image", formData.image);

      await axiosInstance.post("/course/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchCourses();
      toast.success("Course added successfully");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Course Title Dropdown */}
          <Select
            onValueChange={(val) => setFormData({ ...formData, title: val })}
            value={formData.title}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courseOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            name="sub_title"
            placeholder="Subtitle"
            value={formData.sub_title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Course description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />

          <Input type="file" name="image" onChange={handleChange} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseModal;
