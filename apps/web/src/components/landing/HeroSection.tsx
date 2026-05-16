import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ShieldCheck,
  Star,
  FileText,
  TrendingUp,
  CheckCircle,
  Zap,
  BadgeCheck,
  ChevronRight,
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

const stats = [
  { value: "500K+", label: "Returns Filed" },
  { value: "200K+", label: "NTNs Registered" },
  { value: "4.8★", label: "Client Rating" },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050A1F]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[-10%] w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #4F6FF5 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[600px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 65%)" }} />
        <div className="absolute top-1/2 right-[20%] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #10B981 0%, transparent 65%)" }} />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(hsl(228 88% 62% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(228 88% 62% / 0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />

        {/* Animated floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/40"
            style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Top announcement bar */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-2 text-xs text-white/75"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Pakistan's #1 Digital Tax Platform — FBR Authorised &amp; SECP Registered
          <ChevronRight className="h-3 w-3 text-white/40" />
        </motion.div>
      </div>

      <div className="container relative z-10 pt-24 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-14 items-center"
        >
          {/* LEFT: Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div variants={itemVariants} className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-medium text-blue-300 lg:mx-0 mx-auto">
                <Zap className="h-3 w-3 text-blue-400" />
                File Your 2024-25 Return Today
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                Taxes Made{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #60A5FA 0%, #34D399 100%)" }}
                >
                  Simple.
                </span>
                <br />
                Future Made{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #34D399 0%, #60A5FA 100%)" }}
                >
                  Bright.
                </span>
              </h1>

              <p className="text-lg text-white/60 max-w-lg leading-relaxed mx-auto lg:mx-0">
                File tax returns in minutes. Register NTN, GST, Trademark &amp; more — 100% online,
                guided by Pakistan's top tax experts.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="group relative h-14 px-8 text-base font-semibold text-white border-0 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", boxShadow: "0 8px 32px rgba(16, 185, 129, 0.35)" }}
                asChild
              >
                <Link to="/register">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started — It's Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }} />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-semibold border-white/15 text-white/80 hover:bg-white/8 hover:text-white hover:border-white/25 transition-all"
                asChild
              >
                <Link to="/services">Explore Services</Link>
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-6 justify-center lg:justify-start pt-2">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-black text-white">{s.value}</span>
                  <span className="text-xs text-white/45 font-medium">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5 justify-center lg:justify-start text-sm text-white/40 pt-1">
              {[
                { icon: ShieldCheck, text: "FBR Authorised" },
                { icon: BadgeCheck, text: "SECP Registered" },
                { icon: Star, text: "4.8★ on Google" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Dashboard Preview */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-[480px]">
              {/* Glow behind card */}
              <div className="absolute -inset-6 rounded-3xl opacity-30 blur-2xl"
                style={{ background: "linear-gradient(135deg, #4F6FF5, #10B981)" }} />

              {/* Main dashboard card */}
              <div className="relative rounded-2xl border border-white/10 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)" }}>

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #4F6FF5, #10B981)" }}>
                      V&D
                    </div>
                    <span className="text-xs font-semibold text-white/80">Dashboard</span>
                  </div>
                  <span className="text-[10px] text-white/35 bg-white/5 px-2 py-0.5 rounded-full">Tax Year 2024-25</span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Returns", value: "12", color: "#4F6FF5", bg: "rgba(79,111,245,0.12)" },
                      { label: "NTN Status", value: "Active", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
                      { label: "Tax Saved", value: "Rs.45K", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl p-3" style={{ background: item.bg }}>
                        <p className="text-[10px] text-white/40 mb-1">{item.label}</p>
                        <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-white/60">Tax Filings This Year</span>
                      <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +18%
                      </span>
                    </div>
                    <div className="h-16 flex items-end gap-1.5">
                      {[35, 55, 42, 72, 60, 85, 68, 92, 74, 88, 76, 95].map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 rounded-t-sm"
                          style={{
                            height: `${h}%`,
                            background: i === 11
                              ? "linear-gradient(180deg, #10B981, #059669)"
                              : `rgba(79,111,245,${0.2 + (h / 100) * 0.4})`,
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + i * 0.05, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      {["Jan", "Apr", "Jul", "Dec"].map((m) => (
                        <span key={m} className="text-[9px] text-white/25">{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="space-y-2">
                    {[
                      { icon: FileText, text: "Tax Return 2023-24 Submitted", time: "2h ago", color: "#4F6FF5" },
                      { icon: CheckCircle, text: "NTN Certificate Downloaded", time: "Yesterday", color: "#10B981" },
                    ].map(({ icon: Icon, text, time, color }) => (
                      <div key={text} className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.03)" }}>
                        <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${color}20` }}>
                          <Icon className="h-3.5 w-3.5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white/80 truncate">{text}</p>
                        </div>
                        <span className="text-[10px] text-white/30 shrink-0">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-white/8"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <span className="text-[10px] text-white/35">Next deadline: Sep 30, 2025</span>
                  <span className="text-[10px] font-semibold text-emerald-400">File Now →</span>
                </div>
              </div>

              {/* Floating badge top-right */}
              <motion.div
                className="absolute -top-4 -right-4 rounded-xl px-3 py-2 border border-white/10 shadow-xl"
                style={{ background: "rgba(16,185,129,0.15)", backdropFilter: "blur(12px)" }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-300">Live</span>
                </div>
                <p className="text-[10px] text-white/50 mt-0.5">FBR Connected</p>
              </motion.div>

              {/* Floating badge bottom-left */}
              <motion.div
                className="absolute -bottom-4 -left-4 rounded-xl px-3 py-2 border border-white/10 shadow-xl"
                style={{ background: "rgba(79,111,245,0.15)", backdropFilter: "blur(12px)" }}
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <p className="text-[10px] text-white/50">Tax Saved</p>
                <p className="text-sm font-bold text-blue-300">Rs. 2B+</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(220 25% 98%))" }} />
    </section>
  )
}
