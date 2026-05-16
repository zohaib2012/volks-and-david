import { motion } from "framer-motion"
import {
  ShieldCheck,
  Building2,
  Lock,
  CreditCard,
  Award,
  Users,
} from "lucide-react"

interface Badge {
  icon: typeof ShieldCheck
  label: string
}

const badges: Badge[] = [
  { icon: Building2, label: "SECP Registered" },
  { icon: ShieldCheck, label: "FBR Partner" },
  { icon: Lock, label: "Secure Platform" },
  { icon: CreditCard, label: "PCI Compliant" },
  { icon: Award, label: "ISO Certified" },
  { icon: Users, label: "500K+ Clients" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const badgeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
}

export default function TrustBadgesSection() {
  return (
    <section className="py-16 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted &amp; Certified
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8"
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.label}
              variants={badgeVariants}
              className="flex items-center gap-3 glass-card rounded-xl px-5 py-3 hover:-translate-y-1 transition-all duration-300"
            >
              <badge.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium whitespace-nowrap">
                {badge.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
