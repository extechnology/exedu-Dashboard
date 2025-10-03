import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
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
import { StudentProfile } from "@/types";

const courseOptions = [
  {
    value: 1,
    key: "ai_advanced_digital_marketing",
    label: "AI Advanced Digital Marketing",
  },
  { value: 2, key: "graphic_design", label: "Graphic Design" },
  { value: 3, key: "ui_ux_design", label: "UI/UX Design" },
  { value: 4, key: "web_and_app_development", label: "Web & App Development" },
  { value: 5, key: "video_editing", label: "Video Editing" },
  { value: 6, key: "robotics", label: "Robotics" },
];

interface SimpleStudent {
  user: string; 
  name: string;
  course: string;
}

interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students?: SimpleStudent[]; 
}


export default function CertificateModal({
  open,
  onClose,
  onSuccess,
  students,
}: CertificateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(selectedStudent, "selectedStudent");
  console.log(selectedCourse, "selectedCourse");
  console.log(selectedCourseId, "selectedCourseId");

  // when student changes, update course name and ID
 useEffect(() => {
   if (selectedStudent && students) {
     const student = students.find(
       (s) => s.user.toString() === selectedStudent
     );
     if (student) {
       setSelectedCourse(student.course ?? "");
       // find by label instead of key
       const courseObj = courseOptions.find((c) => c.label === student.course);
       setSelectedCourseId(courseObj?.value ?? null);
     } else {
       setSelectedCourse("");
       setSelectedCourseId(null);
     }
   } else {
     setSelectedCourse("");
     setSelectedCourseId(null);
   }
 }, [selectedStudent, students]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return alert("Please upload a certificate file");
    if (!selectedStudent) return alert("Please select a student");
    if (!selectedCourseId) return alert("Invalid course selected");

    const formData = new FormData();
    formData.append("certificateFile", file);
    formData.append("description", description);
    formData.append("grade", grade);
    formData.append("profile", selectedStudent);
    formData.append("course", String(selectedCourseId));

    try {
      setLoading(true);
      await axiosInstance.post("/generate-certificate/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error issuing certificate:", err);
      alert(
        err.response?.data?.detail ||
          "Failed to issue certificate. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Issue Certificate</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="certificate_file">Certificate File</Label>
            <Input
              id="certificate_file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="student">Select Student</Label>
            <select
              title="Select a student"
              id="student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">-- Select a student --</option>
              {(students ?? []).map((student) => (
                <option key={student.user} value={student.user}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-filled Course */}
          {selectedCourse && (
            <div className="space-y-2">
              <Label>Course</Label>
              <Input value={selectedCourse} disabled className="bg-muted" />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter certificate description"
            />
          </div>

          {/* Grade */}
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Input
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Enter grade (optional)"
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Issuing..." : "Issue Certificate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
