import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCard {
  title: string
  price: string
  originalPrice?: string
  description: string
  features: PricingFeature[]
  path: string
  popular?: boolean
}

const tabs = ["Individual", "Business", "USA Services"]

const plans: Record<string, PricingCard[]> = {
  "Individual": [
    {
      title: "Salaried Return",
      price: "Rs. 2,999",
      originalPrice: "Rs. 4,999",
      description: "For individuals with salary income only",
      features: [
        { text: "Salary tax return filing", included: true },
        { text: "Auto-calculation of refund", included: true },
        { text: "Tax certificate download", included: true },
        { text: "FBR verification support", included: true },
        { text: "Priority support", included: false },
      ],
      path: "/services/tax-return",
      popular: true,
    },
    {
      title: "NTN Registration",
      price: "Rs. 1,299",
      originalPrice: "Rs. 2,499",
      description: "New National Tax Number registration",
      features: [
        { text: "NTN application filing", included: true },
        { text: "Document verification", included: true },
        { text: "FBR submission", included: true },
        { text: "NTN certificate", included: true },
        { text: "Priority support", included: false },
      ],
      path: "/services/ntn-registration",
    },
  ],
  "Business": [
    {
      title: "Business Return",
      price: "Rs. 4,999",
      originalPrice: "Rs. 7,999",
      description: "For sole proprietors and freelancers",
      features: [
        { text: "Business income tax return", included: true },
        { text: "Profit & loss statement", included: true },
        { text: "Balance sheet filing", included: true },
        { text: "Tax certificate download", included: true },
        { text: "Priority support", included: true },
      ],
      path: "/services/tax-return",
      popular: true,
    },
    {
      title: "GST Registration",
      price: "Rs. 3,499",
      originalPrice: "Rs. 5,999",
      description: "Sales tax registration for businesses",
      features: [
        { text: "GST application filing", included: true },
        { text: "Sales tax registration", included: true },
        { text: "FBR coordination", included: true },
        { text: "GST certificate", included: true },
        { text: "Priority support", included: true },
      ],
      path: "/services/gst-registration",
    },
    {
      title: "SECP Registration",
      price: "Rs. 8,999",
      originalPrice: "Rs. 14,999",
      description: "Company registration with SECP",
      features: [
        { text: "Company incorporation", included: true },
        { text: "Name reservation", included: true },
        { text: "Document preparation", included: true },
        { text: "SECP filing", included: true },
        { text: "Certificate delivery", included: true },
      ],
      path: "/services/business-registration",
    },
  ],
  "USA Services": [
    {
      title: "ITIN Application",
      price: "$199",
      originalPrice: "$299",
      description: "Individual Taxpayer Identification Number",
      features: [
        { text: "ITIN application filing", included: true },
        { text: "Document review", included: true },
        { text: "IRS submission", included: true },
        { text: "Status tracking", included: true },
        { text: "Priority processing", included: false },
      ],
      path: "/usa-services",
      popular: true,
    },
    {
      title: "LLC Formation",
      price: "$399",
      originalPrice: "$599",
      description: "US Limited Liability Company setup",
      features: [
        { text: "LLC filing in your state", included: true },
        { text: "Registered agent service", included: true },
        { text: "EIN application", included: true },
        { text: "Operating agreement", included: true },
        { text: "Bank account guidance", included: true },
      ],
      path: "/usa-services",
    },
  ],
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState("Individual")

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            No hidden fees. No surprises. Pay only for what you need.
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl border border-border/50 bg-muted/50 p-1 backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                  activeTab === tab
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans[activeTab].map((plan) => (
            <motion.div
              key={plan.title}
              variants={cardVariants}
              className={cn(
                "relative group",
                plan.popular && "lg:scale-105"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg animate-glow">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={cn(
                  "relative rounded-2xl p-8 h-full border transition-all duration-300 card-hover",
                  plan.popular
                    ? "gradient-border bg-card shadow-2xl shadow-primary/20"
                    : "border-border/50 bg-card hover:shadow-xl hover:shadow-primary/10"
                )}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{plan.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.text}
                        className={cn(
                          "flex items-center gap-3 text-sm",
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 shrink-0",
                            feature.included
                              ? "text-emerald-500"
                              : "text-muted-foreground/30"
                          )}
                        />
                        {feature.text}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={cn(
                      "w-full",
                      plan.popular && "bg-gradient-to-r from-primary to-primary/80"
                    )}
                    asChild
                  >
                    <Link to={plan.path}>Get Started</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
