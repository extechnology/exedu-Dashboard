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
import { User, BookOpen, DollarSign } from "lucide-react";

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onStudentAdded?: () => void;
  courses?: { id: string; title: string }[];
}

export default function AddStudentModal({
  open,
  onClose,
  onStudentAdded,
  courses = [],
}: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    profile_image: null as File | null,
    name: "",
    email: "",
    phone_number: "",
    secondary_school: "",
    secondary_year: "",
    university: "",
    university_major: "",
    university_year: "",
    career_objective: "",
    skills: "",
    experience: "",
    interests: "",
    is_public: false,
    can_access_profile: false,
    course: "",
    bach_number: "",
    payment_completed: false,
    paid_amount: "",
  });

  const [loading, setLoading] = useState(false);

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    if (target instanceof HTMLInputElement && type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelect = (value: string, field: keyof typeof formData) => {
    setFormData((prev) => {
      let parsed: string | number | boolean = value;

      if (field === "paid_amount") {
        parsed = Number(value);
      } else if (field === "payment_completed") {
        parsed = value === "true";
      }

      return { ...prev, [field]: parsed };
    });
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profile_image: e.target.files![0] }));
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

      await axiosInstance.post("student/profile/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Student added successfully");
      onClose();
      onStudentAdded?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-primary" />
            Add New Student
          </DialogTitle>
        </DialogHeader>

        {/* Personal Info */}
        <div className="mb-6 border p-4 rounded-md bg-muted/20">
          <h3 className="flex items-center gap-2 font-medium mb-2">
            <User className="h-4 w-4 text-primary" /> Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Student Name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
            <div>
              <Label>Profile Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="mb-6 border p-4 rounded-md bg-muted/20">
          <h3 className="flex items-center gap-2 font-medium mb-2">
            <BookOpen className="h-4 w-4 text-primary" /> Education
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Secondary School</Label>
              <Input
                name="secondary_school"
                value={formData.secondary_school}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                name="secondary_year"
                value={formData.secondary_year}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>University</Label>
              <Input
                name="university"
                value={formData.university}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Major</Label>
              <Input
                name="university_major"
                value={formData.university_major}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                name="university_year"
                value={formData.university_year}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Career */}
        <div className="mb-6 border p-4 rounded-md bg-muted/20">
          <h3 className="font-medium mb-2">Career & Skills</h3>
          <div className="space-y-4">
            <div>
              <Label>Career Objective</Label>
              <Textarea
                name="career_objective"
                value={formData.career_objective}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Skills</Label>
              <Textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Experience</Label>
              <Textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Interests</Label>
              <Textarea
                name="interests"
                value={formData.interests}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Course & Payment */}
        {/* Course & Payment Section */}
        <div className="mb-6 border rounded-xl bg-muted/20 p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-lg mb-4 text-primary">
            <DollarSign className="h-5 w-5" /> Course & Payment
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Course */}
            <div>
              <Label className="text-sm font-medium mb-1">Course</Label>
              <Select
                onValueChange={(v) => handleSelect(v, "course")}
                value={formData.course}
              >
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

            {/* Batch Number */}
            <div>
              <Label className="text-sm font-medium mb-1">Batch Number</Label>
              <Input
                name="bach_number"
                value={formData.bach_number}
                onChange={handleChange}
                placeholder="Enter batch number"
              />
            </div>

            {/* Payment Completed + Paid Amount */}
            <div className="col-span-2 flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <div className="flex items-center gap-3">
                <Label className="font-medium">Payment Completed</Label>
                <input
                  title="Payment Completed"
                  type="checkbox"
                  name="payment_completed"
                  checked={formData.payment_completed}
                  onChange={handleChange}
                  className="toggle toggle-primary"
                />
              </div>

              <div className="flex flex-col">
                <Label className="text-sm font-medium mb-1">Paid Amount</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name="paid_amount"
                    type="number"
                    value={formData.paid_amount}
                    onChange={handleChange}
                    placeholder="₹ 0"
                    className="placeholder:text-muted-foreground"
                  />
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      formData.payment_completed
                        ? "bg-green-500 text-white"
                        : Number(formData.paid_amount) > 0
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {formData.payment_completed
                      ? "Paid"
                      : Number(formData.paid_amount) > 0
                      ? "Partial"
                      : "Unpaid"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="mb-6 border rounded-xl bg-muted/20 p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-primary">
            Privacy Settings
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Profile Public</Label>
              <input
                title="Profile Public"
                type="checkbox"
                name="is_public"
                checked={formData.is_public}
                onChange={handleChange}
                className="toggle toggle-secondary"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-medium">Can Access Profile</Label>
              <input
                title="Can Access Profile"
                type="checkbox"
                name="can_access_profile"
                checked={formData.can_access_profile}
                onChange={handleChange}
                className="toggle toggle-secondary"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
