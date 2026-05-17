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
  BadgeCheck,
  ChevronRight,
  Globe,
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#21346E] via-[#10B981] to-[#21346E]" />

      {/* USA Services Floating Badge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="fixed right-4 top-28 z-40 hidden lg:block"
      >
        <Link
          to="/usa-services"
          className="group flex items-center gap-3 rounded-xl border border-[#21346E]/20 bg-white/95 backdrop-blur-xl px-4 py-3 shadow-lg hover:shadow-xl hover:border-[#21346E]/40 transition-all duration-300"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#21346E]/10">
            <Globe className="h-4 w-4 text-[#21346E]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#21346E]">USA Services</p>
            <p className="text-[10px] text-[#21346E]/50">LLC · EIN · ITIN · Bank</p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-[#21346E]/30 group-hover:text-[#21346E]/60 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </motion.div>

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
              <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-1.5 text-xs font-medium text-[#10B981] lg:mx-0 mx-auto">
                File Your 2024-25 Return Today
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#1A1A2E] leading-[1.05] tracking-tight">
                Taxes Made{" "}
                <span className="text-[#10B981]">Simple.</span>
                <br />
                Future Made{" "}
                <span className="text-[#10B981]">Bright.</span>
              </h1>

              <p className="text-lg text-[#1A1A2E]/60 max-w-lg leading-relaxed mx-auto lg:mx-0">
                File tax returns in minutes. Register NTN, GST, Trademark &amp; more — 100% online,
                guided by Pakistan's top tax experts.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-semibold text-white border-0"
                style={{ background: "linear-gradient(135deg, #21346E 0%, #2C4182 100%)", boxShadow: "0 8px 32px rgba(33, 52, 110, 0.3)" }}
                asChild
              >
                <Link to="/register">
                  Get Started — It's Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-semibold border-[#21346E]/20 text-[#21346E]/70 hover:bg-[#21346E]/5 hover:text-[#21346E] hover:border-[#21346E]/40 transition-all"
                asChild
              >
                <Link to="/services">Explore Services</Link>
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-6 justify-center lg:justify-start pt-2">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-black text-[#1A1A2E]">{s.value}</span>
                  <span className="text-xs text-[#1A1A2E]/45 font-medium">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5 justify-center lg:justify-start text-sm text-[#1A1A2E]/50 pt-1">
              {[
                { icon: ShieldCheck, text: "FBR Authorised" },
                { icon: BadgeCheck, text: "SECP Registered" },
                { icon: Star, text: "4.8★ on Google" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-[#10B981]" />
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
              <div className="absolute -inset-6 rounded-3xl opacity-20 blur-2xl"
                style={{ background: "linear-gradient(135deg, #21346E, #10B981)" }} />

              {/* Main dashboard card */}
              <div className="relative rounded-2xl border border-[#21346E]/10 overflow-hidden bg-white shadow-xl">

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#21346E]/5 bg-[#21346E]/[0.02]">
                  <div className="flex items-center gap-2">
                    <img src="/volksanddavid-logo.svg" alt="V&D" className="h-5 w-auto" />
                    <span className="text-xs font-semibold text-[#1A1A2E]/70">Dashboard</span>
                  </div>
                  <span className="text-[10px] text-[#1A1A2E]/35 bg-[#21346E]/5 px-2 py-0.5 rounded-full">Tax Year 2024-25</span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Returns", value: "12", color: "#21346E", bg: "rgba(33,52,110,0.06)" },
                      { label: "NTN Status", value: "Active", color: "#10B981", bg: "rgba(16,185,129,0.06)" },
                      { label: "Tax Saved", value: "Rs.45K", color: "#C8952E", bg: "rgba(200,149,46,0.06)" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl p-3" style={{ background: item.bg }}>
                        <p className="text-[10px] text-[#1A1A2E]/40 mb-1">{item.label}</p>
                        <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="rounded-xl p-3 bg-[#21346E]/[0.02]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-[#1A1A2E]/60">Tax Filings This Year</span>
                      <span className="text-[10px] text-[#10B981] font-medium flex items-center gap-1">
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
                              : `rgba(33,52,110,${0.08 + (h / 100) * 0.25})`,
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + i * 0.05, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                      {["Jan", "Apr", "Jul", "Dec"].map((m) => (
                        <span key={m} className="text-[9px] text-[#1A1A2E]/25">{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="space-y-2">
                    {[
                      { icon: FileText, text: "Tax Return 2023-24 Submitted", time: "2h ago", color: "#21346E" },
                      { icon: CheckCircle, text: "NTN Certificate Downloaded", time: "Yesterday", color: "#10B981" },
                    ].map(({ icon: Icon, text, time, color }) => (
                      <div key={text} className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-[#21346E]/[0.02]">
                        <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${color}12` }}>
                          <Icon className="h-3.5 w-3.5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#1A1A2E]/80 truncate">{text}</p>
                        </div>
                        <span className="text-[10px] text-[#1A1A2E]/30 shrink-0">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#21346E]/5 bg-[#21346E]/[0.02]">
                  <span className="text-[10px] text-[#1A1A2E]/35">Next deadline: Sep 30, 2025</span>
                  <span className="text-[10px] font-semibold text-[#10B981]">File Now →</span>
                </div>
              </div>

              {/* Floating badge top-right */}
              <motion.div
                className="absolute -top-3 -right-3 rounded-lg px-3 py-1.5 border border-[#10B981]/20 shadow-lg bg-white"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[10px] font-medium text-[#10B981]">Live</span>
                </div>
              </motion.div>

              {/* Floating badge bottom-left */}
              <motion.div
                className="absolute -bottom-3 -left-3 rounded-lg px-3 py-1.5 border border-[#21346E]/20 shadow-lg bg-white"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <p className="text-[10px] text-[#1A1A2E]/50">Tax Saved</p>
                <p className="text-xs font-semibold text-[#21346E]">Rs. 2B+</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
