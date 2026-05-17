import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

const perks = [
  "No credit card required",
  "Free account setup",
  "FBR-compliant process",
  "Expert support included",
]

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030B1A]" />
      <div className="absolute inset-0 opacity-30"
        style={{ background: "radial-gradient(ellipse at 20% 50%, #21346E, transparent 55%)" }} />
      <div className="absolute inset-0 opacity-25"
        style={{ background: "radial-gradient(ellipse at 80% 50%, #C8952E, transparent 55%)" }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

      {/* Floating orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#21346E", top: "20%", left: "10%" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#C8952E", bottom: "20%", right: "10%" }}
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Heading */}
          <div className="space-y-5">
            <p className="text-xs font-semibold tracking-widest text-[#C8952E] uppercase">
              Join 500,000+ Pakistanis
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              Ready to File Your{" "}
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #3B5C9E, #C8952E)" }}>
                Tax Return?
              </span>
            </h2>
            <p className="text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
              Get started today — file your return, register for NTN, or consult an expert.
              Pakistan's most trusted tax platform is here for you.
            </p>
          </div>

          {/* Perks */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-sm text-white/50">
                <CheckCircle className="h-4 w-4 text-[#C8952E] shrink-0" />
                {perk}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                className="h-14 px-10 text-base font-bold text-white border-0"
                  style={{
                    background: "linear-gradient(135deg, #C8952E 0%, #B8862B 100%)",
                    boxShadow: "0 8px 32px rgba(200, 149, 46, 0.4)",
                  }}
                asChild
              >
                <Link to="/register">
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/pricing"
                className="inline-flex h-14 px-10 items-center justify-center rounded-md text-base font-semibold text-white border-2 border-white/40 bg-transparent hover:bg-white/10 hover:border-white/70 transition-all"
              >
                View Pricing
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
