import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Award, 
  Clock,
  Download,
  Filter,
  Calendar,
  Target,
  BarChart3
} from "lucide-react";

const Analytics = () => {
  const overallStats = [
    { name: "Total Students", value: "1,247", change: "+12%", trend: "up", icon: Users },
    { name: "Active Courses", value: "23", change: "+3", trend: "up", icon: BookOpen },
    { name: "Certificates Issued", value: "892", change: "+45", trend: "up", icon: Award },
    { name: "Avg. Completion Rate", value: "78%", change: "+5%", trend: "up", icon: Target },
  ];

  const coursePerformance = [
    { course: "AI Digital Marketing", students: 45, completion: 89, satisfaction: 4.8, revenue: "$13,455" },
    { course: "Web Development", students: 38, completion: 76, satisfaction: 4.6, revenue: "$18,962" },
    { course: "Data Science", students: 32, completion: 82, satisfaction: 4.9, revenue: "$12,768" },
    { course: "UI/UX Design", students: 29, completion: 91, satisfaction: 4.7, revenue: "$5,771" },
    { course: "Mobile Development", students: 25, completion: 73, satisfaction: 4.5, revenue: "$11,225" },
  ];

  const monthlyTrends = [
    { month: "Jan", students: 98, courses: 5, certificates: 67 },
    { month: "Feb", students: 112, courses: 6, certificates: 89 },
    { month: "Mar", students: 124, courses: 7, certificates: 95 },
    { month: "Apr", students: 156, courses: 8, certificates: 134 },
    { month: "May", students: 189, courses: 9, certificates: 167 },
    { month: "Jun", students: 201, courses: 11, certificates: 198 },
  ];

  const topStudents = [
    { name: "Alice Johnson", course: "AI Marketing", progress: 98, grade: "A+", certificates: 3 },
    { name: "Carol Davis", course: "Data Science", progress: 96, grade: "A+", certificates: 2 },
    { name: "Eva Martinez", course: "Mobile Dev", progress: 94, grade: "A", certificates: 2 },
    { name: "David Wilson", course: "UI/UX", progress: 92, grade: "A", certificates: 1 },
    { name: "Bob Smith", course: "Web Dev", progress: 88, grade: "A-", certificates: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into your educational platform performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overallStats.map((stat) => (
          <Card key={stat.name} className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stat.change} from last month
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Trends */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Growth Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="font-medium">{month.month}</div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-primary font-bold">{month.students}</div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-success font-bold">{month.courses}</div>
                      <div className="text-xs text-muted-foreground">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-warning font-bold">{month.certificates}</div>
                      <div className="text-xs text-muted-foreground">Certificates</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Students */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Top Performing Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={student.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{student.grade}</Badge>
                      <span className="text-sm font-medium">{student.progress}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{student.certificates} certificates</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-muted-foreground">Course Name</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Students</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Completion Rate</th>
                  <th className="text-center p-3 font-semibold text-muted-foreground">Satisfaction</th>
                  <th className="text-right p-3 font-semibold text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {coursePerformance.map((course, index) => (
                  <tr key={course.course} className={`border-b hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-muted/10' : ''}`}>
                    <td className="p-3">
                      <div className="font-medium text-foreground">{course.course}</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{course.students}</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" 
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-sm">{course.completion}%</span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div className="flex text-warning">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(course.satisfaction) ? 'text-warning' : 'text-muted'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="font-medium text-sm ml-1">{course.satisfaction}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-bold text-success">{course.revenue}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <h4 className="font-semibold text-success">Growth Highlight</h4>
              </div>
              <p className="text-sm text-muted-foreground">Student enrollment increased by 12% this month, with AI Digital Marketing being the most popular course.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-warning" />
                <h4 className="font-semibold text-warning">Attention Needed</h4>
              </div>
              <p className="text-sm text-muted-foreground">Mobile Development course has the lowest completion rate at 73%. Consider reviewing course structure.</p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-primary">Achievement</h4>
              </div>
              <p className="text-sm text-muted-foreground">Overall satisfaction rating reached 4.7/5, surpassing the quarterly target of 4.5/5.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;