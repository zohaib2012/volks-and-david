import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, FileText, TrendingDown, Users, Laptop } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Maximum Refunds',
    description: 'We identify every eligible deduction and tax credit to ensure you get the largest refund possible.',
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'E-filing with FBR for rapid processing. Most returns are submitted within 24-48 hours of document receipt.',
  },
  {
    icon: FileText,
    title: 'Error-Free Filing',
    description: 'Rigorous review process catches errors before submission, reducing notice risk from FBR.',
  },
  {
    icon: TrendingDown,
    title: 'Tax Savings',
    description: 'Strategic tax planning minimizes your liability while keeping you fully compliant with FBR regulations.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Submit Documents',
    description: 'Upload your salary slips, bank statements, investment proofs, and other required documents to our secure portal.',
  },
  {
    step: '02',
    title: 'Tax Computation',
    description: 'Our experts compute your taxable income, apply deductions under sections like 62C, 63, and calculate your refund or liability.',
  },
  {
    step: '03',
    title: 'Return Preparation',
    description: 'We prepare your complete income tax return with all schedules and annexures as per FBR requirements.',
  },
  {
    step: '04',
    title: 'E-Filing & Confirmation',
    description: 'We file your return electronically through FBR\'s IRIS system and share the acknowledgment with you.',
  },
]

const faqs = [
  {
    q: 'Who needs to file an income tax return in Pakistan?',
    a: 'Salaried individuals earning over PKR 600,000 annually, all business owners, freelancers, AOPs, and companies are required to file annual returns. Filing also enables access to lower withholding tax rates.',
  },
  {
    q: 'What documents do I need to provide?',
    a: 'You\'ll need your CNIC, NTN certificate, salary slips (12 months), bank statements, investment proofs, property details, and previous year\'s tax return if applicable.',
  },
  {
    q: 'What is the deadline for tax return filing?',
    a: 'The tax year runs from July 1 to June 30. Returns for salaried individuals are typically due by September 30, while business returns are due by December 31 each year.',
  },
  {
    q: 'What if I missed previous year filings?',
    a: 'We can file belated returns for up to the past 5 tax years. Late filing may involve penalties, but our team will help minimize any additional charges.',
  },
]

export default function ServicesTaxReturn() {
  return (
    <>
      <Helmet>
        <title>Tax Return Filing Services - Volks & David</title>
        <meta name="description" content="Professional income tax return filing in Pakistan for salaried individuals, freelancers, businesses, and companies. Maximum refunds guaranteed." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Tax Return Filing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Professional income tax return filing for salaried individuals, freelancers, businesses, and companies.
                Accurate computations, maximum legal savings, and timely e-filing with FBR.
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
            <h2 className="text-3xl font-bold mb-3">Why Choose Our Tax Filing Service?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine expertise with technology to deliver a seamless tax filing experience.
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
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-primary" />
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
              From document submission to final filing — we handle everything.
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
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm mb-4">
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
              <p className="text-muted-foreground">Affordable pricing for individuals and businesses.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Salaried Individual</h3>
                  <div className="text-3xl font-bold text-primary mb-4">PKR 2,500</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Complete return preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Deduction optimization</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> E-filing with FBR</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Acknowledgment receipt</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
              <Card className="relative ring-2 ring-primary">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Business / Freelancer</h3>
                  <div className="text-3xl font-bold text-primary mb-4">PKR 5,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Full return preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Balance sheet & P&L schedules</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Advance tax computation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Priority support</li>
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
            <h2 className="text-3xl font-bold mb-4">Ready to File Your Tax Return?</h2>
            <p className="text-muted-foreground mb-8">
              Get your tax return filed by professionals. Maximum refunds guaranteed.
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
