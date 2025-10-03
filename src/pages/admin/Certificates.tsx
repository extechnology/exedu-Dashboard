import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Eye,
  Download,
  Award,
  FileText,
  Calendar,
  User,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CertificateModal from "@/components/ui/certificateModal";
import axiosInstance from "@/api/axiosInstance";
import useStudentProfile from "@/hooks/useStudentProfile";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const { studentProfile } = useStudentProfile();
  console.log(studentProfile, "studentProfile ");
  console.log(certificates, "certificates ");


  const refreshCertificates = async () => {
    try {
      const res = await axiosInstance.get("/certificate/");
      setCertificates(res.data);
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    }
  };

  useEffect(() => {
    refreshCertificates();
  }, []);

  const filteredCertificates = certificates
    .slice()
    .sort((a, b) => b.id - a.id)
    .filter((cert) => {
      const matchesSearch =
        cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        cert.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

  const getStatusBadge = (status: string) => {
    const variants = {
      Issued: "bg-success text-success-foreground",
      Pending: "bg-warning text-warning-foreground",
      Draft: "bg-muted text-muted-foreground",
    };
    return (
      variants[status as keyof typeof variants] ||
      "bg-muted text-muted-foreground"
    );
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-success";
    if (grade.startsWith("B")) return "text-warning";
    return "text-muted-foreground";
  };

  const stats = {
    totalCertificates: certificates.length,
    issued: certificates.filter((c) => c.status === "Issued").length,
    pending: certificates.filter((c) => c.status === "Pending").length,
    draft: certificates.filter((c) => c.status === "Draft").length,
  };

  const exportToExcel = () => {
    if (!certificates || certificates.length === 0) return;

    // Map certificate data to a simple array of objects
    const data = certificates.map((cert) => ({
      "Certificate Number": cert.certificateNumber,
      "Student Name": cert.studentName,
      "Student ID": cert.studentId,
      Course: cert.course,
      Grade: cert.grade,
      Status: cert.status,
      "Issue Date": new Date(cert.issueDate).toLocaleDateString(),
      "Certificate Type": cert.certificateType,
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Certificates");

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save file
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, `Certificates_${new Date().toISOString()}.xlsx`);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
            Certificate Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Issue, track, and manage student certificates.
          </p>
        </div>
        <div className="p-6">
          {/* Button to open modal */}
          <Button
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-primary/90"
            onClick={() => setShowModal(true)}
          >
            + Issue Certificate
          </Button>
          <CertificateModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={refreshCertificates}
            students={
              studentProfile.length > 0
                ? studentProfile.map((student: any) => ({
                    user: student.unique_id,
                    name: student.name ?? "Unnamed",
                    course: student.course_name ?? "",
                  }))
                : []
            }
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Certificates
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.totalCertificates}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Issued
                </p>
                <p className="text-2xl font-bold text-success">
                  {stats.issued}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-warning">
                  {stats.pending}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Drafts
                </p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {stats.draft}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-muted/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground top-3" />
              <Input
                placeholder="Search by student name, course, or certificate number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <div className="grid gap-6">
        {filteredCertificates.map((certificate) => (
          <Card
            key={certificate.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {certificate.studentName}
                      </h3>
                      <Badge className={getStatusBadge(certificate.status)}>
                        {certificate.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ID: {certificate.studentId} • {certificate.course}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {certificate.certificateType}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Certificate Number
                    </p>
                    <p className="font-medium text-sm">
                      {certificate.certificateNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Issue Date</p>
                    <p className="font-medium text-sm">
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p
                      className={`font-bold text-sm ${getGradeColor(
                        certificate.grade
                      )}`}
                    >
                      {certificate.grade}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completion</p>
                    <p className="font-medium text-sm">100%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(certificate.certificateFile, "_blank")
                    }
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = certificate.certificateFile;
                      link.download = `${certificate.studentName}_certificate.pdf`; // You can change the filename
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCertificates.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No certificates found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary"
            >
              <Award className="h-6 w-6 text-primary" />
              <span>Create Certificate</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-success/5 hover:border-success"
            >
              <FileText className="h-6 w-6 text-success" />
              <span>Bulk Issue</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-warning/5 hover:border-warning"
              onClick={exportToExcel}
            >
              <Download className="h-6 w-6 text-warning" />
              <span>Export Report</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/5 hover:border-accent"
            >
              <User className="h-6 w-6 text-accent" />
              <span>Student Lookup</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certificates;
