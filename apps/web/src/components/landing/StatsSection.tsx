import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { FileText, BadgeCheck, Wallet, Star, Users, Award } from "lucide-react"

interface Stat {
  icon: typeof FileText
  value: string
  suffix: string
  label: string
  sublabel: string
  color: string
}

const stats: Stat[] = [
  { icon: FileText, value: "500", suffix: "K+", label: "Returns Filed", sublabel: "Tax Year 2024-25", color: "#3B5C9E" },
  { icon: BadgeCheck, value: "200", suffix: "K+", label: "NTNs Registered", sublabel: "Active & verified", color: "#C8952E" },
  { icon: Wallet, value: "2", suffix: "B+", label: "Tax Saved (PKR)", sublabel: "Our clients' savings", color: "#FBBF24" },
  { icon: Users, value: "50", suffix: "K+", label: "Happy Clients", sublabel: "Nationwide", color: "#A78BFA" },
  { icon: Star, value: "4.8", suffix: "", label: "Avg. Rating", sublabel: "Google & Facebook", color: "#FB923C" },
  { icon: Award, value: "8", suffix: "+", label: "Years of Service", sublabel: "Trusted since 2017", color: "#F472B6" },
]

function AnimatedCounter({ value, suffix, inView }: { value: string; suffix: string; inView: boolean }) {
  const numValue = parseFloat(value)
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true
      const duration = 2000
      const steps = 60
      const increment = numValue / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= numValue) {
          setCount(numValue)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [inView, numValue])

  const display = count % 1 === 0 ? count.toFixed(0) : count.toFixed(1)
  return <span>{display}{suffix}</span>
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D1F3C 50%, #0A1628 100%)" }} />
      <div className="absolute inset-0 opacity-25"
        style={{ background: "radial-gradient(ellipse at 30% 50%, #21346E 0%, transparent 60%)" }} />
      <div className="absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at 70% 50%, #C8952E 0%, transparent 60%)" }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-3">Trusted by Thousands</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Numbers That{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #3B5C9E, #C8952E)" }}>
              Speak for Themselves
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, staggerChildren: 0.08 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl p-5 sm:p-6 border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)" }}
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 50% 80%, ${stat.color}15, transparent 65%)` }} />

              <div className="relative z-10 flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center mb-1"
                  style={{ background: `${stat.color}20` }}>
                  <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
                </div>
                <div className="font-semibold text-sm text-white/85">{stat.label}</div>
                <div className="text-xs text-white/35">{stat.sublabel}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
