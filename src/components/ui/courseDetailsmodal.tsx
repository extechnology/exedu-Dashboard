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
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between gap-4 p-6 border-b">
          <DialogTitle className="text-2xl font-bold leading-tight">
            {formatCourseName(course.title)}
          </DialogTitle>
          {course.status && (
            <Badge
              variant="secondary"
              className="text-xs px-3 py-1 rounded-full"
            >
              {course.status}
            </Badge>
          )}
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Image */}
          {course.image && (
            <img
              src={`${import.meta.env.VITE_MEDIA_BASE_URL}${course.image}`}
              alt={course.title}
              className="w-full rounded-lg shadow"
            />
          )}

          {/* Subtitle */}
          {course.sub_title && (
            <p className="text-muted-foreground italic">{course.sub_title}</p>
          )}

          {/* Description */}
          {course.description && (
            <p className="text-sm text-foreground leading-relaxed">
              {course.description}
            </p>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Instructor:</span>
              <span className="font-medium">{course.tutor || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{course.duration || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">
                {course.price ? `₹${course.price}` : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsModal;
