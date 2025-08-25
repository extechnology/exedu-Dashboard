import { useState } from "react";
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
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Certificates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const certificates = [
    {
      id: 1,
      studentName: "Alice Johnson",
      studentId: "STU001",
      course: "AI Digital Marketing",
      certificateType: "Completion Certificate",
      issueDate: "2024-01-20",
      status: "Issued",
      grade: "A+",
      completionRate: 95,
      certificateNumber: "CERT-2024-001"
    },
    {
      id: 2,
      studentName: "Bob Smith",
      studentId: "STU002",
      course: "Web Development",
      certificateType: "Achievement Certificate",
      issueDate: "2024-01-22",
      status: "Pending",
      grade: "A",
      completionRate: 88,
      certificateNumber: "CERT-2024-002"
    },
    {
      id: 3,
      studentName: "Carol Davis",
      studentId: "STU003",
      course: "Data Science",
      certificateType: "Excellence Certificate",
      issueDate: "2024-01-18",
      status: "Issued",
      grade: "A+",
      completionRate: 98,
      certificateNumber: "CERT-2024-003"
    },
    {
      id: 4,
      studentName: "David Wilson",
      studentId: "STU004",
      course: "UI/UX Design",
      certificateType: "Participation Certificate",
      issueDate: "2024-01-25",
      status: "Draft",
      grade: "B+",
      completionRate: 78,
      certificateNumber: "CERT-2024-004"
    },
    {
      id: 5,
      studentName: "Eva Martinez",
      studentId: "STU005",
      course: "Mobile Development",
      certificateType: "Completion Certificate",
      issueDate: "2024-01-24",
      status: "Issued",
      grade: "A",
      completionRate: 92,
      certificateNumber: "CERT-2024-005"
    }
  ];

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || cert.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      Issued: "bg-success text-success-foreground",
      Pending: "bg-warning text-warning-foreground",
      Draft: "bg-muted text-muted-foreground"
    };
    return variants[status as keyof typeof variants] || "bg-muted text-muted-foreground";
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-success';
    if (grade.startsWith('B')) return 'text-warning';
    return 'text-muted-foreground';
  };

  const stats = {
    totalCertificates: certificates.length,
    issued: certificates.filter(c => c.status === 'Issued').length,
    pending: certificates.filter(c => c.status === 'Pending').length,
    draft: certificates.filter(c => c.status === 'Draft').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Certificate Management</h1>
          <p className="text-muted-foreground mt-1">Issue, track, and manage student certificates.</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Certificate
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Certificates</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalCertificates}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Issued</p>
                <p className="text-2xl font-bold text-success">{stats.issued}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
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
          <Card key={certificate.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{certificate.studentName}</h3>
                      <Badge className={getStatusBadge(certificate.status)}>
                        {certificate.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">ID: {certificate.studentId} • {certificate.course}</p>
                    <p className="text-sm text-muted-foreground">{certificate.certificateType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Certificate Number</p>
                    <p className="font-medium text-sm">{certificate.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Issue Date</p>
                    <p className="font-medium text-sm">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className={`font-bold text-sm ${getGradeColor(certificate.grade)}`}>{certificate.grade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Completion</p>
                    <p className="font-medium text-sm">{certificate.completionRate}%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
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
            <h3 className="text-lg font-semibold text-foreground">No certificates found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria.</p>
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
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary">
              <Award className="h-6 w-6 text-primary" />
              <span>Create Certificate</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-success/5 hover:border-success">
              <FileText className="h-6 w-6 text-success" />
              <span>Bulk Issue</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-warning/5 hover:border-warning">
              <Download className="h-6 w-6 text-warning" />
              <span>Export Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/5 hover:border-accent">
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