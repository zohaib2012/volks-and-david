import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Clock, ShieldCheck, Building2, FileText, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

const benefits = [
  {
    icon: Building2,
    title: 'Company Registration',
    description: 'Register your business as a Private Limited Company, Single Member Company, or Association with SECP.',
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Most registrations completed within 3-7 business days. Express processing available for urgent cases.',
  },
  {
    icon: FileText,
    title: 'Complete Handling',
    description: 'From name reservation to certificate issuance — we manage the entire SECP process for you.',
  },
  {
    icon: Award,
    title: 'Compliance Ready',
    description: 'Post-registration support including NTN, STRN registration, and annual compliance guidance.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Name Reservation',
    description: 'We check availability and reserve your company name with SECP through the eServices portal.',
  },
  {
    step: '02',
    title: 'Document Preparation',
    description: 'We prepare Form 1, Form 2, Memorandum & Articles of Association, and all supporting documents.',
  },
  {
    step: '03',
    title: 'SECP Filing',
    description: 'We submit the complete application package to SECP and handle all correspondence and queries.',
  },
  {
    step: '04',
    title: 'Certificate Issuance',
    description: 'Once approved, we deliver your incorporation certificate, NTN, and STRN registration.',
  },
]

const faqs = [
  {
    q: 'What types of companies can be registered with SECP?',
    a: 'You can register Private Limited Companies, Single Member Companies, Public Unlisted Companies, and Association with Persons (AOP) through SECP.',
  },
  {
    q: 'What is the minimum capital requirement?',
    a: 'The minimum paid-up capital for a Private Limited Company is PKR 100,000. There is no minimum for Single Member Companies.',
  },
  {
    q: 'How long does SECP registration take?',
    a: 'Typically 3-7 business days from document submission. Name reservation takes 1-2 days, and the registration process takes 3-5 days after that.',
  },
  {
    q: 'What documents are needed for company registration?',
    a: 'You need CNIC copies of all directors/shareholders, passport-size photos, utility bill (registered office address), and digital signatures (if applicable).',
  },
]

export default function ServicesSECP() {
  return (
    <>
      <Helmet>
        <title>SECP Business Registration Services - Volks & David</title>
        <meta name="description" content="Register your company with SECP in Pakistan. Private Limited, Single Member, and AOP registration. Fast, online, hassle-free." />
      </Helmet>

      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/5 via-background to-background pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl" />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-amber-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Business Registration (SECP)
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                Register your company with the Securities and Exchange Commission of Pakistan.
                We handle everything from name reservation to incorporation certificate.
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
            <h2 className="text-3xl font-bold mb-3">Why Register With Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              End-to-end SECP registration services with expert guidance at every step.
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
                    <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-amber-500" />
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
              From name reservation to incorporation in four simple steps.
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
                      style={{ backgroundColor: 'rgb(245 158 11)', color: 'white' }}>
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
              <p className="text-muted-foreground">Competitive pricing for business registration.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="relative">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Private Limited Company</h3>
                  <div className="text-3xl font-bold text-amber-500 mb-4">PKR 15,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Name reservation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Form 1 & 2 preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> MoA & AoA drafting</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> NTN & STRN registration</li>
                  </ul>
                  <Button asChild className="w-full"><Link to="/contact">Get Started</Link></Button>
                </CardContent>
              </Card>
              <Card className="relative ring-2 ring-amber-500">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Single Member / AOP</h3>
                  <div className="text-3xl font-bold text-amber-500 mb-4">PKR 10,000</div>
                  <ul className="space-y-2 text-sm text-left mb-6">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Complete registration</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Document preparation</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> SECP filing & follow-up</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Certificate delivery</li>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Register Your Business?</h2>
            <p className="text-muted-foreground mb-8">
              Start your company registration with SECP today. We handle the entire process.
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
