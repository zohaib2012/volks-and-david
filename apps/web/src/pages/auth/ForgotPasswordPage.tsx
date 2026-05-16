import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface ForgotPasswordForm {
  contact: string;
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmail, setIsEmail] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        isEmail
          ? "Password reset link sent to your email"
          : "Password reset instructions sent to your phone",
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - Volks &amp; David</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 shadow-2xl shadow-primary/5 backdrop-blur-xl bg-card/95">
            <CardHeader className="space-y-2 text-center pb-2">
              <Link to="/" className="mx-auto mb-2">
                <span className="text-3xl font-bold gradient-text">
                  Volks &amp; David
                </span>
              </Link>
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email or phone number and we'll send you instructions
                to reset your password.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="flex rounded-lg border border-border p-1 bg-muted/50">
                <button
                  type="button"
                  onClick={() => setIsEmail(true)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    isEmail
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmail(false)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    !isEmail
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">
                    {isEmail ? "Email Address" : "Phone Number"}
                  </Label>
                  <div className="relative">
                    {isEmail ? (
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      id="contact"
                      type={isEmail ? "email" : "tel"}
                      placeholder={
                        isEmail ? "you@example.com" : "+1 (555) 000-0000"
                      }
                      className="pl-10"
                      {...register("contact", {
                        required: isEmail
                          ? "Email is required"
                          : "Phone number is required",
                        pattern: isEmail
                          ? {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            }
                          : {
                              value: /^[\d\s+\-()]{7,20}$/,
                              message: "Invalid phone number",
                            },
                      })}
                    />
                  </div>
                  {errors.contact && (
                    <p className="text-sm text-destructive">
                      {errors.contact.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <p className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
