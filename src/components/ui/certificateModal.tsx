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


interface CertificateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  students?: StudentProfile[];
}

export default function CertificateModal({
  open,
  onClose,
  onSuccess,
  students,
}: CertificateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);

  // when student changes, update course
  useEffect(() => {
    if (selectedStudent && students) {
      const student = students.find((s) => s.user === selectedStudent);
      if (student) {
        setSelectedCourse(student.course ?? "");
      }
    } else {
      setSelectedCourse("");
    }
  }, [selectedStudent, students]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a certificate file");
      return;
    }
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    const formData = new FormData();
    formData.append("certificate_file", file);
    formData.append("description", description);
    formData.append("grade", grade);
    formData.append("profile", String(selectedStudent));

    if (selectedCourse) formData.append("course", String(selectedCourse));

    try {
      setLoading(true);
      await axiosInstance.post("/certificates/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error issuing certificate:", err);
      alert("Failed to issue certificate. Please try again.");
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
              value={selectedStudent ?? ""}
              onChange={(e) => setSelectedStudent(Number(e.target.value))}
              required
              className="w-full border rounded-md p-2"
            >
              <option value="">-- Select a student --</option>
              {(students ?? []).map((student) => (
                <option key={student.id} value={student.id}>
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
