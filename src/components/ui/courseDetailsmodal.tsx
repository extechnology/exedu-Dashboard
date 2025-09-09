import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface Course {
  id: number;
  title: string;
  sub_title?: string;
  description?: string;
  image?: string;
  tutor?: string | null;
  duration?: string | null;
  price?: string | null;
  status?: string;
}

interface CourseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
}

const CourseDetailsModal = ({
  open,
  onClose,
  course,
}: CourseDetailsModalProps) => {
  if (!course) return null;

  function formatCourseName(name: string | null) {
    if (!name) return "No Title";
    return name
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {formatCourseName(course.title)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          {course.image && (
            <img
              src={`${import.meta.env.VITE_MEDIA_BASE_URL}${course.image}`}
              alt={course.title}
              className="w-full rounded-lg"
            />
          )}

          {/* Subtitle */}
          {course.sub_title && (
            <p className="text-muted-foreground italic">{course.sub_title}</p>
          )}

          {/* Description */}
          {course.description && (
            <p className="text-sm text-foreground">{course.description}</p>
          )}

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Instructor:</span>{" "}
              <span className="font-medium">{course.tutor || "N/A"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>{" "}
              <span className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" /> {course.duration || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Price:</span>{" "}
              <span className="font-medium">
                {course.price ? `₹${course.price}` : "N/A"}
              </span>
            </div>
          </div>

          {/* Status */}
          {course.status && <Badge className="mt-2">{course.status}</Badge>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsModal;
