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
import useRegion from "@/hooks/useRegion";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [institute, setInstitute] = useState("");
  const [instituteId, setInstituteId] = useState("");
  const navigate = useNavigate();
  const { region } = useRegion();
  console.log(region, "region");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!institute) {
      toast.error("Please select your institute.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUser({ username, password });
      console.log("Login response:", response);

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);
      localStorage.setItem("userId", response.user_id);
      localStorage.setItem("region", institute);
      localStorage.setItem("region_id", instituteId);

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
            <div className="space-y-2">
              <Label
                htmlFor="institute"
                className="text-sm font-medium text-gray-700"
              >
                Select Institute
              </Label>
              <select
                id="institute"
                title="Select Institute"
                value={instituteId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setInstituteId(selectedId);

                  const selectedRegion = region.find(
                    (item) => item.id === parseInt(selectedId)
                  );

                  setInstitute(selectedRegion?.region || "");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-gray-800"
                required
              >
                <option value="" disabled>
                  -- Choose an institute --
                </option>
                {region.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.region}
                  </option>
                ))}
              </select>
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
