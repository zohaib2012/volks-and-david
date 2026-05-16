import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden relative">
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-8 px-4"
      >
        <div className="text-[150px] sm:text-[200px] font-bold leading-none">
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Oops! Page not found</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Go to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
