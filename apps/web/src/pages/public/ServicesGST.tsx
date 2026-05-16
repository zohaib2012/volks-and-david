import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, FileText, CreditCard, BarChart3, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: CreditCard,
    title: 'GST Registration',
    description: 'Complete Sales Tax / GST registration with FBR. We handle STRN application and certificate delivery.',
  },
  {
    icon: ClipboardList,
    title: 'Monthly Filing',
    description: 'Timely filing of monthly sales tax returns (Form STR-4) with accurate input/output tax computations.',
  },
  {
    icon: BarChart3,
    title: 'Tax Optimization',
    description: 'Expert advisory on input tax adjustments, exemptions, and zero-rated supplies to minimize tax liability.',
  },
  {
    icon: ShieldCheck,
    title: 'Notice Handling',
    description: 'Professional response to FBR sales tax notices, audits, and show-cause notices.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Registration & Setup',
    description: 'We register you for GST (STRN), set up your invoicing system, and configure your FBR portal access.',
  },
  {
    step: '02',
    title: 'Monthly Data Collection',
    description: 'We collect your sales and purchase data, ensuring proper documentation of all taxable transactions.',
  },
  {
    step: '03',
    title: 'Return Preparation',
    description: 'Our experts compute input/output tax, prepare Form STR-4, and reconcile with your records.',
  },
  {
    step: '04',
    title: 'Filing & Compliance',
    description: 'We file the return before the due date and maintain complete compliance records for audit purposes.',
  },
]

const faqs = [
  {
    q: 'Who needs to register for GST/Sales Tax?',
    a: 'Businesses with annual turnover exceeding PKR 10 million (PKR 5 million for services) must register for Sales Tax. Voluntarily registration is also available.',
  },
  {
    q: 'What is the sales tax rate in Pakistan?',
    a: 'The standard sales tax rate is 18% for goods and 16% for services. Certain items are zero-rated or exempt from sales tax.',
  },
  {
    q: 'What is the deadline for monthly sales tax filing?',
    a: 'Monthly sales tax returns must be filed by the 15th of the following month. Late filing incurs penalties and default surcharges.',
  },
  {
    q: 'Can I claim input tax adjustments?',
    a: 'Yes, registered persons can claim input tax credits on taxable purchases used in the course of business, subject to FBR conditions and documentation requirements.',
  },
]

export default function ServicesGST() {
  return (
    <>
      <Helmet>
        <title>GST Registration & Filing Services - Volks & David</title>
        <meta name="description" content="GST/Sales Tax registration, monthly return filing, and compliance services in Pakistan. 100% FBR-compliant process." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-purple-500/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-purple-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                GST Registration & Filing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Complete Sales Tax / GST registration and monthly return filing services.
                Stay compliant with FBR regulations effortlessly.
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
            <h2 className="text-3xl font-bold mb-3">Why Choose Our GST Service?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              End-to-end GST compliance services for businesses of all sizes.
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
                    <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-purple-500" />
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
              From registration to monthly compliance.
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
                      style={{ backgroundColor: 'rgb(139 92 246)', color: 'white' }}>
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
              <p className="text-muted-foreground">Complete GST compliance packages.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">GST Registration</h3>
                  <div className="text-3xl font-bold text-purple-500 mb-4">PKR 3,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> STRN application</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Document preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> FBR submission</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Certificate delivery</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
              <Card className="relative ring-2 ring-purple-500">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Monthly Filing</h3>
                  <div className="text-3xl font-bold text-purple-500 mb-4">PKR 3,000/mo</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Monthly return preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Input/output tax computation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Timely e-filing</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Compliance record maintenance</li>
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
            <h2 className="text-3xl font-bold mb-4">Ready for GST Compliance?</h2>
            <p className="text-muted-foreground mb-8">
              Get registered and stay compliant with professional GST services.
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
