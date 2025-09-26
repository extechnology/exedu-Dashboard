import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  X,
  User,
  GraduationCap,
  Briefcase,
  Target,
  Star,
  CreditCard,
  Clock,
  School,
  Save,
  Upload,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useStudentProfile from "@/hooks/useStudentProfile";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import AddStudentModal from "@/components/ui/addStudentModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useBatches from "@/hooks/useBatch";
import useCourseOptions from "@/hooks/useCourseOptions";
import type { StudentProfile } from "@/types";

interface NormalizedStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  joinDate: string;
  batch: number;
  status: string;
  progress: number;
  attendance: number;
  avatar: string;
  enrolled_at: string;
  profileImage: string | File | null;
  payment_completed: boolean;
  paid_amount: number | null;
}

type FilterType = "all" | "active" | "completed" | "pending";
type StatusVariant = "Active" | "Completed" | "Pending";
// type PaymentStatusVariant = "Completed" | "Pending" | "Failed";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<StudentProfile | null>(null);
  const { batch } = useBatches();
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { studentProfile, loading, error } = useStudentProfile();
  const { courseOptions } = useCourseOptions();
  const [imagePreview, setImagePreview] = useState<string>("");

  console.log(selectedStudent, "selected student");
  const students = useMemo((): NormalizedStudent[] => {
    if (!studentProfile || !Array.isArray(studentProfile)) return [];

    return (
      studentProfile
        // .filter((s: StudentProfileData) => s.can_access_profile === true)
        .map(
          (s: StudentProfile): NormalizedStudent => ({
            id: s.unique_id,
            name: s.name || "Unnamed",
            email: s.email || "N/A",
            phone: s.phone_number || "N/A",
            batch: s.batch ? Number(s.batch) : 0,
            course: s.course_name || "Not Assigned",
            joinDate: s.created_at,
            enrolled_at: s.enrolled_at || "N/A",
            status: s.can_access_profile ? "Active" : "Pending",
            progress: s.progress || 0,
            attendance: 0,
            avatar: s.name ? s.name.slice(0, 2).toUpperCase() : "ST",
            profileImage: s.profile_image,
            payment_completed: s.payment_completed,
            paid_amount: s.paid_amount,
          })
        )
    );
  }, [studentProfile]);

  const filteredStudents = useMemo((): NormalizedStudent[] => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedFilter === "all") return matchesSearch;
      return matchesSearch && student.status.toLowerCase() === selectedFilter;
    });
  }, [students, searchTerm, selectedFilter]);

  const getStatusBadge = (status: string): string => {
    const variants: Record<StatusVariant, string> = {
      Active: "bg-blue-500 text-white",
      Completed: "bg-blue-500 text-white",
      Pending: "bg-orange-500 text-black",
    };
    return variants[status as StatusVariant] || "bg-gray-300 text-black";
  };

  const getPaymentStatusBadge = (
    paymentCompleted: boolean,
    paidAmount?: number
  ): string => {
    if (paymentCompleted) {
      return "bg-green-500 text-white";
    } else if (paidAmount && paidAmount > 0) {
      return "bg-yellow-500 text-black";
    } else {
      return "bg-red-500 text-white";
    }
  };

  useEffect(() => {
    if (editFormData?.profile_image) {
      if (typeof editFormData.profile_image === "string") {
        setImagePreview(editFormData.profile_image);
      } else if (editFormData.profile_image instanceof File) {
        setImagePreview(URL.createObjectURL(editFormData.profile_image));
      }
    } else {
      setImagePreview("");
    }
  }, [editFormData]);

  const getFilteredCount = (filterStatus: string): number => {
    if (filterStatus === "all") return students.length;
    return students.filter((s) => s.status.toLowerCase() === filterStatus)
      .length;
  };

  const handleViewStudent = (studentId: string): void => {
    if (Array.isArray(studentProfile)) {
      const student = studentProfile.find(
        (s: StudentProfile) => s.unique_id === studentId
      );
      if (student) {
        setSelectedStudent(student);
        setIsModalOpen(true);
      }
    }
  };

  const handleEditStudent = (studentId: string): void => {
    if (Array.isArray(studentProfile)) {
      const student = studentProfile.find(
        (s: StudentProfile) => s.unique_id === studentId
      );
      if (student) {
        setEditFormData({ ...student });
        setIsEditModalOpen(true);
      }
    }
  };

  const validateForm = (): boolean => {
    if (!editFormData) return false;

    if (!(editFormData.name ?? "").trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!editFormData.email?.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      toast.error("Invalid email format");
      return false;
    }

    return true;
  };

  const handleSaveChanges = async (): Promise<void> => {
    if (!editFormData || !validateForm()) return;
    console.log(editFormData, "editFormData");

    setIsSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", editFormData.name);
      formData.append("email", editFormData.email);
      if (editFormData.phone_number)
        formData.append("phone_number", editFormData.phone_number);

      if (editFormData.profile_image instanceof File) {
        formData.append("profile_image", editFormData.profile_image); // file upload
      }

      if (editFormData.secondary_school)
        formData.append("secondary_school", editFormData.secondary_school);
      if (editFormData.secondary_year)
        formData.append("secondary_year", editFormData.secondary_year);
      if (editFormData.university)
        formData.append("university", editFormData.university);
      if (editFormData.university_major)
        formData.append("university_major", editFormData.university_major);
      if (editFormData.university_year)
        formData.append("university_year", editFormData.university_year);
      if (editFormData.course && editFormData.course !== "Not Assigned") {
        formData.append("course", String(editFormData.course)); // must be ID (number → string)
      }

      if (editFormData.career_objective)
        formData.append("career_objective", editFormData.career_objective);
      if (editFormData.skills) formData.append("skills", editFormData.skills);
      if (editFormData.experience)
        formData.append("experience", editFormData.experience);
      if (editFormData.interests)
        formData.append("interests", editFormData.interests);

      formData.append("is_public", String(editFormData.is_public));
      formData.append(
        "can_access_profile",
        String(editFormData.can_access_profile)
      );

      if (editFormData.batch) {
        formData.append("batch", String(editFormData.batch)); 
      }

      if (editFormData.progress) {
        formData.append("progress", String(editFormData.progress)); 
      }

      if (editFormData.enrolled_at) {
        const isoDate = new Date(editFormData.enrolled_at).toISOString();
        formData.append("enrolled_at", isoDate);
      }

      if (editFormData.paid_amount !== null)
        formData.append("paid_amount", String(editFormData.paid_amount));

      for (let [key, value] of formData.entries()) {
        console.log(key, value, "debugging");
      }

      const response = await axiosInstance.patch(
        `/student/profile/${editFormData.unique_id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Student profile updated successfully!");
      closeEditModal();
    } catch (error: any) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student profile");
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const closeEditModal = (): void => {
    if (isSaving) return; // Prevent closing while saving
    setIsEditModalOpen(false);
    setEditFormData(null);
  };

  const handleInputChange = (
    field: keyof StudentProfile,
    value: string | boolean | number | File | null
  ): void => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [field]: value,
      });
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  function formatCourseName(course: string | null) {
    if (!course) return "No Course";
    return course
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const formatCurrency = (amount: number | null): string => {
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString()}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading students...</p>
      </div>
    );
  if (error) return <p className="text-red-500">Failed to load students:</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold  text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Student Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all student information and progress.
          </p>
        </div>

        {/* <Button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Student
        </Button> */}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex  flex-col sm:flex-row gap-4">
            <div className="relative flex-1 ">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground top-3" />
              <Input
                placeholder="Search students by name, email, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
                size="sm"
              >
                All ({getFilteredCount("all")})
              </Button>
              <Button
                variant={selectedFilter === "active" ? "default" : "outline"}
                onClick={() => setSelectedFilter("active")}
                size="sm"
              >
                Active ({getFilteredCount("active")})
              </Button>
              <Button
                variant={selectedFilter === "completed" ? "default" : "outline"}
                onClick={() => setSelectedFilter("completed")}
                size="sm"
              >
                Completed ({getFilteredCount("completed")})
              </Button>
              <Button
                variant={selectedFilter === "pending" ? "default" : "outline"}
                onClick={() => setSelectedFilter("pending")}
                size="sm"
              >
                Pending ({getFilteredCount("pending")})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className="border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Profile image / avatar */}
                  {student.profileImage ? (
                    <img
                      src={`${import.meta.env.VITE_MEDIA_BASE_URL}${
                        student.profileImage
                      }`}
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {student.avatar}
                    </div>
                  )}

                  {/* Name and both status badges */}
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getStatusBadge(student.status)}`}>
                        {student.status}
                      </Badge>
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                          student.payment_completed,
                          student.paid_amount
                        )}`}
                      >
                        {student.payment_completed
                          ? "Paid"
                          : student.paid_amount > 0
                          ? "Partial"
                          : "Unpaid"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: dropdown menu only */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewStudent(student.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditStudent(student.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Student
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button asChild variant="outline">
                        <a href={`mailto:${student.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </a>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {student.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {formatCourseName(student.course)}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined: {new Date(student.joinDate).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewStudent(student.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEditStudent(student.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No students found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Student Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              {selectedStudent?.profile_image ? (
                <img
                  src={`${import.meta.env.VITE_MEDIA_BASE_URL}${
                    selectedStudent.profile_image
                  }`}
                  alt={selectedStudent.name}
                  className="h-28 w-28  rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-semibold text-primary-foreground">
                  {selectedStudent?.name?.slice(0, 2).toUpperCase() || "ST"}
                </div>
              )}
              {selectedStudent?.name || "Student Profile"}
              <Badge
                className={getStatusBadge(
                  selectedStudent?.can_access_profile ? "Active" : "Pending"
                )}
              >
                {selectedStudent?.can_access_profile ? "Active" : "Pending"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Personal Information Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.name || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </label>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedStudent.email || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </label>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedStudent.phone_number || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Registration Date
                    </label>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedStudent.created_at)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Educational Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Secondary School
                    </label>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <School className="h-4 w-4" />
                      {selectedStudent.secondary_school || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Secondary Year
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.secondary_year || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      University
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.university || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      University Major
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.university_major || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      University Year
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.university_year || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Course & Payment Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course & Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Current Course
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.course_name || "Not Enrolled"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Enrollment Date
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.enrolled_at
                        ? formatDate(selectedStudent.enrolled_at)
                        : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Bach Number
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.batch || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2 space-x-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Payment Status
                    </label>
                    <Badge
                      className={
                        selectedStudent.payment_completed
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }
                    >
                      {selectedStudent.payment_completed
                        ? "Completed"
                        : "Pending"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Paid Amount
                    </label>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {formatCurrency(selectedStudent.paid_amount)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Payment Date
                    </label>
                    <p className="text-sm font-semibold">
                      {selectedStudent.paid_at
                        ? formatDate(selectedStudent.paid_at)
                        : "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Career Objective
                    </label>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedStudent.career_objective ||
                          "No career objective specified"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Skills
                      </label>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedStudent.skills || "No skills listed"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Experience
                      </label>
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedStudent.experience || "No experience listed"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Interests
                    </label>
                    <div className="bg-muted/30 p-3 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedStudent.interests || "No interests specified"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  onClick={() => {
                    closeModal();
                    handleEditStudent(selectedStudent.unique_id);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button asChild variant="outline">
                  <a href={`mailto:${selectedStudent.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={closeEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              {editFormData?.profile_image ? (
                <img
                  src={
                    typeof editFormData.profile_image === "string"
                      ? editFormData.profile_image
                      : URL.createObjectURL(editFormData.profile_image)
                  }
                  alt={editFormData.name}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-semibold text-primary-foreground">
                  {editFormData?.name?.slice(0, 2).toUpperCase() || "ST"}
                </div>
              )}
              Edit Student Profile
              <Badge
                className={getStatusBadge(
                  editFormData?.can_access_profile ? "Active" : "Pending"
                )}
              >
                {editFormData?.can_access_profile ? "Active" : "Pending"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {editFormData && (
            <div className="space-y-6">
              {/* Personal Information Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={editFormData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editFormData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email address"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={editFormData.phone_number || ""}
                      onChange={(e) =>
                        handleInputChange("phone_number", e.target.value)
                      }
                      placeholder="Enter phone number"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2 content-end">
                    <Label className="text-sm font-medium flex items-center content-center gap-2">
                      <Switch
                        checked={editFormData.is_public}
                        onCheckedChange={(checked) =>
                          handleInputChange("is_public", checked)
                        }
                        disabled={isSaving}
                      />
                      Public Profile
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Make profile visible to others
                    </p>
                  </div>
                  <div className="space-y-2 content-center">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Switch
                        checked={editFormData.can_access_profile}
                        onCheckedChange={(checked) =>
                          handleInputChange("can_access_profile", checked)
                        }
                        disabled={isSaving}
                      />
                      Grand Permission
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Give students full access to profile
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Profile Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    {/* Image Preview */}
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-semibold text-primary-foreground">
                        {editFormData?.name?.slice(0, 2).toUpperCase() || "ST"}
                      </div>
                    )}

                    {/* Upload Field */}
                    <div className="space-y-2 flex-1">
                      <Label
                        htmlFor="profile-image-upload"
                        className="text-sm font-medium"
                      >
                        Profile Image
                      </Label>

                      {/* Hidden File Input */}
                      <Input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setEditFormData((prev) =>
                              prev ? { ...prev, profile_image: file } : null
                            );

                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setImagePreview(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        disabled={isSaving}
                      />

                      {/* Button to trigger file input */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById("profile-image-upload")
                            ?.click()
                        }
                        disabled={isSaving}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {imagePreview ? "Change Image" : "Upload Image"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education Section */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Educational Background
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="secondary_school"
                      className="text-sm font-medium"
                    >
                      Secondary School
                    </Label>
                    <Input
                      id="secondary_school"
                      value={editFormData.secondary_school || ""}
                      onChange={(e) =>
                        handleInputChange("secondary_school", e.target.value)
                      }
                      placeholder="Enter secondary school name"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="secondary_year"
                      className="text-sm font-medium"
                    >
                      Secondary Year
                    </Label>
                    <Input
                      id="secondary_year"
                      value={editFormData.secondary_year || ""}
                      onChange={(e) =>
                        handleInputChange("secondary_year", e.target.value)
                      }
                      placeholder="Enter graduation year"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-sm font-medium">
                      University
                    </Label>
                    <Input
                      id="university"
                      value={editFormData.university || ""}
                      onChange={(e) =>
                        handleInputChange("university", e.target.value)
                      }
                      placeholder="Enter university name"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="university_major"
                      className="text-sm font-medium"
                    >
                      University Major
                    </Label>
                    <Input
                      id="university_major"
                      value={editFormData.university_major || ""}
                      onChange={(e) =>
                        handleInputChange("university_major", e.target.value)
                      }
                      placeholder="Enter major/field of study"
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="university_year"
                      className="text-sm font-medium"
                    >
                      University Year
                    </Label>
                    <Input
                      id="university_year"
                      value={editFormData.university_year || ""}
                      onChange={(e) =>
                        handleInputChange("university_year", e.target.value)
                      }
                      placeholder="Enter graduation year"
                      disabled={isSaving}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Course, Payment & Progress Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course, Payment & Progress
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course Select */}
                  <div className="space-y-2">
                    <Label htmlFor="course" className="text-sm font-medium">
                      Current Course
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("course", Number(value))
                      }
                      value={
                        editFormData.course ? String(editFormData.course) : ""
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger className="w-full border bg-muted/50 text-black">
                        <SelectValue
                          placeholder="Select a course"
                          className="text-black"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {courseOptions.map((course) => (
                          <SelectItem
                            key={course.id}
                            value={String(course.id)}
                            className="text-black"
                          >
                            {course.title || course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Batch Select */}
                  <div className="space-y-2">
                    <Label htmlFor="batch" className="text-sm font-medium">
                      Batch
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("batch", value ? Number(value) : null)
                      }
                      value={
                        editFormData.batch ? String(editFormData.batch) : ""
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger className="w-full border bg-muted/50 text-black">
                        <SelectValue
                          placeholder="Select a batch"
                          className="text-black"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {batch.map((b) => (
                          <SelectItem
                            key={b.id}
                            value={String(b.id)}
                            className="text-black"
                          >
                            {b.batch_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Enrolled At */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="enrolled_at"
                      className="text-sm font-medium"
                    >
                      Enrolled At
                    </Label>
                    <Input
                      id="enrolled_at"
                      type="date"
                      value={editFormData?.enrolled_at?.slice(0, 10) || ""}
                      onChange={(e) =>
                        handleInputChange("enrolled_at", e.target.value)
                      }
                      disabled={isSaving}
                    />
                  </div>

                  {/* Paid Amount */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="paid_amount"
                      className="text-sm font-medium"
                    >
                      Paid Amount (₹)
                    </Label>
                    <Input
                      id="paid_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editFormData.paid_amount || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "paid_amount",
                          parseFloat(e.target.value) || null
                        )
                      }
                      placeholder="Enter paid amount"
                      disabled={isSaving}
                    />
                  </div>

                  {/* Payment Completed */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Switch
                        checked={editFormData.payment_completed}
                        onCheckedChange={(checked) =>
                          handleInputChange("payment_completed", checked)
                        }
                        disabled={isSaving}
                      />
                      Payment Completed
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Mark as paid
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Label htmlFor="progress" className="text-sm font-medium">
                      Progress (%)
                    </Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={editFormData.progress || 0}
                      onChange={(e) =>
                        handleInputChange(
                          "progress",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Enter progress percentage"
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground">
                      Student progress (0–100%)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="career_objective"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <Target className="h-4 w-4" />
                      Career Objective
                    </Label>
                    <Textarea
                      id="career_objective"
                      value={editFormData.career_objective || ""}
                      onChange={(e) =>
                        handleInputChange("career_objective", e.target.value)
                      }
                      placeholder="Describe career goals and objectives..."
                      rows={3}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="skills"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Star className="h-4 w-4" />
                        Skills
                      </Label>
                      <Textarea
                        id="skills"
                        value={editFormData.skills || ""}
                        onChange={(e) =>
                          handleInputChange("skills", e.target.value)
                        }
                        placeholder="List technical and soft skills..."
                        rows={4}
                        disabled={isSaving}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="experience"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Experience
                      </Label>
                      <Textarea
                        id="experience"
                        value={editFormData.experience || ""}
                        onChange={(e) =>
                          handleInputChange("experience", e.target.value)
                        }
                        placeholder="Describe work experience..."
                        rows={4}
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests" className="text-sm font-medium">
                      Interests & Hobbies
                    </Label>
                    <Textarea
                      id="interests"
                      value={editFormData.interests || ""}
                      onChange={(e) =>
                        handleInputChange("interests", e.target.value)
                      }
                      placeholder="List personal interests and hobbies..."
                      rows={3}
                      disabled={isSaving}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={closeEditModal}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-white"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AddStudentModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Students;
