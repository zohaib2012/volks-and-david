import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Receipt,
  BadgeCheck,
  CreditCard,
  Building2,
  Globe,
  HeadphonesIcon,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react"

interface Service {
  icon: typeof Receipt
  title: string
  description: string
  path: string
  gradient: string
  iconBg: string
  iconColor: string
  tag?: string
}

const services: Service[] = [
  {
    icon: Receipt,
    title: "Tax Return Filing",
    description: "Professional filing for salaried & business individuals. Maximum refunds, minimum hassle.",
    path: "/services/tax-return",
    gradient: "from-blue-500/8 to-blue-600/4",
    iconBg: "rgba(59,130,246,0.15)",
    iconColor: "#60A5FA",
    tag: "Most Popular",
  },
  {
    icon: BadgeCheck,
    title: "NTN Registration",
    description: "Get your National Tax Number registered fast. Fully online, verified by FBR.",
    path: "/services/ntn",
    gradient: "from-emerald-500/8 to-emerald-600/4",
    iconBg: "rgba(16,185,129,0.15)",
    iconColor: "#34D399",
  },
  {
    icon: CreditCard,
    title: "GST / Sales Tax",
    description: "Sales tax registration & monthly filing. 100% FBR-compliant process.",
    path: "/services/gst",
    gradient: "from-purple-500/8 to-purple-600/4",
    iconBg: "rgba(139,92,246,0.15)",
    iconColor: "#A78BFA",
  },
  {
    icon: Building2,
    title: "Business Registration",
    description: "Company, partnership & sole proprietorship registration via SECP — online & hassle-free.",
    path: "/services/secp",
    gradient: "from-amber-500/8 to-amber-600/4",
    iconBg: "rgba(245,158,11,0.15)",
    iconColor: "#FBBF24",
  },
  {
    icon: Globe,
    title: "USA Services",
    description: "LLC formation, EIN, ITIN & US bank account for Pakistanis doing global business.",
    path: "/services/usa",
    gradient: "from-rose-500/8 to-rose-600/4",
    iconBg: "rgba(244,63,94,0.15)",
    iconColor: "#FB7185",
    tag: "New",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Consultation",
    description: "One-on-one with certified tax professionals. Get tailored advice for your situation.",
    path: "/services/consultation",
    gradient: "from-cyan-500/8 to-cyan-600/4",
    iconBg: "rgba(6,182,212,0.15)",
    iconColor: "#22D3EE",
  },
  {
    icon: AlertCircle,
    title: "FBR Notice Handling",
    description: "Received an FBR notice? Our experts handle responses, appeals & dispute resolution.",
    path: "/dashboard/fbr-notices",
    gradient: "from-orange-500/8 to-orange-600/4",
    iconBg: "rgba(249,115,22,0.15)",
    iconColor: "#FB923C",
  },
  {
    icon: ShieldCheck,
    title: "Trademark & IP",
    description: "Trademark, copyright & patent registration to protect your brand & intellectual property.",
    path: "/services/trademark",
    gradient: "from-indigo-500/8 to-indigo-600/4",
    iconBg: "rgba(99,102,241,0.15)",
    iconColor: "#818CF8",
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-5"
        style={{ background: "radial-gradient(circle, hsl(228 88% 62%), transparent)" }} />

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">What We Offer</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
            Complete{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, hsl(228 88% 62%), hsl(160 84% 39%))" }}>
              Financial Services
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need for taxes, business & financial compliance — all under one roof.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={service.path}
                className={`group relative flex flex-col h-full rounded-2xl border border-border/60 bg-card p-6 overflow-hidden transition-all duration-350 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl`}
                style={{ "--hover-shadow": "0 20px 50px hsl(228 88% 62% / 0.1)" } as React.CSSProperties}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl`} />

                {/* Popular/New tag */}
                {service.tag && (
                  <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{
                      background: service.tag === "New" ? "rgba(16,185,129,0.15)" : "rgba(79,111,245,0.12)",
                      color: service.tag === "New" ? "#34D399" : "#818CF8",
                      border: `1px solid ${service.tag === "New" ? "rgba(16,185,129,0.3)" : "rgba(79,111,245,0.2)"}`,
                    }}>
                    {service.tag}
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: service.iconBg }}
                  >
                    <service.icon className="h-6 w-6" style={{ color: service.iconColor }} />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold mb-2.5 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>

                  {/* Arrow link */}
                  <div className="flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                    Get Started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            View all services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
