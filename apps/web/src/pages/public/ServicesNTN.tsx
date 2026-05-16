import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, FileText, BadgeCheck, Globe, HeadphonesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Hassle-Free Process',
    description: 'We handle all paperwork and coordination with FBR. You just provide the documents and get your NTN certificate.',
  },
  {
    icon: Clock,
    title: 'Fast Turnaround',
    description: 'Most NTN registrations are completed within 24-48 hours. Same-day processing available for urgent cases.',
  },
  {
    icon: FileText,
    title: 'Complete Documentation',
    description: 'We prepare and submit all required forms, including Form ST-5, CNIC copies, and proof of business address.',
  },
  {
    icon: Globe,
    title: 'Nationwide Service',
    description: 'Available for clients across Pakistan. Fully online process — no need to visit our office.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Document Collection',
    description: 'Submit your CNIC, business registration documents (if applicable), utility bill, and passport-size photographs.',
  },
  {
    step: '02',
    title: 'Form Preparation',
    description: 'Our experts prepare Form ST-5 and other required documents for FBR NTN registration.',
  },
  {
    step: '03',
    title: 'FBR Submission',
    description: 'We submit your application to FBR\'s IRIS system and track the processing status.',
  },
  {
    step: '04',
    title: 'Certificate Delivery',
    description: 'Once approved, we deliver your NTN certificate digitally and guide you on next steps.',
  },
]

const faqs = [
  {
    q: 'Who needs an NTN?',
    a: 'Anyone earning taxable income in Pakistan needs an NTN — salaried individuals above the threshold, business owners, freelancers, AOPs, companies, and property sellers.',
  },
  {
    q: 'What documents are required for NTN registration?',
    a: 'You need your CNIC, recent utility bill (for address proof), 2 passport-size photographs, and business documents if registering as a sole proprietor or company.',
  },
  {
    q: 'How long does NTN registration take?',
    a: 'Typically 24-48 hours. FBR processes NTN applications quickly through the IRIS system. Urgent processing is available on request.',
  },
  {
    q: 'Can I register for NTN online?',
    a: 'Yes, the entire process is online through FBR\'s IRIS portal. We handle the submission on your behalf and keep you updated at every step.',
  },
]

export default function ServicesNTN() {
  return (
    <>
      <Helmet>
        <title>NTN Registration Services - Volks & David</title>
        <meta name="description" content="Get your National Tax Number (NTN) registered with FBR quickly. Fully online process for individuals, freelancers, and businesses." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-500/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <BadgeCheck className="h-8 w-8 text-emerald-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                NTN Registration
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Get your National Tax Number (NTN) registered with FBR quickly and hassle-free.
                Fully online process for individuals, freelancers, sole proprietors, and businesses.
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
            <h2 className="text-3xl font-bold mb-3">Why Register NTN With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make NTN registration simple, fast, and completely online.
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
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-emerald-500" />
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
              Four simple steps to get your NTN certificate.
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
                    <div className="h-10 w-10 rounded-full bg-emerald-500 text-emerald-500-foreground flex items-center justify-center font-bold text-sm mb-4"
                      style={{ backgroundColor: 'rgb(16 185 129)', color: 'white' }}>
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
              <p className="text-muted-foreground">Affordable NTN registration packages.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Individual / Freelancer</h3>
                  <div className="text-3xl font-bold text-emerald-500 mb-4">PKR 1,500</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> NTN application preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> FBR IRIS submission</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Status tracking</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Digital certificate delivery</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
              <Card className="relative ring-2 ring-emerald-500">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Business / AOP / Company</h3>
                  <div className="text-3xl font-bold text-emerald-500 mb-4">PKR 3,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Complete application processing</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Business documentation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> FBR liaison</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Priority processing</li>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Get Your NTN?</h2>
            <p className="text-muted-foreground mb-8">
              Start your NTN registration today. Fully online process.
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
