import { motion } from "framer-motion"
import { User, FileText, CheckCircle, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const steps = [
  {
    number: "01",
    icon: User,
    title: "Create Account",
    description: "Sign up free in under 2 minutes. No paperwork, no office visit needed.",
    color: "#3B5C9E",
    bg: "rgba(59,92,158,0.12)",
  },
  {
    number: "02",
    icon: FileText,
    title: "Fill Your Details",
    description: "Answer simple questions. Our smart form auto-calculates your taxes instantly.",
    color: "#C8952E",
    bg: "rgba(200,149,46,0.12)",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Get It Filed!",
    description: "We review, file & send you confirmation. Download your tax certificate instantly.",
    color: "#3B5C9E",
    bg: "rgba(59,92,158,0.12)",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            File Your Taxes in{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #21346E, #C8952E)" }}>
              3 Easy Steps
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            No tax knowledge required. Our platform guides you through every step.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10 relative">
          {/* Connector arrows for desktop */}
          <div className="hidden md:flex absolute top-16 left-[calc(33.33%-10px)] right-[calc(33.33%-10px)] justify-around pointer-events-none">
            <ArrowRight className="h-5 w-5 text-border" style={{ marginLeft: "calc(33.33% - 12px)" }} />
            <ArrowRight className="h-5 w-5 text-border" style={{ marginRight: "calc(33.33% - 12px)" }} />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col items-center text-center"
            >
              {/* Step circle */}
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500"
                  style={{ background: step.color }} />
                <div
                  className="relative h-20 w-20 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}30, ${step.color}15)`,
                    border: `1.5px solid ${step.color}40`,
                  }}
                >
                  <step.icon className="h-8 w-8" style={{ color: step.color }} />
                </div>
                {/* Step number badge */}
                <div
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}90)` }}
                >
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-xl"
            style={{
            background: "linear-gradient(135deg, #21346E, #C8952E)",
            boxShadow: "0 4px 24px rgba(33,52,110,0.3)",
            }}
          >
            Get Started Now — It's Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
