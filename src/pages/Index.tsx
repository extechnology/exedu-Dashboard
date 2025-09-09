import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Award,
  BarChart3,
  ArrowRight,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description:
        "Comprehensive student profiles with progress tracking, attendance, and performance analytics.",
    },
    {
      icon: BookOpen,
      title: "Course Administration",
      description:
        "Create, manage, and track courses with detailed curriculum and learning objectives.",
    },
    {
      icon: Award,
      title: "Certificate Management",
      description:
        "Issue, track, and verify digital certificates with automated generation capabilities.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Real-time insights into student performance, course effectiveness, and institutional growth.",
    },
  ];


 

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
              <GraduationCap className="h-4 w-4" />
              Hybrid AI Education
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent leading-tight">
              exedu CRM
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive educational management system for modern
              institutions. Track students, manage courses, and drive
              educational excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg px-8 py-4"
                >
                  Access Admin Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Powerful Features for
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                Education Management
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your educational institution
              efficiently and effectively.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group border-0 shadow-lg bg-gradient-to-br from-card to-card/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
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

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/ex_edu_logo-03.png" alt="" className="h-8 w-full" />
            </div>
            <p className="text-muted-foreground text-center">
              © 2025 exedu. Hybrid AI Education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
