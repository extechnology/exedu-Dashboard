import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Upload,
  Loader2,
  Save,
  Image as ImageIcon,
  User,
  Clock,
  DollarSign,
  BookOpen,
  FileText,
} from "lucide-react";
import { Course } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCourseOptions from "@/hooks/useCourseOptions";
import useTutorOptions from "@/api/getTutorOptions";
import { toast } from "sonner";

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  onSave: (courseData: Course) => Promise<void>;
  isSaving: boolean;
}

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  course: Course | null;
  onSave: (courseData: Course) => Promise<void>;
  onDelete: (courseId: number) => Promise<void>;
  isSaving: boolean;
  courseTitleToKeyMap: Record<string, string>;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  open,
  onClose,
  course,
  onSave,
  isSaving,
  onDelete,
  courseTitleToKeyMap,
}) => {
  const [formData, setFormData] = useState<Course>({
    id: 0,
    title: "",
    sub_title: "",
    description: "",
    image: "",
    tutor_id: "",
    course_id: "",
    duration: "",
    tutor_name:"",
    tutor: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { courseOptions } = useCourseOptions();
  const { tutorOptions } = useTutorOptions();
  console.log(courseTitleToKeyMap, " course title to key map");

  console.log(courseOptions, "course options");
  console.log(tutorOptions);
  useEffect(() => {
    if (course && open) {
      setFormData({
        ...course,
        title: course.title, 
        tutor_id: course.tutor ? Number(course.tutor) : "",
      });
      if (course.image) {
        setImagePreview(
          `${import.meta.env.VITE_MEDIA_BASE_URL}${course.image}`
        );
      }
    }
  }, [course, open]);

  useEffect(() => {
    if (!open) {
      setFormData({
        id: 0,
        title: "",
        sub_title: "",
        description: "",
        image: "",
        duration: "",
        tutor_id: "",
        tutor_name:"",
        course_id: "",
        tutor: "",
        price: "",
      });
      setImageFile(null);
      setImagePreview("");
    }
  }, [open]);

  const handleInputChange = (field: keyof Course, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting formData", formData);

    const titleToSubmit = formData.title || course?.title || "";

    if (!titleToSubmit.trim()) {
      toast.error("Title is required");
      return;
    }

    const courseData = new FormData();
    courseData.append("title", formData.title);
    courseData.append("description", formData.description || "");
    courseData.append("sub_title", formData.sub_title || "");
    courseData.append("duration", formData.duration || "");
    courseData.append("price", formData.price || "");
    if (formData.tutor_id !== "") {
      courseData.append("tutor", String(formData.tutor_id));
    }
    console.log(formData.tutor_id, "form data tutor id");
    console.log(formData.title, "form data title");

    if (imageFile) courseData.append("image", imageFile);

    await onSave({
      ...formData,
      title_display:
        courseOptions.find((c) => c.id === Number(formData.title))?.title ||
        formData.title,
    } as Course);
  };

  function formatCourseName(courseName: string | null) {
    if (!courseName) return "No Course";
    return courseName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-card to-card/50">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-foreground">
                Edit Course
              </DialogTitle>
              <p className="text-muted-foreground">
                Update course information and settings
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Preview Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Course preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p className="text-sm">Course Image Preview</p>
                  </div>
                )}
                {/* <div className="absolute top-4 right-4">
                  <Badge className={getStatusBadge(formData.status)}>
                    {formData.status}
                  </Badge>
                </div> */}
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl leading-tight">
                    {courseOptions.find((c) => c.id === formData.course_id)
                      ?.title || "Course Title"}
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {formData.description ||
                    "Course description will appear here..."}
                </p>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium">
                    {formData.tutor_name || "Not assigned"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formData.duration || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">
                    {formData.price || "Free"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Course Image Upload */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-sm font-medium">
                        Course Image
                      </Label>
                    </div>
                    <div className="space-y-3">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isSaving}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        disabled={isSaving}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Title */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="title" className="text-sm font-medium">
                        Course Title *
                      </Label>
                    </div>

                    <Select
                      onValueChange={(value) =>
                        handleInputChange("title", value)
                      }
                      value={formData.title || ""}
                    >
                      <SelectTrigger className="w-full border bg-muted/50">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseOptions.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={courseTitleToKeyMap[c.title]} // ✅ send the key/slug
                          >
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Course Description */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description *
                      </Label>
                    </div>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter course description"
                      rows={4}
                      required
                      disabled={isSaving}
                      className="border-0 bg-muted/50"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Instructor */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="tutor" className="text-sm font-medium">
                        Instructor
                      </Label>
                    </div>
                    <select
                      title="Select Instructor"
                      id="tutor_id"
                      name="tutor_id"
                      className="w-full px-3 py-2 border  bg-muted/50 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                      value={formData.tutor_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tutor_id: Number(e.target.value) || "",
                        })
                      }
                      required
                    >
                      <option value="">Select Tutor</option>
                      {tutorOptions.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>

                {/* Duration */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="duration" className="text-sm font-medium">
                        Duration
                      </Label>
                    </div>
                    <Input
                      id="duration"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      placeholder="e.g., 8 weeks, 40 hours"
                      disabled={isSaving}
                      className="border-0 bg-muted/50"
                    />
                  </CardContent>
                </Card>

                {/* Price */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="price" className="text-sm font-medium">
                        Price
                      </Label>
                    </div>
                    <Input
                      id="price"
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="e.g., $299, Free"
                      disabled={isSaving}
                      className="border-0 bg-muted/50"
                    />
                  </CardContent>
                </Card>

                {/* Status */}
                {/* <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className="h-4 w-4 rounded-full" />
                      <Label className="text-sm font-medium">Status</Label>
                    </div>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger className="border-0 bg-muted/50">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`${getStatusBadge(
                                  option.value
                                )} h-2 w-2 rounded-full p-0`}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card> */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>

              {/* Delete Button with Confirmation */}
              {formData.id !== 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isSaving}
                      className="flex-1"
                    >
                      Delete Course
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete{" "}
                        <span className="font-medium">{formData.title}</span>{" "}
                        and remove all its data from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => onDelete(formData.id)}
                      >
                        Yes, Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCourseModal;
