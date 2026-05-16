import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, Lightbulb, FileText, Search, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: Lightbulb,
    title: 'Invention Protection',
    description: 'Secure exclusive rights to your invention — processes, machines, manufactures, or compositions of matter.',
  },
  {
    icon: Search,
    title: 'Prior Art Search',
    description: 'Comprehensive patentability assessment and prior art search before filing to ensure your invention is novel.',
  },
  {
    icon: Award,
    title: '20-Year Protection',
    description: 'Patent protection lasts for 20 years from the filing date, giving you exclusive commercial rights.',
  },
  {
    icon: FileText,
    title: 'Expert Drafting',
    description: 'Professional patent specification and claims drafting by experienced practitioners meeting IPO requirements.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Patentability Assessment',
    description: 'We assess your invention for novelty, inventive step, and industrial applicability before filing.',
  },
  {
    step: '02',
    title: 'Specification Drafting',
    description: 'Our experts draft the complete patent specification, including detailed description and claims.',
  },
  {
    step: '03',
    title: 'IPO Filing & Prosecution',
    description: 'We file the patent application with IPO-Pakistan and handle all examination responses.',
  },
  {
    step: '04',
    title: 'Patent Grant',
    description: 'Upon approval, we assist with patent grant formalities and provide maintenance guidance.',
  },
]

const faqs = [
  {
    q: 'What can be patented in Pakistan?',
    a: 'Any new invention involving an inventive step and industrial applicability can be patented — including processes, machines, articles of manufacture, and compositions of matter.',
  },
  {
    q: 'How long does patent registration take?',
    a: 'The patent process in Pakistan typically takes 24-36 months from filing to grant, depending on the complexity of the invention and examination timeline.',
  },
  {
    q: 'What is the difference between a patent and a trademark?',
    a: 'A patent protects inventions and processes (functional/technical), while a trademark protects brand identifiers (names, logos). Patents last 20 years, trademarks last 10 years (renewable).',
  },
  {
    q: 'Can I file a patent myself?',
    a: 'Yes, but patent drafting requires specialized legal and technical expertise. Professional drafting significantly increases the chances of grant and ensures broader protection.',
  },
]

export default function ServicesPatent() {
  return (
    <>
      <Helmet>
        <title>Patent Registration Services - Volks & David</title>
        <meta name="description" content="File patents with IPO-Pakistan. Protect your inventions with expert patent drafting, filing, and prosecution services." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-500/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="h-8 w-8 text-cyan-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Patent Registration
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                File patents for your inventions with IPO-Pakistan. Protection for new and useful processes,
                machines, manufactures, or compositions of matter.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why File a Patent?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Protect your inventions with exclusive patent rights.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-cyan-500" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From assessment to patent grant.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mb-4"
                      style={{ backgroundColor: 'rgb(6 182 212)', color: 'white' }}>
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-muted-foreground/30">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Pricing</h2>
              <p className="text-muted-foreground">Professional patent filing services at competitive rates.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Standard Patent</h3>
                  <div className="text-3xl font-bold text-cyan-500 mb-4">PKR 25,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Patentability assessment</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Specification drafting</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Claims preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> IPO filing & prosecution</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
              <Card className="relative ring-2 ring-cyan-500">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Comprehensive Patent</h3>
                  <div className="text-3xl font-bold text-cyan-500 mb-4">PKR 35,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Prior art search report</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Detailed specification</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Multiple claim sets</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Full prosecution support</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.q}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Invention?</h2>
            <p className="text-muted-foreground mb-8">
              File your patent today and secure exclusive rights to your invention.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
