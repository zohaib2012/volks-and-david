import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
      <div className="relative">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] spin-ring">
          <div className="h-full w-full rounded-full bg-background" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
            V&D
          </div>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-muted-foreground text-sm font-medium"
      >
        Loading...
      </motion.p>
    </div>
  );
}
