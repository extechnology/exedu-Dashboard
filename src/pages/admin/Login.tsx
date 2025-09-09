import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { loginUser } from "@/api/apiServices/authServices";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({ username, password });

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      toast.success("Login successful!");
      navigate("/admin");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.response?.data?.detail || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-[url('/dashboard-login.jpg')]  justify-center bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-background/80" />
      <Card className="relative z-10 w-full max-w-md mx-4 bg-card/95 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <div className=" items-center justify-center mb-4">
            <img
              src="/ex_edu_logo-03.png"
              className="w-auto pb-3 h-12 mx-auto"
              alt=""
            />
            <span className="text-2xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
              CRM
            </span>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your exedu CRM</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
