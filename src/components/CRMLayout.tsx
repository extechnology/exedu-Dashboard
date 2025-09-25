import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Award,
  // BarChart3,
  // Settings,
  Bell,
  Search,
  Menu,
  X,
  CircleUser,
  Info,
  ClockAlert,
  UserRoundPlus,
  BookOpenCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
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
import useNotification from "@/hooks/useNotification";

interface CRMLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Tutor", href: "/admin/tutor", icon: UserRoundPlus },
  { name: "Session", href: "/admin/session", icon: BookOpenCheck },
  { name: "Batch", href: "/admin/batch", icon: ClockAlert },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Attendance", href: "/admin/attendance", icon: Calendar },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Enquiries", href: "/admin/enquiries", icon: Info },
  { name: "Contacts", href: "/admin/contacts", icon: CircleUser },

  // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  // { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function CRMLayout({ children }: CRMLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useNotification();
  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setLogoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-card ">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
                placeholder="Search students, courses..."
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Link to={"/admin/notifications"}>
                <Button variant="ghost" size="sm" className="relative">
                  <div className="relative">
                    <Bell className="w-12 h-12 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
                  A
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  Admin
                </span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild className="cursor-pointer">
                  <IoIosLogOut className="h-5 w-5 text-red-600 font-bold cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You will need to log in
                      again to continue.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleLogout}
                    >
                      Yes,Log Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 md:shadow-xl">
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/ex_edu_logo-03.png" alt="" className="h-8 w-full" />
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all hover:bg-muted ${
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "text-primary" : ""
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
