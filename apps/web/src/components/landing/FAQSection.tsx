import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Who needs to file a tax return in Pakistan?",
    answer:
    "Any individual whose annual income exceeds Rs. 600,000 (salaried) or Rs. 400,000 (non-salaried) must file a tax return. Filing is also required if you own a vehicle, property, or have a bank account with significant transactions.",
  },
  {
    question: "What documents do I need to file my taxes?",
    answer:
    "You'll need your CNIC, NTN (if already registered), salary slips or income proof, bank statements, utility bills, and details of any investments or assets. Our system will guide you through everything step by step.",
  },
  {
    question: "How long does the tax filing process take?",
    answer:
    "With our platform, most salaried individuals can complete their return in under 15 minutes. Business returns may take 30-45 minutes. Our expert review ensures accuracy before submission.",
  },
  {
    question: "What is an NTN and why do I need one?",
    answer:
    "NTN (National Tax Number) is a unique identifier assigned by FBR for tax purposes. It is required for filing tax returns, opening business bank accounts, and conducting various financial transactions.",
  },
  {
    question: "Can you help with FBR notices or audits?",
    answer:
    "Absolutely. We provide full support for FBR notices, audits, and any compliance-related queries. Our team of experts will handle all communication with FBR on your behalf.",
  },
  {
    question: "Is my data secure on your platform?",
    answer:
    "Yes. We use bank-grade encryption to protect your data. All documents are stored securely, and we never share your information with third parties without your explicit consent. We are fully compliant with Pakistan's data protection regulations.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to know about tax filing in Pakistan.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={cn(
                "rounded-2xl border transition-all duration-300",
                openIndex === index
                  ? "glass-card border-primary/30"
                  : "backdrop-blur-xl bg-white/5 border-white/10 hover:border-white/20"
              )}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
