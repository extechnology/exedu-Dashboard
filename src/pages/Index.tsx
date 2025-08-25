import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  Award, 
  BarChart3, 
  ArrowRight,
  GraduationCap,
  Target,
  TrendingUp
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student profiles with progress tracking, attendance, and performance analytics."
    },
    {
      icon: BookOpen,
      title: "Course Administration",
      description: "Create, manage, and track courses with detailed curriculum and learning objectives."
    },
    {
      icon: Award,
      title: "Certificate Management",
      description: "Issue, track, and verify digital certificates with automated generation capabilities."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights into student performance, course effectiveness, and institutional growth."
    }
  ];

  const stats = [
    { label: "Active Students", value: "1,247", icon: Users },
    { label: "Live Courses", value: "23", icon: BookOpen },
    { label: "Certificates Issued", value: "892", icon: Award },
    { label: "Success Rate", value: "94%", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
              <GraduationCap className="h-4 w-4" />
              Educational Management Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent leading-tight">
              EduCRM
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive educational management system for modern institutions. 
              Track students, manage courses, and drive educational excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/admin">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-4">
                  Access Admin Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 hover:bg-primary/5">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Powerful Features for 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Education Management</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your educational institution efficiently and effectively.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 backdrop-blur-sm">
            <CardContent className="text-center space-y-8 py-12">
              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  Ready to Transform Your Educational Management?
                </h3>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of educational institutions using EduCRM to streamline operations and enhance student success.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/admin">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-4">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Start Managing Today
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 hover:bg-primary/5">
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EduCRM
              </span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2024 EduCRM. Empowering educational institutions worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
