import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ShieldCheck,
  Star,
  BadgeCheck,
  ChevronRight,
  Globe,
  Calculator,
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

function calcTax(income: number): number {
  if (income <= 600000) return 0
  if (income <= 1200000) return (income - 600000) * 0.01
  if (income <= 2200000) return 6000 + (income - 1200000) * 0.11
  if (income <= 3200000) return 116000 + (income - 2200000) * 0.23
  if (income <= 4100000) return 346000 + (income - 3200000) * 0.30
  return 616000 + (income - 4100000) * 0.35
}

function fmtPKR(n: number): string {
  if (n >= 1000000) return `Rs.${(n / 1000000).toFixed(2)}M`
  if (n >= 100000) return `Rs.${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `Rs.${(n / 1000).toFixed(1)}K`
  return `Rs.${Math.round(n)}`
}

export default function HeroSection() {
  const [income, setIncome] = useState("")

  const monthlyNum = parseFloat(income.replace(/,/g, "")) || 0
  const annualNum = monthlyNum * 12
  const annualTax = calcTax(annualNum)
  const monthlyTax = annualTax / 12
  const monthlyTakeHome = monthlyNum - monthlyTax
  const effectiveRate = annualNum > 0 ? ((annualTax / annualNum) * 100).toFixed(1) : "0"
  const taxPct = annualNum > 0 ? Math.min((annualTax / annualNum) * 100, 100) : 0

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EFF6FF]">
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#21346E] via-[#10B981] to-[#21346E]" />

      {/* USA Services Floating Badge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="fixed right-4 top-28 z-40"
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

          {/* RIGHT: Calculator Card */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-[480px]">
              {/* Glow behind card */}
              <div className="absolute -inset-6 rounded-3xl opacity-20 blur-2xl"
                style={{ background: "linear-gradient(135deg, #21346E, #10B981)" }} />

              {/* Main card */}
              <div className="relative rounded-2xl border border-[#21346E]/10 overflow-hidden bg-white shadow-xl">

                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#21346E]/5 bg-[#21346E]/[0.02]">
                  <div className="flex items-center gap-1.5">
                    <Calculator className="h-3.5 w-3.5 text-[#21346E]/50" />
                    <span className="text-[11px] font-semibold text-[#21346E]/70">Tax Calculator</span>
                  </div>
                  <span className="text-[10px] text-[#1A1A2E]/35 bg-[#21346E]/5 px-2 py-0.5 rounded-full">
                    FY 2025-26
                  </span>
                </div>

                {/* CALCULATOR */}
                <div className="p-5 space-y-4">
                  {/* Income Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#1A1A2E]/50 uppercase tracking-wide">
                      Monthly Salary
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#21346E]/50 pointer-events-none">
                        Rs.
                      </span>
                      <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        placeholder="100,000"
                        className="w-full pl-9 pr-3 py-2.5 text-sm font-semibold rounded-xl border border-[#21346E]/15 bg-[#21346E]/[0.02] focus:outline-none focus:border-[#21346E]/40 focus:bg-white text-[#1A1A2E] transition-all placeholder:text-[#1A1A2E]/20"
                      />
                    </div>
                  </div>

                  {/* Results */}
                  {monthlyNum > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-[#21346E]/8 bg-[#21346E]/[0.02] p-4 space-y-3"
                    >
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-white p-2.5 border border-[#21346E]/8">
                          <p className="text-[10px] text-[#1A1A2E]/40 mb-0.5">Monthly Tax</p>
                          <p className="text-sm font-bold text-[#21346E]">{fmtPKR(monthlyTax)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-2.5 border border-[#21346E]/8">
                          <p className="text-[10px] text-[#1A1A2E]/40 mb-0.5">Take Home</p>
                          <p className="text-sm font-bold text-[#C8952E]">{fmtPKR(monthlyTakeHome)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-2.5 border border-[#21346E]/8">
                          <p className="text-[10px] text-[#1A1A2E]/40 mb-0.5">Annual Tax</p>
                          <p className="text-sm font-bold text-[#10B981]">{fmtPKR(annualTax)}</p>
                        </div>
                      </div>

                      {/* Tax vs Take-home bar */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] text-[#1A1A2E]/35">Tax: {fmtPKR(monthlyTax)}</span>
                          <span className="text-[10px] text-[#1A1A2E]/35">Take Home: {fmtPKR(monthlyTakeHome)}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#10B981]/15 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: "linear-gradient(90deg, #21346E, #2C4182)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${taxPct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Placeholder slabs */
                    <div className="rounded-xl border border-[#21346E]/8 bg-[#21346E]/[0.02] p-4 space-y-2">
                      <p className="text-[11px] font-semibold text-[#1A1A2E]/50 mb-2">FBR Tax Slabs 2025-26</p>
                      {[
                        { range: "Up to Rs.6L", rate: "0%" },
                        { range: "Rs.6L – 12L", rate: "1%" },
                        { range: "Rs.12L – 22L", rate: "11%" },
                        { range: "Rs.22L – 32L", rate: "23%" },
                        { range: "Rs.32L – 41L", rate: "30%" },
                        { range: "Above Rs.41L", rate: "35%" },
                      ].map((slab) => (
                        <div key={slab.range} className="flex justify-between items-center">
                          <span className="text-[11px] text-[#1A1A2E]/50">{slab.range}</span>
                          <span className="text-[11px] font-semibold text-[#21346E]">{slab.rate}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <Link to="/register" className="block">
                    <button
                      className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #21346E 0%, #2C4182 100%)" }}
                    >
                      File Your Return — It's Free →
                    </button>
                  </Link>

                  <p className="text-[10px] text-[#1A1A2E]/30 text-center">
                    Based on FBR Tax Slabs 2025-26 (Salaried)
                  </p>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-[#21346E]/5 bg-[#21346E]/[0.02]">
                  <span className="text-[10px] text-[#1A1A2E]/35">Next deadline: Sep 30, 2025</span>
                  <Link to="/login" className="text-[10px] font-semibold text-[#10B981] hover:opacity-75 transition-opacity">
                    File Now →
                  </Link>
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
