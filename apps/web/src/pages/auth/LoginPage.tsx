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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur text-white font-bold text-lg">
                V&D
              </div>
              <span className="text-2xl font-bold text-white">Volks &amp; David</span>
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
                <Link to="/" className="mx-auto mb-2 lg:hidden">
                  <span className="text-3xl font-bold gradient-text">
                    Volks &amp; David
                  </span>
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-11 gap-2" onClick={() => toast.error("Google OAuth coming soon")}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-11 gap-2" onClick={() => toast.error("Facebook OAuth coming soon")}>
                    <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>

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
