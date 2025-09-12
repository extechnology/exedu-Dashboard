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

interface CertificateGenerateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentId: number;
  studentName: string;
  courseName: string;
}


export default function CertificateGenerateModal({
  open,
  onClose,
  onSuccess,
  studentId,
  studentName,
  courseName,
}: CertificateGenerateModalProps) {
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState<string>("");

  useEffect(() => {
    if (open) {
      axiosInstance.get("/certificates/generate-number/").then((res) => {
        setCertificateNumber(res.data.certificate_number);
      });
    }
  }, [open]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        "/certificates/auto-generate/",
        {
          profile: studentId,
          description,
          grade,
        },
        { responseType: "blob" }
      );

      // Show preview (PDF as blob URL)
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      onSuccess();
    } catch (err) {
      console.error("Error generating certificate:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Generate Certificate</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Student Name</Label>
              <Input value={studentName} disabled />
            </div>
            <div>
              <Label>Course</Label>
              <Input value={courseName} disabled />
            </div>
            <div>
              <Label>Grade</Label>
              <Input
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
              />
            </div>
            <div>
              <Label>Certificate No</Label>
              <Input value={certificateNumber} disabled />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Certificate description"
            />
          </div>

          {/* Preview PDF if generated */}
          {previewUrl && (
            <iframe
              src={previewUrl}
              className="w-full h-80 border rounded-lg"
              title="Certificate Preview"
            ></iframe>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Certificate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
