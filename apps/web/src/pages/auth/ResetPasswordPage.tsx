import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
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

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Password Reset - Volks &amp; David</title>
        </Helmet>

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border-border/50 shadow-2xl shadow-primary/5 backdrop-blur-xl bg-card/95">
              <CardHeader className="space-y-2 text-center pb-2">
                <div className="mx-auto mb-2 h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-2xl">
                  Password Reset Successful
                </CardTitle>
                <CardDescription>
                  Your password has been reset successfully. You can now sign in
                  with your new password.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <Link to="/login">
                  <Button className="w-full h-11 text-base">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reset Password - Volks &amp; David</title>
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
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>Enter your new password below.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="pl-10 pr-10"
                      {...register("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message:
                            "Must include uppercase, lowercase, and number",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10"
                      {...register("confirmPassword", {
                        required: "Please confirm your new password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

              <p className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-all"
                >
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
