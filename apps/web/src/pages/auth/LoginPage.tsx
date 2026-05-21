import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, CheckCircle, FileText, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { login } from "@/lib/auth";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const benefits = [
  { icon: FileText, text: "File tax returns in minutes" },
  { icon: ShieldCheck, text: "FBR-compliant & SECP registered" },
  { icon: Star, text: "4.8★ from 50,000+ clients" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await login(data.email, data.password);
      if (res.success) {
        if (res.data.requiresOtp) {
          toast.success("OTP sent to your email");
          navigate(`/verify-otp?type=admin_2fa&email=${encodeURIComponent(res.data.email)}`);
          return;
        }
        toast.success("Welcome back!");
        const role = res.data.user?.role;
        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Volks &amp; David</title>
      </Helmet>

      <div className="min-h-screen flex lg:grid lg:grid-cols-2">
        <div className="hidden lg:flex relative flex-col justify-center items-center p-12 bg-gradient-to-br from-primary via-primary/90 to-accent/80 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-3 mb-8">
                <img src="/volksanddavid-logo.svg" alt="Volks & David" className="h-12 w-auto" />
                <span className="text-2xl font-bold"><span style={{ color: "#21346E" }}>Volks</span><span className="text-white/60 mx-0.5 font-light">&amp;</span><span style={{ color: "#C8952E" }}>David</span></span>
              </div>

            <h1 className="text-4xl font-bold text-white mb-4">Why Volks &amp; David?</h1>

            <div className="space-y-4">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="h-5 w-5 text-accent shrink-0" />
                  <span>{b.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/10">
              <p className="text-white/80 text-sm italic">
                "Pakistan's most trusted tax filing platform. Join 500,000+ happy users."
              </p>
              <div className="flex items-center gap-2 mt-3">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-4 lg:p-12 bg-gradient-to-br from-background via-background to-primary/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border-border/50 shadow-2xl shadow-primary/5 backdrop-blur-xl bg-card/95">
              <CardHeader className="space-y-2 text-center pb-2">
                <Link to="/" className="mx-auto mb-2 lg:hidden flex items-center gap-2">
                  <img src="/volksanddavid-logo.svg" alt="Volks & David" className="h-10 w-auto" />
                  <span className="text-2xl font-bold"><span style={{ color: "#21346E" }}>Volks</span><span className="text-foreground/60 mx-0.5 font-light">&amp;</span><span style={{ color: "#C8952E" }}>David</span></span>
                </Link>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-10"
                        {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }})}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
                        className="pl-10 pr-10"
                        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" }})}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" {...register("rememberMe")} />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-all">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full h-11 text-base bg-gradient-to-r from-primary to-primary/80" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium transition-all">
                    Register
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
