import { useState, useRef, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(RESEND_COOLDOWN);
    toast.success("OTP resent to your email/phone");
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete OTP");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("OTP verified successfully!");
    } catch {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP - Volks &amp; David</title>
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
              <div className="mx-auto mb-2 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Verify OTP</CardTitle>
              <CardDescription>
                We've sent a 6-digit code to your email and phone. Enter it
                below to verify your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="h-14 w-12 rounded-lg border border-input bg-background text-center text-xl font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                  />
                ))}
              </div>

              <Button
                type="button"
                className="w-full h-11 text-base"
                disabled={isLoading || otp.join("").length !== OTP_LENGTH}
                onClick={handleVerify}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {cooldown > 0 ? (
                    <>
                      Resend code in{" "}
                      <span className="font-medium text-foreground">
                        {cooldown}s
                      </span>
                    </>
                  ) : (
                    <>
                      Didn't receive the code?{" "}
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-primary hover:text-primary/80 underline-offset-4 hover:underline font-medium transition-all"
                      >
                        Resend OTP
                      </button>
                    </>
                  )}
                </p>
                <Link
                  to="/register"
                  className="inline-block text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-all"
                >
                  Change email/phone
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
